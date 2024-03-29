
class DanmuInstance {

    constructor(renderNode, inputNode, options) {
        this.renderNode = renderNode;
        this.inputNode = inputNode;
        this.options = Object.assign({
            animateType: 'nomal'
        }, options);
        this.nodeId = 0;
        this.nodeArr = [];
    };

    // 生成弹幕节点
    createCNode(config) {
        const {
            seepd, color, size, offsetY, easing
        } = config;
        let str = this.inputNode.value;
        if (!str) {
            console.warn('发射内容为空')
            return
        }
        let node = document.createElement('span');
        node.setAttribute('id', 'node_' + this.nodeId++);
        node.setAttribute('class', 'danmu-item');
        node.style.color = color;
        node.style.fontSize = size + 'px';
        node.style.position = 'absolute';
        node.style.left = '0';
        node.style.top = '0';

        let offsetX = this.renderNode.offsetWidth;
        node.style.transform = `translateX(${offsetX}px) translateY(${offsetY}px)`;

        let animateInstance = node.animate(
            [{
                transform: `translateX(-400px) translateY(${offsetY}px)`
            }],
            {
                duration: seepd * 1000,
                easing: easing,
                delay: 0,
                fill: 'forwards',
            }
        )
        let nodeConfig = {
            seepd,
            color,
            size,
            offsetX,
            offsetY,
            easing,
            target: node,
            animate: animateInstance,
        }
        node._nodeConfig = nodeConfig;
        node.innerHTML = str;
        this.SetNodeMouseEven(node);
        this.nodeArr.push(nodeConfig);
        return node;
    }
    // 弹幕悬停挂载
    SetNodeMouseEven(node) {
        if (!node) {
            return
        }
        node.addEventListener('mouseenter', () => {
            node._nodeConfig.animate.pause();
        })
        node.addEventListener('mouseout', () => {
            node._nodeConfig.animate.play();
        })
    }
    // 初始化节点参数
    initNodeConfig() {
        let seepd = Math.floor(Math.random() * (12 - 2)) + 2;
        let size = Math.floor(Math.random() * (36 - 12)) + 12;
        let color = this.randomColor();

        let offsetHight = this.renderNode.offsetHeight;

        let offsetY = Math.floor(Math.random() * (offsetHight - 80)) + 40;

        let easing = this.getAnimateEase();

        return {
            seepd,
            size,
            color,
            offsetY,
            easing
        }

    }
    // 随机颜色
    randomColor() {
        var str1 = "rgb(";
        for (var i = 0; i < 3; i++) {
            str1 += Math.floor(Math.random() * 256) + ",";
        }
        str1 = str1.slice(0, -1) + ")";
        return str1;
    }
    // 获取动画效果
    getAnimateEase() {
        if (this.options.animateType == 'random') {
            let arr = [
                'linear', 'ease-in', 'step-end', 'cubic-bezier(0.42, 0, 0.58, 1)',
                'cubic-bezier(0.075, 0.82, 0.165, 1)', 'cubic-bezier(0.165, 0.84, 0.44, 1)', 'cubic-bezier(0.19, 1, 0.22, 1)'
            ]
            let len = arr.length - 1;
            let index = Math.floor(Math.random() * len)
            return arr[index]
        }
        return 'linear'

    }
    // 发射事件
    handlePush() {
        let node = this.createCNode(this.initNodeConfig());
        node && this.renderNode.append(node);

    }
    // 全部弹幕
    handlesendAll() {
        if (this.nodeArr.length <= 0) {
            return
        }
        this.nodeArr.forEach((n) => {
            n.animate.cancel();
            n.animate.play();
        })

    }
    // 清楚事件
    handleClear() {
        this.renderNode.innerHTML = '';
        this.nodeId = 0;
        this.nodeArr = [];
        // 内存释放
    }
    // 改变动画
    handleChangeAnimate() {
        if (this.options.animateType == 'nomal') {
            this.options.animateType = 'random'
        } else {
            this.options.animateType = 'nomal'
        }

    }

}

let instance = new DanmuInstance(document.getElementById('viewBox'), document.getElementById('inputBox'), {});


document.getElementById('sendBtn').addEventListener('click', () => {
    instance.handlePush();
})
document.getElementById('clearBtn').addEventListener('click', () => {
    instance.handleClear();
})
document.getElementById('sendAll').addEventListener('click', () => {
    instance.handlesendAll();
})
document.getElementById('randomAnimate').addEventListener('click', () => {
    instance.handleChangeAnimate();
})
document.getElementById('inputBox').addEventListener('keydown', function (event) {
    if (event.keyCode === 13) {
        instance.handlePush();
    }
});

document.body._DanmuInstance = instance;