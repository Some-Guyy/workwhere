// firebase db setup
const admin = require("firebase-admin")
const firestore = require("firebase-admin/firestore")
var serviceAccount = require("./workwhere_firebase_env.json")
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "workwhere-2b031"
})
const db = admin.firestore()

let collectionEmployee = "mock_employee"
let collectionWa = "mock_working_arrangements"
if (process.env.NODE_ENV === 'test') {
    collectionEmployee = "test_employee"
    collectionWa = "test_working_arrangements"
}

const cors = require("cors")
const express = require('express')
const app = express()

app.use(cors())
app.use(express.json({ limit: '10mb' })); // Body parser after CORS
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json())

/*
 note to self:
    id in employee is Staff_ID
    id in work_arrangement is staff_ID (fix if possible)
*/

//batch fetching
const fetchWorkingArrangementsInBatches = async (ids, startDate, endDate, calledFrom) => {
    const workingArrangements = []
    const batchSize = 30 // Firestore limit for 'in' operator

    if (calledFrom === "team") {

        // send back approved working arrangements
        for (let i = 0; i < ids.length; i += batchSize) {
            const batch = ids.slice(i, i + batchSize)
            const snapshot = await db.collection(collectionWa)
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

    if (calledFrom === "manager" || calledFrom === "department") {
        for (let i = 0; i < ids.length; i += batchSize) {
            const batch = ids.slice(i, i + batchSize)
            const snapshot = await db.collection(collectionWa)
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

    if (calledFrom === "supervise") {
        for (let i = 0; i < ids.length; i += batchSize) {
            const batch = ids.slice(i, i + batchSize)
            const snapshot = await db.collection(collectionWa)
              .where('Staff_ID', 'in', batch)
              .where("status", "==", "pending")
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
        const snapshot = await db.collection(collectionWa)
        .where('Staff_ID', '==', employeeid)
        .get()

        if (snapshot.empty) {
            return res.status(404).json({ message: 'No working arrangements found for the given employee', workingArrangements: null})
        }
        const workingArrangements = []
        snapshot.forEach((doc) => {
            workingArrangements.push(doc.data())
        })

        res.json(workingArrangements)

    } catch (err) {
        
        res.status(500).json({message: "Something went wrong when fetching your working arrangements", error: `Internal server error`})
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
        const snapshot = await db.collection(collectionEmployee)
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
        res.status(500).json({message: "Something went wrong when fetching your working arrangements", error: `Internal server error`})
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
        const snapshot = await db.collection(collectionEmployee)
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
        res.status(500).json({message: "Something went wrong when fetching your working arrangements", error: `Internal server error`})
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

        const employeeSnapshot = await db.collection(collectionEmployee)
        .where('Staff_ID', '==', employeeId)
        .limit(1)
        .get()

        // if employee cannot be found
        if (employeeSnapshot.empty) {
            return res.status(404).json({ error: `Employee with Staff_ID ${employeeId} not found.` })
        }

        // reporting manager info
        const employeeData = employeeSnapshot.docs[0].data()
        const position = employeeData.Position

        // then call db again to find those same reporting managers
        const teamSnapshot = await db.collection(collectionEmployee)
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
        
        res.status(500).json({message: "Something went wrong when fetching your working arrangements", error: `Internal server error`})
    }
})

// login
app.post('/login', async (req, res) => {
    const { emailAddress, password } = req.body

    try {
        // find user from user db
        const snapshot = await db.collection(collectionEmployee)
            .where('Email', '==', emailAddress.toLowerCase())
            .limit(1)
            .get()

        // if email address is wrong, return error message
        if (snapshot.empty) {
            return res.status(401).json({ message: 'Invalid email address or password' })
        }

        let staffDetails = null
        snapshot.forEach(doc => {
            staffDetails = doc.data()
        });

        //check if password matches
        if (staffDetails.Password !== password) {
            return res.status(401).json({ message: 'Invalid email address or password' })
        }

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

    } catch (err) {
        res.status(500).json({ message: "Something went wrong trying to login", error: `Internal server error` });
    }
})

//create new working arrangement 
app.post('/request', async (req, res) => {
    try {
        const { Staff_ID, Staff_FName, Staff_LName, dates } = req.body;
        // create a working arrangement for each date
        const batch = db.batch()

        // for automatic approval (the big boss jack sigma)
        if (Staff_ID === "130002") {
            dates.forEach(dateObject => {
                const { date, time, attachment} = dateObject
            
                const dateValue = new Date(date); 
                const newDocRef = db.collection(collectionWa).doc()
                batch.set(newDocRef, {
                    Staff_ID: Staff_ID,
                    Staff_FName: Staff_FName,
                    Staff_LName: Staff_LName,
                    reason: null,  
                    startDate: firestore.Timestamp.fromDate(dateValue),
                    endDate: firestore.Timestamp.fromDate(dateValue),
                    requestCreated: firestore.Timestamp.now(),
                    status: 'approved',
                    Approved_ID: Staff_ID, 
                    Approved_FName: Staff_FName, 
                    Approved_LName: Staff_LName,
                    time: time,
                    attachment: attachment == null ? null : attachment
                })
            })            
        } else {
            //for the commoners
            dates.forEach(dateObject => {
                const { date, time, attachment} = dateObject

                const dateValue = new Date(date) 
                const newDocRef = db.collection(collectionWa).doc()
                batch.set(newDocRef, {
                    Staff_ID: Staff_ID,
                    Staff_FName: Staff_FName,
                    Staff_LName: Staff_LName,
                    reason: null,  
                    startDate: firestore.Timestamp.fromDate(dateValue),
                    endDate: firestore.Timestamp.fromDate(dateValue),
                    requestCreated: firestore.Timestamp.now(),
                    status: 'pending',
                    Approved_ID: null, 
                    Approved_FName: null, 
                    Approved_LName: null,
                    time: time,
                    attachment: attachment == null ? null : attachment
                })
            })
        }

        
        // commit operation to create all documents
        await batch.commit()

        res.status(201).json({ message: 'Request created successfully' });

    } catch (err) {
        res.status(500).json({ message: "Something happened when creating your request", error: `Internal server error` })
    }
})

//cancel own working arrangement
app.put("/working-arrangements", async (req, res) => {

    try {
        const { Staff_ID, startDate} = req.body

        const targetDate = new Date(startDate)
        const endOfDay = new Date(startDate)
    
        targetDate.setHours(0, 0, 0, 0)
        endOfDay.setHours(23, 59, 59, 999)

        const snapshot = await db.collection(collectionWa)
        .where('Staff_ID', '==', Staff_ID)
        .where("startDate", "<=", endOfDay)
        .where("endDate", ">=", targetDate)
        .where("status", "==", "pending")
        .get()

        if (snapshot.empty) {
            return res.status(404).json({ message: "No matching working arrangement found" })
        }
    
        const doc = snapshot.docs[0]
        const docRef = db.collection(collectionWa).doc(doc.id)
    
        await docRef.update({ status: "cancelled" })
        return res.status(200).json({ message: "Working arrangement successfully cancelled." })
    } catch (err) {
        return res.status(500).json({ message: "Something happened when creating your working arrangements", error: `Internal server error `})
    }
})

//get team in charge working arrangements //pending
app.get("/working-arrangements/supervise/:managerId", async (req, res) => {
    try {
        const { managerId } = req.params

        // find employees you're in charge of
        const snapshot = await db.collection(collectionEmployee)
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
        const workingArrangements = await fetchWorkingArrangementsInBatches(inChargeOfID, null, null, "supervise")

        res.json({workingArrangements, inChargeOf})

    } catch (err) {
        res.status(500).json({message: "Something went wrong when fetching your working arrangements", error: `Internal server error`})
    }
})

// manager to update pending arrangements to rejected or approved
app.put("/working-arrangements/manage", async (req, res) => {

    try {
        const { Approved_ID, Approved_FName, Approved_LName, Staff_ID, startDate, status, reason} = req.body
    
        const targetDate = new Date(startDate)
        const endOfDay = new Date(startDate)
    
        targetDate.setHours(0, 0, 0, 0)
        endOfDay.setHours(23, 59, 59, 999)
    
        //return that specific working arrangement and ensure its pending
        const snapshot = await db.collection(collectionWa)
        .where("Staff_ID", "==", Staff_ID)
        .where("startDate", "<=", endOfDay)
        .where("endDate", ">=", targetDate)
        .where("status", "==", "pending")
        .get()
    
        if (snapshot.empty) {
            return res.status(404).json({ message: "No matching working arrangement found" })
        }
    
        const doc = snapshot.docs[0]
        const docRef = db.collection(collectionWa).doc(doc.id)
    
        await docRef.update({
            Approved_ID,
            Approved_FName,
            Approved_LName,
            reason,
            status })
    
        return res.status(200).json({ message: "Working arrangement successfully updated." })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Something happened when updating the working arrangements", error: `Internal server error`})
    }

})


// catch rogue calls
app.all("*", (req, res) => {
    console.log("Unhandled route:", req.path)
    res.status(404).send("Route not found")
}) 

module.exports = { app, fetchWorkingArrangementsInBatches }
