-- Active: 1688696090090@@127.0.0.1@3306
CREATE TABLE tasks (
  task_name TEXT NOT NULL
);

INSERT INTO tasks ( task_name)
VALUES ( 'orar');

DELETE FROM tasks
WHERE task_name = task_name;

UPDATE tasks
SET task_name = 'estudar'
