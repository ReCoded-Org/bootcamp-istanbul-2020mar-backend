# Attendance system

## Description:

1- There gonna be lectures, a lecturer has name,surename,email

2- There gonna be courses, a course is taught be ONE lecturer, a course has a schedule ,

a course's schedule is composed of lectures

3- There gonna be students, a student has a name, surname, email, studentId,

a student is enrolled in a course, and therefor a student attends the course's lecture

## User stories:

### Lecturer:

        L1- As a Lecturer I want to register a course
        L2- As a lecturer I want to enroll some students based on their studentIDs in the course based on the courseID
        L3- As a lecturer I want to set a schedule for a lecture
        L4- As a lecturer I want to be able to report students Attendance of a specific lecture
        L5- As a lecturer I want to be able to report students Attendance of the whole course
        L6- As a lecturer I want to be ale to report a specific students attendance throughout the course

### Student:

     S1- As a student I want to able to attend a lecture

Diagram: https://app.diagrams.net/#G1raN-kS8YvCs9MYY9akna5eZ02fsqh2G0

development data base ip : 172.17.0.1

### Extra Idea:
        1- lecture press sharecode 
        2- forntent send request to backend to sharecode 
        3- backend take a note of the time and register it as a timestamp (code_creation_time_stamp)
        4- backend returns code to frotend
        5- forntend present the code to user 

        student copy the code from lecturer screen
        frontend send a request to join the lecture 
        the backend take a note of the request timestamp 
        the backend compare the request timestamp with  code creation timestamp + join_lecture_timeout ? 
        if request_timestamp > creation_timestamp + join_lecturer_timeout the user will be denied access
        otherwise the user will join the lecture