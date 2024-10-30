const request = require('supertest')
const admin = require("firebase-admin")
const { app } = require("../../app") // Gets firebase initialization from here
const db = admin.firestore()
const firestore = require('firebase-admin/firestore')

const collectionEmployee = "testEmployees"
const collectionWa = "testWorkingArrangements"

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
            (Sales department)
                A -> (B, C)
                C -> D
            
            (Any)
                E -> F (E is Jack Sim, F can be any director that is not Sales)

        Insert working arrangements:
            1 approved each for A, B, C (same date)
            1 pending each for A, B, C (same date)
    */

    const employees = [
        {
            staffId: "140001",
            staffFirstName: "Derek",
            staffLastName: "Tan",
            dept: testDept,
            position: "Director",
            country: "Singapore",
            email: "derek.tan@allinone.com.sg",
            reportingId: "130002",
            role: "1",
            password: "123",
        },
        {
            staffId: "140894",
            staffFirstName: "Rahim",
            staffLastName: "Khalid",
            dept: testDept,
            position: "Sales Manager",
            country: "Singapore",
            email: "rahim.khalid@allinone.com.sg",
            reportingId: "140001",
            role: "3",
            password: "123",
        },
        {
            staffId: "140008",
            staffFirstName: "Jaclyn",
            staffLastName: "Lee",
            dept: testDept,
            position: "Sales Manager",
            country: "Singapore",
            email: "jaclyn.lee@allinone.com.sg",
            reportingId: "140001",
            role: "3",
            password: "123",
        },
        {
            staffId: "140880",
            staffFirstName: "Heng",
            staffLastName: "Chan",
            dept: testDept,
            position: "Account Manager",
            country: "Singapore",
            email: "heng.chan@allinone.com.sg",
            reportingId: "140008",
            role: "2",
            password: "123",
        },
        {
            staffId: "130002",
            staffFirstName: "Jack",
            staffLastName: "Sim",
            dept: "CEO",
            position: "MD",
            country: "Singapore",
            email: "jack.sim@allinone.com.sg",
            reportingId: "130002",
            role: "1",
            password: "123",
        },
        {
            staffId: "160008",
            staffFirstName: "Sally",
            staffLastName: "Loh",
            dept: "HR",
            position: "Director",
            country: "Singapore",
            email: "sally.loh@allinone.com.sg",
            reportingId: "130002",
            role: "1",
            password: "123",
        },
    ]
    const workingArrangements = [
        {
            staffId: "140001",
            staffFirstName: "Derek",
            staffLastName: "Tan",
            reason: null,
            date: testFirestoreDate,
            requestCreated: testFirestoreNow,
            status: 'pending',
            reportingId: null,
            reportingFirstName: null,
            reportingLastName: null,
            time: "AM",
            attachment: null
        },
        {
            staffId: "140001",
            staffFirstName: "Derek",
            staffLastName: "Tan",
            reason: null,
            date: testFirestoreDate,
            requestCreated: testFirestoreNow,
            status: 'approved',
            reportingId: "130002",
            reportingFirstName: "Jack",
            reportingLastName: "Sim",
            time: "AM",
            attachment: null
        },
        {
            staffId: "140894",
            staffFirstName: "Rahim",
            staffLastName: "Khalid",
            reason: null,
            date: testFirestoreDate,
            requestCreated: testFirestoreNow,
            status: 'pending',
            reportingId: null,
            reportingFirstName: null,
            reportingLastName: null,
            time: "AM",
            attachment: null
        },
        {
            staffId: "140894",
            staffFirstName: "Rahim",
            staffLastName: "Khalid",
            reason: null,
            date: testFirestoreDate,
            requestCreated: testFirestoreNow,
            status: 'approved',
            reportingId: "140001",
            reportingFirstName: "Derek",
            reportingLastName: "Tan",
            time: "AM",
            attachment: null
        },
        {
            staffId: "140008",
            staffFirstName: "Jaclyn",
            staffLastName: "Lee",
            reason: null,
            date: testFirestoreDate,
            requestCreated: testFirestoreNow,
            status: 'pending',
            reportingId: null,
            reportingFirstName: null,
            reportingLastName: null,
            time: "AM",
            attachment: null
        },
        {
            staffId: "140008",
            staffFirstName: "Jaclyn",
            staffLastName: "Lee",
            reason: null,
            date: testFirestoreDate,
            requestCreated: testFirestoreNow,
            status: 'approved',
            reportingId: "140001",
            reportingFirstName: "Derek",
            reportingLastName: "Tan",
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
                staffId: "140001",
                staffFirstName: "Derek",
                staffLastName: "Tan",
                dept: testDept,
                position: "Director",
                role: "1",
                reportingId: "130002",
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
                staffId: "140001",
                staffFirstName: "Derek",
                staffLastName: "Tan",
                reason: null,
                date: timestampToSeconds(new Date(testDate)),
                requestCreated: timestampToSeconds(new Date(testNowDate)),
                status: 'pending',
                reportingId: null,
                reportingFirstName: null,
                reportingLastName: null,
                time: "AM",
                attachment: null
            },
            {
                staffId: "140001",
                staffFirstName: "Derek",
                staffLastName: "Tan",
                reason: null,
                date: timestampToSeconds(new Date(testDate)),
                requestCreated: timestampToSeconds(new Date(testNowDate)),
                status: 'approved',
                reportingId: "130002",
                reportingFirstName: "Jack",
                reportingLastName: "Sim",
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
                    staffId: "140001",
                    staffFirstName: "Derek",
                    staffLastName: "Tan",
                    reason: null,
                    date: timestampToSeconds(new Date(testDate)),
                    requestCreated: timestampToSeconds(new Date(testNowDate)),
                    status: 'pending',
                    reportingId: null,
                    reportingFirstName: null,
                    reportingLastName: null,
                    time: "AM",
                    attachment: null
                },
                {
                    staffId: "140001",
                    staffFirstName: "Derek",
                    staffLastName: "Tan",
                    reason: null,
                    date: timestampToSeconds(new Date(testDate)),
                    requestCreated: timestampToSeconds(new Date(testNowDate)),
                    status: 'approved',
                    reportingId: "130002",
                    reportingFirstName: "Jack",
                    reportingLastName: "Sim",
                    time: "AM",
                    attachment: null
                },
                {
                    staffId: "140894",
                    staffFirstName: "Rahim",
                    staffLastName: "Khalid",
                    reason: null,
                    date: timestampToSeconds(new Date(testDate)),
                    requestCreated: timestampToSeconds(new Date(testNowDate)),
                    status: 'pending',
                    reportingId: null,
                    reportingFirstName: null,
                    reportingLastName: null,
                    time: "AM",
                    attachment: null
                },
                {
                    staffId: "140894",
                    staffFirstName: "Rahim",
                    staffLastName: "Khalid",
                    reason: null,
                    date: timestampToSeconds(new Date(testDate)),
                    requestCreated: timestampToSeconds(new Date(testNowDate)),
                    status: 'approved',
                    reportingId: "140001",
                    reportingFirstName: "Derek",
                    reportingLastName: "Tan",
                    time: "AM",
                    attachment: null
                },
                {
                    staffId: "140008",
                    staffFirstName: "Jaclyn",
                    staffLastName: "Lee",
                    reason: null,
                    date: timestampToSeconds(new Date(testDate)),
                    requestCreated: timestampToSeconds(new Date(testNowDate)),
                    status: 'pending',
                    reportingId: null,
                    reportingFirstName: null,
                    reportingLastName: null,
                    time: "AM",
                    attachment: null
                },
                {
                    staffId: "140008",
                    staffFirstName: "Jaclyn",
                    staffLastName: "Lee",
                    reason: null,
                    date: timestampToSeconds(new Date(testDate)),
                    requestCreated: timestampToSeconds(new Date(testNowDate)),
                    status: 'approved',
                    reportingId: "140001",
                    reportingFirstName: "Derek",
                    reportingLastName: "Tan",
                    time: "AM",
                    attachment: null
                },
            ]),
            sameDepart: expect.arrayContaining([
                {
                    staffId: "140001",
                    staffFirstName: "Derek",
                    staffLastName: "Tan",
                    dept: testDept,
                    position: "Director",
                    country: "Singapore",
                    email: "derek.tan@allinone.com.sg",
                    reportingId: "130002",
                    role: "1",
                    password: "123",
                },
                {
                    staffId: "140894",
                    staffFirstName: "Rahim",
                    staffLastName: "Khalid",
                    dept: testDept,
                    position: "Sales Manager",
                    country: "Singapore",
                    email: "rahim.khalid@allinone.com.sg",
                    reportingId: "140001",
                    role: "3",
                    password: "123",
                },
                {
                    staffId: "140008",
                    staffFirstName: "Jaclyn",
                    staffLastName: "Lee",
                    dept: testDept,
                    position: "Sales Manager",
                    country: "Singapore",
                    email: "jaclyn.lee@allinone.com.sg",
                    reportingId: "140001",
                    role: "3",
                    password: "123",
                },
                {
                    staffId: "140880",
                    staffFirstName: "Heng",
                    staffLastName: "Chan",
                    dept: testDept,
                    position: "Account Manager",
                    country: "Singapore",
                    email: "heng.chan@allinone.com.sg",
                    reportingId: "140008",
                    role: "2",
                    password: "123",
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
                    staffId: "140001",
                    staffFirstName: "Derek",
                    staffLastName: "Tan",
                    dept: testDept,
                    position: "Director",
                    country: "Singapore",
                    email: "derek.tan@allinone.com.sg",
                    reportingId: "130002",
                    role: "1",
                    password: "123",
                },
                {
                    staffId: "140894",
                    staffFirstName: "Rahim",
                    staffLastName: "Khalid",
                    dept: testDept,
                    position: "Sales Manager",
                    country: "Singapore",
                    email: "rahim.khalid@allinone.com.sg",
                    reportingId: "140001",
                    role: "3",
                    password: "123",
                },
                {
                    staffId: "140008",
                    staffFirstName: "Jaclyn",
                    staffLastName: "Lee",
                    dept: testDept,
                    position: "Sales Manager",
                    country: "Singapore",
                    email: "jaclyn.lee@allinone.com.sg",
                    reportingId: "140001",
                    role: "3",
                    password: "123",
                },
                {
                    staffId: "140880",
                    staffFirstName: "Heng",
                    staffLastName: "Chan",
                    dept: testDept,
                    position: "Account Manager",
                    country: "Singapore",
                    email: "heng.chan@allinone.com.sg",
                    reportingId: "140008",
                    role: "2",
                    password: "123",
                },
            ]),
        })
        expect(response2.status).toBe(200)
        expect(response2.body).toEqual({
            workingArrangements: [],
            sameDepart: expect.arrayContaining([
                {
                    staffId: "140001",
                    staffFirstName: "Derek",
                    staffLastName: "Tan",
                    dept: testDept,
                    position: "Director",
                    country: "Singapore",
                    email: "derek.tan@allinone.com.sg",
                    reportingId: "130002",
                    role: "1",
                    password: "123",
                },
                {
                    staffId: "140894",
                    staffFirstName: "Rahim",
                    staffLastName: "Khalid",
                    dept: testDept,
                    position: "Sales Manager",
                    country: "Singapore",
                    email: "rahim.khalid@allinone.com.sg",
                    reportingId: "140001",
                    role: "3",
                    password: "123",
                },
                {
                    staffId: "140008",
                    staffFirstName: "Jaclyn",
                    staffLastName: "Lee",
                    dept: testDept,
                    position: "Sales Manager",
                    country: "Singapore",
                    email: "jaclyn.lee@allinone.com.sg",
                    reportingId: "140001",
                    role: "3",
                    password: "123",
                },
                {
                    staffId: "140880",
                    staffFirstName: "Heng",
                    staffLastName: "Chan",
                    dept: testDept,
                    position: "Account Manager",
                    country: "Singapore",
                    email: "heng.chan@allinone.com.sg",
                    reportingId: "140008",
                    role: "2",
                    password: "123",
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
                    staffId: "140894",
                    staffFirstName: "Rahim",
                    staffLastName: "Khalid",
                    reason: null,
                    date: timestampToSeconds(new Date(testDate)),
                    requestCreated: timestampToSeconds(new Date(testNowDate)),
                    status: 'pending',
                    reportingId: null,
                    reportingFirstName: null,
                    reportingLastName: null,
                    time: "AM",
                    attachment: null
                },
                {
                    staffId: "140894",
                    staffFirstName: "Rahim",
                    staffLastName: "Khalid",
                    reason: null,
                    date: timestampToSeconds(new Date(testDate)),
                    requestCreated: timestampToSeconds(new Date(testNowDate)),
                    status: 'approved',
                    reportingId: "140001",
                    reportingFirstName: "Derek",
                    reportingLastName: "Tan",
                    time: "AM",
                    attachment: null
                },
                {
                    staffId: "140008",
                    staffFirstName: "Jaclyn",
                    staffLastName: "Lee",
                    reason: null,
                    date: timestampToSeconds(new Date(testDate)),
                    requestCreated: timestampToSeconds(new Date(testNowDate)),
                    status: 'pending',
                    reportingId: null,
                    reportingFirstName: null,
                    reportingLastName: null,
                    time: "AM",
                    attachment: null
                },
                {
                    staffId: "140008",
                    staffFirstName: "Jaclyn",
                    staffLastName: "Lee",
                    reason: null,
                    date: timestampToSeconds(new Date(testDate)),
                    requestCreated: timestampToSeconds(new Date(testNowDate)),
                    status: 'approved',
                    reportingId: "140001",
                    reportingFirstName: "Derek",
                    reportingLastName: "Tan",
                    time: "AM",
                    attachment: null
                },
            ]),
            inChargeOf: expect.arrayContaining([
                {
                    staffId: "140894",
                    staffFirstName: "Rahim",
                    staffLastName: "Khalid",
                    dept: testDept,
                    position: "Sales Manager",
                    country: "Singapore",
                    email: "rahim.khalid@allinone.com.sg",
                    reportingId: "140001",
                    role: "3",
                    password: "123",
                },
                {
                    staffId: "140008",
                    staffFirstName: "Jaclyn",
                    staffLastName: "Lee",
                    dept: testDept,
                    position: "Sales Manager",
                    country: "Singapore",
                    email: "jaclyn.lee@allinone.com.sg",
                    reportingId: "140001",
                    role: "3",
                    password: "123",
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
                    staffId: "140880",
                    staffFirstName: "Heng",
                    staffLastName: "Chan",
                    dept: testDept,
                    position: "Account Manager",
                    country: "Singapore",
                    email: "heng.chan@allinone.com.sg",
                    reportingId: "140008",
                    role: "2",
                    password: "123",
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
                    staffId: "140894",
                    staffFirstName: "Rahim",
                    staffLastName: "Khalid",
                    reason: null,
                    date: timestampToSeconds(new Date(testDate)),
                    requestCreated: timestampToSeconds(new Date(testNowDate)),
                    status: 'approved',
                    reportingId: "140001",
                    reportingFirstName: "Derek",
                    reportingLastName: "Tan",
                    time: "AM",
                    attachment: null
                },
                {
                    staffId: "140008",
                    staffFirstName: "Jaclyn",
                    staffLastName: "Lee",
                    reason: null,
                    date: timestampToSeconds(new Date(testDate)),
                    requestCreated: timestampToSeconds(new Date(testNowDate)),
                    status: 'approved',
                    reportingId: "140001",
                    reportingFirstName: "Derek",
                    reportingLastName: "Tan",
                    time: "AM",
                    attachment: null
                },
            ]),
            teamMembers: expect.arrayContaining([
                {
                    staffId: "140894",
                    staffFirstName: "Rahim",
                    staffLastName: "Khalid",
                    dept: testDept,
                    position: "Sales Manager",
                    country: "Singapore",
                    email: "rahim.khalid@allinone.com.sg",
                    reportingId: "140001",
                    role: "3",
                    password: "123",
                },
                {
                    staffId: "140008",
                    staffFirstName: "Jaclyn",
                    staffLastName: "Lee",
                    dept: testDept,
                    position: "Sales Manager",
                    country: "Singapore",
                    email: "jaclyn.lee@allinone.com.sg",
                    reportingId: "140001",
                    role: "3",
                    password: "123",
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
        expect(response.body).toEqual({ error: 'Employee with staffId 999999 not found.' })
    })
})

describe('POST /request', () => {
    test('create request for an arrangement', async () => {
        // Create a request for employee F
        const response = await request(app)
            .post('/request')
            .send({
                staffId: "160008",
                staffFirstName: "Sally",
                staffLastName: "Loh",
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

describe('PUT /working-arrangements', () => {
    test('cancel existing pending working arrangement', async () => {
        // Cancel the only existing pending working arrangement of Employee A, use testDate
        const response = await request(app)
            .put('/working-arrangements')
            .send({
                staffId: "140001",
                date: testDate
              });
        // Expect 200 and json response body equals
        expect(response.status).toBe(200);
        expect(response.body.message).toEqual('Working arrangement successfully cancelled.');

    })

    test('cancel a non-existent pending working arrangement', async () => {
        // Try to cancel that same pending working arrangement above again
        const response = await request(app)
            .put('/working-arrangements')
            .send({
                staffId: "140001",
                date: testDate
                });

        // Expect 404 and json response body to equal
        expect(response.status).toBe(404)
        expect(response.body).toEqual({ message: 'No matching working arrangement found' })
    })

    test('cancel a non-existent employee\'s pending working arrangement', async () => {
        // Cancel using employee id 999999 as that employee does not exist
        const response = await request(app)
            .put('/working-arrangements')
            .send({
                staffId: "999999",
                date: testDate,
            })

        // Expect 404 and json response body to equal
        expect(response.status).toBe(404)
        expect(response.body).toEqual({ message: 'No matching working arrangement found' })
    })
})

describe('GET /working-arrangements/supervise/:managerId', () => {
    test('get all pending arrangements of manager\'s team in charge of', async () => {
        // Get pending arrangements of Employee A's team in charge of
        const response = await request(app)
            .get('/working-arrangements/supervise/140001')
            .send()

        // Expect 200 and json response body to equal (use expect.arrayContaining() on arrays so that the order does not matter)
        expect(response.status).toBe(200)
        expect(response.body).toEqual({
            workingArrangements: expect.arrayContaining([
                {
                    staffId: "140894",
                    staffFirstName: "Rahim",
                    staffLastName: "Khalid",
                    reason: null,
                    date: timestampToSeconds(new Date(testDate)),
                    requestCreated: timestampToSeconds(new Date(testNowDate)),
                    status: 'pending',
                    reportingId: null,
                    reportingFirstName: null,
                    reportingLastName: null,
                    time: "AM",
                    attachment: null
                },
                {
                    staffId: "140008",
                    staffFirstName: "Jaclyn",
                    staffLastName: "Lee",
                    reason: null,
                    date: timestampToSeconds(new Date(testDate)),
                    requestCreated: timestampToSeconds(new Date(testNowDate)),
                    status: 'pending',
                    reportingId: null,
                    reportingFirstName: null,
                    reportingLastName: null,
                    time: "AM",
                    attachment: null
                },
            ]),
            inChargeOf: expect.arrayContaining([
                {
                    staffId: "140894",
                    staffFirstName: "Rahim",
                    staffLastName: "Khalid",
                    dept: testDept,
                    position: "Sales Manager",
                    country: "Singapore",
                    email: "rahim.khalid@allinone.com.sg",
                    reportingId: "140001",
                    role: "3",
                    password: "123",
                },
                {
                    staffId: "140008",
                    staffFirstName: "Jaclyn",
                    staffLastName: "Lee",
                    dept: testDept,
                    position: "Sales Manager",
                    country: "Singapore",
                    email: "jaclyn.lee@allinone.com.sg",
                    reportingId: "140001",
                    role: "3",
                    password: "123",
                },
            ]),
        })
    })

    test('get non-existent pending arrangements of manager\'s team in charge of', async () => {
        // Get pending arrangements of Employee C's team in charge of
        const response = await request(app)
            .get('/working-arrangements/supervise/130002')
            .send()

        // Expect 200 and json response body to equal (workingArrangements would be an empty array but inChargeOf still includes Employee D) 
        expect(response.status).toBe(200)
        expect(response.body).toEqual({
            workingArrangements: expect.arrayContaining([]),
            inChargeOf: expect.arrayContaining([
                {
                    staffId: "140001",
                    staffFirstName: "Derek",
                    staffLastName: "Tan",
                    dept: testDept,
                    position: "Director",
                    country: "Singapore",
                    email: "derek.tan@allinone.com.sg",
                    reportingId: "130002",
                    role: "1",
                    password: "123",
                },
                {
                    staffId: "130002",
                    staffFirstName: "Jack",
                    staffLastName: "Sim",
                    dept: "CEO",
                    position: "MD",
                    country: "Singapore",
                    email: "jack.sim@allinone.com.sg",
                    reportingId: "130002",
                    role: "1",
                    password: "123",
                },
                {
                    staffId: "160008",
                    staffFirstName: "Sally",
                    staffLastName: "Loh",
                    dept: "HR",
                    position: "Director",
                    country: "Singapore",
                    email: "sally.loh@allinone.com.sg",
                    reportingId: "130002",
                    role: "1",
                    password: "123",
                },
            ]),
        })
    })
})

describe('PUT /working-arrangements/manage', () => {
    test('approve an existing pending arrangement', async () => {
        // Employee A will approve employee B's pending arrangement
        const response = await request(app)
            .put('/working-arrangements/manage')
            .send({
                reportingId: "140001",
                reportingFirstName: "Derek",
                reportingLastName: "Tan",
                staffId: "140894",
                date: testDate,
                status: 'approved',
                reason: null,
            })

        // Expect 200 and json response body
        expect(response.status).toBe(200)
        expect(response.body).toEqual({ message: 'Working arrangement successfully updated.' })
    })

    test('reject an existing pending arrangement', async () => {
        // Employee A will reject employee C's pending arrangement
        const response = await request(app)
            .put('/working-arrangements/manage')
            .send({
                reportingId: "140001",
                reportingFirstName: "Derek",
                reportingLastName: "Tan",
                staffId: "140008",
                date: testDate,
                status: 'rejected',
                reason: "Important meeting, everyone is required to be in office",
            })

        // Expect 200 and json response body
        expect(response.status).toBe(200)
        expect(response.body).toEqual({ message: 'Working arrangement successfully updated.' })

    })

    test('approve a non-existing pending arrangement', async () => {
        // Employee A will approve employee C's same as above pending arrangement (same day)
        const response = await request(app)
            .put('/working-arrangements/manage')
            .send({
                reportingId: "140001",
                reportingFirstName: "Derek",
                reportingLastName: "Tan",
                staffId: "140008",
                date: testDate,
                status: 'approved',
                reason: null,
            })

        // Expect 404 and json response body
        expect(response.status).toBe(404)
        expect(response.body).toEqual({ message: 'No matching working arrangement found' })
    })
})
