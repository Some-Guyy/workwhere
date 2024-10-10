const admin = require("firebase-admin")
const { app } = require("../../app") // Gets firebase initialization from here
const db = admin.firestore()

const collectionEmployee = "test_employee"
const collectionWa = "test_working_arrangements"

beforeAll(async () => {
    // Insert needed data in db
    /*
        Insert employees A, B, C, D, E, F
        Hierarchy:
            A -> B, C -> D (All from sales department)
            E -> F (E is Jack Sim, F can be any director that is not Sales)

        Insert working arrangements:
            1 approved each for A, B, C (same date)
            1 pending each for A, B, C (same date)
    */

    const dateValue = new Date("2024-10-01");
    const batch = db.batch()
    const employees = [
        {
            Staff_ID: "140001",
            Staff_FName: "Derek",
            Staff_LName: "Tan",
            Dept: "Sales",
            Position: "Director",
            Country: "Singapore",
            Email: "derek.tan@allinone.com.sg",
            Reporting_Manager: "130002",
            Role: "1",
        },
        {
            Staff_ID: "140894",
            Staff_FName: "Rahim",
            Staff_LName: "Khalid",
            Dept: "Sales",
            Position: "Sales Manager",
            Country: "Singapore",
            Email: "rahim.khalid@allinone.com.sg",
            Reporting_Manager: "140001",
            Role: "3",
        },
        {
            Staff_ID: "140008",
            Staff_FName: "Jaclyn",
            Staff_LName: "Lee",
            Dept: "Sales",
            Position: "Sales Manager",
            Country: "Singapore",
            Email: "jaclyn.lee@allinone.com.sg",
            Reporting_Manager: "140001",
            Role: "3",
        },
        {
            Staff_ID: "140880",
            Staff_FName: "Heng",
            Staff_LName: "Chan",
            Dept: "Sales",
            Position: "Account Manager",
            Country: "Singapore",
            Email: "heng.chan@allinone.com.sg",
            Reporting_Manager: "140008",
            Role: "2",
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
        },
    ]
    const workingArrangements = [
        {
            Staff_ID: "140001",
            Staff_FName: "Derek",
            Staff_LName: "Tan",
            reason: null,
            startDate: firestore.Timestamp.fromDate(dateValue),
            endDate: firestore.Timestamp.fromDate(dateValue),
            requestCreated: firestore.Timestamp.now(),
            status: 'pending',
            approvedBy: null,
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
            startDate: firestore.Timestamp.fromDate(dateValue),
            endDate: firestore.Timestamp.fromDate(dateValue),
            requestCreated: firestore.Timestamp.now(),
            status: 'approved',
            approvedBy: "130002",
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
            startDate: firestore.Timestamp.fromDate(dateValue),
            endDate: firestore.Timestamp.fromDate(dateValue),
            requestCreated: firestore.Timestamp.now(),
            status: 'pending',
            approvedBy: null,
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
            startDate: firestore.Timestamp.fromDate(dateValue),
            endDate: firestore.Timestamp.fromDate(dateValue),
            requestCreated: firestore.Timestamp.now(),
            status: 'approved',
            approvedBy: "140001",
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
            startDate: firestore.Timestamp.fromDate(dateValue),
            endDate: firestore.Timestamp.fromDate(dateValue),
            requestCreated: firestore.Timestamp.now(),
            status: 'pending',
            approvedBy: null,
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
            startDate: firestore.Timestamp.fromDate(dateValue),
            endDate: firestore.Timestamp.fromDate(dateValue),
            requestCreated: firestore.Timestamp.now(),
            status: 'approved',
            approvedBy: "140001",
            Approved_FName: "Derek",
            Approved_LName: "Tan",
            time: "AM",
            attachment: null
        },
    ]

    employees.forEach(employee => {
        const newDocRef = db.collection(collectionEmployee).doc()
        batch.set(newDocRef, employee)
    })
    await batch.commit()

    workingArrangements.forEach(wa => {
        const newDocRef = db.collection(collectionWa).doc()
        batch.set(newDocRef, wa)
    })
    await batch.commit()
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
    })

    test('login non-existent user', async () => {
        // Login chickenrice69@chicken.com
    })
})

describe('GET /working-arrangements/:employeeid', () => {
    test('get existing arrangements from an employee', async () => {
        // Get from employee A
    })

    test('get non-existent arrangements for an employee', async () => {
        // Get from employee id 999999
    })
})

describe('GET /working-arrangements/department/:department/:date', () => {
    test('get arrangements for department on a date', async () => {
        // Get from department including employees A, B, C
        // Expect arrangements of A, B and C
        // Expect arrangements to be both approved and pending
    })

    test('get arrangements for department on a date with no arrangements', async () => {
        // Get from department including employees A, B, C but one day after and before the date of arrangements
        // Expect 200 but empty response array
    })
})

describe('GET /working-arrangements/manager/:managerId/:date', () => {
    test('get arrangements of manager\'s team in charge of on a date', async () => {
        // Get from A as the manager
        // Expect arrangements of both B and C
        // Expect arrangements to be both approved and pending
    })

    test('get non-existent arrangements of manager\'s team in charge of on a date', async () => {
        // Get from C as the manager
        // Expect 200 but empty response array cause D has no arrangements
    })
})

describe('GET /working-arrangements/team/:employeeId/:date', () => {
    test('get approved arrangements of employee\'s teammates on a date', async () => {
        // Get from B as the employee
        // Expect arrangements of both B and C
        // Expect arrangements to be approved only
    })

    test('get arrangements of non-existent employee\'s teammates on a date', async () => {
        // Get from from employeeid 999999
        // Expect 404 + body
    })
})

describe('POST /request', () => {
    test('create request for an arrangement', async () => {
        // Create a request for employee F
    })
})
