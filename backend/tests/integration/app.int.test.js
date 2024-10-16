const request = require('supertest')
const admin = require("firebase-admin")
const { app } = require("../../app") // Gets firebase initialization from here
const db = admin.firestore()
const firestore = require('firebase-admin/firestore')

const collectionEmployee = "test_employee"
const collectionWa = "test_working_arrangements"

const testDept = "Sales"
const testDate = "2024-10-01"
const testTomorrow = "2024-10-02"
const testYesterday = "2024-09-30"
const testNowDate = new Date().toJSON().slice(0, 10)
const testFirestoreDate = firestore.Timestamp.fromDate(new Date(testDate))
const testFirestoreNow = firestore.Timestamp.fromDate(new Date(testNowDate))

const timestampToSeconds = (date) => ({
    _seconds: Math.floor(date.getTime() / 1000),
    _nanoseconds: (date.getTime() % 1000) * 1000000,
})

beforeAll(async () => {
    // Insert needed data in db
    /*
        Insert employees A, B, C, D, E, F
        Hierarchy:
            A -> B, C -> D (All from Sales department)
            E -> F (E is Jack Sim, F can be any director that is not Sales)

        Insert working arrangements:
            1 approved each for A, B, C (same date)
            1 pending each for A, B, C (same date)
    */

    const employees = [
        {
            Staff_ID: "140001",
            Staff_FName: "Derek",
            Staff_LName: "Tan",
            Dept: testDept,
            Position: "Director",
            Country: "Singapore",
            Email: "derek.tan@allinone.com.sg",
            Reporting_Manager: "130002",
            Role: "1",
            Password: "123",
        },
        {
            Staff_ID: "140894",
            Staff_FName: "Rahim",
            Staff_LName: "Khalid",
            Dept: testDept,
            Position: "Sales Manager",
            Country: "Singapore",
            Email: "rahim.khalid@allinone.com.sg",
            Reporting_Manager: "140001",
            Role: "3",
            Password: "123",
        },
        {
            Staff_ID: "140008",
            Staff_FName: "Jaclyn",
            Staff_LName: "Lee",
            Dept: testDept,
            Position: "Sales Manager",
            Country: "Singapore",
            Email: "jaclyn.lee@allinone.com.sg",
            Reporting_Manager: "140001",
            Role: "3",
            Password: "123",
        },
        {
            Staff_ID: "140880",
            Staff_FName: "Heng",
            Staff_LName: "Chan",
            Dept: testDept,
            Position: "Account Manager",
            Country: "Singapore",
            Email: "heng.chan@allinone.com.sg",
            Reporting_Manager: "140008",
            Role: "2",
            Password: "123",
        },
        {
            Staff_ID: "130002",
            Staff_FName: "Jack",
            Staff_LName: "Sim",
            Dept: "CEO",
            Position: "MD",
            Country: "Singapore",
            Email: "jack.sim@allinone.com.sg",
            Reporting_Manager: "130002",
            Role: "1",
            Password: "123",
        },
        {
            Staff_ID: "160008",
            Staff_FName: "Sally",
            Staff_LName: "Loh",
            Dept: "HR",
            Position: "Director",
            Country: "Singapore",
            Email: "sally.loh@allinone.com.sg",
            Reporting_Manager: "130002",
            Role: "1",
            Password: "123",
        },
    ]
    const workingArrangements = [
        {
            Staff_ID: "140001",
            Staff_FName: "Derek",
            Staff_LName: "Tan",
            reason: null,
            startDate: testFirestoreDate,
            endDate: testFirestoreDate,
            requestCreated: testFirestoreNow,
            status: 'pending',
            Approved_ID: null,
            Approved_FName: null,
            Approved_LName: null,
            time: "AM",
            attachment: null
        },
        {
            Staff_ID: "140001",
            Staff_FName: "Derek",
            Staff_LName: "Tan",
            reason: null,
            startDate: testFirestoreDate,
            endDate: testFirestoreDate,
            requestCreated: testFirestoreNow,
            status: 'approved',
            Approved_ID: "130002",
            Approved_FName: "Jack",
            Approved_LName: "Sim",
            time: "AM",
            attachment: null
        },
        {
            Staff_ID: "140894",
            Staff_FName: "Rahim",
            Staff_LName: "Khalid",
            reason: null,
            startDate: testFirestoreDate,
            endDate: testFirestoreDate,
            requestCreated: testFirestoreNow,
            status: 'pending',
            Approved_ID: null,
            Approved_FName: null,
            Approved_LName: null,
            time: "AM",
            attachment: null
        },
        {
            Staff_ID: "140894",
            Staff_FName: "Rahim",
            Staff_LName: "Khalid",
            reason: null,
            startDate: testFirestoreDate,
            endDate: testFirestoreDate,
            requestCreated: testFirestoreNow,
            status: 'approved',
            Approved_ID: "140001",
            Approved_FName: "Derek",
            Approved_LName: "Tan",
            time: "AM",
            attachment: null
        },
        {
            Staff_ID: "140008",
            Staff_FName: "Jaclyn",
            Staff_LName: "Lee",
            reason: null,
            startDate: testFirestoreDate,
            endDate: testFirestoreDate,
            requestCreated: testFirestoreNow,
            status: 'pending',
            Approved_ID: null,
            Approved_FName: null,
            Approved_LName: null,
            time: "AM",
            attachment: null
        },
        {
            Staff_ID: "140008",
            Staff_FName: "Jaclyn",
            Staff_LName: "Lee",
            reason: null,
            startDate: testFirestoreDate,
            endDate: testFirestoreDate,
            requestCreated: testFirestoreNow,
            status: 'approved',
            Approved_ID: "140001",
            Approved_FName: "Derek",
            Approved_LName: "Tan",
            time: "AM",
            attachment: null
        },
    ]

    const batch1 = db.batch()
    employees.forEach(employee => {
        const newDocRef = db.collection(collectionEmployee).doc()
        batch1.set(newDocRef, employee)
    })
    await batch1.commit()

    const batch2 = db.batch()
    workingArrangements.forEach(wa => {
        const newDocRef = db.collection(collectionWa).doc()
        batch2.set(newDocRef, wa)
    })
    await batch2.commit()
})
afterAll(async () => {
    // Delete everything inserted in beforeAll()
    async function deleteCollection(db, collectionPath) {
        const collectionRef = db.collection(collectionPath)
        const query = collectionRef.orderBy('__name__')

        return new Promise((resolve, reject) => {
            deleteQueryBatch(db, query, resolve).catch(reject);
        });
    }

    async function deleteQueryBatch(db, query, resolve) {
        const snapshot = await query.get();

        const batchSize = snapshot.size;
        if (batchSize === 0) {
            // When there are no documents left, we are done
            resolve();
            return;
        }

        // Delete documents in a batch
        const batch = db.batch();
        snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });
        await batch.commit();

        // Recurse on the next process tick, to avoid
        // exploding the stack.
        process.nextTick(() => {
            deleteQueryBatch(db, query, resolve);
        });
    }

    await deleteCollection(db, collectionEmployee)
    await deleteCollection(db, collectionWa)
})

describe('POST /login', () => {
    test('login existing user with valid password', async () => {
        // Login employee A with valid password
        const response = await request(app)
            .post('/login')
            .send({
                emailAddress: 'derek.tan@allinone.com.sg',
                password: '123',
            })

        expect(response.status).toBe(200)
        expect(response.body).toEqual({
            message: 'Login successful',
            user: {
                Staff_ID: "140001",
                Staff_FName: "Derek",
                Staff_LName: "Tan",
                Dept: testDept,
                Position: "Director",
                Role: "1",
                Reporting_Manager: "130002",
            },
        })
    })

    test('login non-existent user', async () => {
        // Login chickenrice69@chicken.com
        const response = await request(app)
            .post('/login')
            .send({
                emailAddress: 'chickenrice69@chicken.com',
                password: '123',
            })

        expect(response.status).toBe(401)
        expect(response.body).toEqual({
            message: 'Invalid email address or password',
        })
    })
})

describe('GET /working-arrangements/:employeeid', () => {
    test('get existing arrangements from an employee', async () => {
        // Get from employee A
        const response = await request(app)
            .get('/working-arrangements/140001')
            .send()

        expect(response.status).toBe(200)
        expect(response.body).toEqual(expect.arrayContaining([
            {
                Staff_ID: "140001",
                Staff_FName: "Derek",
                Staff_LName: "Tan",
                reason: null,
                startDate: timestampToSeconds(new Date(testDate)),
                endDate: timestampToSeconds(new Date(testDate)),
                requestCreated: timestampToSeconds(new Date(testNowDate)),
                status: 'pending',
                Approved_ID: null,
                Approved_FName: null,
                Approved_LName: null,
                time: "AM",
                attachment: null
            },
            {
                Staff_ID: "140001",
                Staff_FName: "Derek",
                Staff_LName: "Tan",
                reason: null,
                startDate: timestampToSeconds(new Date(testDate)),
                endDate: timestampToSeconds(new Date(testDate)),
                requestCreated: timestampToSeconds(new Date(testNowDate)),
                status: 'approved',
                Approved_ID: "130002",
                Approved_FName: "Jack",
                Approved_LName: "Sim",
                time: "AM",
                attachment: null
            },
        ]))
    })

    test('get non-existent arrangements for an employee', async () => {
        // Get from employee id 999999
        const response = await request(app)
            .get('/working-arrangements/999999')
            .send()
        expect(response.status).toBe(404)
        expect(response.body).toEqual({
            message: 'No working arrangements found for the given employee',
            workingArrangements: null,
        })
    })
})

describe('GET /working-arrangements/department/:department/:date', () => {
    test('get arrangements for department on a date', async () => {
        // Get from department including employees A, B, C
        const response = await request(app)
            .get(`/working-arrangements/department/${testDept}/${testDate}`)
            .send()

        // Expect arrangements of A, B and C
        // Expect arrangements to be both approved and pending
        expect(response.status).toBe(200)
        expect(response.body).toEqual({
            workingArrangements: expect.arrayContaining([
                {
                    Staff_ID: "140001",
                    Staff_FName: "Derek",
                    Staff_LName: "Tan",
                    reason: null,
                    startDate: timestampToSeconds(new Date(testDate)),
                    endDate: timestampToSeconds(new Date(testDate)),
                    requestCreated: timestampToSeconds(new Date(testNowDate)),
                    status: 'pending',
                    Approved_ID: null,
                    Approved_FName: null,
                    Approved_LName: null,
                    time: "AM",
                    attachment: null
                },
                {
                    Staff_ID: "140001",
                    Staff_FName: "Derek",
                    Staff_LName: "Tan",
                    reason: null,
                    startDate: timestampToSeconds(new Date(testDate)),
                    endDate: timestampToSeconds(new Date(testDate)),
                    requestCreated: timestampToSeconds(new Date(testNowDate)),
                    status: 'approved',
                    Approved_ID: "130002",
                    Approved_FName: "Jack",
                    Approved_LName: "Sim",
                    time: "AM",
                    attachment: null
                },
                {
                    Staff_ID: "140894",
                    Staff_FName: "Rahim",
                    Staff_LName: "Khalid",
                    reason: null,
                    startDate: timestampToSeconds(new Date(testDate)),
                    endDate: timestampToSeconds(new Date(testDate)),
                    requestCreated: timestampToSeconds(new Date(testNowDate)),
                    status: 'pending',
                    Approved_ID: null,
                    Approved_FName: null,
                    Approved_LName: null,
                    time: "AM",
                    attachment: null
                },
                {
                    Staff_ID: "140894",
                    Staff_FName: "Rahim",
                    Staff_LName: "Khalid",
                    reason: null,
                    startDate: timestampToSeconds(new Date(testDate)),
                    endDate: timestampToSeconds(new Date(testDate)),
                    requestCreated: timestampToSeconds(new Date(testNowDate)),
                    status: 'approved',
                    Approved_ID: "140001",
                    Approved_FName: "Derek",
                    Approved_LName: "Tan",
                    time: "AM",
                    attachment: null
                },
                {
                    Staff_ID: "140008",
                    Staff_FName: "Jaclyn",
                    Staff_LName: "Lee",
                    reason: null,
                    startDate: timestampToSeconds(new Date(testDate)),
                    endDate: timestampToSeconds(new Date(testDate)),
                    requestCreated: timestampToSeconds(new Date(testNowDate)),
                    status: 'pending',
                    Approved_ID: null,
                    Approved_FName: null,
                    Approved_LName: null,
                    time: "AM",
                    attachment: null
                },
                {
                    Staff_ID: "140008",
                    Staff_FName: "Jaclyn",
                    Staff_LName: "Lee",
                    reason: null,
                    startDate: timestampToSeconds(new Date(testDate)),
                    endDate: timestampToSeconds(new Date(testDate)),
                    requestCreated: timestampToSeconds(new Date(testNowDate)),
                    status: 'approved',
                    Approved_ID: "140001",
                    Approved_FName: "Derek",
                    Approved_LName: "Tan",
                    time: "AM",
                    attachment: null
                },
            ]),
            sameDepart: expect.arrayContaining([
                {
                    Staff_ID: "140001",
                    Staff_FName: "Derek",
                    Staff_LName: "Tan",
                    Dept: testDept,
                    Position: "Director",
                    Country: "Singapore",
                    Email: "derek.tan@allinone.com.sg",
                    Reporting_Manager: "130002",
                    Role: "1",
                    Password: "123",
                },
                {
                    Staff_ID: "140894",
                    Staff_FName: "Rahim",
                    Staff_LName: "Khalid",
                    Dept: testDept,
                    Position: "Sales Manager",
                    Country: "Singapore",
                    Email: "rahim.khalid@allinone.com.sg",
                    Reporting_Manager: "140001",
                    Role: "3",
                    Password: "123",
                },
                {
                    Staff_ID: "140008",
                    Staff_FName: "Jaclyn",
                    Staff_LName: "Lee",
                    Dept: testDept,
                    Position: "Sales Manager",
                    Country: "Singapore",
                    Email: "jaclyn.lee@allinone.com.sg",
                    Reporting_Manager: "140001",
                    Role: "3",
                    Password: "123",
                },
                {
                    Staff_ID: "140880",
                    Staff_FName: "Heng",
                    Staff_LName: "Chan",
                    Dept: testDept,
                    Position: "Account Manager",
                    Country: "Singapore",
                    Email: "heng.chan@allinone.com.sg",
                    Reporting_Manager: "140008",
                    Role: "2",
                    Password: "123",
                },
            ]),
        })
    })

    test('get arrangements for department on a date with no arrangements', async () => {
        // Get from department including employees A, B, C but one day after and before the date of arrangements
        const response1 = await request(app)
            .get(`/working-arrangements/department/${testDept}/${testTomorrow}`)
            .send()
        const response2 = await request(app)
            .get(`/working-arrangements/department/${testDept}/${testYesterday}`)
            .send()

        // Expect 200 but empty response array
        expect(response1.status).toBe(200)
        expect(response1.body).toEqual({
            workingArrangements: [],
            sameDepart: expect.arrayContaining([
                {
                    Staff_ID: "140001",
                    Staff_FName: "Derek",
                    Staff_LName: "Tan",
                    Dept: testDept,
                    Position: "Director",
                    Country: "Singapore",
                    Email: "derek.tan@allinone.com.sg",
                    Reporting_Manager: "130002",
                    Role: "1",
                    Password: "123",
                },
                {
                    Staff_ID: "140894",
                    Staff_FName: "Rahim",
                    Staff_LName: "Khalid",
                    Dept: testDept,
                    Position: "Sales Manager",
                    Country: "Singapore",
                    Email: "rahim.khalid@allinone.com.sg",
                    Reporting_Manager: "140001",
                    Role: "3",
                    Password: "123",
                },
                {
                    Staff_ID: "140008",
                    Staff_FName: "Jaclyn",
                    Staff_LName: "Lee",
                    Dept: testDept,
                    Position: "Sales Manager",
                    Country: "Singapore",
                    Email: "jaclyn.lee@allinone.com.sg",
                    Reporting_Manager: "140001",
                    Role: "3",
                    Password: "123",
                },
                {
                    Staff_ID: "140880",
                    Staff_FName: "Heng",
                    Staff_LName: "Chan",
                    Dept: testDept,
                    Position: "Account Manager",
                    Country: "Singapore",
                    Email: "heng.chan@allinone.com.sg",
                    Reporting_Manager: "140008",
                    Role: "2",
                    Password: "123",
                },
            ]),
        })
        expect(response2.status).toBe(200)
        expect(response2.body).toEqual({
            workingArrangements: [],
            sameDepart: expect.arrayContaining([
                {
                    Staff_ID: "140001",
                    Staff_FName: "Derek",
                    Staff_LName: "Tan",
                    Dept: testDept,
                    Position: "Director",
                    Country: "Singapore",
                    Email: "derek.tan@allinone.com.sg",
                    Reporting_Manager: "130002",
                    Role: "1",
                    Password: "123",
                },
                {
                    Staff_ID: "140894",
                    Staff_FName: "Rahim",
                    Staff_LName: "Khalid",
                    Dept: testDept,
                    Position: "Sales Manager",
                    Country: "Singapore",
                    Email: "rahim.khalid@allinone.com.sg",
                    Reporting_Manager: "140001",
                    Role: "3",
                    Password: "123",
                },
                {
                    Staff_ID: "140008",
                    Staff_FName: "Jaclyn",
                    Staff_LName: "Lee",
                    Dept: testDept,
                    Position: "Sales Manager",
                    Country: "Singapore",
                    Email: "jaclyn.lee@allinone.com.sg",
                    Reporting_Manager: "140001",
                    Role: "3",
                    Password: "123",
                },
                {
                    Staff_ID: "140880",
                    Staff_FName: "Heng",
                    Staff_LName: "Chan",
                    Dept: testDept,
                    Position: "Account Manager",
                    Country: "Singapore",
                    Email: "heng.chan@allinone.com.sg",
                    Reporting_Manager: "140008",
                    Role: "2",
                    Password: "123",
                },
            ]),
        })
    })
})

describe('GET /working-arrangements/manager/:managerId/:date', () => {
    test('get arrangements of manager\'s team in charge of on a date', async () => {
        // Get from A as the manager
        const response = await request(app)
            .get(`/working-arrangements/manager/140001/${testDate}`)
            .send()

        // Expect arrangements of both B and C
        // Expect arrangements to be both approved and pending
        expect(response.status).toBe(200)
        expect(response.body).toEqual({
            workingArrangements: expect.arrayContaining([
                {
                    Staff_ID: "140894",
                    Staff_FName: "Rahim",
                    Staff_LName: "Khalid",
                    reason: null,
                    startDate: timestampToSeconds(new Date(testDate)),
                    endDate: timestampToSeconds(new Date(testDate)),
                    requestCreated: timestampToSeconds(new Date(testNowDate)),
                    status: 'pending',
                    Approved_ID: null,
                    Approved_FName: null,
                    Approved_LName: null,
                    time: "AM",
                    attachment: null
                },
                {
                    Staff_ID: "140894",
                    Staff_FName: "Rahim",
                    Staff_LName: "Khalid",
                    reason: null,
                    startDate: timestampToSeconds(new Date(testDate)),
                    endDate: timestampToSeconds(new Date(testDate)),
                    requestCreated: timestampToSeconds(new Date(testNowDate)),
                    status: 'approved',
                    Approved_ID: "140001",
                    Approved_FName: "Derek",
                    Approved_LName: "Tan",
                    time: "AM",
                    attachment: null
                },
                {
                    Staff_ID: "140008",
                    Staff_FName: "Jaclyn",
                    Staff_LName: "Lee",
                    reason: null,
                    startDate: timestampToSeconds(new Date(testDate)),
                    endDate: timestampToSeconds(new Date(testDate)),
                    requestCreated: timestampToSeconds(new Date(testNowDate)),
                    status: 'pending',
                    Approved_ID: null,
                    Approved_FName: null,
                    Approved_LName: null,
                    time: "AM",
                    attachment: null
                },
                {
                    Staff_ID: "140008",
                    Staff_FName: "Jaclyn",
                    Staff_LName: "Lee",
                    reason: null,
                    startDate: timestampToSeconds(new Date(testDate)),
                    endDate: timestampToSeconds(new Date(testDate)),
                    requestCreated: timestampToSeconds(new Date(testNowDate)),
                    status: 'approved',
                    Approved_ID: "140001",
                    Approved_FName: "Derek",
                    Approved_LName: "Tan",
                    time: "AM",
                    attachment: null
                },
            ]),
            inChargeOf: expect.arrayContaining([
                {
                    Staff_ID: "140894",
                    Staff_FName: "Rahim",
                    Staff_LName: "Khalid",
                    Dept: testDept,
                    Position: "Sales Manager",
                    Country: "Singapore",
                    Email: "rahim.khalid@allinone.com.sg",
                    Reporting_Manager: "140001",
                    Role: "3",
                    Password: "123",
                },
                {
                    Staff_ID: "140008",
                    Staff_FName: "Jaclyn",
                    Staff_LName: "Lee",
                    Dept: testDept,
                    Position: "Sales Manager",
                    Country: "Singapore",
                    Email: "jaclyn.lee@allinone.com.sg",
                    Reporting_Manager: "140001",
                    Role: "3",
                    Password: "123",
                },
            ]),
        })
    })

    test('get non-existent arrangements of manager\'s team in charge of on a date', async () => {
        // Get from C as the manager
        const response = await request(app)
            .get(`/working-arrangements/manager/140008/${testDate}`)
            .send()

        // Expect 200 but empty response array cause D has no arrangements
        expect(response.status).toBe(200)
        expect(response.body).toEqual({
            workingArrangements: [],
            inChargeOf: expect.arrayContaining([
                {
                    Staff_ID: "140880",
                    Staff_FName: "Heng",
                    Staff_LName: "Chan",
                    Dept: testDept,
                    Position: "Account Manager",
                    Country: "Singapore",
                    Email: "heng.chan@allinone.com.sg",
                    Reporting_Manager: "140008",
                    Role: "2",
                    Password: "123",
                },
            ]),
        })
    })
})

describe('GET /working-arrangements/team/:employeeId/:date', () => {
    test('get approved arrangements of employee\'s teammates on a date', async () => {
        // Get from B as the employee
        const response = await request(app)
            .get(`/working-arrangements/team/140894/${testDate}`)
            .send()

        // Expect arrangements of both B and C
        // Expect arrangements to be approved only
        expect(response.status).toBe(200)
        expect(response.body).toEqual({
            workingArrangements: expect.arrayContaining([
                {
                    Staff_ID: "140894",
                    Staff_FName: "Rahim",
                    Staff_LName: "Khalid",
                    reason: null,
                    startDate: timestampToSeconds(new Date(testDate)),
                    endDate: timestampToSeconds(new Date(testDate)),
                    requestCreated: timestampToSeconds(new Date(testNowDate)),
                    status: 'approved',
                    Approved_ID: "140001",
                    Approved_FName: "Derek",
                    Approved_LName: "Tan",
                    time: "AM",
                    attachment: null
                },
                {
                    Staff_ID: "140008",
                    Staff_FName: "Jaclyn",
                    Staff_LName: "Lee",
                    reason: null,
                    startDate: timestampToSeconds(new Date(testDate)),
                    endDate: timestampToSeconds(new Date(testDate)),
                    requestCreated: timestampToSeconds(new Date(testNowDate)),
                    status: 'approved',
                    Approved_ID: "140001",
                    Approved_FName: "Derek",
                    Approved_LName: "Tan",
                    time: "AM",
                    attachment: null
                },
            ]),
            teamMembers: expect.arrayContaining([
                {
                    Staff_ID: "140894",
                    Staff_FName: "Rahim",
                    Staff_LName: "Khalid",
                    Dept: testDept,
                    Position: "Sales Manager",
                    Country: "Singapore",
                    Email: "rahim.khalid@allinone.com.sg",
                    Reporting_Manager: "140001",
                    Role: "3",
                    Password: "123",
                },
                {
                    Staff_ID: "140008",
                    Staff_FName: "Jaclyn",
                    Staff_LName: "Lee",
                    Dept: testDept,
                    Position: "Sales Manager",
                    Country: "Singapore",
                    Email: "jaclyn.lee@allinone.com.sg",
                    Reporting_Manager: "140001",
                    Role: "3",
                    Password: "123",
                },
            ]),
        })
    })

    test('get arrangements of non-existent employee\'s teammates on a date', async () => {
        // Get from from employeeid 999999
        const response = await request(app)
            .get(`/working-arrangements/team/999999/${testDate}`)
            .send()

        // Expect 404 + body
        expect(response.status).toBe(404)
        expect(response.body).toEqual({ error: 'Employee with Staff_ID 999999 not found.' })
    })
})

describe('POST /request', () => {
    test('create request for an arrangement', async () => {
        // Create a request for employee F
        const response = await request(app)
            .post('/request')
            .send({
                Staff_ID: "160008",
                Staff_FName: "Sally",
                Staff_LName: "Loh",
                dates: [{
                    date: testDate,
                    time: 'AM',
                    attachment: null
                }],
            })

        expect(response.status).toBe(201)
        expect(response.body).toEqual({ message: 'Request created successfully' })
    })
})
