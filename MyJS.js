'use strict';

function $(name) {
    return document.querySelector(name);
}

function DOMContructor(DOMInfo) {
    /**DOM构造器
     * Params:
     *  DOMInfo -> DOM构造器接收的一个JS对象，包含了一个DOM对象的基本信息。
     *  =======
     *  DOMInfo
     *      |-> nodeName
     *      |-> className
     *      |-> id
     *      |-> innerHTML
     *      |-> otherParams
     *      |   |-> type: 'text'
     *      |   |-> ...
     *      |-> dataAll
     *      |   |-> url: 'xxxx'
     *      |   |-> ...
     *      |-> styleList
     *          |-> ['color: #fff', ...]
     *  =======
     * Return:
     *  DOM Object -> DOM对象
     */
    var DOMObj = null;
    var node = null;
    var nodeStyle = [];

    try {
        node = document.createElement(DOMInfo.nodeName);
    } catch (e) {
        console.log('DOMinfo: 缺少重要参数 -> nodeName');
        return node;
    }

    node.id = DOMInfo.id == undefined ? '' : DOMInfo.id;
    node.className = DOMInfo.className == undefined ? '' : DOMInfo.className;
    node.innerHTML = DOMInfo.innerHTML == undefined ? '' : DOMInfo.innerHTML;

    for (var param in DOMInfo.otherParams) {
        node[param] = DOMInfo.otherParams[param];
    }
    for (var data in DOMInfo.dataAll) {
        node.dataset[data] = DOMInfo.dataAll[data];
    }

    try {
        DOMInfo.styleList.forEach(function(el) {
            var style = el.split(':');
            node.style.setProperty(style[0], style[1]);
        }, this);
    } catch (e) {
        if (e.name == 'TypeError') {
            //doNothing
            //如果该节点没有定义styleList会报错，直接忽略即可
        } else {
            console.log('DOMInfo: 参数错误 -> styleList');
        }
    }

    return node;
}

function DOMTreeConstructor(DOMTree) {
    /**
     * DOM树构造器
     * Params:
     *  DOMTree -> 一个JS对象，包含了一个DOM树的所有信息
     * Return:
     *  DOM Object -> 根节点DOM对象
     */

    if (!DOMTree) return null;
    var thisNode = DOMContructor(DOMTree);
    if (DOMTree.children) {
        for (var i in DOMTree.children) {
            i = DOMTree.children[i];
            thisNode.appendChild(DOMTreeConstructor(i));
        }
    }

    return thisNode;
}

function ajax(option) {
    /**只支持chrome,edge,ff等现代浏览器
     * option: {
     *     method: String <-post or get
     *     url:    String <-your url here
     *     data:      Obj <-your data here
     *     async: Boolean <-async or not
     *     handler:   Obj <-async fun here, eg: b.init.bind(b)
     * }
     */
    var xhr = new XMLHttpRequest();
    var data = null;
    if (!option.async) option.async = true;
    xhr.open(option.method, option.url, option.async);
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            option.handler(JSON.parse(xhr.responseText));
        }
    }
    if (option.method.toUpperCase() == 'GET') {
        xhr.send(data);
    } else if (option.method.toUpperCase() == 'POST') {
        data = new FormData();
        data.append('data', JSON.stringify(option.data));
        xhr.send(data);
    }
}

function test() {
    var testDOMConstructor = DOMContructor({
        nodeName: 'span',
        id: 'xxx',
        className: 'div',
        otherParams: {
            type: 'xxx'
        },
        dataAll: {
            url: 'xxx/xxx'
        },
        innerHTML: 'fsdf',
        styleList: [
            'coor:#fff'
        ]
    });
    console.log(testDOMConstructor);

    var testTree = {
        nodeName: 'span',
        id: 'haha',
        styleList: [
            'border:1px solid #fff',
            'background-color:red'
        ],
        children: [{
            nodeName: 'p',
            id: 'fd',
            innerHTML: 'fsdf'
        }, {
            nodeName: 'h1',
            innerHTML: 'fdf'
        }]
    };

    console.log(DOMTreeConstructor(testTree));
    $('body').appendChild(DOMTreeConstructor(testTree));
}

test();