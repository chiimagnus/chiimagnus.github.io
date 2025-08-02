// 演示页面交互功能
document.addEventListener('DOMContentLoaded', function() {
    // 录制演示功能
    let isRecording = false;
    let recordingStartTime = 0;
    let recordingInterval;
    let animationInterval;
    
    const startBtn = document.getElementById('startRecording');
    const stopBtn = document.getElementById('stopRecording');
    const statusText = document.getElementById('statusText');
    const statusDot = document.querySelector('.status-dot');
    const recordingTime = document.getElementById('recordingTime');
    const airplane3d = document.getElementById('airplane3d');
    
    // 传感器数据模拟
    let sensorData = {
        pitch: 0,
        roll: 0,
        yaw: 0,
        speed: 0
    };
    
    // 开始录制
    startBtn.addEventListener('click', function() {
        isRecording = true;
        recordingStartTime = Date.now();
        
        startBtn.disabled = true;
        stopBtn.disabled = false;
        statusText.textContent = '正在录制';
        statusDot.classList.add('recording');
        
        // 开始时间计时
        recordingInterval = setInterval(updateRecordingTime, 100);
        
        // 开始传感器数据模拟
        animationInterval = setInterval(simulateSensorData, 100);
    });
    
    // 停止录制
    stopBtn.addEventListener('click', function() {
        isRecording = false;
        
        startBtn.disabled = false;
        stopBtn.disabled = true;
        statusText.textContent = '录制完成';
        statusDot.classList.remove('recording');
        
        clearInterval(recordingInterval);
        clearInterval(animationInterval);
        
        // 重置传感器数据
        resetSensorData();
    });
    
    // 更新录制时间
    function updateRecordingTime() {
        const elapsed = Date.now() - recordingStartTime;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        recordingTime.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // 模拟传感器数据
    function simulateSensorData() {
        const time = (Date.now() - recordingStartTime) / 1000;
        
        // 生成模拟的传感器数据
        sensorData.pitch = Math.sin(time * 0.5) * 30; // -30° to 30°
        sensorData.roll = Math.cos(time * 0.3) * 45; // -45° to 45°
        sensorData.yaw = Math.sin(time * 0.2) * 60; // -60° to 60°
        sensorData.speed = Math.abs(Math.sin(time * 0.4)) * 15; // 0 to 15 m/s
        
        updateSensorDisplay();
        updateAirplaneModel();
    }
    
    // 更新传感器显示
    function updateSensorDisplay() {
        document.getElementById('pitchValue').textContent = `${sensorData.pitch.toFixed(1)}°`;
        document.getElementById('rollValue').textContent = `${sensorData.roll.toFixed(1)}°`;
        document.getElementById('yawValue').textContent = `${sensorData.yaw.toFixed(1)}°`;
        document.getElementById('speedValue').textContent = `${sensorData.speed.toFixed(1)} m/s`;
        
        // 更新进度条
        updateProgressBar('pitchProgress', sensorData.pitch, -30, 30);
        updateProgressBar('rollProgress', sensorData.roll, -45, 45);
        updateProgressBar('yawProgress', sensorData.yaw, -60, 60);
        updateProgressBar('speedProgress', sensorData.speed, 0, 15);
    }
    
    // 更新进度条
    function updateProgressBar(id, value, min, max) {
        const progress = document.getElementById(id);
        const percentage = ((value - min) / (max - min)) * 100;
        progress.style.width = `${Math.max(0, Math.min(100, percentage))}%`;
    }
    
    // 更新飞机模型
    function updateAirplaneModel() {
        if (airplane3d) {
            const transform = `
                rotateX(${-sensorData.pitch}deg) 
                rotateZ(${sensorData.roll}deg) 
                rotateY(${sensorData.yaw}deg)
                scale(${1 + sensorData.speed / 30})
            `;
            airplane3d.style.transform = transform;
        }
    }
    
    // 重置传感器数据
    function resetSensorData() {
        sensorData = { pitch: 0, roll: 0, yaw: 0, speed: 0 };
        updateSensorDisplay();
        if (airplane3d) {
            airplane3d.style.transform = 'rotateX(0deg) rotateZ(0deg) rotateY(0deg) scale(1)';
        }
    }
    
    // 回放演示功能
    const playBtn = document.getElementById('playBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const timelineSlider = document.getElementById('timelineSlider');
    const flightCanvas = document.getElementById('flightCanvas');
    
    let isPlaying = false;
    let playbackTime = 0;
    let playbackInterval;
    let flightPath = [];
    
    // 初始化飞行路径数据
    function initFlightPath() {
        flightPath = [];
        for (let i = 0; i <= 100; i++) {
            const t = i / 100;
            flightPath.push({
                x: Math.sin(t * Math.PI * 2) * 150 + 200,
                y: Math.cos(t * Math.PI * 2) * 100 + 150,
                z: Math.sin(t * Math.PI * 4) * 50,
                pitch: Math.sin(t * Math.PI * 3) * 30,
                roll: Math.cos(t * Math.PI * 2) * 45,
                yaw: t * 360
            });
        }
    }
    
    // 绘制飞行路径
    function drawFlightPath() {
        if (!flightCanvas) return;
        
        const ctx = flightCanvas.getContext('2d');
        ctx.clearRect(0, 0, flightCanvas.width, flightCanvas.height);
        
        // 绘制背景网格
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 20; i++) {
            const x = (i / 20) * flightCanvas.width;
            const y = (i / 20) * flightCanvas.height;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, flightCanvas.height);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(flightCanvas.width, y);
            ctx.stroke();
        }
        
        // 绘制飞行路径
        ctx.strokeStyle = '#007AFF';
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let i = 0; i < flightPath.length; i++) {
            const point = flightPath[i];
            if (i === 0) {
                ctx.moveTo(point.x, point.y);
            } else {
                ctx.lineTo(point.x, point.y);
            }
        }
        ctx.stroke();
        
        // 绘制当前位置
        if (flightPath.length > 0) {
            const currentIndex = Math.floor((playbackTime / 100) * (flightPath.length - 1));
            const currentPoint = flightPath[currentIndex];
            
            ctx.fillStyle = '#FF9500';
            ctx.beginPath();
            ctx.arc(currentPoint.x, currentPoint.y, 8, 0, Math.PI * 2);
            ctx.fill();
            
            // 绘制飞机图标
            ctx.fillStyle = '#007AFF';
            ctx.font = '20px FontAwesome';
            ctx.textAlign = 'center';
            ctx.fillText('✈', currentPoint.x, currentPoint.y + 6);
        }
    }
    
    // 播放控制
    if (playBtn) {
        playBtn.addEventListener('click', function() {
            isPlaying = true;
            playbackInterval = setInterval(function() {
                playbackTime += 1;
                if (playbackTime > 100) {
                    playbackTime = 0;
                }
                timelineSlider.value = playbackTime;
                drawFlightPath();
            }, 100);
        });
    }
    
    if (pauseBtn) {
        pauseBtn.addEventListener('click', function() {
            isPlaying = false;
            clearInterval(playbackInterval);
        });
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            isPlaying = false;
            clearInterval(playbackInterval);
            playbackTime = 0;
            timelineSlider.value = 0;
            drawFlightPath();
        });
    }
    
    if (timelineSlider) {
        timelineSlider.addEventListener('input', function() {
            playbackTime = parseInt(this.value);
            drawFlightPath();
        });
    }
    
    // 图表绘制功能
    function drawChart(canvasId, data, color, label) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 绘制坐标轴
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(40, 20);
        ctx.lineTo(40, canvas.height - 40);
        ctx.lineTo(canvas.width - 20, canvas.height - 40);
        ctx.stroke();
        
        // 绘制数据线
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < data.length; i++) {
            const x = 40 + (i / (data.length - 1)) * (canvas.width - 60);
            const y = canvas.height - 40 - (data[i] / 100) * (canvas.height - 60);
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
        
        // 添加标签
        ctx.fillStyle = '#333';
        ctx.font = '12px Inter';
        ctx.fillText(label, 50, 35);
    }
    
    // 初始化演示数据
    initFlightPath();
    drawFlightPath();
    
    // 绘制示例图表
    const angleData = Array.from({length: 50}, (_, i) => Math.sin(i * 0.2) * 50 + 50);
    const speedData = Array.from({length: 50}, (_, i) => Math.abs(Math.sin(i * 0.1)) * 80 + 20);
    
    drawChart('angleChart', angleData, '#007AFF', '角度变化 (°)');
    drawChart('speedChart', speedData, '#FF9500', '速度变化 (m/s)');
    
    // 添加鼠标悬停效果
    document.querySelectorAll('.data-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'var(--shadow)';
        });
    });
});
