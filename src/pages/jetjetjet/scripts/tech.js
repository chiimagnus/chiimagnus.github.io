// 技术架构页面交互功能
document.addEventListener('DOMContentLoaded', function() {
    // 架构层级交互
    const layers = document.querySelectorAll('.layer');
    const components = document.querySelectorAll('.component');
    
    // 为每个组件添加点击事件
    components.forEach(component => {
        component.addEventListener('click', function() {
            showComponentDetails(this.textContent);
        });
    });
    
    // 显示组件详情
    function showComponentDetails(componentName) {
        const details = getComponentDetails(componentName);
        if (details) {
            showModal(details);
        }
    }
    
    // 获取组件详情信息
    function getComponentDetails(name) {
        const componentInfo = {
            'FlightRecordingView': {
                title: 'FlightRecordingView',
                description: '主录制界面，负责显示实时传感器数据和3D飞机模型',
                features: [
                    '实时传感器数据显示',
                    '3D飞机模型渲染',
                    '录制控制按钮',
                    '倒计时功能',
                    '状态指示器'
                ],
                code: `struct FlightRecordingView: View {
    @State private var viewModel = FlightRecordingVM()
    
    var body: some View {
        VStack(spacing: 20) {
            StatusIndicatorView(
                isRecording: viewModel.isRecording,
                isCountingDown: viewModel.isCountingDown
            )
            
            if let snapshot = viewModel.currentSnapshot {
                SensorDataView(snapshot: snapshot)
            }
            
            Airplane3DSceneView(
                airplane3DModel: airplane3DModel,
                height: 200
            )
            
            RecordingControlButton(
                isRecording: viewModel.isRecording,
                onStart: { viewModel.startRecording() },
                onStop: { viewModel.stopRecording() }
            )
        }
    }
}`
            },
            'FlightRecordingVM': {
                title: 'FlightRecordingVM',
                description: '录制功能的业务逻辑管理，处理传感器数据和状态管理',
                features: [
                    '传感器数据管理',
                    '录制状态控制',
                    '数据存储逻辑',
                    '倒计时管理',
                    '错误处理'
                ],
                code: `@Observable
class FlightRecordingVM {
    private let motionService = MotionService()
    private var modelContext: ModelContext?
    
    var isRecording = false
    var currentSnapshot: FlightDataSnapshot?
    var recordingDuration: TimeInterval = 0
    
    func startRecording() {
        isRecording = true
        recordingStartTime = Date()
        
        motionService.startMotionUpdates { [weak self] snapshot in
            self?.currentSnapshot = snapshot
            self?.recordedData.append(snapshot)
        }
    }
}`
            },
            'MotionService': {
                title: 'MotionService',
                description: '核心传感器服务，负责设备运动数据的采集和处理',
                features: [
                    'CoreMotion框架集成',
                    '设备姿态检测',
                    '加速度数据处理',
                    '速度计算算法',
                    '数据滤波处理'
                ],
                code: `class MotionService {
    private let motionManager = CMMotionManager()
    
    func startMotionUpdates(handler: @escaping (FlightDataSnapshot) -> Void) {
        motionManager.deviceMotionUpdateInterval = 0.1
        motionManager.startDeviceMotionUpdates(to: .main) { motion, error in
            guard let motion = motion else { return }
            
            let pitch = motion.attitude.pitch * 180.0 / .pi
            let roll = motion.attitude.roll * 180.0 / .pi
            let yaw = motion.attitude.yaw * 180.0 / .pi
            let speed = self.calculateSpeed(from: motion.userAcceleration)
            
            let snapshot = FlightDataSnapshot(
                timestamp: Date(),
                speed: speed,
                pitch: pitch,
                roll: roll,
                yaw: yaw
            )
            
            handler(snapshot)
        }
    }
}`
            },
            'FlightData': {
                title: 'FlightData',
                description: 'SwiftData数据模型，定义飞行数据的存储结构',
                features: [
                    'SwiftData模型定义',
                    '时间戳记录',
                    '姿态角度存储',
                    '速度数据保存',
                    '会话关联管理'
                ],
                code: `@Model
final class FlightData {
    var timestamp: Date = Date()
    var speed: Double = 0.0      // 前进速度 (m/s)
    var pitch: Double = 0.0      // 俯仰角 (degrees)
    var roll: Double = 0.0       // 横滚角 (degrees)
    var yaw: Double = 0.0        // 偏航角 (degrees)
    var sessionId: UUID?         // 关联的会话ID

    init(timestamp: Date = Date(), speed: Double = 0.0, 
         pitch: Double = 0.0, roll: Double = 0.0, 
         yaw: Double = 0.0, sessionId: UUID? = nil) {
        self.timestamp = timestamp
        self.speed = speed
        self.pitch = pitch
        self.roll = roll
        self.yaw = yaw
        self.sessionId = sessionId
    }
}`
            }
        };
        
        return componentInfo[name];
    }
    
    // 显示模态框
    function showModal(details) {
        // 创建模态框HTML
        const modalHTML = `
            <div class="modal-overlay" id="componentModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>${details.title}</h2>
                        <button class="modal-close" onclick="closeModal()">&times;</button>
                    </div>
                    <div class="modal-body">
                        <p class="modal-description">${details.description}</p>
                        <div class="modal-features">
                            <h3>主要功能</h3>
                            <ul>
                                ${details.features.map(feature => `<li>${feature}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="modal-code">
                            <h3>代码示例</h3>
                            <div class="code-block">
                                <pre><code>${details.code}</code></pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // 添加到页面
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // 添加样式
        addModalStyles();
        
        // 添加关闭事件
        document.getElementById('componentModal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
    }
    
    // 关闭模态框
    window.closeModal = function() {
        const modal = document.getElementById('componentModal');
        if (modal) {
            modal.remove();
        }
    };
    
    // 添加模态框样式
    function addModalStyles() {
        if (document.getElementById('modalStyles')) return;
        
        const styles = `
            <style id="modalStyles">
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    animation: fadeIn 0.3s ease;
                }
                
                .modal-content {
                    background: white;
                    border-radius: 12px;
                    max-width: 800px;
                    max-height: 90vh;
                    overflow-y: auto;
                    animation: slideIn 0.3s ease;
                    margin: 20px;
                }
                
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 25px 30px;
                    border-bottom: 1px solid #e0e0e0;
                }
                
                .modal-header h2 {
                    margin: 0;
                    color: var(--text-primary);
                    font-size: 1.5rem;
                }
                
                .modal-close {
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #666;
                    padding: 5px;
                    border-radius: 50%;
                    width: 35px;
                    height: 35px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .modal-close:hover {
                    background: #f0f0f0;
                    color: #333;
                }
                
                .modal-body {
                    padding: 30px;
                }
                
                .modal-description {
                    font-size: 1.1rem;
                    color: var(--text-secondary);
                    margin-bottom: 25px;
                    line-height: 1.6;
                }
                
                .modal-features {
                    margin-bottom: 25px;
                }
                
                .modal-features h3 {
                    font-size: 1.2rem;
                    color: var(--text-primary);
                    margin-bottom: 15px;
                }
                
                .modal-features ul {
                    list-style: none;
                    padding: 0;
                }
                
                .modal-features li {
                    padding: 8px 0;
                    color: var(--text-secondary);
                    position: relative;
                    padding-left: 20px;
                }
                
                .modal-features li::before {
                    content: '✓';
                    position: absolute;
                    left: 0;
                    color: var(--primary-color);
                    font-weight: bold;
                }
                
                .modal-code h3 {
                    font-size: 1.2rem;
                    color: var(--text-primary);
                    margin-bottom: 15px;
                }
                
                .modal-code .code-block {
                    background: #1e1e1e;
                    border-radius: 8px;
                    overflow: hidden;
                }
                
                .modal-code pre {
                    margin: 0;
                    padding: 20px;
                    color: white;
                    font-family: 'Monaco', 'Menlo', monospace;
                    font-size: 13px;
                    line-height: 1.5;
                    overflow-x: auto;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slideIn {
                    from { transform: translateY(-50px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                
                @media (max-width: 768px) {
                    .modal-content {
                        margin: 10px;
                        max-height: 95vh;
                    }
                    
                    .modal-header {
                        padding: 20px;
                    }
                    
                    .modal-body {
                        padding: 20px;
                    }
                    
                    .modal-code pre {
                        font-size: 12px;
                        padding: 15px;
                    }
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }
    
    // 框架卡片悬停效果
    const frameworkCards = document.querySelectorAll('.framework-card');
    frameworkCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // 滚动动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // 为架构层级添加延迟动画
                if (entry.target.classList.contains('layer')) {
                    const index = Array.from(document.querySelectorAll('.layer')).indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 0.2}s`;
                }
            }
        });
    }, observerOptions);
    
    // 观察需要动画的元素
    const animatedElements = document.querySelectorAll('.layer, .framework-card, .implementation-card, .performance-item, .roadmap-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // 代码块语法高亮
    function highlightCode() {
        const codeBlocks = document.querySelectorAll('.code-block code');
        codeBlocks.forEach(block => {
            const code = block.textContent;
            const highlighted = code
                .replace(/(@Model|@Observable|final|class|var|func|private|let|struct|import)/g, '<span style="color: #569cd6;">$1</span>')
                .replace(/(FlightData|FlightRecordingVM|MotionService|Date|Double|UUID|String|Int)/g, '<span style="color: #4ec9b0;">$1</span>')
                .replace(/(timestamp|speed|pitch|roll|yaw|sessionId|isRecording|currentSnapshot)/g, '<span style="color: #9cdcfe;">$1</span>')
                .replace(/(\/\/.*)/g, '<span style="color: #6a9955;">$1</span>')
                .replace(/(".*?")/g, '<span style="color: #ce9178;">$1</span>');
            
            block.innerHTML = highlighted;
        });
    }
    
    // 初始化代码高亮
    highlightCode();
    
    // 性能指标动画
    const performanceItems = document.querySelectorAll('.performance-item');
    performanceItems.forEach((item, index) => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) rotate(2deg)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotate(0deg)';
        });
    });
    
    // 路线图项目交互
    const roadmapItems = document.querySelectorAll('.roadmap-item');
    roadmapItems.forEach(item => {
        item.addEventListener('click', function() {
            // 添加点击效果
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
});
