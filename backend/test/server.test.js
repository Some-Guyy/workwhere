const request = require('supertest')
const app = require('../server')
const admin = require('firebase-admin')

jest.mock('firebase-admin', () => {
  return {
    initializeApp: jest.fn(),
    credential: {
      cert: jest.fn(),
    },
    firestore: jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        get: jest.fn(),
      }),
    }),
  }
})

//test login
describe('POST /login', () => {
  afterEach(() => {
    jest.clearAllMocks() //reset mock
  })

  //login successful
  it('return user details for a valid login', async () => {
    const mockGet = require('firebase-admin').firestore().collection().get
    mockGet.mockResolvedValueOnce({
      empty: false, // User exists
      forEach: (callback) => {
        callback({
          data: () => ({
            password: '123', 
            Staff_ID: '151408',
            Staff_FName: 'Philip',
            Staff_LName: 'Lee',
            Dept: 'Engineering',
            Position: 'Director',
            Role: '1',
            Reporting_Manager: '130002',
          }),
        })
      },
    })

    const res = await request(app)
      .post('/login')
      .send({
        emailAddress: 'Philip.Lee@allinone.com.sg',
        password: '123',
      })

    expect(res.body).toEqual({
      message: 'Login successful',
      user: {
        Staff_ID: "151408",
        Staff_FName: "Philip",
        Staff_LName: "Lee",
        Dept: "Engineering",
        Position: "Director",
        Role: "1",
        Reporting_Manager: "130002",
      },
    })
  })

  //login unsuccessful - wrong email
  it('return error message when wrong email', async () => {
    // return nothing back
    const mockGet = require('firebase-admin').firestore().collection().get
    mockGet.mockResolvedValueOnce({
      empty: true, 
      forEach: jest.fn(), 
    })

    const response = await request(app)
      .post('/login')
      .send({ 
        emailAddress: 'Philip.Lee@allinone.com.sg', 
        password: '12345' })

    expect(response.status).toBe(401)
    expect(response.body.message).toBe('Invalid email address or password')
  })

  //login unsuccessful - wrong password
  it('return error message when wrong password', async () => {
    // return user
    const mockGet = require('firebase-admin').firestore().collection().get
    mockGet.mockResolvedValueOnce({
      empty: false, // User exists
      forEach: (callback) => {
        callback({
          data: () => ({
            password: '123', 
            Staff_ID: '151408',
            Staff_FName: 'Philip',
            Staff_LName: 'Lee',
            Dept: 'Engineering',
            Position: 'Director',
            Role: '1',
            Reporting_Manager: '130002',
          }),
        })
      },
    })

    const response = await request(app)
      .post('/login')
      .send({ 
        emailAddress: 'Philip.Lee@allinone.com.sg', 
        password: '1231' })

    expect(response.status).toBe(401)
    expect(response.body.message).toBe('Invalid email address or password')
  })

  
})

//test personal employee
describe('GET /working-arrangements/:employeeid', () => {
  afterEach(() => {
    jest.clearAllMocks() // Reset the mocks after each test
  })

  //successful
  it('working arrangements for valid employeeid', async () => {
    // Mock Firestore to return working arrangements
    const mockGet = require('firebase-admin').firestore().collection().get
    mockGet.mockResolvedValueOnce({
      empty: false,
      forEach: (callback) => {
        callback({
          data: () => ({
            Approved_FName: "Eric",
            Approved_LName: "Loh",
            approvedBy: "150008",
            Staff_ID: "190019",
            Staff_FName: "Heng",
            Staff_LName: "Sim",
            startDate: "2024-10-08",
            endDate: "2024-10-08",
            requestCreated: "2024-10-05",
            status: "pending",
            time: "PM"
          })
        })
      },
    })

    const response = await request(app)
      .get('/working-arrangements/151408')
      .send()

    expect(response.status).toBe(200) // Expect 200 OK
    expect(response.body).toEqual([{
      Approved_FName: "Eric",
      Approved_LName: "Loh",
      approvedBy: "150008",
      Staff_ID: "190019",
      Staff_FName: "Heng",
      Staff_LName: "Sim",
      startDate: "2024-10-08",
      endDate: "2024-10-08",
      requestCreated: "2024-10-05",
      status: "pending",
      time: "PM"
    }])
  })

  //unsuccessful
  it('no working arrangements for staff', async () => {
    // Mock Firestore to return an empty snapshot
    const mockGet = require('firebase-admin').firestore().collection().get
    mockGet.mockResolvedValueOnce({ empty: true })

    const response = await request(app)
      .get('/working-arrangements/999999') // Some employee ID with no working arrangements
      .send()

    expect(response.status).toBe(404)
    expect(response.body).toEqual({
      error: 'No working arrangements found for the given employee',
      workingArrangements: null,
    })
  })

  //unsuccessful - something wrong with backend code
  it('should return 500 when there is a server error', async () => {
    //get firestore to throw error
    const mockGet = require('firebase-admin').firestore().collection().get
    mockGet.mockRejectedValueOnce(new Error('Firestore error'))

    const response = await request(app)
      .get('/working-arrangements/190019')
      .send()

    expect(response.status).toBe(500) // Expect 500 Internal Server Error
    expect(response.body).toEqual({ error: 'Internal server error' })
  })
})

//test department
describe('GET /working-arrangements/department/:department/:date', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  //successful
  it('return deparments and their working arrangements', async () => {

    const mockGet = require('firebase-admin').firestore().collection().get
    mockGet.mockResolvedValueOnce({
      empty: false,
      forEach: (callback) => {
        callback({
          data: () => ({
            Staff_ID: '190019',
            Staff_FName: 'Heng',
            Staff_LName: 'Sim',
            Reporting_Manager: '150008',
            Role: '2',
            Email: 'Heng.Sim@allinone.com.sg',
            Dept: 'Solutioning',
            Position: 'Developers',
            Country: 'Singapore',
            password: '123',
          })
        })
      },
    })

    //approved working arrangements
    mockGet.mockResolvedValueOnce({
      empty: false,
      forEach: (callback) => {
        callback({
          data: () => ({
            reason: 'Take care of sick cat',
            Staff_LName: 'Sim',
            Staff_FName: 'Heng',
            approvedBy: '150008',
            time: 'PM',
            Staff_ID: '190019',
            status: 'approved',
            startDate: {
              _seconds: 1728316800,
              _nanoseconds: 393000000
            },
            endDate: {
              _seconds: 1728316800,
              _nanoseconds: 713000000
            },
            requestCreated: {
              _seconds: 1727539200,
              _nanoseconds: 331000000
            },
            Approved_FName: 'Eric',
            Approved_LName: 'Loh'
          })
        })
      },
    })

    const response = await request(app)
      .get('/working-arrangements/department/Engineering/2024-10-01')
      .send()

    expect(response.status).toBe(200) // Expect 200 OK
    expect(response.body.workingArrangements).toEqual([
      {
        reason: 'Take care of sick cat',
        Staff_LName: 'Sim',
        Staff_FName: 'Heng',
        approvedBy: '150008',
        time: 'PM',
        Staff_ID: '190019',
        status: 'approved',
        startDate: {
          _seconds: 1728316800,
          _nanoseconds: 393000000
        },
        endDate: {
          _seconds: 1728316800,
          _nanoseconds: 713000000
        },
        requestCreated: {
          _seconds: 1727539200,
          _nanoseconds: 331000000
        },
        Approved_FName: 'Eric',
        Approved_LName: 'Loh'
      }
    ])
    expect(response.body.sameDepart).toEqual([
      {
        Staff_ID: '190019',
        Staff_FName: 'Heng',
        Staff_LName: 'Sim',
        Reporting_Manager: '150008',
        Role: '2',
        Email: 'Heng.Sim@allinone.com.sg',
        Dept: 'Solutioning',
        Position: 'Developers',
        Country: 'Singapore',
        password: '123',
      }
    ])
  })

  //unsuccessful - something wrong with backend code
  it('should return 500 when there is a server error', async () => {
    // Mock Firestore to throw an error
    const mockGet = require('firebase-admin').firestore().collection().get
    mockGet.mockRejectedValueOnce(new Error('Firestore error'))

    const response = await request(app)
      .get('/working-arrangements/department/Engineering/2024-10-01')
      .send()

    expect(response.status).toBe(500) // Expect 500 Internal Server Error
    expect(response.body.error).toBe('Internal server error')
  })
})

//test manager
describe('GET /working-arrangements/manager/:managerId/:date', () => {
  afterEach(() => {
    jest.clearAllMocks() // Reset the mocks after each test
  })

  it('should return employees and their approved and pending working arrangements for a manager', async () => {
    const mockGet = require('firebase-admin').firestore().collection().get
    
    // Mock Firestore to return employees under the manager
    mockGet.mockResolvedValueOnce({
      empty: false,
      forEach: (callback) => {
        callback({
          data: () => ({
            Staff_ID: '190019',
            Staff_FName: 'Heng',
            Staff_LName: 'Sim',
            Reporting_Manager: '150008',
            Dept: 'Solutioning',
            Position: 'Developers',
            Email: 'Heng.Sim@allinone.com.sg',
          })
        })
        callback({
          data: () => ({
            Staff_ID: '150008',
            Staff_FName: 'Eric',
            Staff_LName: 'Loh',
            Reporting_Manager: '150008',
            Dept: 'Solutioning',
            Position: 'Director',
            Email: 'Eric.Loh@allinone.com.sg',
          })
        })
      },
    })

    // Mock Firestore to return approved and pending working arrangements
    mockGet.mockResolvedValueOnce({
      empty: false,
      forEach: (callback) => {
        callback({
          data: () => ({
            Staff_ID: '190019',
            startDate: {
              _seconds: 1728316800,
              _nanoseconds: 393000000
            },
            endDate: {
              _seconds: 1728316800,
              _nanoseconds: 713000000
            },
            reason: 'Medical leave',
            status: 'pending',
          })
        })
        callback({
          data: () => ({
            Staff_ID: '150008',
            startDate: {
              _seconds: 1728316800,
              _nanoseconds: 393000000
            },
            endDate: {
              _seconds: 1728316800,
              _nanoseconds: 713000000
            },
            reason: 'Project work',
            status: 'approved',
          })
        })
      },
    })

    const response = await request(app)
      .get('/working-arrangements/manager/150008/2024-10-01')
      .send()

    expect(response.status).toBe(200) // Expect 200 OK
    expect(response.body.workingArrangements).toEqual([
      {
        Staff_ID: '190019',
        startDate: {
          _seconds: 1728316800,
          _nanoseconds: 393000000
        },
        endDate: {
          _seconds: 1728316800,
          _nanoseconds: 713000000
        },
        reason: 'Medical leave',
        status: 'pending',
      },
      {
        Staff_ID: '150008',
        startDate: {
          _seconds: 1728316800,
          _nanoseconds: 393000000
        },
        endDate: {
          _seconds: 1728316800,
          _nanoseconds: 713000000
        },
        reason: 'Project work',
        status: 'approved',
      }
    ])
    expect(response.body.inChargeOf).toEqual([
      {
        Staff_ID: '190019',
        Staff_FName: 'Heng',
        Staff_LName: 'Sim',
        Reporting_Manager: '150008',
        Dept: 'Solutioning',
        Position: 'Developers',
        Email: 'Heng.Sim@allinone.com.sg',
      },
      {
        Staff_ID: '150008',
        Staff_FName: 'Eric',
        Staff_LName: 'Loh',
        Reporting_Manager: '150008',
        Dept: 'Solutioning',
        Position: 'Director',
        Email: 'Eric.Loh@allinone.com.sg',
      },
    ])
  })

  //unsuccessful - something wrong with backend code
  it('should return 500 when Firestore throws an error', async () => {
    const mockGet = require('firebase-admin').firestore().collection().get
    
    // Mock Firestore to throw an error when fetching employees
    mockGet.mockRejectedValueOnce(new Error('Firestore error'))

    const response = await request(app)
      .get('/working-arrangements/manager/150008/2024-10-01')
      .send()

    expect(response.status).toBe(500) // Expect 500 Internal Server Error
    expect(response.body.error).toBe('Internal server error')
  })
})

//test team members
describe('GET /working-arrangements/team/:employeeId/:date', () => {
  afterEach(() => {
    jest.clearAllMocks() // Reset the mocks after each test
  })

  //successful
  it('return team members and approved working arrangements', async () => {
    const mockGet = require('firebase-admin').firestore().collection().get

    // Mock Firestore to return the employee data
    mockGet.mockResolvedValueOnce({
      empty: false,
      docs: [{
        data: () => ({
          Staff_ID: '190019',
          Staff_FName: 'Heng',
          Staff_LName: 'Sim',
          Position: 'Developers',
          Dept: 'Solutioning',
        }),
      }],
    })

    // Mock Firestore to return the team members based on position
    mockGet.mockResolvedValueOnce({
      empty: false,
      forEach: (callback) => {
        callback({
          data: () => ({
            Staff_ID: '190019',
            Staff_FName: 'Heng',
            Staff_LName: 'Sim',
            Position: 'Developers',
            Dept: 'Solutioning',
          })
        })
        callback({
          data: () => ({
            Staff_ID: '190059',
            Staff_FName: 'Phuc',
            Staff_LName: 'Le',
            Position: 'Developers',
            Dept: 'Solutioning',
          })
        })
      },
    })

    // Mock Firestore to return approved working arrangements for the team members
    mockGet.mockResolvedValueOnce({
      empty: false,
      forEach: (callback) => {
        callback({
          data: () => ({
            Staff_ID: '190019',
            startDate: {
              _seconds: 1728316800,
              _nanoseconds: 393000000
            },
            endDate: {
              _seconds: 1728316800,
              _nanoseconds: 713000000
            },
            reason: 'Medical leave',
            status: 'approved',
          })
        })
        callback({
          data: () => ({
            Staff_ID: '190059',
            startDate: {
              _seconds: 1728316800,
              _nanoseconds: 393000000
            },
            endDate: {
              _seconds: 1728316800,
              _nanoseconds: 713000000
            },
            reason: 'Project work',
            status: 'approved',
          })
        })
      },
    })

    const response = await request(app)
      .get('/working-arrangements/team/190019/2024-10-01')
      .send()

    expect(response.status).toBe(200) // Expect 200 OK
    expect(response.body.workingArrangements).toEqual([
      {
        Staff_ID: '190019',
        startDate: {
          _seconds: 1728316800,
          _nanoseconds: 393000000
        },
        endDate: {
          _seconds: 1728316800,
          _nanoseconds: 713000000
        },
        reason: 'Medical leave',
        status: 'approved',
      },
      {
        Staff_ID: '190059',
        startDate: {
          _seconds: 1728316800,
          _nanoseconds: 393000000
        },
        endDate: {
          _seconds: 1728316800,
          _nanoseconds: 713000000
        },
        reason: 'Project work',
        status: 'approved',
      }
    ])
    expect(response.body.teamMembers).toEqual([
      {
        Staff_ID: '190019',
        Staff_FName: 'Heng',
        Staff_LName: 'Sim',
        Position: 'Developers',
        Dept: 'Solutioning',
      },
      {
        Staff_ID: '190059',
        Staff_FName: 'Phuc',
        Staff_LName: 'Le',
        Position: 'Developers',
        Dept: 'Solutioning',
      }
    ])
  })

  //unsuccessful - employee cant be found
  it('should return 404 when the employee is not found', async () => {
    const mockGet = require('firebase-admin').firestore().collection().get

    // Mock Firestore to return an empty employee snapshot
    mockGet.mockResolvedValueOnce({ empty: true })

    const response = await request(app)
      .get('/working-arrangements/team/999999/2024-10-01')
      .send()

    expect(response.status).toBe(404) // Expect 404 Not Found
    expect(response.body.error).toBe('Employee with Staff_ID 999999 not found.')
  })

  //unsuccessful - backend code 
  it('should return 500 when Firestore throws an error', async () => {
    const mockGet = require('firebase-admin').firestore().collection().get


    // Mock Firestore to throw an error
    mockGet.mockRejectedValueOnce(new Error('Firestore error'))

    const response = await request(app)
      .get('/working-arrangements/team/190019/2024-10-01')
      .send()

    expect(response.status).toBe(500) // Expect 500 Internal Server Error
    expect(response.body.error).toBe('Internal server error')
  })
})