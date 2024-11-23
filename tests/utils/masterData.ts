const brandName = "[E2E] Brand A";
const centerName = `${brandName} - Center 1`;
const courseMasterName = "CM Ngan Schedule";
const locationCourseName = `${courseMasterName} - ${centerName}`;


export const MASTER_NAME = {
    brandName,
    centerName,
    courseMasterName,
    academicYear: "2024",
    programMasterName: "PM Ngan 2024",
    locationCourseName,
    className: `Class01 - ${locationCourseName}`,
    classroomName: `CR01 - ${centerName}`,
    gradeName: "Grade Ngan 01",
    subjectName: "Subject Ngan 01",
    closedDateName: "Closed date Ngan 01",
};

const currentDate = new Date();
const nextDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
const nextLessonDate = nextDate.getDate() + " " + nextDate.toLocaleString("default", { month: "short" }) + " " + nextDate.getFullYear();

const viewNextDate = nextDate.getDate() + "/" + (nextDate.getMonth() + 1) + "/" + nextDate.getFullYear();

export const LESSON_NAME = {
    nextLessonDate,
    viewNextDate,
    startTime: "09:00 am",
    newStartTime: "11:00 am",
    endTime: "10:00 am",
    newEndTime: "12:00 pm",
    newClassroom: `CR02 - ${centerName}`,
    teacher: "[E2E][Lesson] Kim Ngan SPU",
    // student: "[E2E][Lesson] Kim Ngan Student",  //add student manually
    numberLA: "539",

}