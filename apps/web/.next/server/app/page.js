(() => {
var exports = {};
exports.id = 931;
exports.ids = [931];
exports.modules = {

/***/ 8038:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/react");

/***/ }),

/***/ 8704:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/react-dom/server-rendering-stub");

/***/ }),

/***/ 7897:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/react-server-dom-webpack/client");

/***/ }),

/***/ 6786:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/react/jsx-runtime");

/***/ }),

/***/ 5868:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/app-render");

/***/ }),

/***/ 1844:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/get-segment-param");

/***/ }),

/***/ 6624:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/future/helpers/interception-routes");

/***/ }),

/***/ 5281:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/future/route-modules/route-module");

/***/ }),

/***/ 7085:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/app-router-context");

/***/ }),

/***/ 199:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/hash");

/***/ }),

/***/ 9569:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/hooks-client-context");

/***/ }),

/***/ 893:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/add-path-prefix");

/***/ }),

/***/ 7887:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/handle-smooth-scroll");

/***/ }),

/***/ 8735:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/is-bot");

/***/ }),

/***/ 8231:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/parse-path");

/***/ }),

/***/ 4614:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/path-has-prefix");

/***/ }),

/***/ 3750:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/remove-trailing-slash");

/***/ }),

/***/ 9618:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/server-inserted-html");

/***/ }),

/***/ 279:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GlobalError: () => (/* reexport default from dynamic */ next_dist_client_components_error_boundary__WEBPACK_IMPORTED_MODULE_2___default.a),
/* harmony export */   __next_app__: () => (/* binding */ __next_app__),
/* harmony export */   originalPathname: () => (/* binding */ originalPathname),
/* harmony export */   pages: () => (/* binding */ pages),
/* harmony export */   routeModule: () => (/* binding */ routeModule),
/* harmony export */   tree: () => (/* binding */ tree)
/* harmony export */ });
/* harmony import */ var next_dist_server_future_route_modules_app_page_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(167);
/* harmony import */ var next_dist_server_future_route_modules_app_page_module__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_page_module__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(792);
/* harmony import */ var next_dist_client_components_error_boundary__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3585);
/* harmony import */ var next_dist_client_components_error_boundary__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_client_components_error_boundary__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var next_dist_server_app_render_entry_base__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3368);
/* harmony import */ var next_dist_server_app_render_entry_base__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_app_render_entry_base__WEBPACK_IMPORTED_MODULE_3__);
/* harmony reexport (unknown) */ var __WEBPACK_REEXPORT_OBJECT__ = {};
/* harmony reexport (unknown) */ for(const __WEBPACK_IMPORT_KEY__ in next_dist_server_app_render_entry_base__WEBPACK_IMPORTED_MODULE_3__) if(["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) __WEBPACK_REEXPORT_OBJECT__[__WEBPACK_IMPORT_KEY__] = () => next_dist_server_app_render_entry_base__WEBPACK_IMPORTED_MODULE_3__[__WEBPACK_IMPORT_KEY__]
/* harmony reexport (unknown) */ __webpack_require__.d(__webpack_exports__, __WEBPACK_REEXPORT_OBJECT__);
// @ts-ignore this need to be imported from next/dist to be external


const AppPageRouteModule = next_dist_server_future_route_modules_app_page_module__WEBPACK_IMPORTED_MODULE_0__.AppPageRouteModule;
// We inject the tree and pages here so that we can use them in the route
// module.
const tree = {
        children: [
        '',
        {
        children: ['__PAGE__', {}, {
          page: [() => Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 7436)), "/home/user/TradeComposer/apps/web/app/page.tsx"],
          
        }]
      },
        {
        'layout': [() => Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 8081)), "/home/user/TradeComposer/apps/web/app/layout.tsx"],
'not-found': [() => Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 3321, 23)), "next/dist/client/components/not-found-error"],
        
      }
      ]
      }.children;
const pages = ["/home/user/TradeComposer/apps/web/app/page.tsx"];

// @ts-expect-error - replaced by webpack/turbopack loader

const __next_app_require__ = __webpack_require__
const __next_app_load_chunk__ = () => Promise.resolve()
const originalPathname = "/page";
const __next_app__ = {
    require: __next_app_require__,
    loadChunk: __next_app_load_chunk__
};

// Create and export the route module that will be consumed.
const routeModule = new AppPageRouteModule({
    definition: {
        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_PAGE,
        page: "/page",
        pathname: "/",
        // The following aren't used in production.
        bundlePath: "",
        filename: "",
        appPaths: []
    },
    userland: {
        loaderTree: tree
    }
});

//# sourceMappingURL=app-page.js.map

/***/ }),

/***/ 7905:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 1418))

/***/ }),

/***/ 5768:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 7099, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 669, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 8732, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 7187, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 1008, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 2603, 23))

/***/ }),

/***/ 9364:
/***/ (() => {



/***/ }),

/***/ 1418:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ Home)
});

// EXTERNAL MODULE: external "next/dist/compiled/react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(6786);
// EXTERNAL MODULE: external "next/dist/compiled/react"
var react_ = __webpack_require__(8038);
// EXTERNAL MODULE: ../../node_modules/react-hotkeys-hook/dist/index.js
var dist = __webpack_require__(6805);
;// CONCATENATED MODULE: ./app/prokeys.ts

function useProKeys(opts) {
    const act = (mode)=>fetch("/api/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                mode,
                intent: opts.getIntent()
            })
        });
    (0,dist.useHotkeys)("shift+enter", ()=>act("force"));
    (0,dist.useHotkeys)("shift+p", ()=>act("prioritize"));
    (0,dist.useHotkeys)("shift+t", ()=>act("test"));
    (0,dist.useHotkeys)("shift+r", ()=>act("review"));
}

;// CONCATENATED MODULE: ./app/components.tsx
/* __next_internal_client_entry_do_not_use__ TradeComposer auto */ 


const Button = ({ onClick, color, children })=>/*#__PURE__*/ jsx_runtime_.jsx("button", {
        onClick: onClick,
        style: {
            padding: "8px 12px",
            borderRadius: 8,
            background: color,
            color: "white"
        },
        children: children
    });
const LevelButtons = {
    Default: [
        {
            label: "TEST",
            color: "#059669"
        },
        {
            label: "PRIORITIZE",
            color: "#d97706"
        },
        {
            label: "REVIEW",
            color: "#2563eb"
        },
        {
            label: "FORCE",
            color: "#dc2626"
        }
    ],
    Medium: [
        {
            label: "PANIC",
            color: "#ef4444"
        },
        {
            label: "GHOST",
            color: "#6b7280"
        },
        {
            label: "TIME-WARP",
            color: "#8b5cf6"
        }
    ],
    Full: [
        {
            label: "PATCH-LOCK",
            color: "#4f46e5"
        },
        {
            label: "ROLLBACK",
            color: "#f97316"
        },
        {
            label: "SCOPE",
            color: "#14b8a6"
        }
    ]
};
const Dashboard = ({ level, onAction, intent })=>{
    let buttons = LevelButtons.Default;
    if (level === "Medium") {
        buttons = [
            ...buttons,
            ...LevelButtons.Medium
        ];
    } else if (level === "Full") {
        buttons = [
            ...buttons,
            ...LevelButtons.Medium,
            ...LevelButtons.Full
        ];
    }
    return /*#__PURE__*/ jsx_runtime_.jsx("div", {
        style: {
            display: "flex",
            gap: 8,
            flexWrap: "wrap"
        },
        children: buttons.map(({ label, color })=>/*#__PURE__*/ jsx_runtime_.jsx(Button, {
                onClick: ()=>onAction(label.toLowerCase(), intent),
                color: color,
                children: label
            }, label))
    });
};
function TradeComposer() {
    const [plan, setPlan] = (0,react_.useState)(null);
    const [symbol, setSymbol] = (0,react_.useState)("BTCUSD");
    const [level, setLevel] = (0,react_.useState)("Default");
    useProKeys({
        getIntent: ()=>plan?.tasks?.[1]?.order || null
    });
    async function onCheckchart() {
        const r = await fetch("/api/plan", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                symbol
            })
        });
        setPlan(await r.json());
    }
    async function onAction(mode, intent) {
        await fetch("/api/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                mode,
                intent
            })
        });
    }
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)("main", {
        style: {
            padding: 24,
            fontFamily: "Inter, system-ui, Arial"
        },
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx("h1", {
                style: {
                    fontSize: 24,
                    fontWeight: 700
                },
                children: "Trade Composer"
            }),
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                style: {
                    display: "flex",
                    gap: 8,
                    marginTop: 12,
                    alignItems: "center"
                },
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx("input", {
                        value: symbol,
                        onChange: (e)=>setSymbol(e.target.value),
                        placeholder: "Symbol e.g. BTCUSD",
                        style: {
                            padding: "8px 12px",
                            border: "1px solid #ccc",
                            borderRadius: 8
                        }
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("button", {
                        onClick: onCheckchart,
                        style: {
                            padding: "8px 12px",
                            borderRadius: 8,
                            background: "black",
                            color: "white"
                        },
                        children: "Checkchart"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)("select", {
                        value: level,
                        onChange: (e)=>setLevel(e.target.value),
                        style: {
                            padding: "8px 12px",
                            border: "1px solid #ccc",
                            borderRadius: 8
                        },
                        children: [
                            /*#__PURE__*/ jsx_runtime_.jsx("option", {
                                children: "Default"
                            }),
                            /*#__PURE__*/ jsx_runtime_.jsx("option", {
                                children: "Medium"
                            }),
                            /*#__PURE__*/ jsx_runtime_.jsx("option", {
                                children: "Full"
                            })
                        ]
                    })
                ]
            }),
            plan && /*#__PURE__*/ (0,jsx_runtime_.jsxs)("section", {
                style: {
                    marginTop: 16,
                    border: "1px solid #eee",
                    borderRadius: 12,
                    padding: 16
                },
                children: [
                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                        children: [
                            /*#__PURE__*/ jsx_runtime_.jsx("b", {
                                children: "Bias:"
                            }),
                            " ",
                            plan.regime.bias
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                        style: {
                            opacity: 0.7,
                            fontSize: 13
                        },
                        children: [
                            "Levels: ",
                            plan.levels.map((l)=>`${l.type}@${l.price}`).join(", ")
                        ]
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("div", {
                        style: {
                            marginTop: 12
                        },
                        children: /*#__PURE__*/ jsx_runtime_.jsx(Dashboard, {
                            level: level,
                            onAction: onAction,
                            intent: plan.tasks?.[1]?.order || null
                        })
                    })
                ]
            })
        ]
    });
}

;// CONCATENATED MODULE: ./app/page.tsx
/* __next_internal_client_entry_do_not_use__ default auto */ 

function Home() {
    return /*#__PURE__*/ jsx_runtime_.jsx(TradeComposer, {});
}


/***/ }),

/***/ 8081:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ RootLayout),
/* harmony export */   metadata: () => (/* binding */ metadata)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6786);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);

const metadata = {
    title: "Trade Composer",
    description: "Moog-style trading instrument"
};
function RootLayout({ children }) {
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("html", {
        lang: "en",
        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("body", {
            children: children
        })
    });
}


/***/ }),

/***/ 7436:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   $$typeof: () => (/* binding */ $$typeof),
/* harmony export */   __esModule: () => (/* binding */ __esModule),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var next_dist_build_webpack_loaders_next_flight_loader_module_proxy__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4918);

const proxy = (0,next_dist_build_webpack_loaders_next_flight_loader_module_proxy__WEBPACK_IMPORTED_MODULE_0__.createProxy)(String.raw`/home/user/TradeComposer/apps/web/app/page.tsx`)

// Accessing the __esModule property and exporting $$typeof are required here.
// The __esModule getter forces the proxy target to create the default export
// and the $$typeof value is for rendering logic to determine if the module
// is a client boundary.
const { __esModule, $$typeof } = proxy;
const __default__ = proxy.default;


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__default__);

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [547,586], () => (__webpack_exec__(279)));
module.exports = __webpack_exports__;

})();