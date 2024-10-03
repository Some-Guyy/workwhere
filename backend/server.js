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
      const snapshot = await db.collection('mock_working_arrangements')
        .where('Staff_ID', 'in', batch)
        .where("startDate", "<=", startDate)
        .where("endDate", ">=", endDate)
        .get()

      snapshot.forEach((doc) => {
        workingArrangements.push(doc.data())
      })
    }

    return workingArrangements
}

//get all dates between start and end
function getDatesBetween(startDate, endDate) {
    const dates = []
    let currentDate = new Date(startDate)

    while (currentDate <= new Date(endDate)) {
        dates.push(new Date(currentDate))
        currentDate.setDate(currentDate.getDate() + 1)
    }

    return dates
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

//get all employee working arrangements based on department and specified date
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
        const workingArrangements = await fetchWorkingArrangementsInBatches(sameDepartmentID, endOfDay, targetDate)

        res.json({workingArrangements, sameDepart})

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
        const workingArrangements = await fetchWorkingArrangementsInBatches(inChargeOfID, endOfDay, targetDate)

        res.json({inChargeOf, workingArrangements})

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
        const workingArrangements = await fetchWorkingArrangementsInBatches(teamMemberIds, endOfDay, targetDate)

        // Return the list of working arrangements for the team members
        res.json({teamMembers, workingArrangements})


    } catch (err) {
        console.error("Error fetching data", err)
        res.status(500).json({error: "Internal server error"})
    }
})

// login ( ** NOT TESTED ***)
app.post('/login', async (req, res) => {
    const { emailAddress, password } = req.body

    try {
        // find user from user db
        const userSnapshot = await db.collection('users')
            .where('email_address', '==', emailAddress)
            .get()

        if (userSnapshot.empty) {
            return res.status(401).json({ error: 'Invalid username or password' })
        }

        let userData = ""
        userSnapshot.forEach(doc => {
            userData = doc.data()
        });

        // compare password, if wrong return error message
        if (password !== userData.password) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // get staff details from employee db
        const employeeSnapshot = await db.collection('mock_employee')
            .where('Staff_ID', '==', userData.staff_id)
            .get();

        // if something mess up lul
        if (employeeSnapshot.empty) {
            return res.status(404).json({ error: 'Staff details not found' });
        }

        let staffDetails = ""
        employeeSnapshot.forEach(doc => {
            staffDetails = doc.data();
        });

        // return the data back
        res.json({
            message: 'Login successful',
            user: {
                staff_id: staffDetails.Staff_ID,
                staff_fname: staffDetails.Staff_FName,
                staff_lname: staffDetails.Staff_LName,
                dept: staffDetails.Dept,
                position: staffDetails.Position,
                reporting_manager: staffDetails.Reporting_Manager,
            },
        });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//create new working arrangement (*** NOT TESTED ***)
app.post('/working-arrangements', async (req, res) => {
    try {
        const { staff_id, startDate, endDate, time, reason } = req.body;

        // get staff name from db
        const employeeSnapshot = await firestore.collection('mock_employee')
            .where('staff_id', '==', staff_id)
            .get();

        if (employeeSnapshot.empty) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        let staffDetails = ""
        employeeSnapshot.forEach(doc => {
            staffDetails = doc.data()
        })

        // unpack into variable
        const { staff_fname, staff_lname } = staffDetails

        // get the dates between startdate and enddate
        const dates = getDatesBetween(startDate, endDate);

        // create a working arrangement for each date
        const batch = firestore.batch();

        dates.forEach(date => {
            const newDocRef = firestore.collection('working_arrangements').doc()
            batch.set(newDocRef, {
                Staff_ID: staff_id,
                Staff_FName: staff_fname,
                Staff_LName: staff_lname,
                time,
                reason,
                startDate: Timestamp.fromDate(date),
                endDate: Timestamp.fromDate(date), 
                requestCreated: Timestamp.now(),
                status: 'pending',
                approvedBy: '', 
                Approved_Fname: '', 
                Approved_Lname: ''
            });
        });

        // commit operation to create all documents
        await batch.commit()

        res.json({ message: 'Request created successfully' });

    } catch (error) {
        console.error('Error creating your request', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// catch rogue calls
app.all("*", (req, res) => {
    console.log("Unhandled route:", req.path)
    res.status(404).send("Route not found")
}) 

const PORT = 3000 
app.listen(PORT, () => { 
    console.log(`Server is running on http://localhost:${PORT}`) 
}) 