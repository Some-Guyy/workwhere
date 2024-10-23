const request = require('supertest')
const { app, fetchWorkingArrangementsInBatches } = require('../../app')
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
        doc: jest.fn().mockReturnValue({
          update: jest.fn()
        })
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

describe('fetchWorkingArrangementsInBatches function is called', () => {
  const sameDepartmentID = ['190019']
  const teamMemberIds = ['190019', '190059']
  const inChargeOfID = ['190019', '150008']
  const targetDate = new Date('2024-10-01')
  const endOfDay = new Date(targetDate)
  targetDate.setHours(0, 0, 0, 0)
  endOfDay.setHours(23, 59, 59, 999)

  test('fetch arrangements in batches for department', async () => {
    const mockGet = db.collection().get
    mockGet.mockResolvedValueOnce({
      empty: false,
      forEach: (callback) => {
        callback({
          data: () => ({
            reason: null,
            Staff_LName: 'Sim',
            Staff_FName: 'Heng',
            Approved_ID: '150008',
            time: 'PM',
            Staff_ID: '190019',
            status: 'approved',
            startDate: {
              _seconds: 1728316800,
              _nanoseconds: 393000000
            },
            endDate: {
              _seconds: 1728316800,
              _nanoseconds: 393000000
            },
            requestCreated: {
              _seconds: 1727539200,
              _nanoseconds: 331000000
            },
            Approved_FName: 'Eric',
            Approved_LName: 'Loh',
            attachment: null
          })
        })
      }
    })

    await fetchWorkingArrangementsInBatches(sameDepartmentID, endOfDay, targetDate, "department")
    expect(db.collection().where).toHaveBeenCalledWith("status", "!=", "rejected")
  })

  test('fetch arrangements in batches for team', async () => {
    const mockGet = db.collection().get
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
              _nanoseconds: 393000000
            },
            reason: null,
            status: 'approved',
            Staff_LName: 'Sim',
            Staff_FName: 'Heng',
            Approved_ID: '150008',
            time: 'PM',
            requestCreated: {
              _seconds: 1727539200,
              _nanoseconds: 331000000
            },
            Approved_FName: 'Eric',
            Approved_LName: 'Loh',
            attachment: null
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
              _nanoseconds: 393000000
            },
            reason: null,
            status: 'approved',
            Staff_LName: 'Phuc',
            Staff_FName: 'Le',
            Approved_ID: '150008',
            time: 'PM',
            requestCreated: {
              _seconds: 1727539200,
              _nanoseconds: 331000000
            },
            Approved_FName: 'Eric',
            Approved_LName: 'Loh',
            attachment: null
          })
        })
      },
    })

    await fetchWorkingArrangementsInBatches(teamMemberIds, endOfDay, targetDate, "team")
    expect(db.collection().where).toHaveBeenCalledWith("status", "==", "approved")
  })

  test('fetch arrangements in batches for manager\'s team in charge of', async () => {
    const mockGet = db.collection().get
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
              _nanoseconds: 393000000
            },
            reason: null,
            status: 'pending',
            Staff_LName: 'Sim',
            Staff_FName: 'Heng',
            Approved_ID: null,
            time: 'PM',
            requestCreated: {
              _seconds: 1727539200,
              _nanoseconds: 331000000
            },
            Approved_FName: null,
            Approved_LName: null,
            attachment: null
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
              _nanoseconds: 393000000
            },
            reason: null,
            status: 'approved',
            Staff_LName: 'Eric',
            Staff_FName: 'Loh',
            Approved_ID: '130002',
            time: 'PM',
            requestCreated: {
              _seconds: 1727539200,
              _nanoseconds: 331000000
            },
            Approved_FName: 'Jack',
            Approved_LName: 'Sim',
            attachment: null
          })
        })
      },
    })

    await fetchWorkingArrangementsInBatches(inChargeOfID, endOfDay, targetDate, "manager")
    expect(db.collection().where).toHaveBeenCalledWith("status", "!=", "rejected")
  })

  test('fetch arrangements in batches for manager\'s supervised employees pending', async () => {
    const mockGet = db.collection().get
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
              _nanoseconds: 393000000
            },
            reason: null,
            status: 'pending',
            Staff_LName: 'Sim',
            Staff_FName: 'Heng',
            Approved_ID: null,
            time: 'PM',
            requestCreated: {
              _seconds: 1727539200,
              _nanoseconds: 331000000
            },
            Approved_FName: null,
            Approved_LName: null,
            attachment: null
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
              _nanoseconds: 393000000
            },
            reason: null,
            status: 'pending',
            Staff_LName: 'Eric',
            Staff_FName: 'Loh',
            Approved_ID: '130002',
            time: 'PM',
            requestCreated: {
              _seconds: 1727539200,
              _nanoseconds: 331000000
            },
            Approved_FName: null,
            Approved_LName: null,
            attachment: null
          })
        })
      },
    })

    await fetchWorkingArrangementsInBatches(inChargeOfID, null, null, "supervise")
    expect(db.collection().where).toHaveBeenCalledWith("status", "==", "pending")
  })
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
            Password: '123',
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
            Password: '123',
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
            Password: '123',
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
    expect(response.body).toEqual({ message: "Something went wrong trying to login", error: `Internal server error` })
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
            Approved_ID: "150008",
            Staff_ID: "190019",
            Staff_FName: "Heng",
            Staff_LName: "Sim",
            startDate: {
              _seconds: 1728316800,
              _nanoseconds: 393000000
            },
            endDate: {
              _seconds: 1728316800,
              _nanoseconds: 393000000
            },
            requestCreated: {
              _seconds: 1727539200,
              _nanoseconds: 331000000
            },
            status: "pending",
            time: "PM",
            reason: null,
            attachment: null
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
      Approved_ID: "150008",
      Staff_ID: "190019",
      Staff_FName: "Heng",
      Staff_LName: "Sim",
      startDate: {
        _seconds: 1728316800,
        _nanoseconds: 393000000
      },
      endDate: {
        _seconds: 1728316800,
        _nanoseconds: 393000000
      },
      requestCreated: {
        _seconds: 1727539200,
        _nanoseconds: 331000000
      },
      status: "pending",
      time: "PM",
      reason: null,
      attachment: null
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
      message: 'No working arrangements found for the given employee',
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
    expect(response.body).toEqual({ message: "Something went wrong when fetching your working arrangements", error: `Internal server error` })
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
            reason: null,
            Staff_LName: 'Sim',
            Staff_FName: 'Heng',
            Approved_ID: '150008',
            time: 'PM',
            Staff_ID: '190019',
            status: 'approved',
            startDate: {
              _seconds: 1728316800,
              _nanoseconds: 393000000
            },
            endDate: {
              _seconds: 1728316800,
              _nanoseconds: 393000000
            },
            requestCreated: {
              _seconds: 1727539200,
              _nanoseconds: 331000000
            },
            Approved_FName: 'Eric',
            Approved_LName: 'Loh',
            attachment: null
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
        reason: null,
        Staff_LName: 'Sim',
        Staff_FName: 'Heng',
        Approved_ID: '150008',
        time: 'PM',
        Staff_ID: '190019',
        status: 'approved',
        startDate: {
          _seconds: 1728316800,
          _nanoseconds: 393000000
        },
        endDate: {
          _seconds: 1728316800,
          _nanoseconds: 393000000
        },
        requestCreated: {
          _seconds: 1727539200,
          _nanoseconds: 331000000
        },
        Approved_FName: 'Eric',
        Approved_LName: 'Loh',
        attachment: null
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
            Reporting_Manager: '130002',
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
              _nanoseconds: 393000000
            },
            reason: null,
            status: 'pending',
            Staff_LName: 'Sim',
            Staff_FName: 'Heng',
            Approved_ID: null,
            time: 'PM',
            requestCreated: {
              _seconds: 1727539200,
              _nanoseconds: 331000000
            },
            Approved_FName: null,
            Approved_LName: null,
            attachment: null
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
              _nanoseconds: 393000000
            },
            reason: null,
            status: 'approved',
            Staff_LName: 'Eric',
            Staff_FName: 'Loh',
            Approved_ID: '130002',
            time: 'PM',
            requestCreated: {
              _seconds: 1727539200,
              _nanoseconds: 331000000
            },
            Approved_FName: 'Jack',
            Approved_LName: 'Sim',
            attachment: null
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
        Reporting_Manager: '130002',
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
          _nanoseconds: 393000000
        },
        reason: null,
        status: 'pending',
        Staff_LName: 'Sim',
        Staff_FName: 'Heng',
        Approved_ID: null,
        time: 'PM',
        requestCreated: {
          _seconds: 1727539200,
          _nanoseconds: 331000000
        },
        Approved_FName: null,
        Approved_LName: null,
        attachment: null
      },
      {
        Staff_ID: '150008',
        startDate: {
          _seconds: 1728316800,
          _nanoseconds: 393000000
        },
        endDate: {
          _seconds: 1728316800,
          _nanoseconds: 393000000
        },
        reason: null,
        status: 'approved',
        Staff_LName: 'Eric',
        Staff_FName: 'Loh',
        Approved_ID: '130002',
        time: 'PM',
        requestCreated: {
          _seconds: 1727539200,
          _nanoseconds: 331000000
        },
        Approved_FName: 'Jack',
        Approved_LName: 'Sim',
        attachment: null
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
              _nanoseconds: 393000000
            },
            reason: null,
            status: 'approved',
            Staff_LName: 'Sim',
            Staff_FName: 'Heng',
            Approved_ID: '150008',
            time: 'PM',
            requestCreated: {
              _seconds: 1727539200,
              _nanoseconds: 331000000
            },
            Approved_FName: 'Eric',
            Approved_LName: 'Loh',
            attachment: null
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
              _nanoseconds: 393000000
            },
            reason: null,
            status: 'approved',
            Staff_LName: 'Phuc',
            Staff_FName: 'Le',
            Approved_ID: '150008',
            time: 'PM',
            requestCreated: {
              _seconds: 1727539200,
              _nanoseconds: 331000000
            },
            Approved_FName: 'Eric',
            Approved_LName: 'Loh',
            attachment: null
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
          _nanoseconds: 393000000
        },
        reason: null,
        status: 'approved',
        Staff_LName: 'Sim',
        Staff_FName: 'Heng',
        Approved_ID: '150008',
        time: 'PM',
        requestCreated: {
          _seconds: 1727539200,
          _nanoseconds: 331000000
        },
        Approved_FName: 'Eric',
        Approved_LName: 'Loh',
        attachment: null
      },
      {
        Staff_ID: '190059',
        startDate: {
          _seconds: 1728316800,
          _nanoseconds: 393000000
        },
        endDate: {
          _seconds: 1728316800,
          _nanoseconds: 393000000
        },
        reason: null,
        status: 'approved',
        Staff_LName: 'Phuc',
        Staff_FName: 'Le',
        Approved_ID: '150008',
        time: 'PM',
        requestCreated: {
          _seconds: 1727539200,
          _nanoseconds: 331000000
        },
        Approved_FName: 'Eric',
        Approved_LName: 'Loh',
        attachment: null
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
      attachment: null
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
      reason: null,
      startDate: firestore.Timestamp.fromDate(dateValue),
      endDate: firestore.Timestamp.fromDate(dateValue),
      requestCreated: firestore.Timestamp.now(),
      status: 'pending',
      Approved_ID: null,
      Approved_FName: null,
      Approved_LName: null,
      time: dates[0].time,
      attachment: dates[0].attachment
    })
    expect(response.body).toEqual({
      message: 'Request created successfully'
    })
  })

  test('create request for multiple arrangements', async () => {
    const staffId = '190019'
    const staffFName = 'Heng'
    const staffLName = 'Sim'
    const dates = [{
      date: '2024-10-01',
      time: 'PM',
      attachment: null
    },
    {
      date: '2024-10-02',
      time: 'AM',
      attachment: "b64string"
    }]

    const response = await request(app)
      .post('/request')
      .send({
        Staff_ID: staffId,
        Staff_FName: staffFName,
        Staff_LName: staffLName,
        dates: dates
      })

    const dateValue1 = new Date(dates[0].date);
    const dateValue2 = new Date(dates[1].date);
    const newDocRef = db.collection('mock_working_arrangements').doc();

    expect(response.status).toBe(201)
    expect(db.batch().set).toHaveBeenCalledWith(newDocRef, {
      Staff_ID: staffId,
      Staff_FName: staffFName,
      Staff_LName: staffLName,
      reason: null,
      startDate: firestore.Timestamp.fromDate(dateValue1),
      endDate: firestore.Timestamp.fromDate(dateValue1),
      requestCreated: firestore.Timestamp.now(),
      status: 'pending',
      Approved_ID: null,
      Approved_FName: null,
      Approved_LName: null,
      time: dates[0].time,
      attachment: dates[0].attachment
    })
    expect(db.batch().set).toHaveBeenCalledWith(newDocRef, {
      Staff_ID: staffId,
      Staff_FName: staffFName,
      Staff_LName: staffLName,
      reason: null,
      startDate: firestore.Timestamp.fromDate(dateValue2),
      endDate: firestore.Timestamp.fromDate(dateValue2),
      requestCreated: firestore.Timestamp.now(),
      status: 'pending',
      Approved_ID: null,
      Approved_FName: null,
      Approved_LName: null,
      time: dates[1].time,
      attachment: dates[1].attachment
    })
    expect(response.body).toEqual({
      message: 'Request created successfully'
    })
  })

  test('create request for MD role', async () => {
    const staffId = '130002'
    const staffFName = 'Jack'
    const staffLName = 'Sim'
    const dates = [{
      date: '2024-10-01',
      time: 'PM',
      attachment: null
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
      reason: null,
      startDate: firestore.Timestamp.fromDate(dateValue),
      endDate: firestore.Timestamp.fromDate(dateValue),
      requestCreated: firestore.Timestamp.now(),
      status: 'approved',
      Approved_ID: staffId,
      Approved_FName: staffFName,
      Approved_LName: staffLName,
      time: dates[0].time,
      attachment: dates[0].attachment
    })
    expect(response.body).toEqual({
      message: 'Request created successfully'
    })
  })

  test('create request for MD role with attachment', async () => {
    const staffId = '130002'
    const staffFName = 'Jack'
    const staffLName = 'Sim'
    const dates = [{
      date: '2024-10-01',
      time: 'PM',
      attachment: "b64string"
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
      reason: null,
      startDate: firestore.Timestamp.fromDate(dateValue),
      endDate: firestore.Timestamp.fromDate(dateValue),
      requestCreated: firestore.Timestamp.now(),
      status: 'approved',
      Approved_ID: staffId,
      Approved_FName: staffFName,
      Approved_LName: staffLName,
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
      attachment: null
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
    expect(response.body.message).toBe('Something happened when creating your request')
    expect(response.body.error).toBe('Internal server error')
  })
})

describe('GET /working-arrangements/supervise/:managerId', () => {
  test('get all pending arrangements of manager\'s team in charge of', async () => {
    const mockGet = db.collection().get
    // mock inChargeOf
    mockGet.mockResolvedValueOnce({
      empty: false,
      forEach: (callback) => {
        callback({
          data: () => ({
            Reporting_Manager: "130002",
            Role: "1",
            Email: "sally.loh@allinone.com.sg",
            Dept: "HR",
            Position: "Director",
            Staff_LName: "Loh",
            Staff_FName: "Sally",
            Country: "Singapore",
            Staff_ID: "160008",
            Password: "123"
          })
        });
      }
    });

    //mock workingArrangements
    mockGet.mockResolvedValueOnce({
      empty: false,
      forEach: (callback) => {
        callback({
          data: () => ({
            Approved_FName: "Jack",
            Approved_LName: "Sim",
            Approved_ID: "130002",
            Staff_ID: "130002",
            Staff_FName: "Jack",
            Staff_LName: "Sim",
            startDate: {
              _seconds: 1728316800,
              _nanoseconds: 393000000
            },
            endDate: {
              _seconds: 1728316800,
              _nanoseconds: 393000000
            },
            requestCreated: {
              _seconds: 1727539200,
              _nanoseconds: 331000000
            },
            status: "pending",
            time: "PM",
            reason: null,
            attachment: null
          })
        })
      },
    })


    const response = await request(app)
      .get('/working-arrangements/supervise/130002')
      .send()
    
    expect(response.status).toBe(200)
    expect(response.body.workingArrangements).toEqual([
      {
        Approved_FName: "Jack",
        Approved_LName: "Sim",
        Approved_ID: "130002",
        Staff_ID: "130002",
        Staff_FName: "Jack",
        Staff_LName: "Sim",
        startDate: {
          _seconds: 1728316800,
          _nanoseconds: 393000000
        },
        endDate: {
          _seconds: 1728316800,
          _nanoseconds: 393000000
        },
        requestCreated: {
          _seconds: 1727539200,
          _nanoseconds: 331000000
        },
        status: "pending",
        time: "PM",
        reason: null,
        attachment: null
      }
    ])
    expect(response.body.inChargeOf).toEqual([
      {
        "Reporting_Manager": "130002",
        "Role": "1",
        "Email": "sally.loh@allinone.com.sg",
        "Dept": "HR",
        "Position": "Director",
        "Staff_LName": "Loh",
        "Staff_FName": "Sally",
        "Country": "Singapore",
        "Staff_ID": "160008",
        "Password": "123"
      }
    ])
  })

  test('get non-existent pending arrangements of manager\'s team in charge of', async () => {
    const mockGet = db.collection().get
    // mock inChargeOf
    mockGet.mockResolvedValueOnce({
      empty: false,
      forEach: (callback) => {
        callback({
          data: () => ({
            Reporting_Manager: "130002",
            Role: "1",
            Email: "sally.loh@allinone.com.sg",
            Dept: "HR",
            Position: "Director",
            Staff_LName: "Loh",
            Staff_FName: "Sally",
            Country: "Singapore",
            Staff_ID: "160008",
            Password: "123"
          })
        });
      }
    });

    //mock workingArrangements
    mockGet.mockResolvedValueOnce([])

    const response = await request(app)
      .get('/working-arrangements/supervise/130002')
      .send()
    
    expect(response.status).toBe(200)
    expect(response.body.workingArrangements).toEqual([])
    expect(response.body.inChargeOf).toEqual([
      {
        "Reporting_Manager": "130002",
        "Role": "1",
        "Email": "sally.loh@allinone.com.sg",
        "Dept": "HR",
        "Position": "Director",
        "Staff_LName": "Loh",
        "Staff_FName": "Sally",
        "Country": "Singapore",
        "Staff_ID": "160008",
        "Password": "123"
      }
    ])
  })

  //unsuccessful - something wrong with backend code
  test('get all pending arrangements of manager\'s team in charge of with firestore error', async () => {
    //get firestore to throw error
    const mockGet = db.collection().get
    mockGet.mockRejectedValueOnce(new Error('Firestore error'))

    const response = await request(app)
      .get('/working-arrangements/supervise/130002')
      .send()

    expect(response.status).toBe(500) // Expect 500 Internal Server Error
    expect(response.body).toEqual({ message: "Something went wrong when fetching your working arrangements", error: `Internal server error` })

  })
})

describe('PUT /working-arrangements', () => {
  test('cancel existing pending working arrangement', async () => {
    // Mock Firestore get method to return a snapshot with a matching document
    const mockGet = db.collection().get;
    const mockDocRef = {
      update: jest.fn().mockResolvedValue() // Mock the update method to resolve successfully
    };

    mockGet.mockResolvedValueOnce({
      empty: false, // Indicating that matching documents were found
      docs: [
        { id: 'mock-doc-id', data: () => ({ /* mock data */ }) }
      ]
    });

    // Mock Firestore doc reference
    db.collection().doc = jest.fn().mockReturnValue(mockDocRef);

    // Simulate a PUT request with valid data
    const response = await request(app)
      .put('/working-arrangements')
      .send({
        Staff_ID: "130002",
        startDate: {
          _seconds: 1728316800,
          _nanoseconds: 393000000
        }
      });

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body.message).toEqual('Working arrangement successfully cancelled.');

    // Verify that the correct document was updated with the correct status
    expect(db.collection().doc).toHaveBeenCalledWith('mock-doc-id');
    expect(mockDocRef.update).toHaveBeenCalledWith({ status: 'cancelled' });
  });


  //unsuccessful
  test('cancel a non-existent pending working arrangement', async () => {
    const mockGet = db.collection().get
    mockGet.mockResolvedValueOnce({
      empty: true
    })

    const response = await request(app)
      .put('/working-arrangements')
      .send({
        Staff_ID: "130002",
        startDate: {
          _seconds: 1728316800,
          _nanoseconds: 393000000
        }
      })
    expect(response.status).toBe(404)
    expect(response.body.message).toBe("No matching working arrangement found")

  })

  test('cancel pending working arrangement with firestore error', async () => {
    //get firestore to throw error
    const mockGet = db.collection().get
    mockGet.mockRejectedValueOnce(new Error('Firestore error'))

    const response = await request(app)
      .put('/working-arrangements/')
      .send()

    expect(response.status).toBe(500) // Expect 500 Internal Server Error
    expect(response.body).toEqual({ message: "Something happened when creating your working arrangements", error: `Internal server error ` })

  })
})

describe('PUT /working-arrangements/manage', () => {
  test('update existing pending arrangement', async () => {
    // Mock Firestore get method to return a snapshot with a matching document
    const mockGet = db.collection().get;
    const mockDocRef = {
      update: jest.fn().mockResolvedValue() // Mock the update method to resolve successfully
    };

    mockGet.mockResolvedValueOnce({
      empty: false, // Indicating that matching documents were found
      docs: [
        { id: 'mock-doc-id', data: () => ({ /* mock data */ }) }
      ]
    });

    // Mock Firestore doc reference
    db.collection().doc = jest.fn().mockReturnValue(mockDocRef);

    // Simulate a PUT request with valid data
    const response = await request(app)
      .put('/working-arrangements/manage')
      .send({
        Approved_ID: "130002",
        Approved_FName: "Jack",
        Approved_LName: "Sim",
        Staff_ID: "160008",
        startDate: {
          _seconds: 1728316800,
          _nanoseconds: 393000000
        },
        status: "approved",
        reason: null
      });

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body.message).toEqual('Working arrangement successfully updated.');

    // Verify that the correct document was updated with the correct status
    expect(db.collection().doc).toHaveBeenCalledWith('mock-doc-id');
  })

  test('update non-existent pending arrangement', async () => {
    const mockGet = db.collection().get
    mockGet.mockResolvedValueOnce({
      empty: true
    })

    const response = await request(app)
      .put('/working-arrangements/manage')
      .send({
        Approved_ID: "130002",
        Approved_FName: "Jack",
        Approved_LName: "Sim",
        Staff_ID: "160008",
        startDate: {
          _seconds: 1728316800,
          _nanoseconds: 393000000
        },
        status: "approved",
        reason: null
      })
    expect(response.status).toBe(404)
    expect(response.body.message).toBe("No matching working arrangement found")

  })

  test('update pending arrangement with firestore error', async () => {
    //get firestore to throw error
    const mockGet = db.collection().get
    mockGet.mockRejectedValueOnce(new Error('Firestore error'))

    const response = await request(app)
      .put('/working-arrangements/manage')
      .send()

    expect(response.status).toBe(500) // Expect 500 Internal Server Error
    expect(response.body).toEqual({ message: "Something happened when updating the working arrangements", error: `Internal server error` })

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
