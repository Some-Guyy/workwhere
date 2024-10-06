const request = require('supertest')
const app = require('../../app')
const admin = require('firebase-admin')
const db = admin.firestore()
const firestore = require('firebase-admin/firestore')

// Fixtures
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
        doc: jest.fn().mockReturnValue('some-doc-ref')
      }),
      batch: jest.fn().mockReturnValue({
        set: jest.fn(),
        commit: jest.fn()
      })
    })
  }
})

jest.mock('firebase-admin/firestore', () => {
  return {
    Timestamp: {
      fromDate: jest.fn(),
      now: jest.fn()
    }
  }
})

afterEach(() => {
  jest.clearAllMocks() // Reset the mocks after each test
})

//test login
describe('POST /login', () => {
  //login successful
  test('login existing user with valid password', async () => {
    const mockGet = db.collection().get
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
        emailAddress: 'philip.lee@allinone.com.sg',
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

  test('login existing user with valid password but uppercased email', async () => {
    const mockGet = db.collection().get
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
        emailAddress: 'pHiLiP.LeE@allinone.com.sg',
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
  test('login non-existent user', async () => {
    // return nothing back
    const mockGet = db.collection().get
    mockGet.mockResolvedValueOnce({
      empty: true,
      forEach: jest.fn(),
    })

    const response = await request(app)
      .post('/login')
      .send({
        emailAddress: 'philip.lee@allinone.com.sg',
        password: '123'
      })

    expect(response.status).toBe(401)
    expect(response.body.message).toBe('Invalid email address or password')
  })

  //login unsuccessful - wrong password
  test('login existing user with invalid password', async () => {
    // return user
    const mockGet = db.collection().get
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
        emailAddress: 'philip.lee@allinone.com.sg',
        password: '1231'
      })

    expect(response.status).toBe(401)
    expect(response.body.message).toBe('Invalid email address or password')
  })

  test('login with firestore error', async () => {
    // Mock Firestore to throw an error
    const mockGet = db.collection().get
    mockGet.mockRejectedValueOnce(new Error('Firestore error'))

    const response = await request(app)
      .post('/login')
      .send({
        emailAddress: 'philip.lee@allinone.com.sg',
        password: '123'
      })

    expect(response.status).toBe(500) // Expect 500 Internal Server Error
    expect(response.body.error).toBe('Internal server error')
  })
})

//test personal employee
describe('GET /working-arrangements/:employeeid', () => {
  //successful
  test('get arrangements for an employee', async () => {
    // Mock Firestore to return working arrangements
    const mockGet = db.collection().get
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
      .get('/working-arrangements/190019')
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
  test('get non-existent arrangements for an employee', async () => {
    // Mock Firestore to return an empty snapshot
    const mockGet = db.collection().get
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
  test('get arrangements for an employee with firestore error', async () => {
    //get firestore to throw error
    const mockGet = db.collection().get
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
  //successful
  test('get arrangements for department on a date', async () => {
    const mockGet = db.collection().get
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
            Email: 'heng.sim@allinone.com.sg',
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
      .get('/working-arrangements/department/Solutioning/2024-10-01')
      .send()

    expect(response.status).toBe(200) // Expect 200 OK
    expect(response.body.sameDepart).toEqual([
      {
        Staff_ID: '190019',
        Staff_FName: 'Heng',
        Staff_LName: 'Sim',
        Reporting_Manager: '150008',
        Role: '2',
        Email: 'heng.sim@allinone.com.sg',
        Dept: 'Solutioning',
        Position: 'Developers',
        Country: 'Singapore',
        password: '123',
      }
    ])
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
  })

  //unsuccessful - something wrong with backend code
  test('get arrangements for department on a date with firestore error', async () => {
    // Mock Firestore to throw an error
    const mockGet = db.collection().get
    mockGet.mockRejectedValueOnce(new Error('Firestore error'))

    const response = await request(app)
      .get('/working-arrangements/department/Solutioning/2024-10-01')
      .send()

    expect(response.status).toBe(500) // Expect 500 Internal Server Error
    expect(response.body.error).toBe('Internal server error')
  })
})

//test manager
describe('GET /working-arrangements/manager/:managerId/:date', () => {
  test('get arrangements of manager\'s team in charge of on a date', async () => {
    const mockGet = db.collection().get

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
            Email: 'heng.sim@allinone.com.sg',
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
            Email: 'eric.loh@allinone.com.sg',
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
    expect(response.body.inChargeOf).toEqual([
      {
        Staff_ID: '190019',
        Staff_FName: 'Heng',
        Staff_LName: 'Sim',
        Reporting_Manager: '150008',
        Dept: 'Solutioning',
        Position: 'Developers',
        Email: 'heng.sim@allinone.com.sg',
      },
      {
        Staff_ID: '150008',
        Staff_FName: 'Eric',
        Staff_LName: 'Loh',
        Reporting_Manager: '150008',
        Dept: 'Solutioning',
        Position: 'Director',
        Email: 'eric.loh@allinone.com.sg',
      },
    ])
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
  })

  //unsuccessful - something wrong with backend code
  test('get arrangements of manager\'s team in charge of on a date with firestore error', async () => {
    const mockGet = db.collection().get

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
  //successful
  test('get approved arrangements of employee\'s teammates on a date', async () => {
    const mockGet = db.collection().get

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
  })

  //unsuccessful - employee cant be found
  test('get approved arrangements of non-existent employee\'s teammates on a date', async () => {
    const mockGet = db.collection().get

    // Mock Firestore to return an empty employee snapshot
    mockGet.mockResolvedValueOnce({ empty: true })

    const response = await request(app)
      .get('/working-arrangements/team/999999/2024-10-01')
      .send()

    expect(response.status).toBe(404) // Expect 404 Not Found
    expect(response.body.error).toBe('Employee with Staff_ID 999999 not found.')
  })

  //unsuccessful - backend code 
  test('get approved arrangements of employee\'s teammates on a date with firestore error', async () => {
    const mockGet = db.collection().get

    // Mock Firestore to throw an error
    mockGet.mockRejectedValueOnce(new Error('Firestore error'))

    const response = await request(app)
      .get('/working-arrangements/team/190019/2024-10-01')
      .send()

    expect(response.status).toBe(500) // Expect 500 Internal Server Error
    expect(response.body.error).toBe('Internal server error')
  })
})

//test create working arrangement
describe('POST /request', () => {
  test('create request for an arrangement', async () => {
    const staffId = '190019'
    const staffFName = 'Heng'
    const staffLName = 'Sim'
    const dates = [{
      date: '2024-10-01',
      time: 'PM',
      attachment: ''
    }]

    const response = await request(app)
      .post('/request')
      .send({
        Staff_ID: staffId,
        Staff_FName: staffFName,
        Staff_LName: staffLName,
        dates: dates
      })

    const dateValue = new Date(dates[0].date);
    const newDocRef = db.collection('mock_working_arrangements').doc();

    expect(response.status).toBe(201)
    expect(db.batch().set).toHaveBeenCalledWith(newDocRef, {
      Staff_ID: staffId,
      Staff_FName: staffFName,
      Staff_LName: staffLName,
      reason: '',
      startDate: firestore.Timestamp.fromDate(dateValue),
      endDate: firestore.Timestamp.fromDate(dateValue),
      requestCreated: firestore.Timestamp.now(),
      status: 'pending',
      approvedBy: '',
      Approved_FName: '',
      Approved_LName: '',
      time: dates[0].time,
      attachment: dates[0].attachment
    })
    expect(response.body).toEqual({
      message: 'Request created successfully'
    })
  })

  test('create request for an arrangement with firestore error', async () => {
    const staffId = '190019'
    const staffFName = 'Heng'
    const staffLName = 'Sim'
    const dates = [{
      date: '2024-10-01',
      time: 'PM',
      attachment: ''
    }]
    db.batch().commit.mockRejectedValueOnce(new Error('Firestore error'))

    const response = await request(app)
      .post('/request')
      .send({
        Staff_ID: staffId,
        Staff_FName: staffFName,
        Staff_LName: staffLName,
        dates: dates
      })

    expect(response.status).toBe(500)
    expect(response.body.message).toBe('Error creating your request')
    expect(response.body.error).toBe('Internal server error')
  })
})

// catch rogue calls
describe('ALL *', () => {
  test('access rogue route', async () => {
    const response = await request(app)
      .get('/non-existent_route')
      .send()

    expect(response.status).toBe(404)
  })
})
