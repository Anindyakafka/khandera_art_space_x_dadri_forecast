export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([]),
	mimeTypes: {},
	_: {
		client: {start:"_app/immutable/entry/start.CljyB1tK.js",app:"_app/immutable/entry/app.C2akgDou.js",imports:["_app/immutable/entry/start.CljyB1tK.js","_app/immutable/chunks/BscbdKMQ.js","_app/immutable/chunks/DG77EOL1.js","_app/immutable/chunks/DXjcHDnz.js","_app/immutable/entry/app.C2akgDou.js","_app/immutable/chunks/DG77EOL1.js","_app/immutable/chunks/reChJaxL.js","_app/immutable/chunks/AwpZ848c.js","_app/immutable/chunks/DXjcHDnz.js","_app/immutable/chunks/CM0QRC25.js","_app/immutable/chunks/9-y1uofh.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js'))
		],
		remotes: {
			
		},
		routes: [
			
		],
		prerendered_routes: new Set(["/","/about","/artists","/events","/projects"]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
