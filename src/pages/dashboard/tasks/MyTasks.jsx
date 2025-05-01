import React, { useEffect, useState, useContext } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '@/api/tasks';
import IsLoading from '@/configs/isLoading';
import { AuthContext } from '@/context/AuthContext';
import { format, parseISO, isBefore, isToday, isTomorrow, addDays } from 'date-fns';
import Swal from 'sweetalert2';

const MyTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [activeTab, setActiveTab] = useState('all');
    const [timers, setTimers] = useState({});
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        dueDate: format(new Date(), 'yyyy-MM-dd')
    });
    const [showModal, setShowModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, [user._id]);

    const fetchTasks = async () => {
        try {
            const response = await getTasks(user._id);
            setTasks(response);
            const initialTimers = {};
            response.forEach(task => {
                initialTimers[task._id] = 0;
            });
            setTimers(initialTimers);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTask = async () => {
        try {
            const taskData = {
                ...newTask,
                userId: user._id
            };
            await createTask(taskData);
            setShowModal(false);
            setNewTask({
                title: '',
                description: '',
                dueDate: format(new Date(), 'yyyy-MM-dd')
            });
            Swal.fire({
                icon: 'success',
                title: 'Task Created',
                text: 'Your task has been created successfully!',
                confirmButtonText: 'OK' , 
                confirmButtonColor: 'green',
            })
            fetchTasks();
        } catch (error) {
            console.error("Error creating task:", error);
        }
    };

    const handleUpdateTask = async () => {
        try {
            await updateTask(editingTask._id, editingTask);
            setEditingTask(null);
            Swal.fire({
                icon: 'success',
                title: 'Task Updated',
                text: 'Your task has been updated successfully!',
                confirmButtonText: 'OK' ,
                confirmButtonColor : 'green'
            })
            fetchTasks();
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    const handleDeleteTask = async (taskId, taskTitle , userId) => {
        const result = await Swal.fire({
            title: `Delete "${taskTitle}"?`,
            text: "This action cannot be undone!",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            confirmButtonColor: 'red',
            cancelButtonColor: 'gray',
            cancelButtonText: 'Keep',
            reverseButtons: true
        });
    
        if (result.isConfirmed) {
            try {
                await deleteTask(taskId , userId);
                await fetchTasks();
                await Swal.fire(
                    'Deleted!',
                    `"${taskTitle}" was successfully deleted.`,
                    'success',
                    {
                        confirmButtonText: 'OK',
                        confirmButtonColor: 'green'
                    }
                );
            } catch (error) {
                console.error("Error deleting task:", error);
                await Swal.fire(
                    'Failed!',
                    `Could not delete "${taskTitle}".`,
                    'error' ,
                    {
                        confirmButtonText: 'OK',
                        confirmButtonColor: 'red'
                    }
                );
            }
        }
    };


    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const filteredTasks = tasks.filter(task => {
        const taskDate = parseISO(task.dueDate);
        
        if (activeTab === 'completed') return task.isCompleted;
        if (activeTab === 'pending') return !task.isCompleted;
        
        return (
            taskDate.getDate() === selectedDate.getDate() &&
            taskDate.getMonth() === selectedDate.getMonth() &&
            taskDate.getFullYear() === selectedDate.getFullYear()
        );
    });

    const generateCalendarDays = () => {
        const days = [];
        const startDate = addDays(selectedDate, -3);
        
        for (let i = 0; i < 7; i++) {
            const day = addDays(startDate, i);
            days.push(day);
        }
        
        return days;
    };

    const toggleTaskCompletion = async (task) => {
        try {
            const updatedTask = { ...task, isCompleted: !task.isCompleted };
            await updateTask(task._id, updatedTask);
            fetchTasks();
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    if (loading) return <IsLoading />;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">My Accounting Tasks</h1>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        New Task
                    </button>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-700">
                            {format(selectedDate, 'MMMM yyyy')}
                        </h2>
                        <div className="flex space-x-2">
                            <button 
                                onClick={() => setSelectedDate(addDays(selectedDate, -7))}
                                className="p-2 rounded-full hover:bg-gray-100"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button 
                                onClick={() => setSelectedDate(new Date())}
                                className="px-3 py-1 text-sm bg-green-100 text-green-600 rounded-md hover:bg-green-200"
                            >
                                Today
                            </button>
                            <button 
                                onClick={() => setSelectedDate(addDays(selectedDate, 7))}
                                className="p-2 rounded-full hover:bg-gray-100"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-2">
                        {generateCalendarDays().map((day, index) => {
                            const dayTasks = tasks.filter(task => {
                                const taskDate = parseISO(task.dueDate);
                                return (
                                    taskDate.getDate() === day.getDate() &&
                                    taskDate.getMonth() === day.getMonth() &&
                                    taskDate.getFullYear() === day.getFullYear()
                                );
                            });
                            
                            return (
                                <div 
                                    key={index}
                                    onClick={() => setSelectedDate(day)}
                                    className={`p-2 rounded-lg cursor-pointer transition-colors ${
                                        day.getDate() === selectedDate.getDate() && 
                                        day.getMonth() === selectedDate.getMonth() && 
                                        day.getFullYear() === selectedDate.getFullYear()
                                            ? 'bg-green-100 border border-green-300'
                                            : 'hover:bg-gray-100'
                                    }`}
                                >
                                    <div className="text-center">
                                        <div className="text-sm text-gray-500">{format(day, 'EEE')}</div>
                                        <div className={`text-lg font-medium ${
                                            isToday(day) ? 'text-green-600' : 
                                            isBefore(day, new Date()) ? 'text-gray-400' : 'text-gray-800'
                                        }`}>
                                            {day.getDate()}
                                        </div>
                                        {dayTasks.length > 0 && (
                                            <div className="mt-1">
                                                <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                
                <div className="flex border-b border-gray-200 mb-6">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`px-4 py-2 font-medium text-sm ${activeTab === 'all' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        All Tasks
                    </button>
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`px-4 py-2 font-medium text-sm ${activeTab === 'pending' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Pending
                    </button>
                    <button
                        onClick={() => setActiveTab('completed')}
                        className={`px-4 py-2 font-medium text-sm ${activeTab === 'completed' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Completed
                    </button>
                </div>
                
                <div className="space-y-4">
                    {filteredTasks.length === 0 ? (
                        <div className="bg-white rounded-lg shadow p-6 text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <h3 className="mt-2 text-lg font-medium text-gray-700">No tasks found</h3>
                            <p className="mt-1 text-gray-500">Create a new task or check another date</p>
                        </div>
                    ) : (
                        filteredTasks.map(task => {
                            const taskDate = parseISO(task.dueDate);
                            const isOverdue = isBefore(taskDate, new Date()) && !task.isCompleted;
                            
                            return (
                                <div key={task._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                    <div className="p-4">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={task.isCompleted}
                                                    onChange={() => toggleTaskCompletion(task)}
                                                    className="h-5 w-5 text-green-600 rounded focus:ring-green-500"
                                                />
                                                <div className="ml-3 flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className={`text-lg font-medium ${
                                                                task.isCompleted ? 'text-gray-400 line-through' : 'text-gray-800'
                                                            }`}>
                                                                {task.title}
                                                            </h3>
                                                            {task.description && (
                                                                <p className="text-gray-600 mt-1">{task.description}</p>
                                                            )}
                                                        </div>
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => setEditingTask(task)}
                                                                className="text-gray-500 hover:text-green-500"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                </svg>
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteTask(task._id , task.title , user._id)}
                                                                className="text-gray-500 hover:text-red-500"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center mt-2 space-x-4">
                                                        <span className={`text-sm ${
                                                            isOverdue ? 'text-red-500' : 
                                                            isToday(taskDate) ? 'text-green-500' : 
                                                            isTomorrow(taskDate) ? 'text-yellow-500' : 'text-gray-500'
                                                        }`}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            {format(taskDate, 'MMM d, yyyy')}
                                                            {isOverdue && ' (Overdue)'}
                                                            {isToday(taskDate) && ' (Today)'}
                                                            {isTomorrow(taskDate) && ' (Tomorrow)'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Create New Task</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                    <input
                                        type="text"
                                        value={newTask.title}
                                        onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="Task title"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        value={newTask.description}
                                        onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="Task description"
                                        rows="3"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                                    <input
                                        type="date"
                                        value={newTask.dueDate}
                                        onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateTask}
                                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                                >
                                    Create Task
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {editingTask && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Edit Task</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                    <input
                                        type="text"
                                        value={editingTask.title}
                                        onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        value={editingTask.description}
                                        onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                        rows="3"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                                    <input
                                        type="date"
                                        value={format(parseISO(editingTask.dueDate), 'yyyy-MM-dd')}
                                        onChange={(e) => setEditingTask({...editingTask, dueDate: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="completed"
                                        checked={editingTask.isCompleted}
                                        onChange={(e) => setEditingTask({...editingTask, isCompleted: e.target.checked})}
                                        className="h-4 w-4 text-green-600 rounded focus:ring-green-500"
                                    />
                                    <label htmlFor="completed" className="ml-2 text-sm text-gray-700">
                                        Mark as completed
                                    </label>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    onClick={() => setEditingTask(null)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdateTask}
                                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                                >
                                    Update Task
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyTasks;