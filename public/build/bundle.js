
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.44.2' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/App.svelte generated by Svelte v3.44.2 */

    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let div8;
    	let div0;
    	let h1;
    	let t1;
    	let ul;
    	let li0;
    	let a0;
    	let t3;
    	let li1;
    	let a1;
    	let t5;
    	let li2;
    	let a2;
    	let t7;
    	let li3;
    	let a3;
    	let t9;
    	let li4;
    	let a4;
    	let t11;
    	let div2;
    	let h20;
    	let t13;
    	let p0;
    	let t15;
    	let input0;
    	let t16;
    	let button0;
    	let t18;
    	let div1;
    	let t19;
    	let div4;
    	let h21;
    	let t21;
    	let p1;
    	let t23;
    	let p2;
    	let t25;
    	let input1;
    	let t26;
    	let button1;
    	let t28;
    	let input2;
    	let t29;
    	let div3;
    	let t30;
    	let div6;
    	let h22;
    	let t32;
    	let p3;
    	let t34;
    	let input3;
    	let t35;
    	let button2;
    	let t37;
    	let div5;
    	let t38;
    	let div7;
    	let a5;

    	const block = {
    		c: function create() {
    			div8 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Tools for cryptic crossword creation - under construction";
    			t1 = space();
    			ul = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			a0.textContent = "Anagrams";
    			t3 = space();
    			li1 = element("li");
    			a1 = element("a");
    			a1.textContent = "Free dictionary";
    			t5 = space();
    			li2 = element("li");
    			a2 = element("a");
    			a2.textContent = "Free thesaurus";
    			t7 = space();
    			li3 = element("li");
    			a3 = element("a");
    			a3.textContent = "Different clue types";
    			t9 = space();
    			li4 = element("li");
    			a4 = element("a");
    			a4.textContent = "Clues for letters";
    			t11 = space();
    			div2 = element("div");
    			h20 = element("h2");
    			h20.textContent = "Find Words That Fit";
    			t13 = space();
    			p0 = element("p");
    			p0.textContent = "Enter the pattern to match below. Use letters where you have them and '.' or space for empty spaces";
    			t15 = space();
    			input0 = element("input");
    			t16 = space();
    			button0 = element("button");
    			button0.textContent = "Search";
    			t18 = space();
    			div1 = element("div");
    			t19 = space();
    			div4 = element("div");
    			h21 = element("h2");
    			h21.textContent = "Find Anagrams";
    			t21 = space();
    			p1 = element("p");
    			p1.textContent = "All single letters can be considered words in some way. To reduce the number of results we limit single letter words to just 'a' and 'I'.";
    			t23 = space();
    			p2 = element("p");
    			p2.textContent = "Find up to 1000 results";
    			t25 = space();
    			input1 = element("input");
    			t26 = space();
    			button1 = element("button");
    			button1.textContent = "Search";
    			t28 = text(" Exclude these letters ");
    			input2 = element("input");
    			t29 = space();
    			div3 = element("div");
    			t30 = space();
    			div6 = element("div");
    			h22 = element("h2");
    			h22.textContent = "Find Single Anagrams";
    			t32 = space();
    			p3 = element("p");
    			p3.textContent = "Find all single word anagrams within the input, not necessarily using all letters";
    			t34 = space();
    			input3 = element("input");
    			t35 = space();
    			button2 = element("button");
    			button2.textContent = "Search";
    			t37 = space();
    			div5 = element("div");
    			t38 = space();
    			div7 = element("div");
    			a5 = element("a");
    			a5.textContent = "Credits/Copyright";
    			add_location(h1, file, 2, 8, 59);
    			attr_dev(a0, "href", "https://www.wordplays.com/anagrammer");
    			attr_dev(a0, "target", "_blank");
    			attr_dev(a0, "class", "svelte-15cs1lt");
    			add_location(a0, file, 5, 16, 156);
    			add_location(li0, file, 5, 12, 152);
    			attr_dev(a1, "href", "https://www.dictionary.com/");
    			attr_dev(a1, "target", "_blank");
    			attr_dev(a1, "class", "svelte-15cs1lt");
    			add_location(a1, file, 6, 16, 253);
    			add_location(li1, file, 6, 12, 249);
    			attr_dev(a2, "href", "https://www.thesaurus.com/");
    			attr_dev(a2, "target", "_blank");
    			attr_dev(a2, "class", "svelte-15cs1lt");
    			add_location(a2, file, 7, 16, 348);
    			add_location(li2, file, 7, 12, 344);
    			attr_dev(a3, "href", "https://puzzling.stackexchange.com/questions/45984/cryptic-clue-guide|");
    			attr_dev(a3, "target", "_blank");
    			attr_dev(a3, "class", "svelte-15cs1lt");
    			add_location(a3, file, 8, 16, 441);
    			add_location(li3, file, 8, 12, 437);
    			attr_dev(a4, "href", "https://en.wikipedia.org/wiki/Crossword_abbreviations");
    			attr_dev(a4, "target", "_blank");
    			attr_dev(a4, "class", "svelte-15cs1lt");
    			add_location(a4, file, 9, 16, 584);
    			add_location(li4, file, 9, 12, 580);
    			add_location(ul, file, 4, 8, 135);
    			attr_dev(div0, "class", "content-block svelte-15cs1lt");
    			add_location(div0, file, 1, 4, 23);
    			add_location(h20, file, 14, 8, 757);
    			add_location(p0, file, 15, 8, 794);
    			attr_dev(input0, "id", "findMatchingWordsInput");
    			add_location(input0, file, 16, 8, 909);
    			attr_dev(button0, "id", "findMatchingWordsButton");
    			add_location(button0, file, 16, 46, 947);
    			attr_dev(div1, "id", "findMatchingWordsOutput");
    			add_location(div1, file, 17, 8, 1008);
    			attr_dev(div2, "class", "content-block svelte-15cs1lt");
    			add_location(div2, file, 13, 4, 721);
    			add_location(h21, file, 21, 8, 1101);
    			add_location(p1, file, 22, 8, 1132);
    			add_location(p2, file, 23, 8, 1285);
    			attr_dev(input1, "id", "findAnagramsInput");
    			add_location(input1, file, 24, 8, 1324);
    			attr_dev(button1, "id", "findAnagramsButton");
    			add_location(button1, file, 24, 41, 1357);
    			attr_dev(input2, "id", "findAnagramsExclude");
    			add_location(input2, file, 24, 111, 1427);
    			attr_dev(div3, "id", "findAnagramsOutput");
    			add_location(div3, file, 25, 8, 1470);
    			attr_dev(div4, "class", "content-block svelte-15cs1lt");
    			add_location(div4, file, 20, 4, 1065);
    			add_location(h22, file, 29, 8, 1558);
    			add_location(p3, file, 30, 8, 1596);
    			attr_dev(input3, "id", "findSingleAnagramsInput");
    			add_location(input3, file, 31, 8, 1693);
    			attr_dev(button2, "id", "findSingleAnagramsButton");
    			add_location(button2, file, 31, 47, 1732);
    			attr_dev(div5, "id", "findSingleAnagramsOutput");
    			add_location(div5, file, 32, 8, 1794);
    			attr_dev(div6, "class", "content-block svelte-15cs1lt");
    			add_location(div6, file, 28, 4, 1522);
    			attr_dev(a5, "href", "/CrosswordCreator/credits");
    			attr_dev(a5, "class", "svelte-15cs1lt");
    			add_location(a5, file, 36, 8, 1888);
    			attr_dev(div7, "class", "content-block svelte-15cs1lt");
    			add_location(div7, file, 35, 4, 1852);
    			attr_dev(div8, "class", "main");
    			add_location(div8, file, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div8, anchor);
    			append_dev(div8, div0);
    			append_dev(div0, h1);
    			append_dev(div0, t1);
    			append_dev(div0, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a0);
    			append_dev(ul, t3);
    			append_dev(ul, li1);
    			append_dev(li1, a1);
    			append_dev(ul, t5);
    			append_dev(ul, li2);
    			append_dev(li2, a2);
    			append_dev(ul, t7);
    			append_dev(ul, li3);
    			append_dev(li3, a3);
    			append_dev(ul, t9);
    			append_dev(ul, li4);
    			append_dev(li4, a4);
    			append_dev(div8, t11);
    			append_dev(div8, div2);
    			append_dev(div2, h20);
    			append_dev(div2, t13);
    			append_dev(div2, p0);
    			append_dev(div2, t15);
    			append_dev(div2, input0);
    			append_dev(div2, t16);
    			append_dev(div2, button0);
    			append_dev(div2, t18);
    			append_dev(div2, div1);
    			append_dev(div8, t19);
    			append_dev(div8, div4);
    			append_dev(div4, h21);
    			append_dev(div4, t21);
    			append_dev(div4, p1);
    			append_dev(div4, t23);
    			append_dev(div4, p2);
    			append_dev(div4, t25);
    			append_dev(div4, input1);
    			append_dev(div4, t26);
    			append_dev(div4, button1);
    			append_dev(div4, t28);
    			append_dev(div4, input2);
    			append_dev(div4, t29);
    			append_dev(div4, div3);
    			append_dev(div8, t30);
    			append_dev(div8, div6);
    			append_dev(div6, h22);
    			append_dev(div6, t32);
    			append_dev(div6, p3);
    			append_dev(div6, t34);
    			append_dev(div6, input3);
    			append_dev(div6, t35);
    			append_dev(div6, button2);
    			append_dev(div6, t37);
    			append_dev(div6, div5);
    			append_dev(div8, t38);
    			append_dev(div8, div7);
    			append_dev(div7, a5);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div8);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
        target: document.body,
        props: {
            name: 'world'
        }
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
