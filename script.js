
document.addEventListener('DOMContentLoaded', function() {
   
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('nav ul li');
    const themeToggle = document.querySelector('.theme-toggle');
    
  
    const totalSubjectsEl = document.getElementById('total-subjects');
    const totalTasksEl = document.getElementById('total-tasks');
    const completedTasksEl = document.getElementById('completed-tasks');
    const quoteEl = document.getElementById('motivational-quote');
    
 
    const subjectInput = document.getElementById('subject-input');
    const addSubjectBtn = document.getElementById('add-subject-btn');
    const subjectList = document.getElementById('subject-list');
    
 
    const taskInput = document.getElementById('task-input');
    const subjectSelect = document.getElementById('subject-select');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
   
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    const startTimerBtn = document.getElementById('start-timer');
    const pauseTimerBtn = document.getElementById('pause-timer');
    const resetTimerBtn = document.getElementById('reset-timer');
    const modeBtns = document.querySelectorAll('.mode-btn');
    const timerAlert = document.getElementById('timer-alert');
 
    const progressCircle = document.querySelector('.progress-ring-circle');
    const progressPercent = document.getElementById('progress-percent');
    const completedCount = document.getElementById('completed-count');
    const totalCount = document.getElementById('total-count');
    
  
    let subjects = JSON.parse(localStorage.getItem('subjects')) || [];
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';
    let timer;
    let timerTime = 25 * 60; 
    let isTimerRunning = false;
    let currentTheme = localStorage.getItem('theme') || 'light';
    
  
    const quotes = [
        "The expert in anything was once a beginner.",
        "Don't watch the clock; do what it does. Keep going.",
        "Success is the sum of small efforts, repeated day in and day out.",
        "The only way to learn mathematics is to do mathematics.",
        "Study hard what interests you the most in the most undisciplined, irreverent and original manner possible.",
        "Learning is a treasure that will follow its owner everywhere.",
        "The more that you read, the more things you will know. The more that you learn, the more places you'll go."
    ];
    

    init();
    
    function init() {

        setTheme(currentTheme);
        
  
        loadSubjects();
        loadTasks();
        updateDashboard();
        updateProgress();
        

        setupEventListeners();
        
      
        showRandomQuote();
    }
    
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        const icon = themeToggle.querySelector('i');
        const text = themeToggle.querySelector('span');
        
        if (theme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            text.textContent = 'Light Mode';
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            text.textContent = 'Dark Mode';
        }
    }
    
    function showRandomQuote() {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        quoteEl.textContent = `"${quotes[randomIndex]}"`;
    }
    
    function setupEventListeners() {
       
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                const sectionId = this.getAttribute('data-section');
                showSection(sectionId);
                
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            });
        });
        
  
        themeToggle.addEventListener('click', function() {
            currentTheme = currentTheme === 'light' ? 'dark' : 'light';
            setTheme(currentTheme);
        });
        

        addSubjectBtn.addEventListener('click', addSubject);
        subjectInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') addSubject();
        });
      
        addTaskBtn.addEventListener('click', addTask);
        taskInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') addTask();
        });
       
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentFilter = this.getAttribute('data-filter');
                renderTasks();
            });
        });
        
   
        startTimerBtn.addEventListener('click', startTimer);
        pauseTimerBtn.addEventListener('click', pauseTimer);
        resetTimerBtn.addEventListener('click', resetTimer);
        
     
        modeBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                modeBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                const time = parseInt(this.getAttribute('data-time'));
                timerTime = time * 60;
                updateTimerDisplay();
                
                if (isTimerRunning) {
                    resetTimer();
                    startTimer();
                }
            });
        });
    }
    
    function showSection(sectionId) {
        sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === sectionId) {
                section.classList.add('active');
            }
        });
    }

    function loadSubjects() {
        subjectList.innerHTML = '';
        subjectSelect.innerHTML = '<option value="">Select Subject</option>';
        
        if (subjects.length === 0) return;
        
        subjects.forEach(subject => {
            addSubjectToDOM(subject);
            addSubjectToSelect(subject);
        });
    }
    
    function addSubjectToDOM(subject) {
        const li = document.createElement('li');
        li.className = 'subject-item';
        li.innerHTML = `
            <span>${subject}</span>
            <div class="subject-actions">
                <button class="delete-btn" data-subject="${subject}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        subjectList.appendChild(li);

        const deleteBtn = li.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', deleteSubject);
    }
    
    function addSubjectToSelect(subject) {
        const option = document.createElement('option');
        option.value = subject;
        option.textContent = subject;
        subjectSelect.appendChild(option);
    }
    
    function addSubject() {
        const subject = subjectInput.value.trim();
        
        if (subject === '') {
            alert('Please enter a subject name');
            return;
        }
        
        if (subjects.includes(subject)) {
            alert('This subject already exists');
            return;
        }
        
        subjects.push(subject);
        localStorage.setItem('subjects', JSON.stringify(subjects));
        
        addSubjectToDOM(subject);
        addSubjectToSelect(subject);
        
        subjectInput.value = '';
        updateDashboard();
    }
    
    function deleteSubject(e) {
        const subject = e.currentTarget.getAttribute('data-subject');
  
        subjects = subjects.filter(s => s !== subject);
        localStorage.setItem('subjects', JSON.stringify(subjects));
        
   
        const subjectItem = e.currentTarget.closest('.subject-item');
        subjectItem.remove();
        

        const options = Array.from(subjectSelect.options);
        const optionToRemove = options.find(opt => opt.value === subject);
        if (optionToRemove) subjectSelect.removeChild(optionToRemove);
        
        // Remove tasks associated with this subject
        tasks = tasks.filter(task => task.subject !== subject);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
        
        updateDashboard();
        updateProgress();
    }
    
    function loadTasks() {
        renderTasks();
    }
    
    function renderTasks() {
        taskList.innerHTML = '';
        
        let filteredTasks = tasks;
        
        if (currentFilter === 'completed') {
            filteredTasks = tasks.filter(task => task.completed);
        } else if (currentFilter === 'pending') {
            filteredTasks = tasks.filter(task => !task.completed);
        }
        
        if (filteredTasks.length === 0) {
            taskList.innerHTML = '<p class="no-tasks">No tasks found</p>';
            return;
        }
        
        filteredTasks.forEach(task => {
            addTaskToDOM(task);
        });
    }
    
    function addTaskToDOM(task) {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'task-completed' : ''}`;
        li.innerHTML = `
            <div class="task-content">
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} 
                    data-id="${task.id}">
                <span class="task-text">${task.text}</span>
                ${task.subject ? `<span class="task-subject">${task.subject}</span>` : ''}
            </div>
            <div class="task-actions">
                <button class="delete-btn" data-id="${task.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        taskList.appendChild(li);
        
        // Add event listeners
        const checkbox = li.querySelector('.task-checkbox');
        checkbox.addEventListener('change', toggleTaskCompletion);
        
        const deleteBtn = li.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', deleteTask);
    }
    
    function addTask() {
        const text = taskInput.value.trim();
        const subject = subjectSelect.value;
        
        if (text === '') {
            alert('Please enter a task description');
            return;
        }
        
        const task = {
            id: Date.now(),
            text,
            subject,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        
        addTaskToDOM(task);
        taskInput.value = '';
        
        updateDashboard();
        updateProgress();
    }
    
    function toggleTaskCompletion(e) {
        const taskId = parseInt(e.currentTarget.getAttribute('data-id'));
        const task = tasks.find(t => t.id === taskId);
        
        if (task) {
            task.completed = e.currentTarget.checked;
            localStorage.setItem('tasks', JSON.stringify(tasks));
            
            const taskItem = e.currentTarget.closest('.task-item');
            taskItem.classList.toggle('task-completed', task.completed);
            
            updateDashboard();
            updateProgress();
        }
    }
    
    function deleteTask(e) {
        const taskId = parseInt(e.currentTarget.getAttribute('data-id'));
        tasks = tasks.filter(task => task.id !== taskId);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        
        const taskItem = e.currentTarget.closest('.task-item');
        taskItem.remove();
        
        updateDashboard();
        updateProgress();
    }
    

    function updateTimerDisplay() {
        const minutes = Math.floor(timerTime / 60);
        const seconds = timerTime % 60;
        
        minutesEl.textContent = minutes.toString().padStart(2, '0');
        secondsEl.textContent = seconds.toString().padStart(2, '0');
    }
    
    function startTimer() {
        if (isTimerRunning) return;
        
        isTimerRunning = true;
        timer = setInterval(() => {
            timerTime--;
            updateTimerDisplay();
            
            if (timerTime <= 0) {
                clearInterval(timer);
                isTimerRunning = false;
                timerAlert.play();
                alert('Time is up!');
            }
        }, 1000);
    }
    
    function pauseTimer() {
        clearInterval(timer);
        isTimerRunning = false;
    }
    
    function resetTimer() {
        pauseTimer();
        
        const activeMode = document.querySelector('.mode-btn.active');
        const time = parseInt(activeMode.getAttribute('data-time'));
        timerTime = time * 60;
        
        updateTimerDisplay();
    }
    

    function updateDashboard() {
        totalSubjectsEl.textContent = subjects.length;
        
        const today = new Date().toISOString().split('T')[0];
        const todayTasks = tasks.filter(task => task.createdAt.split('T')[0] === today);
        
        totalTasksEl.textContent = todayTasks.length;
        completedTasksEl.textContent = todayTasks.filter(task => task.completed).length;
    }
    

    function updateProgress() {
        if (tasks.length === 0) {
            progressCircle.style.strokeDashoffset = 565.48;
            progressPercent.textContent = '0';
            completedCount.textContent = '0';
            totalCount.textContent = '0';
            return;
        }
        
        const completedTasks = tasks.filter(task => task.completed).length;
        const totalTasks = tasks.length;
        const percentage = Math.round((completedTasks / totalTasks) * 100);
     
        const circumference = 565.48; 
        const offset = circumference - (percentage / 100) * circumference;
        progressCircle.style.strokeDashoffset = offset;
        
     
        progressPercent.textContent = percentage;
        completedCount.textContent = completedTasks;
        totalCount.textContent = totalTasks;
    }
});