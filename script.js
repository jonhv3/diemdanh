import { db } from "./firebase-config.js";
import { collection, addDoc, query, where, getDocs, Timestamp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

// Thêm học sinh
document.getElementById("addStudentButton").addEventListener("click", async () => {
    const name = document.getElementById("newStudentName").value.trim();
    const classes = Array.from(document.querySelectorAll("#addClassesSelection input:checked")).map(el => el.value);

    if (!name || classes.length === 0) {
        alert("Vui lòng nhập tên học sinh và chọn ít nhất một lớp.");
        return;
    }

    try {
        await addDoc(collection(db, "students"), { name, classes });
        alert("Thêm học sinh thành công!");
    } catch (error) {
        console.error("Lỗi:", error);
    }
});

// Điểm danh
document.getElementById("markAttendanceButton").addEventListener("click", async () => {
    const name = document.getElementById("attendanceStudentName").value.trim();
    const dateTime = document.getElementById("attendanceDateTime").value;
    const selectedClass = document.getElementById("attendanceClass").value;
    const content = document.getElementById("attendanceContent").value;
    const absent = document.getElementById("attendanceAbsent").checked;

    if (!name || !dateTime || !selectedClass) {
        alert("Vui lòng nhập đầy đủ thông tin.");
        return;
    }

    try {
        await addDoc(collection(db, "attendance"), {
            name,
            date: Timestamp.fromDate(new Date(dateTime)),
            class: selectedClass,
            content,
            absent,
        });
        alert("Điểm danh thành công!");
    } catch (error) {
        console.error("Lỗi:", error);
    }
});

// Truy vấn
document.getElementById("queryButton").addEventListener("click", async () => {
    const name = document.getElementById("queryStudentName").value.trim();
    const startDate = document.getElementById("queryStartDate").value;
    const endDate = document.getElementById("queryEndDate").value;

    if (!name || !startDate || !endDate) {
        alert("Vui lòng nhập đầy đủ thông tin.");
        return;
    }

    try {
        const q = query(collection(db, "attendance"), where("name", "==", name));
        const querySnapshot = await getDocs(q);

        const results = querySnapshot.docs.map(doc => doc.data()).filter(data => {
            const date = data.date.toDate();
            return date >= new Date(startDate) && date <= new Date(endDate);
        });

        const tbody = document.getElementById("queryResultBody");
        tbody.innerHTML = results
            .map(res => `<tr><td>${res.name}</td><td>${res.date.toDate().toLocaleString()}</td><td>${res.class}</td></tr>`)
            .join("");
    } catch (error) {
        console.error("Lỗi:", error);
    }
});
