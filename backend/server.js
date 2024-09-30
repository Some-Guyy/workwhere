// firebase db setup
const admin = require("firebase-admin")
var serviceAccount = require("./workwhere_firebase_env.json")
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "workwhere-2b031"
})
const db = admin.firestore()

const express = require('express')
const app = express()
//need to use this to ionclude body parser functionality
app.use(express.json())


/*
 note to self:
    id in employee is Staff_ID
    id in work_arrangement is staff_ID (fix if possible)
*/

//batch fetching
const fetchWorkingArrangementsInBatches = async (ids, startDate, endDate) => {
    const workingArrangements = []
    const batchSize = 30 // Firestore limit for 'in' operator

    for (let i = 0; i < ids.length; i += batchSize) {
      const batch = ids.slice(i, i + batchSize)
      const snapshot = await db.collection('work_arrangement')
        .where('staff_ID', 'in', batch)
        .where("startDate", "<=", startDate)
        .where("endDate", ">=", endDate)
        .get()

      snapshot.forEach((doc) => {
        workingArrangements.push(doc.data())
      })
    }

    return workingArrangements
}

//get specific employee for working arrangements (personal work schedule)
app.get("/working-arrangements/:employeeId", async (req, res) => {
    try {
        const { employeeId } = req.params
        const snapshot = await db.collection('work_arrangement')
        .where('staff_ID', '==', employeeId)
        .get()

        if (snapshot.empty) {
            return res.status(404).json({ error: 'No working arrangements found for the given employee', workingArrangements: null})
        }
        const workingArrangements = []
        snapshot.forEach((doc) => {
            workingArrangements.push(doc.data())
        })

        res.json(workingArrangements)

    } catch (err) {
        console.error("Error fetching data", err)
        res.status(500).json({error: "Internal server error"})
    }
})

//get all employee working arrangements based on department and specified date
app.get("/working-arrangements/department/:department/:date", async (req, res) => {
    try {
        const { department, date } = req.params

        const targetDate = new Date(date)
        const endOfDay = new Date(targetDate)

        targetDate.setHours(0, 0, 0, 0)
        endOfDay.setHours(23, 59, 59, 999)

        // find department teammates
        const snapshot = await db.collection("employee")
        .where("Dept", "==", department)
        .get()

        // create list based on these teammates
        const sameDepartment = []
        snapshot.forEach((doc) => {
            sameDepartment.push(doc.data().Staff_ID)
        })

        // fetch working arrangements based on these department mates
        const workingArrangements = await fetchWorkingArrangementsInBatches(sameDepartment, endOfDay, targetDate)

        res.json(workingArrangements)

    } catch (err) {
        console.error("Error fetching data", err)
        res.status(500).json({error: "Internal server error"})
    }
})

//get team in charge working arrangements based on specified date
app.get("/working-arrangements/manager/:managerId/:date", async (req, res) => {
    try {
        const { managerId, date } = req.params

        const targetDate = new Date(date)
        const endOfDay = new Date(targetDate)

        targetDate.setHours(0, 0, 0, 0)
        endOfDay.setHours(23, 59, 59, 999)

        // find employees you're in charge of
        const snapshot = await db.collection("employee")
        .where("Reporting_Manager", "==", managerId)
        .get()

        // create list based on these employees
        const inChargeOf = []
        snapshot.forEach((doc) => {
            inChargeOf.push(doc.data().Staff_ID)
        })

        // fetch working arrangements based on these department mates
        const workingArrangements = await fetchWorkingArrangementsInBatches(inChargeOf, endOfDay, targetDate)

        res.json(workingArrangements)

    } catch (err) {
        console.error("Error fetching data", err)
        res.status(500).json({error: "Internal server error"})
    }
})

//get all team members working arrangement based on specified date
app.get("/working-arrangements/team/:employeeId/:date", async (req, res) => {
    try {
        const { employeeId, date } = req.params
        const targetDate = new Date(date)
        const endOfDay = new Date(targetDate)

        targetDate.setHours(0, 0, 0, 0)
        endOfDay.setHours(23, 59, 59, 999)

        const employeeSnapshot = await db.collection('employee')
        .where('Staff_ID', '==', employeeId)
        .limit(1)
        .get()

        // if employee cannot be found
        if (employeeSnapshot.empty) {
            console.error(`Employee with Staff_ID ${employeeId} not found.`)
            return res.status(404).json({ error: `Employee with Staff_ID ${employeeId} not found.` })
        }

        // reporting manager info
        const employeeData = employeeSnapshot.docs[0].data()
        const reportingManager = employeeData.Reporting_Manager

        // then call db again to find those same reporting managers
        const teamSnapshot = await db.collection('employee')
        .where('Reporting_Manager', '==', reportingManager)
        .get()

        // get list of team members id
        const teamMemberIds = teamSnapshot.docs.map((doc) => doc.data().Staff_ID)

        //since firebase limit is 30 to use "in", have to do batch fetching
        const workingArrangements = await fetchWorkingArrangementsInBatches(teamMemberIds, endOfDay, targetDate)

        // Return the list of working arrangements for the team members
        res.json(workingArrangements)


    } catch (err) {
        console.error("Error fetching data", err)
        res.status(500).json({error: "Internal server error"})
    }
})

const PORT = 3000 
app.listen(PORT, () => { 
    console.log(`Server is running on http://localhost:${PORT}`) 
}) 