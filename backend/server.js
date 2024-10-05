// firebase db setup
const admin = require("firebase-admin")
var serviceAccount = require("./workwhere_firebase_env.json")
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "workwhere-2b031"
})
const db = admin.firestore()

const express = require('express');
const cors = require('cors')
const app = express()
//need to use this to ionclude body parser functionality
app.use(express.json())
app.use(cors())


/*
 note to self:
    id in employee is Staff_ID
    id in work_arrangement is staff_ID (fix if possible)
*/

//batch fetching
const fetchWorkingArrangementsInBatches = async (ids, startDate, endDate, calledFrom) => {
    const workingArrangements = []
    const batchSize = 30 // Firestore limit for 'in' operator

    if (calledFrom === "department" || calledFrom === "team") {

        // send back approved working arrangements
        for (let i = 0; i < ids.length; i += batchSize) {
            const batch = ids.slice(i, i + batchSize)
            const snapshot = await db.collection('mock_working_arrangements')
              .where('Staff_ID', 'in', batch)
              .where("startDate", "<=", startDate)
              .where("endDate", ">=", endDate)
              .where("status", "==", "approved")
              .get()
      
            snapshot.forEach((doc) => {
              workingArrangements.push(doc.data())
            })
          }
    }

    if (calledFrom === "manager") {
        for (let i = 0; i < ids.length; i += batchSize) {
            const batch = ids.slice(i, i + batchSize)
            const snapshot = await db.collection('mock_working_arrangements')
              .where('Staff_ID', 'in', batch)
              .where("startDate", "<=", startDate)
              .where("endDate", ">=", endDate)
              .where("status", "!=", "rejected")
              .get()
      
            snapshot.forEach((doc) => {
              workingArrangements.push(doc.data())
            })
          }
    }

    return workingArrangements
}

//get specific employee for working arrangements (personal work schedule)
app.get("/working-arrangements/:employeeid", async (req, res) => {
    try {
        const { employeeid } = req.params
        const snapshot = await db.collection('mock_working_arrangements')
        .where('Staff_ID', '==', employeeid)
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

//get all employee working arrangements based on department and specified date //approved only
app.get("/working-arrangements/department/:department/:date", async (req, res) => {
    try {
        const { department, date } = req.params

        const targetDate = new Date(date)
        const endOfDay = new Date(targetDate)

        targetDate.setHours(0, 0, 0, 0)
        endOfDay.setHours(23, 59, 59, 999)

        // find department teammates
        const snapshot = await db.collection("mock_employee")
        .where("Dept", "==", department)
        .get()

        // create list based on these teammates
        const sameDepartmentID = []
        const sameDepart = []
        snapshot.forEach((doc) => {
            sameDepartmentID.push(doc.data().Staff_ID)
            sameDepart.push(doc.data())
        })
        // fetch working arrangements based on these department mates
        const workingArrangements = await fetchWorkingArrangementsInBatches(sameDepartmentID, endOfDay, targetDate, "department")

        res.json({workingArrangements, sameDepart})

    } catch (err) {
        console.error("Error fetching data", err)
        res.status(500).json({error: "Internal server error"})
    }
})

//get team in charge working arrangements based on specified date //approved and pending
app.get("/working-arrangements/manager/:managerId/:date", async (req, res) => {
    try {
        const { managerId, date } = req.params

        const targetDate = new Date(date)
        const endOfDay = new Date(targetDate)

        targetDate.setHours(0, 0, 0, 0)
        endOfDay.setHours(23, 59, 59, 999)

        // find employees you're in charge of
        const snapshot = await db.collection("mock_employee")
        .where("Reporting_Manager", "==", managerId)
        .get()

        // create list based on these employees
        const inChargeOf = []
        const inChargeOfID = []
        snapshot.forEach((doc) => {
            inChargeOfID.push(doc.data().Staff_ID)
            inChargeOf.push(doc.data())
        })

        // fetch working arrangements based on these department mates
        const workingArrangements = await fetchWorkingArrangementsInBatches(inChargeOfID, endOfDay, targetDate, "manager")

        res.json({workingArrangements, inChargeOf})

    } catch (err) {
        console.error("Error fetching data", err)
        res.status(500).json({error: "Internal server error"})
    }
})

//get all team members working arrangement based on specified date //approved
app.get("/working-arrangements/team/:employeeId/:date", async (req, res) => {
    try {
        const { employeeId, date } = req.params
        const targetDate = new Date(date)
        const endOfDay = new Date(targetDate)

        targetDate.setHours(0, 0, 0, 0)
        endOfDay.setHours(23, 59, 59, 999)

        const employeeSnapshot = await db.collection('mock_employee')
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
        const position = employeeData.Position

        // then call db again to find those same reporting managers
        const teamSnapshot = await db.collection('mock_employee')
        .where('Position', '==', position)
        .get()

        // get list of team members id
        const teamMemberIds = []
        const teamMembers = []
        teamSnapshot.forEach((doc) => {
            teamMemberIds.push(doc.data().Staff_ID)
            teamMembers.push(doc.data())
        })

        //since firebase limit is 30 to use "in", have to do batch fetching
        const workingArrangements = await fetchWorkingArrangementsInBatches(teamMemberIds, endOfDay, targetDate, "team")

        // Return the list of working arrangements for the team members
        res.json({workingArrangements, teamMembers})


    } catch (err) {
        console.error("Error fetching data", err)
        res.status(500).json({error: "Internal server error"})
    }
})

// login
app.post('/login', async (req, res) => {
    const { emailAddress, password } = req.body

    try {
        // find user from user db
        const snapshot = await db.collection('mock_employee')
            .where('Email', '==', emailAddress)
            .limit(1)
            .get()

        // if emaill address is wrong || compare password, if wrong return error message
        if (snapshot.empty) {
            return res.status(401).json({ message: 'Invalid email address or password' })
        }

        let staffDetails = ""
        snapshot.forEach(doc => {
            staffDetails = doc.data()
            if (staffDetails.password !== password) {
                return res.status(401).json({ message: 'Invalid email address or password' })
            }
        });

        // return the data back
        res.json({
            message: 'Login successful',
            user: {
                Staff_ID: staffDetails.Staff_ID,
                Staff_FName: staffDetails.Staff_FName,
                Staff_LName: staffDetails.Staff_LName,
                Dept: staffDetails.Dept,
                Position: staffDetails.Position,
                Role: staffDetails.Role,
                Reporting_Manager: staffDetails.Reporting_Manager
            },
        });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//create new working arrangement 
app.post('/request', async (req, res) => {
    try {
        const { Staff_ID, Staff_FName, Staff_LName, dates } = req.body;

        // create a working arrangement for each date
        const batch = db.batch()

        dates.forEach(dateObject => {
            const { date, time, reason } = dateObject; // Destructure the object
        
            // Convert the date string to a JavaScript Date object
            const dateValue = new Date(date); 
        
            const newDocRef = db.collection('test_create').doc();
            batch.set(newDocRef, {
                Staff_ID: Staff_ID,
                Staff_FName: Staff_FName,
                Staff_LName: Staff_LName,
                reason,  
                startDate: admin.firestore.Timestamp.fromDate(dateValue),
                endDate: admin.firestore.Timestamp.fromDate(dateValue),
                requestCreated: admin.firestore.Timestamp.now(),
                status: 'pending',
                approvedBy: '', 
                Approved_FName: '', 
                Approved_LName: '',
                time: time 
            })
        })
        
        // commit operation to create all documents
        await batch.commit()

        res.json({ message: 'Request created successfully' });

    } catch (error) {
        console.error('Error creating your request', error);
        res.status(500).json({ message: "Error creating your request", error: 'Internal server error' });
    }
});

//delete all 
app.delete('/delete-all/', async (req, res) => {
    const collectionRef = db.collection("test_create")

    try {
        // Get all documents in the collection
        const snapshot = await collectionRef.get()

        if (snapshot.empty) {
            return res.status(200).json({ message: `No documents found in test_create` })
        }

        // Create a batch to delete all documents in one operation
        const batch = db.batch()

        snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref)
        });

        // Commit the batch
        await batch.commit()

        res.status(200).json({ message: `All documents from test_create deleted successfully` })
    } catch (error) {
        console.error('Error deleting documents:', error)
        res.status(500).json({ error: 'Failed to delete documents', details: error.message })
    }
})


// catch rogue calls
app.all("*", (req, res) => {
    console.log("Unhandled route:", req.path)
    res.status(404).send("Route not found")
}) 

const PORT = 3000 
app.listen(PORT, () => { 
    console.log(`Server is running on http://localhost:${PORT}`) 
}) 