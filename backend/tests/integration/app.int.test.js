const admin = require("firebase-admin")
const { app } = require("../../app") // Gets firebase initialization from here
const db = admin.firestore()

const collectionEmployee = "mock_employee"
const collectionWa = "mock_working_arrangements"

beforeAll(async () => {
    // Insert needed data in db
    /*
        Insert employees A, B, C, D, E, F
        Hierarchy:
            A -> B, C -> D (Sales department)
            E -> F (E is Jack Sim, F can be any director that is not already inserted)

        Insert working arrangements:
            1 approved each for A, B, C (same date)
            1 pending each for A, B, C (same date)
    */
})
afterAll(async () => {
    // Delete everything inserted in beforeAll()
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
