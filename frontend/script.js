// Register Student
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;

        const response = await fetch('http://localhost:5000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email })
        });

        const data = await response.json();
        if (data.success) {
            document.getElementById('registration').style.display = 'none';
            document.getElementById('roomDetails').style.display = 'block';
            document.getElementById('roomInfo').innerText = data.message;
        } else {
            alert('Registration failed: ' + data.message);
        }
    });
}

// Allot Room (Admin)
const allotForm = document.getElementById('allotForm');
if (allotForm) {
    allotForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const studentEmail = document.getElementById('studentEmail').value;
        const roomNumber = document.getElementById('roomNumber').value;

        const response = await fetch('http://localhost:5000/api/allot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ studentEmail, roomNumber })
        });

        const data = await response.json();
        if (data.success) {
            alert('Room allotted successfully');
        } else {
            alert('Failed to allot room: ' + data.message);
        }
    });
}
async function fetchAllottedStudents() {
    try {
        const response = await fetch('http://localhost:5000/api/allotted_students');
        const data = await response.json();
        const studentsList = document.getElementById('allottedStudentsList');
        studentsList.innerHTML = '';  // Clear the list

        if (data.students.length === 0) {
            studentsList.innerHTML = '<li>No students have been allotted rooms yet.</li>';
        } else {
            data.students.forEach(student => {
                const listItem = document.createElement('li');
                listItem.textContent = `Name: ${student.name}, Email: ${student.email}, Room: ${student.room}`;
                studentsList.appendChild(listItem);
            });
        }
        document.getElementById('allottedStudentsSection').style.display = 'block';
    } catch (error) {
        console.error('Error fetching allotted students:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchAllottedStudents);
