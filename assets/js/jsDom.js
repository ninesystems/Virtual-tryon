(function(window) {
	window.jsDom = {
		/**
		 * nodeName = node tag to create
		 * noedAttrs = node attributes in obj {}
		 * nodeHtml = data to put in node
		 * otherNodeType = other node type parent/child
		 * otherNode = other node
		 * return	::	node
		 * */
		createNode:function(nodeName,nodeAttrs,nodeHtml,otherNodeType,otherNode, prepend){
			var node = document.createElement(nodeName);
			jsDom.setAttr(node,nodeAttrs);
			if(nodeHtml){
				jsDom.html(node,nodeHtml);
			}
			switch(otherNodeType){
				case 'parent':
					if(!prepend){
						jsDom.append(otherNode, node);
					}else{
						jsDom.prepend(otherNode, node);
					}
				break;
				case 'child':
					if(!prepend){
						jsDom.append(node,otherNode);
					}else{
						jsDom.prepend(node,otherNode);
					}
				break;
				default:
				break;
			}
			return node;
		},
		remove:function(node){
			var e = jsDom.getNode(node);
			if(e.firstChild)
				jsDom.clearNode(e);
			e.parentNode.removeChild(e);
		},
		/**
		 * node = node name to remove child
		 * */
		clearNode:function(node){
			while(node.firstChild) node.removeChild(node.firstChild);
		},
		/**
		 * node = node to set attributes
		 * attrs = attributes in obj {}
		 * */
		setAttr:function(node,attrs){
			var e = jsDom.getNode(node);
			for (var k in attrs){
		        if (attrs.hasOwnProperty(k)){
		        	e.setAttribute(k,attrs[k]);
		        }
		    }
		},
		/**
		 * node = node to put data
		 * data = data
		 * */
		html:function(node,data){
			var e = jsDom.getNode(node);
			e.innerHTML = data;
		},
		/**
		 * parrent = parent node
		 * node = node to append
		 * */
		append:function(parent,node){
			var p = jsDom.getNode(parent);
			var c = jsDom.getNode(node);
			p.appendChild(c);
		},
		prepend:function(parent, node){
			var p = jsDom.getNode(parent);
			var c = jsDom.getNode(node);
			p.insertBefore(c, p.childNodes[0] || null);
		},
		/**
		 * liAttrs = list attributes
		 * liHtml = list html data
		 * return	::	li
		 * */
		li:function(liAttrs,liHtml){
			var li = document.createElement('li');
			jsDom.setAttr(li,liAttrs);
			jsDom.html(li,liHtml);
			return li;
		},
		/**
		 * nodeName = node name for image container div/li
		 * nodeAttrs = list attributes in obj form { } 
		 * imgAttrs = attributes for image
		 * return	::	node with image
		 **/
		liImage:function(nodeName,nodeAttrs,imgAttrs){
			var img_div = jsDom.createNode(nodeName,nodeAttrs);
			var image = jsDom.createNode("img",imgAttrs,null,'parent',img_div);
			return img_div;
		},
		/**
		 * node = parent node to append data
		 * btnAttrs = button attributes
		 * btnImgSrc = Source image for button (+,-,etc)
		 * listenerToken = token for listener to add or remove
		 * listenerValue = value for add/remove
		 * obj = data to create cart list 
		 * */
		button:function(node,btnAttrs,btnHtml,btnImgSrc,listenerToken,listenerValue,obj){
			var btn = jsDom.createNode('button',btnAttrs);
			if(btnImgSrc)
				var btnImg = jsDom.createNode('img',{'src':btnImgSrc},null,'parent',btn);
			else
				jsDom.html(btn,btnHtml);
			node.appendChild(btn);
		},
		/**
		 * nodeId	=	node id
		 * func		=	display : block/none
		 * return	::	node
		 * */
		displayById:function(nodeId,func){
			var node = jsDom.nodeById(nodeId);
			if(func) jsDom.displayNode(node,func);
			return node;
		},
		/**
		 * node		=	node
		 * func		=	display : block/none
		 * */
		displayNode:function(node,func){
			node.style.display = func;
		},
		/**
		 * node		=	node
		 * */
		show:function(node){
			jsDom.getNode(node).style.display = 'block';
		},
		/**
		 * node		=	node
		 * */
		hide:function(node){
			jsDom.getNode(node).style.display = 'none';
		},
		/**
		 * nodeId	=	node id
		 * html		=	data to insert in node
		 * return	::	node
		 * */
		nodeById:function(nodeId,html){
			var node = document.getElementById(nodeId);
			if(html)
				this.html(node,html);
			return node;
		},
		/**
		 * nodeClass	=	node class
		 * return	::	node
		 * */
		nodeByClass:function(nodeClass){
			return document.getElementsByClassName(nodeClass);
		},
		css:function(node,attrs){
			var e = jsDom.getNode(node);
			for (var k in attrs){
		        if (attrs.hasOwnProperty(k)){
		        	e.style[k] = attrs[k];
		        }
		    }
		},
		getProperty:function(node,prop,token){
			var e = jsDom.getNode(node);
			var val = e[prop];
			if(token){
				return jsDom.makeInt(val);
			}
			return val;
		},
		getStyle:function(node,prop,token){
			var e = jsDom.getNode(node);
			var val = e.style[prop];
			if(token){
				return jsDom.makeInt(val);
			}
			return val;
		},
		removeStyle:function(node,prop){
			var e = jsDom.getNode(node);
			e.style.removeProperty(prop);
		},
		makeInt:function(val){
			return val == ""?0:parseInt(val);
		},
		getNode:function(node){
			if(typeof node != 'object')
				return jsDom.nodeById(node);
			return node;
		},
		setBGOpacity:function(node, val){
			var e = jsDom.getNode(node);
			e.style["-khtml-opacity"] = val/100;
			e.style["-moz-opacity"] = val/100;
			e.style["-ms-filter"] = "alpha(opacity="+val+")";
			e.style["filter"] = "alpha(opacity="+val+")";
			e.style["filter"] = "progid:DXImageTransform.Microsoft.Alpha(opacity=("+val/100+"))";
			e.style["opacity"] = val/100;
		}
	}
})(this);