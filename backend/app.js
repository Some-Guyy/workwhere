// firebase db setup
const admin = require("firebase-admin")
const firestore = require("firebase-admin/firestore")
var serviceAccount = require("./workwhere_firebase_env.json")
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "workwhere-2b031"
})
const db = admin.firestore()

let collectionEmployee = "mockEmployees"
let collectionWa = "mockWorkingArrangements"
let collectionNotification = "notifications"
if (process.env.NODE_ENV === 'test') {
    collectionEmployee = "testEmployees"
    collectionWa = "testWorkingArrangements"
    collectionNotification = "testNotifications"
}

const cors = require("cors")
const express = require('express')
const app = express()

app.use(cors())
app.use(express.json({ limit: '10mb' })); // Body parser after CORS
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json())

// ------------------------ HELPER FUNCTIONS ------------------------------
//batch fetching
const fetchWorkingArrangementsInBatches = async (ids, startDate, endDate, calledFrom) => {
    const workingArrangements = []
    const batchSize = 30 // Firestore limit for 'in' operator

    if (calledFrom === "team") {

        // send back approved working arrangements
        for (let i = 0; i < ids.length; i += batchSize) {
            const batch = ids.slice(i, i + batchSize)
            const snapshot = await db.collection(collectionWa)
              .where('staffId', 'in', batch)
              .where("date", "<=", startDate)
              .where("date", ">=", endDate)
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
              .where('staffId', 'in', batch)
              .where("date", "<=", startDate)
              .where("date", ">=", endDate)
              .where("status", "in", ["approved", "pending"])
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
              .where('staffId', 'in', batch)
              .where("status", "in", ["pending", "pendingWithdraw"])
              .get()
      
            snapshot.forEach((doc) => {
              workingArrangements.push(doc.data())
            })
          }
    }

    return workingArrangements
}

// ------------------------ ENDPOINTS FOR PERSONAL ------------------------
//get specific employee for working arrangements (personal work schedule)
app.get("/working-arrangements/:employeeId", async (req, res) => {
    try {
        const { employeeId } = req.params
        const snapshot = await db.collection(collectionWa)
        .where('staffId', '==', employeeId)
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

//get all team members working arrangement based on specified date || returns approved working arrangements
app.get("/working-arrangements/team/:employeeId/:date", async (req, res) => {
    try {
        const { employeeId, date } = req.params
        const targetDate = new Date(date)
        const endOfDay = new Date(targetDate)

        targetDate.setHours(0, 0, 0, 0)
        endOfDay.setHours(23, 59, 59, 999)

        const employeeSnapshot = await db.collection(collectionEmployee)
        .where('staffId', '==', employeeId)
        .limit(1)
        .get()

        // if employee cannot be found
        if (employeeSnapshot.empty) {
            return res.status(404).json({ error: `Employee with staffId ${employeeId} not found.` })
        }

        // reporting manager info
        const employeeData = employeeSnapshot.docs[0].data()
        const position = employeeData.position

        // then call db again to find those same reporting managers
        const teamSnapshot = await db.collection(collectionEmployee)
        .where('position', '==', position)
        .get()

        // get list of team members id
        const teamMemberIds = []
        const teamMembers = []
        teamSnapshot.forEach((doc) => {
            teamMemberIds.push(doc.data().staffId)
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

//create new working arrangement 
app.post('/request', async (req, res) => {
    try {
        const { reportingId, staffId, staffFirstName, staffLastName, dates } = req.body;
        // create a working arrangement for each date
        const batch = db.batch()

        // for automatic approval (the big boss jack sigma)
        if (staffId === "130002") {
            dates.forEach(dateObject => {
                const { date, time, attachment} = dateObject
            
                const dateValue = new Date(date); 
                const newDocRef = db.collection(collectionWa).doc()
                batch.set(newDocRef, {
                    staffId: staffId,
                    staffFirstName: staffFirstName,
                    staffLastName: staffLastName,
                    reason: null,  
                    date: firestore.Timestamp.fromDate(dateValue),
                    requestCreated: firestore.Timestamp.now(),
                    status: 'approved',
                    reportingId: staffId, 
                    reportingFirstName: staffFirstName, 
                    reportingLastName: staffLastName,
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
                    staffId: staffId,
                    staffFirstName: staffFirstName,
                    staffLastName: staffLastName,
                    reason: null,  
                    date: firestore.Timestamp.fromDate(dateValue),
                    requestCreated: firestore.Timestamp.now(),
                    status: 'pending',
                    reportingId: null, 
                    reportingFirstName: null, 
                    reportingLastName: null,
                    time: time,
                    attachment: attachment == null ? null : attachment
                })

                // also need to create notification for each date
                const newNotificationRef = db.collection(collectionNotification).doc()
                batch.set(newNotificationRef, {
                    staffId: reportingId,
                    arrangementDate: new Date(date),
                    arrangementStatus: "pending",
                    status: "unseen",
                    reason: null,
                    actorId: staffId,
                    actorFirstName: staffFirstName,
                    actorLastName: staffLastName,
                    notificationCreated: firestore.Timestamp.now()
                })

            })

            
        }

        
        // commit operation to create all documents
        await batch.commit()

        res.status(201).json({ message: 'Request created successfully' });

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Something happened when creating your request", error: `Internal server error` })
    }
})

//cancel own working arrangement
app.put("/cancel", async (req, res) => {

    try {
        const { staffId, date} = req.body

        const targetDate = new Date(date)
        const endOfDay = new Date(date)
    
        targetDate.setHours(0, 0, 0, 0)
        endOfDay.setHours(23, 59, 59, 999)

        const snapshot = await db.collection(collectionWa)
        .where('staffId', '==', staffId)
        .where("date", "<=", endOfDay)
        .where("date", ">=", targetDate)
        .where("status", "==", "pending")
        .get()

        if (snapshot.empty) {
            return res.status(404).json({ message: "No matching working arrangement found" })
        }
    
        const doc = snapshot.docs[0]
        const docRef = db.collection(collectionWa).doc(doc.id)
    
        await docRef.update({ status: "cancelled" })

        //once we cancelled the working arrangement, need to delete the notification for pending
        const notificationSnapshot = await db.collection(collectionNotification)
        .where('actorId', "==", staffId)
        .where('arrangementDate', "<=", endOfDay)
        .where('arrangementDate', ">=", targetDate)
        .where('arrangementStatus', "==", "pending")
        .get()

        if (!notificationSnapshot.empty) {
            const notificationDoc = notificationSnapshot.docs[0]
            await db.collection(collectionNotification).doc(notificationDoc.id).delete()
        }

        return res.status(200).json({ message: "Working arrangement successfully cancelled." })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Something happened when cancelling your working arrangements", error: `Internal server error `})
    }
})

//withdraw own working arrangement
app.put("/withdraw", async (req, res) => {

    try {
        const { staffId, staffFirstName, staffLastName, reportingId, date, reason} = req.body

        const targetDate = new Date(date)
        const endOfDay = new Date(date)
    
        targetDate.setHours(0, 0, 0, 0)
        endOfDay.setHours(23, 59, 59, 999)

        const snapshot = await db.collection(collectionWa)
        .where('staffId', '==', staffId)
        .where("date", "<=", endOfDay)
        .where("date", ">=", targetDate)
        .where("status", "==", "approved")
        .get()

        if (snapshot.empty) {
            return res.status(404).json({ message: "No matching working arrangement found" })
        }


        const doc = snapshot.docs[0]
        const docRef = db.collection(collectionWa).doc(doc.id)

        let notificationStatus = ""
        let message = "Working arrangement is withdrawn"
        // auto withdrawal for jack sigma
        if (staffId == "130002") {
            notificationStatus = "withdrawn"
            await docRef.update({ reason: reason, status: "withdrawn" })
        } else {
            //for commoners
            notificationStatus = "pendingWithdraw"
            message = "Working arrangement is now pending for withdrawal"
            await docRef.update({ reason: reason, status: "pendingWithdraw" })
        }
    
        //after updating doc, now we send a notification to reporting manager to update him
        const notificationDoc = {
            staffId: reportingId,
            arrangementDate: new Date(date),
            arrangementStatus: notificationStatus,
            status: "unseen",
            reason: reason,
            actorId: staffId,
            actorFirstName: staffFirstName,
            actorLastName: staffLastName,
            notificationCreated: firestore.Timestamp.now()
        }

        await db.collection(collectionNotification).add(notificationDoc)
        return res.status(200).json({ message: message})
    } catch (err) {
        return res.status(500).json({ message: "Something happened when withdrawing your working arrangements", error: `Internal server error `})
    }
})

// see all notifications
app.get("/get-notifications/:employeeId", async (req, res) => {
    try {
        const {employeeId} = req.params
        const snapshot = await db.collection(collectionNotification)
        .where('staffId', "==", employeeId)
        .get()

        // frontend needs the id and doc data
        const notifications = []
        snapshot.forEach((doc) => {
            const docDetails = []
            docDetails.push(doc.id)
            docDetails.push(doc.data())

            notifications.push(docDetails)
        })

        res.status(200).json({notifications})
        
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Something happened when getting your notifications", error: `Internal server error `})
    }
})

// change notification to seen
app.put("/seen-notification", async (req, res) => {
    
    try {
        const {docId} = req.body
        const docRef = db.collection(collectionNotification).doc(docId)
        await docRef.update({ status: "seen" })

        return res.status(200).json({message : "Successfully updated notification status"})
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Something happened when updating your notifications", error: `Internal server error `})
    }
})

// ------------------------ ENDPOINTS FOR HR & DIRECTOR -------------------
//get all employee working arrangements based on department and specified date || returns approved working arrangements
app.get("/working-arrangements/department/:department/:date", async (req, res) => {
    try {
        const { department, date } = req.params

        const targetDate = new Date(date)
        const endOfDay = new Date(targetDate)

        targetDate.setHours(0, 0, 0, 0)
        endOfDay.setHours(23, 59, 59, 999)

        // find department teammates
        const snapshot = await db.collection(collectionEmployee)
        .where("dept", "==", department)
        .get()

        // create list based on these teammates
        const sameDepartmentID = []
        const sameDepart = []
        snapshot.forEach((doc) => {
            sameDepartmentID.push(doc.data().staffId)
            sameDepart.push(doc.data())
        })

        // fetch working arrangements based on these department mates
        const workingArrangements = await fetchWorkingArrangementsInBatches(sameDepartmentID, endOfDay, targetDate, "department")

        res.json({workingArrangements, sameDepart})

    } catch (err) {
        res.status(500).json({message: "Something went wrong when fetching your working arrangements", error: `Internal server error`})
    }
})

// ------------------------ ENDPOINTS FOR MANAGER ------------------------
//get team in charge working arrangements based on specified date || returns approved & pending working arrangements
app.get("/working-arrangements/manager/:managerId/:date", async (req, res) => {
    try {
        const { managerId, date } = req.params

        const targetDate = new Date(date)
        const endOfDay = new Date(targetDate)

        targetDate.setHours(0, 0, 0, 0)
        endOfDay.setHours(23, 59, 59, 999)

        // find employees you're in charge of
        const snapshot = await db.collection(collectionEmployee)
        .where("reportingId", "==", managerId)
        .get()

        // create list based on these employees
        const inChargeOf = []
        const inChargeOfID = []
        snapshot.forEach((doc) => {
            inChargeOfID.push(doc.data().staffId)
            inChargeOf.push(doc.data())
        })

        // fetch working arrangements based on these department mates
        const workingArrangements = await fetchWorkingArrangementsInBatches(inChargeOfID, endOfDay, targetDate, "manager")

        res.json({workingArrangements, inChargeOf})

    } catch (err) {
        res.status(500).json({message: "Something went wrong when fetching your working arrangements", error: `Internal server error`})
    }
})

//get team in charge working arrangements || returns pending & pendingWithdraw working arrangements
app.get("/working-arrangements/supervise/:managerId", async (req, res) => {
    try {
        const { managerId } = req.params

        // find employees you're in charge of
        const snapshot = await db.collection(collectionEmployee)
        .where("reportingId", "==", managerId)
        .get()

        // create list based on these employees
        const inChargeOf = []
        const inChargeOfID = []
        snapshot.forEach((doc) => {
            inChargeOfID.push(doc.data().staffId)
            inChargeOf.push(doc.data())
        })

        // fetch working arrangements based on these department mates
        const workingArrangements = await fetchWorkingArrangementsInBatches(inChargeOfID, null, null, "supervise")

        res.json({workingArrangements, inChargeOf})

    } catch (err) {
        res.status(500).json({message: "Something went wrong when fetching your working arrangements", error: `Internal server error`})
    }
})

// manager to update pending arrangements to rejected, approved, withdrawn
app.put("/working-arrangements/manage", async (req, res) => {

    try {
        const { reportingId, reportingFirstName, reportingLastName, staffId, date, status, reason, purpose} = req.body
        let findStatus = ""
        const targetDate = new Date(date)
        const endOfDay = new Date(date)
        
        // if frontend returns empty string, we set it as null in the db
        if (reason == "") {
            reason = null
        }

        targetDate.setHours(0, 0, 0, 0)
        endOfDay.setHours(23, 59, 59, 999)

        //switch case here to determine purpose of this endpoint
        switch (purpose) {
            case ("managePending"):
                findStatus = "pending"
                break

            case("manageWithdraw"):
                findStatus = "pendingWithdraw"
        }
    
        //return that specific working arrangement and ensure its pending
        const snapshot = await db.collection(collectionWa)
        .where("staffId", "==", staffId)
        .where("date", "<=", endOfDay)
        .where("date", ">=", targetDate)
        .where("status", "==", findStatus)
        .get()
    
        if (snapshot.empty) {
            return res.status(404).json({ message: "No matching working arrangement found" })
        }
    
        const doc = snapshot.docs[0]
        const docRef = db.collection(collectionWa).doc(doc.id)

        //final status for the working arrangement doc, notification status for the notification doc
        let finalStatus = status
        let notificationStatus = status

        if (purpose == "manageWithdraw") {

            // manager approves means we will withdraw WA
            if (status == "approved") {
                finalStatus = "withdrawn"
                notificationStatus = finalStatus
            }

            // manager rejects means we will delete the bring it back to approved
            if (status == "rejected") {
                finalStatus = "approved"
                notificationStatus = "rejected withdrawal"
            }
        }

        await docRef.update({
            reportingId,
            reportingFirstName,
            reportingLastName,
            reason,
            status:  finalStatus})
        
            
        //after updating doc, now we send a notification to subordinate to update the fella
        const notificationDoc = {
            staffId: staffId,
            arrangementDate: new Date(date),
            arrangementStatus: notificationStatus,
            status: "unseen",
            reason,
            actorId: reportingId,
            actorFirstName: reportingFirstName,
            actorLastName: reportingLastName,
            notificationCreated: firestore.Timestamp.now()
        }

        await db.collection(collectionNotification).add(notificationDoc)
    

    
        return res.status(200).json({ message: "Working arrangement successfully updated." })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Something happened when updating the working arrangements", error: `Internal server error`})
    }

})

//manager to withdraw approved working arrangements
app.put("/working-arrangements/withdraw", async (req, res) => {

    try {
        const { reportingId, reportingFirstName, reportingLastName, staffId, date, reason} = req.body
    
        const targetDate = new Date(date)
        const endOfDay = new Date(date)
    
        targetDate.setHours(0, 0, 0, 0)
        endOfDay.setHours(23, 59, 59, 999)
    
        //return that specific working arrangement and ensure its approved
        const snapshot = await db.collection(collectionWa)
        .where("staffId", "==", staffId)
        .where("date", "<=", endOfDay)
        .where("date", ">=", targetDate)
        .where("status", "==", "approved")
        .get()
    
        if (snapshot.empty) {
            return res.status(404).json({ message: "No matching working arrangement found" })
        }
    
        const doc = snapshot.docs[0]
        const docRef = db.collection(collectionWa).doc(doc.id)
    
        await docRef.update({ reason: reason, status: "withdrawn" })

        //after updating doc, now we send a notification to subordinate to update them
        const notificationDoc = {
            staffId: staffId,
            arrangementDate: new Date(date),
            arrangementStatus: "withdrawn",
            status: "unseen",
            reason,
            actorId: reportingId,
            actorFirstName: reportingFirstName,
            actorLastName: reportingLastName,
            notificationCreated: firestore.Timestamp.now()
        }

        await db.collection(collectionNotification).add(notificationDoc)
    
        return res.status(200).json({ message: "Working arrangement successfully updated." })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Something happened when updating the working arrangements", error: `Internal server error`})
    }

})

// ------------------------ ENDPOINTS FOR ALL ----------------------------
// login
app.post('/login', async (req, res) => {
    const { emailAddress, password } = req.body

    try {
        // find user from user db
        const snapshot = await db.collection(collectionEmployee)
            .where('email', '==', emailAddress.toLowerCase())
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
        if (staffDetails.password !== password) {
            return res.status(401).json({ message: 'Invalid email address or password' })
        }

        // return the data back
        res.json({
            message: 'Login successful',
            user: {
                staffId: staffDetails.staffId,
                staffFirstName: staffDetails.staffFirstName,
                staffLastName: staffDetails.staffLastName,
                dept: staffDetails.dept,
                position: staffDetails.position,
                role: staffDetails.role,
                reportingId: staffDetails.reportingId
            },
        });

    } catch (err) {
        res.status(500).json({ message: "Something went wrong trying to login", error: `Internal server error` });
    }
})

// ------------------------ ROGUE CALLS ----------------------------------
// catch rogue calls
app.all("*", (req, res) => {
    console.log("Unhandled route:", req.path)
    res.status(404).send("Route not found")
}) 

module.exports = { app, fetchWorkingArrangementsInBatches }
