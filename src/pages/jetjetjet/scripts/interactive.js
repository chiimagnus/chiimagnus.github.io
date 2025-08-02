// 交互式飞行模拟器功能
document.addEventListener('DOMContentLoaded', function() {
    // 获取控制元素
    const pitchSlider = document.getElementById('pitchSlider');
    const rollSlider = document.getElementById('rollSlider');
    const yawSlider = document.getElementById('yawSlider');
    const speedSlider = document.getElementById('speedSlider');
    
    const pitchValue = document.getElementById('pitchValue');
    const rollValue = document.getElementById('rollValue');
    const yawValue = document.getElementById('yawValue');
    const speedValue = document.getElementById('speedValue');
    
    const airplaneModel = document.getElementById('airplaneModel');
    const compassNeedle = document.getElementById('compassNeedle');
    
    // 数据显示元素
    const displayPitch = document.getElementById('displayPitch');
    const displayRoll = document.getElementById('displayRoll');
    const displayYaw = document.getElementById('displayYaw');
    const displaySpeed = document.getElementById('displaySpeed');
    
    const pitchProgress = document.getElementById('pitchProgress');
    const rollProgress = document.getElementById('rollProgress');
    const yawProgress = document.getElementById('yawProgress');
    const speedProgress = document.getElementById('speedProgress');
    
    // 轨迹记录
    const trajectoryCanvas = document.getElementById('trajectoryCanvas');
    const ctx = trajectoryCanvas.getContext('2d');
    let isRecordingTrajectory = false;
    let trajectoryData = [];
    let trajectoryStartTime = 0;
    
    // 当前姿态数据
    let currentAttitude = {
        pitch: 0,
        roll: 0,
        yaw: 0,
        speed: 0
    };
    
    // 更新飞机姿态
    function updateAirplaneAttitude() {
        const pitch = parseFloat(pitchSlider.value);
        const roll = parseFloat(rollSlider.value);
        const yaw = parseFloat(yawSlider.value);
        const speed = parseFloat(speedSlider.value);
        
        currentAttitude = { pitch, roll, yaw, speed };
        
        // 更新显示值
        pitchValue.textContent = `${pitch}°`;
        rollValue.textContent = `${roll}°`;
        yawValue.textContent = `${yaw}°`;
        speedValue.textContent = `${speed.toFixed(1)} m/s`;
        
        displayPitch.textContent = `${pitch}°`;
        displayRoll.textContent = `${roll}°`;
        displayYaw.textContent = `${yaw}°`;
        displaySpeed.textContent = `${speed.toFixed(1)} m/s`;
        
        // 更新进度条
        updateProgressBar(pitchProgress, pitch, -90, 90);
        updateProgressBar(rollProgress, roll, -180, 180);
        updateProgressBar(yawProgress, yaw, 0, 360);
        updateProgressBar(speedProgress, speed, 0, 20);
        
        // 更新3D模型
        updateAirplane3D(pitch, roll, yaw, speed);
        
        // 更新指南针
        updateCompass(yaw);
        
        // 记录轨迹
        if (isRecordingTrajectory) {
            recordTrajectoryPoint();
        }
    }
    
    // 更新进度条
    function updateProgressBar(progressElement, value, min, max) {
        const percentage = ((value - min) / (max - min)) * 100;
        progressElement.style.width = `${Math.max(0, Math.min(100, percentage))}%`;
    }
    
    // 更新3D飞机模型
    function updateAirplane3D(pitch, roll, yaw, speed) {
        if (!airplaneModel) return;
        
        // 计算缩放比例（基于速度）
        const scale = 1 + (speed / 40);
        
        // 应用3D变换
        const transform = `
            rotateX(${-pitch}deg) 
            rotateZ(${roll}deg) 
            rotateY(${yaw}deg)
            scale(${scale})
        `;
        
        airplaneModel.style.transform = transform;
        
        // 添加速度效果
        if (speed > 5) {
            airplaneModel.style.filter = `blur(${Math.min(speed / 10, 2)}px)`;
        } else {
            airplaneModel.style.filter = 'none';
        }
    }
    
    // 更新指南针
    function updateCompass(yaw) {
        if (!compassNeedle) return;
        compassNeedle.style.transform = `rotate(${yaw}deg)`;
    }
    
    // 预设姿态配置
    const presets = {
        'level': { pitch: 0, roll: 0, yaw: 0, speed: 5 },
        'climb': { pitch: 15, roll: 0, yaw: 0, speed: 8 },
        'dive': { pitch: -20, roll: 0, yaw: 0, speed: 12 },
        'left-turn': { pitch: 5, roll: -30, yaw: 270, speed: 6 },
        'right-turn': { pitch: 5, roll: 30, yaw: 90, speed: 6 },
        'barrel-roll': { pitch: 0, roll: 180, yaw: 0, speed: 10 }
    };
    
    // 应用预设姿态
    function applyPreset(presetName) {
        const preset = presets[presetName];
        if (!preset) return;
        
        // 平滑过渡到预设值
        animateToValues(preset);
    }
    
    // 平滑动画到目标值
    function animateToValues(target) {
        const startValues = {
            pitch: parseFloat(pitchSlider.value),
            roll: parseFloat(rollSlider.value),
            yaw: parseFloat(yawSlider.value),
            speed: parseFloat(speedSlider.value)
        };
        
        const duration = 1000; // 1秒动画
        const startTime = Date.now();
        
        function animate() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // 使用缓动函数
            const easeProgress = easeInOutCubic(progress);
            
            // 插值计算当前值
            const currentValues = {
                pitch: lerp(startValues.pitch, target.pitch, easeProgress),
                roll: lerp(startValues.roll, target.roll, easeProgress),
                yaw: lerp(startValues.yaw, target.yaw, easeProgress),
                speed: lerp(startValues.speed, target.speed, easeProgress)
            };
            
            // 更新滑块值
            pitchSlider.value = currentValues.pitch;
            rollSlider.value = currentValues.roll;
            yawSlider.value = currentValues.yaw;
            speedSlider.value = currentValues.speed;
            
            // 更新显示
            updateAirplaneAttitude();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }
        
        animate();
    }
    
    // 线性插值函数
    function lerp(start, end, t) {
        return start + (end - start) * t;
    }
    
    // 缓动函数
    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    
    // 轨迹记录功能
    function recordTrajectoryPoint() {
        const currentTime = Date.now();
        if (trajectoryStartTime === 0) {
            trajectoryStartTime = currentTime;
        }
        
        const timeOffset = (currentTime - trajectoryStartTime) / 1000; // 转换为秒
        
        trajectoryData.push({
            time: timeOffset,
            pitch: currentAttitude.pitch,
            roll: currentAttitude.roll,
            yaw: currentAttitude.yaw,
            speed: currentAttitude.speed,
            x: Math.cos(currentAttitude.yaw * Math.PI / 180) * currentAttitude.speed * timeOffset,
            y: Math.sin(currentAttitude.yaw * Math.PI / 180) * currentAttitude.speed * timeOffset
        });
        
        drawTrajectory();
    }
    
    // 绘制轨迹
    function drawTrajectory() {
        if (!ctx || trajectoryData.length === 0) return;
        
        ctx.clearRect(0, 0, trajectoryCanvas.width, trajectoryCanvas.height);
        
        // 绘制网格
        drawGrid();
        
        // 绘制轨迹线
        ctx.strokeStyle = '#007AFF';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        for (let i = 0; i < trajectoryData.length; i++) {
            const point = trajectoryData[i];
            const x = trajectoryCanvas.width / 2 + point.x * 2;
            const y = trajectoryCanvas.height / 2 - point.y * 2;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
        
        // 绘制当前位置
        if (trajectoryData.length > 0) {
            const lastPoint = trajectoryData[trajectoryData.length - 1];
            const x = trajectoryCanvas.width / 2 + lastPoint.x * 2;
            const y = trajectoryCanvas.height / 2 - lastPoint.y * 2;
            
            ctx.fillStyle = '#FF9500';
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // 绘制网格
    function drawGrid() {
        ctx.strokeStyle = '#E0E0E0';
        ctx.lineWidth = 1;
        
        // 垂直线
        for (let x = 0; x <= trajectoryCanvas.width; x += 40) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, trajectoryCanvas.height);
            ctx.stroke();
        }
        
        // 水平线
        for (let y = 0; y <= trajectoryCanvas.height; y += 30) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(trajectoryCanvas.width, y);
            ctx.stroke();
        }
        
        // 中心线
        ctx.strokeStyle = '#CCCCCC';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(trajectoryCanvas.width / 2, 0);
        ctx.lineTo(trajectoryCanvas.width / 2, trajectoryCanvas.height);
        ctx.moveTo(0, trajectoryCanvas.height / 2);
        ctx.lineTo(trajectoryCanvas.width, trajectoryCanvas.height / 2);
        ctx.stroke();
    }
    
    // 事件监听器
    pitchSlider.addEventListener('input', updateAirplaneAttitude);
    rollSlider.addEventListener('input', updateAirplaneAttitude);
    yawSlider.addEventListener('input', updateAirplaneAttitude);
    speedSlider.addEventListener('input', updateAirplaneAttitude);
    
    // 预设按钮事件
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const preset = this.getAttribute('data-preset');
            applyPreset(preset);
            
            // 视觉反馈
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
    
    // 重置按钮
    document.getElementById('resetBtn').addEventListener('click', function() {
        applyPreset('level');
    });
    
    // 轨迹控制按钮
    document.getElementById('startTrajectory').addEventListener('click', function() {
        if (!isRecordingTrajectory) {
            isRecordingTrajectory = true;
            trajectoryData = [];
            trajectoryStartTime = 0;
            this.innerHTML = '<i class="fas fa-stop"></i> 停止记录';
            this.style.background = '#e74c3c';
        } else {
            isRecordingTrajectory = false;
            this.innerHTML = '<i class="fas fa-play"></i> 开始记录';
            this.style.background = '';
        }
    });
    
    document.getElementById('clearTrajectory').addEventListener('click', function() {
        trajectoryData = [];
        isRecordingTrajectory = false;
        trajectoryStartTime = 0;
        ctx.clearRect(0, 0, trajectoryCanvas.width, trajectoryCanvas.height);
        drawGrid();
        
        const startBtn = document.getElementById('startTrajectory');
        startBtn.innerHTML = '<i class="fas fa-play"></i> 开始记录';
        startBtn.style.background = '';
    });
    
    // 键盘控制
    document.addEventListener('keydown', function(e) {
        const step = 5;
        let updated = false;
        
        switch(e.key) {
            case 'ArrowUp':
                pitchSlider.value = Math.min(90, parseFloat(pitchSlider.value) + step);
                updated = true;
                break;
            case 'ArrowDown':
                pitchSlider.value = Math.max(-90, parseFloat(pitchSlider.value) - step);
                updated = true;
                break;
            case 'ArrowLeft':
                yawSlider.value = Math.max(0, parseFloat(yawSlider.value) - step);
                updated = true;
                break;
            case 'ArrowRight':
                yawSlider.value = Math.min(360, parseFloat(yawSlider.value) + step);
                updated = true;
                break;
            case 'q':
            case 'Q':
                rollSlider.value = Math.max(-180, parseFloat(rollSlider.value) - step);
                updated = true;
                break;
            case 'e':
            case 'E':
                rollSlider.value = Math.min(180, parseFloat(rollSlider.value) + step);
                updated = true;
                break;
            case ' ':
                e.preventDefault();
                applyPreset('level');
                updated = true;
                break;
        }
        
        if (updated) {
            updateAirplaneAttitude();
        }
    });
    
    // 初始化
    updateAirplaneAttitude();
    drawGrid();
    
    // 添加触摸支持
    let touchStartY = 0;
    let touchStartX = 0;
    
    airplaneModel.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
    });
    
    airplaneModel.addEventListener('touchmove', function(e) {
        e.preventDefault();
        const touchY = e.touches[0].clientY;
        const touchX = e.touches[0].clientX;
        
        const deltaY = touchStartY - touchY;
        const deltaX = touchX - touchStartX;
        
        // 更新俯仰角和偏航角
        const newPitch = Math.max(-90, Math.min(90, parseFloat(pitchSlider.value) + deltaY / 5));
        const newYaw = Math.max(0, Math.min(360, parseFloat(yawSlider.value) + deltaX / 5));
        
        pitchSlider.value = newPitch;
        yawSlider.value = newYaw;
        
        updateAirplaneAttitude();
        
        touchStartY = touchY;
        touchStartX = touchX;
    });
});
