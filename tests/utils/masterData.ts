const brandName = "[E2E] Brand A";
const centerName = `${brandName} - Center 1`;
const courseMasterName = "[E2E] CM Ngan Schedule 112201";
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

export const LESSON_NAME = {
  startTime: "09:00 am",
  newStartTime: "11:00 am",
  newStartTimeBO: "11:00",
  endTime: "10:00 am",
  newEndTime: "12:00 pm",
  newEndTimeBO: "12:00",
  newClassroom: `CR02 - ${centerName}`,
  teacherRecurringIndividual: "[E2E][Lesson] Kim Ngan SPU",
  teacherOneTimeIndividual: "[E2E] Kim Ngan Teacher",
  teacherOneTimeGroup: "[E2E] Kim Ngan PT",
  teacherRecurringGroup: "[E2E] Kim Ngan CM",
};
