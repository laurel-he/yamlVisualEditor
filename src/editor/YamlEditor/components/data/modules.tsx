const modules = {
    "modules": [
        {
            "name": "moPi",
            "show": true,
            "chinese": "磨皮",
            "type": "radio",
            "abridge": "mp",
            "id": 1,
            "scalar": "int",
            "route": "data=params=effect=moPi",
            "child": [

            ]
        },
        {
            "name": "liangYan",
            "show": true,
            "chinese": "亮眼",
            "type": "radio",
            "abridge": "ly",
            "id": 2,
            "scalar": "float",
            "route": "data=params=effect=liangYan",
            "child": [

            ]
        },
        {
            "name": "shouBi-men",
            "show": true,
            "chinese": "瘦鼻男",
            "abridge": "sb",
            "type": "radio",
            "id": 3,
            "scalar": "float",
            "route": "data=params=effect=shouBi-men",
            "child": [

            ]
        },
        {
            "name": "shouBi-women",
            "show": true,
            "chinese": "瘦鼻女",
            "abridge": "sb",
            "type": "radio",
            "id": 4,
            "scalar": "float",
            "route": "data=params=effect=shouBi-women",
            "child": [

            ]
        },
        {
            "name": "daYan-men",
            "show": true,
            "chinese": "大眼男",
            "type": "radio",
            "abridge": "dy",
            "id": 5,
            "scalar": "float",
            "route": "data=params=effect=daYan-men",
            "child": [

            ]
        },
        {
            "name": "daYan-women",
            "show": true,
            "chinese": "大眼女",
            "type": "radio",
            "abridge": "dy",
            "id": 6,
            "scalar": "float",
            "route": "data=params=effect=daYan-women",
            "child": [

            ]
        },
        {
            "name": "shouLian-men",
            "show": true,
            "chinese": "瘦脸男",
            "abridge": "sl",
            "type": "radio",
            "id": 7,
            "scalar": "float",
            "route": "data=params=effect=shouLian-men",
            "child": [

            ]
        },
        {
            "name": "shouLian-women",
            "show": true,
            "chinese": "瘦脸女",
            "type": "radio",
            "abridge": "sl",
            "id": 8,
            "scalar": "float",
            "route": "data=params=effect=shouLian-women",
            "child": [

            ]
        },
        {
            "name": "xiaoLian-men",
            "show": true,
            "chinese": "小脸男",
            "abridge": "xl",
            "type": "radio",
            "id": 9,
            "scalar": "float",
            "route": "data=params=effect=xiaoLian-men",
            "child": [

            ]
        },
        {
            "name": "xiaoLian-women",
            "show": true,
            "chinese": "小脸女",
            "abridge": "xl",
            "type": "radio",
            "id": 10,
            "scalar": "float",
            "route": "data=params=effect=xiaoLian-women",
            "child": [

            ]
        },
        {
            "name": "vLian-men",
            "show": true,
            "chinese": "V脸男",
            "abridge": "vl",
            "type": "radio",
            "id": 11,
            "scalar": "float",
            "route": "data=params=effect=vLian-men",
            "child": [

            ]
        },
        {
            "name": "vLian-women",
            "show": true,
            "chinese": "V脸女",
            "abridge": "vl",
            "type": "radio",
            "id": 12,
            "scalar": "float",
            "route": "data=params=effect=vLian-women",
            "child": [

            ]
        },
        {
            "name": "quDou",
            "show": true,
            "chinese": "祛痘",
            "type": "radio",
            "abridge": "qd",
            "id": 13,
            "scalar": "int",
            "route": "data=params=effect=quDou",
            "child": [

            ]
        },
        {
            "name": "jiLi",
            "show": true,
            "chinese": "肌理",
            "type": "radio",
            "abridge": "jl",
            "id": 14,
            "scalar": "int",
            "route": "data=params=effect=jiLi",
            "child": [

            ]
        },
        {
            "name": "ruiHua",
            "show": true,
            "chinese": "锐化",
            "type": "radio",
            "abridge": "rh",
            "id": 15,
            "scalar": "int",
            "route": "data=params=effect=ruiHua",
            "child": [

            ]
        },
        {
            "name": "baiYa",
            "show": true,
            "chinese": "白牙",
            "type": "radio",
            "abridge": "by",
            "id": 16,
            "scalar": "float",
            "route": "data=params=effect=baiYa",
            "child": [

            ]
        },
        {
            "name": "baiFu",
            "show": true,
            "chinese": "白肤",
            "type": "radio",
            "abridge": "bf",
            "id": 17,
            "scalar": "int",
            "route": "data=params=effect=baiFu",
            "child": [

            ]
        },
        {
            "name": "xiuRong-men",
            "show": true,
            "chinese": "修容男",
            "type": "radio",
            "abridge": "xr",
            "id": 18,
            "scalar": "int",
            "route": "data=params=effect=xiuRong=men",
            "child": [

            ]
        },
        {
            "name": "xiuRong-women",
            "show": true,
            "chinese": "修容女",
            "type": "radio",
            "abridge": "xr",
            "id": 19,
            "scalar": "int",
            "route": "data=params=effect=xiuRong=women",
            "child": [

            ]
        },
        {
            "name": "enable",
            "show": true,
            "chinese": "液化分年龄",
            "type": "switch",
            "id": 20,
            "route": "data=params=regular=age=enable",
            "child": [

            ]
        },
        {
            "name": "min",
            "show": true,
            "chinese": "液化年龄最小值",
            "type": "input",
            "id": 21,
            "scalar": "int",
            "route": "data=params=regular=age=min",
            "related": {
                "route": "data=params=regular=age=enable",
                "value": true
            },
            "child": [

            ]
        },
        {
            "name": "max",
            "show": true,
            "chinese": "液化年龄最大值",
            "type": "input",
            "id": 22,
            "route": "data=params=regular=age=max",
            "related": {
                "route": "data=params=regular=age=enable",
                "value": true
            },
            "child": [

            ]
        },
        {
            "name": "enable",
            "show": true,
            "chinese": "自动提亮",
            "type": "switch",
            "id": 23,
            "route": "data=params=autoBright",
            "child": [

            ]
        }
    ]
}

export default modules
