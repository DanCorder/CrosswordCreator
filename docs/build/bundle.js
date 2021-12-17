
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
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
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
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
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
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
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
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function create_component(block) {
        block && block.c();
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
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
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

    class AnagramList {
    }
    function createAnagramList(wordList) {
        const maxWordLength = 15;
        const ret = new AnagramList();
        for (let i = 1; i <= maxWordLength; i++) {
            const words = wordList[i];
            const processed = {};
            Object.keys(words).forEach(word => {
                const sortedLetters = sortString(word);
                if (!processed.hasOwnProperty(sortedLetters)) {
                    processed[sortedLetters] = [];
                }
                processed[sortedLetters].push(word);
            });
            ret[i] = Object.entries(processed).sort(function (x, y) {
                if (x[0] < y[0]) {
                    return -1;
                }
                if (x[0] > y[0]) {
                    return 1;
                }
                return 0;
            }).map(x => { return { letters: x[0], words: x[1].sort() }; });
        }
        return ret;
    }
    function findAllSingleWordAnagrams(parentWord, anagramList) {
        const parentLetters = sortString(parentWord);
        let anagrams = [];
        for (let letters of generatePowerSetStrings(parentLetters)) {
            const result = anagramList[letters.length].find(a => a.letters === letters);
            if (result !== undefined) {
                anagrams = anagrams.concat(result.words);
            }
        }
        anagrams = [...(new Set(anagrams))]; // Deduplicate entires
        return anagrams
            .filter(a => a !== parentWord)
            .map(r => [[r]]);
    }
    // For e.g. "look" returns results like:
    // [
    //   [ [ "loo" ], [ "k" ] ]
    //   [ [ "ko", "ok"], [ "lo" ] ]
    //   [ [ "kolo" ] ]
    // ]
    function findAnagrams(letters, anagramList, maxResults = 1000, ignoreWeirdSingleLetters = true) {
        const sortedLetters = sortString(letters);
        const results = [];
        for (const letterGroups of generateAllLetterCombinations(sortedLetters)) {
            const result = [];
            let foundResult = true;
            for (let i = 0; i < letterGroups.length; i++) {
                const letterGroup = letterGroups[i];
                if (ignoreWeirdSingleLetters
                    && letterGroup.length === 1
                    && letterGroup[0] !== 'a'
                    && letterGroup[0] !== 'i') {
                    foundResult = false;
                    break;
                }
                const anagrams = anagramList[letterGroup.length].find(x => x.letters === letterGroup);
                if (anagrams === undefined) {
                    // We can't anagram all of the groups so move on to the next set of groups
                    foundResult = false;
                    break;
                }
                const filteredWords = anagrams.words.filter(x => x !== letters);
                if (filteredWords.length === 0) {
                    foundResult = false;
                    break;
                }
                result.push(anagrams.words.filter(x => x !== letters));
            }
            if (foundResult) {
                result.sort(sortResultByLengthThenAlphabetically);
                let foundDuplicate = false;
                for (let i = 0; i < results.length; i++) {
                    const savedResult = results[i];
                    if (savedResult.length !== result.length) {
                        continue;
                    }
                    let areIdentical = true;
                    for (let j = 0; j < savedResult.length; j++) {
                        if (savedResult[j][0] !== result[j][0]) {
                            areIdentical = false;
                            break;
                        }
                    }
                    if (areIdentical) {
                        foundDuplicate = true;
                        break;
                    }
                }
                if (!foundDuplicate) {
                    results.push(result);
                }
            }
            if (results.length >= maxResults) {
                break;
            }
        }
        return results;
    }
    function sortResultByLengthThenAlphabetically(first, second) {
        if (second[0].length !== first[0].length) {
            return second[0].length - first[0].length;
        }
        if (second[0] > first[0]) {
            return -1;
        }
        return 1;
    }
    function sortString(str) {
        var arr = str.split('');
        var sorted = arr.sort();
        return sorted.join('');
    }
    // Generates the power set of letters from the supplied string
    // Preserves the order of the original string in the substrings
    // Written as a generator so that we don't have to keep the whole power set in memory at once.
    function* generatePowerSetStrings(letters) {
        for (let flags = 1; flags < (1 << letters.length); flags++) {
            let subset = '';
            for (let index = 0; index < letters.length; index++) {
                if (flags & (1 << index)) {
                    subset += letters[index];
                }
            }
            yield subset;
        }
    }
    // Generate all sub groupings of letters
    function* generateAllLetterCombinations(letters) {
        for (let restrictedGrowthString of generateRestrictedGrowthStrings(letters.length)) {
            const letterGroups = [];
            for (let i = 0; i < letters.length; i++) {
                const set = restrictedGrowthString[i];
                if (letterGroups[set] === undefined) {
                    letterGroups[set] = "";
                }
                letterGroups[set] += letters[i];
            }
            yield letterGroups;
        }
    }
    // Generate all set partitions for a set of a given length. Yields an array of integers
    // representing the sets that each letter at that index belongs to.
    // Implementation of algorithm from "The Art Of Computer Programming" by Donald E. Knuth
    // with some refactoring
    function* generateRestrictedGrowthStrings(length) {
        let restrictedGrowthString = [];
        let maxValues = [];
        for (let i = 0; i < length; i++) {
            restrictedGrowthString.push(0);
            maxValues.push(1);
        }
        const lastIndex = length - 1;
        while (true) {
            yield restrictedGrowthString;
            if (restrictedGrowthString[lastIndex] === maxValues[lastIndex]) {
                // Find the first value from the right in restrictedGrowthString that is below its maximum
                let j = lastIndex - 1;
                while (restrictedGrowthString[j] === maxValues[j]) {
                    j--;
                }
                // If the only value left is the first then we are done as that value always belongs to
                // set 0
                if (j === 0) {
                    return;
                }
                // Otherwise increment it
                restrictedGrowthString[j] += 1;
                // If restrictedGrowthString[j] has reached its maximum then the digits to the right will
                // need a maximum one higher so they can belong to a new set.
                const newMax = maxValues[j] + (restrictedGrowthString[j] === maxValues[j] ? 1 : 0);
                // Reset all the elements to the right
                j++;
                for (; j < length; j++) {
                    restrictedGrowthString[j] = 0;
                    maxValues[j] = newMax;
                }
            }
            else {
                restrictedGrowthString[lastIndex] += 1;
            }
        }
    }

    function findMatchingWords(pattern, wordList) {
        let matches = [];
        if (pattern === '') {
            return matches;
        }
        const wordsOfSameLength = wordList[pattern.length];
        const regex = new RegExp(pattern.replaceAll('.', '\\w').replaceAll(' ', '\\w'));
        Object.keys(wordsOfSameLength).forEach(candidate => {
            if (regex.test(candidate)) {
                matches = matches.concat(wordsOfSameLength[candidate]);
            }
        });
        return matches;
    }

    /* src\components\WordResult.svelte generated by Svelte v3.44.2 */

    const file$4 = "src\\components\\WordResult.svelte";

    function create_fragment$4(ctx) {
    	let div;
    	let a;
    	let t;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			a = element("a");
    			t = text(/*result*/ ctx[0]);
    			attr_dev(a, "href", a_href_value = "" + (dictionaryUrlPrefix$1 + /*result*/ ctx[0]));
    			attr_dev(a, "target", "_blank");
    			add_location(a, file$4, 5, 4, 126);
    			attr_dev(div, "class", "svelte-5xtzbs");
    			add_location(div, file$4, 4, 0, 116);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, a);
    			append_dev(a, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*result*/ 1) set_data_dev(t, /*result*/ ctx[0]);

    			if (dirty & /*result*/ 1 && a_href_value !== (a_href_value = "" + (dictionaryUrlPrefix$1 + /*result*/ ctx[0]))) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const dictionaryUrlPrefix$1 = 'https://www.dictionary.com/browse/';

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('WordResult', slots, []);
    	let { result } = $$props;
    	const writable_props = ['result'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<WordResult> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('result' in $$props) $$invalidate(0, result = $$props.result);
    	};

    	$$self.$capture_state = () => ({ result, dictionaryUrlPrefix: dictionaryUrlPrefix$1 });

    	$$self.$inject_state = $$props => {
    		if ('result' in $$props) $$invalidate(0, result = $$props.result);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [result];
    }

    class WordResult extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { result: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "WordResult",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*result*/ ctx[0] === undefined && !('result' in props)) {
    			console.warn("<WordResult> was created without expected prop 'result'");
    		}
    	}

    	get result() {
    		throw new Error("<WordResult>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set result(value) {
    		throw new Error("<WordResult>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\WordFit.svelte generated by Svelte v3.44.2 */
    const file$3 = "src\\components\\WordFit.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (24:8) {#each results as result}
    function create_each_block$2(ctx) {
    	let result;
    	let current;

    	result = new WordResult({
    			props: { result: /*result*/ ctx[6] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(result.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(result, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const result_changes = {};
    			if (dirty & /*results*/ 1) result_changes.result = /*result*/ ctx[6];
    			result.$set(result_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(result.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(result.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(result, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(24:8) {#each results as result}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div1;
    	let h2;
    	let t1;
    	let p;
    	let t3;
    	let input;
    	let t4;
    	let button;
    	let t6;
    	let div0;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*results*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Find Words That Fit";
    			t1 = space();
    			p = element("p");
    			p.textContent = "Enter the pattern to match below. Use letters where you have them and '.' or space for empty spaces";
    			t3 = space();
    			input = element("input");
    			t4 = space();
    			button = element("button");
    			button.textContent = "Search";
    			t6 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(h2, file$3, 19, 4, 500);
    			add_location(p, file$3, 20, 4, 533);
    			add_location(input, file$3, 21, 4, 644);
    			add_location(button, file$3, 21, 61, 701);
    			add_location(div0, file$3, 22, 4, 752);
    			attr_dev(div1, "class", "content-block");
    			add_location(div1, file$3, 18, 0, 468);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h2);
    			append_dev(div1, t1);
    			append_dev(div1, p);
    			append_dev(div1, t3);
    			append_dev(div1, input);
    			set_input_value(input, /*pattern*/ ctx[1]);
    			append_dev(div1, t4);
    			append_dev(div1, button);
    			append_dev(div1, t6);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[5]),
    					listen_dev(input, "keydown", /*handleKeyDown*/ ctx[3], false, false, false),
    					listen_dev(button, "click", /*handleClick*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*pattern*/ 2 && input.value !== /*pattern*/ ctx[1]) {
    				set_input_value(input, /*pattern*/ ctx[1]);
    			}

    			if (dirty & /*results*/ 1) {
    				each_value = /*results*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div0, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('WordFit', slots, []);
    	let { wordList } = $$props;
    	let results = [];
    	let pattern = "";

    	function handleClick() {
    		if (!wordList) {
    			alert("Word list not downloaded yet, please try again");
    		}

    		$$invalidate(0, results = findMatchingWords(pattern, wordList));
    	}

    	function handleKeyDown(event) {
    		if (event.key === "Enter") {
    			handleClick();
    		}
    	}

    	const writable_props = ['wordList'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<WordFit> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		pattern = this.value;
    		$$invalidate(1, pattern);
    	}

    	$$self.$$set = $$props => {
    		if ('wordList' in $$props) $$invalidate(4, wordList = $$props.wordList);
    	};

    	$$self.$capture_state = () => ({
    		findMatchingWords,
    		Result: WordResult,
    		wordList,
    		results,
    		pattern,
    		handleClick,
    		handleKeyDown
    	});

    	$$self.$inject_state = $$props => {
    		if ('wordList' in $$props) $$invalidate(4, wordList = $$props.wordList);
    		if ('results' in $$props) $$invalidate(0, results = $$props.results);
    		if ('pattern' in $$props) $$invalidate(1, pattern = $$props.pattern);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [results, pattern, handleClick, handleKeyDown, wordList, input_input_handler];
    }

    class WordFit extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { wordList: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "WordFit",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*wordList*/ ctx[4] === undefined && !('wordList' in props)) {
    			console.warn("<WordFit> was created without expected prop 'wordList'");
    		}
    	}

    	get wordList() {
    		throw new Error("<WordFit>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set wordList(value) {
    		throw new Error("<WordFit>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\AnagramResult.svelte generated by Svelte v3.44.2 */

    const file$2 = "src\\components\\AnagramResult.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (8:12) {#each wordSet as word}
    function create_each_block_1(ctx) {
    	let li;
    	let a;
    	let t_value = /*word*/ ctx[4] + "";
    	let t;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "href", a_href_value = "" + (dictionaryUrlPrefix + /*word*/ ctx[4]));
    			attr_dev(a, "target", "_blank");
    			add_location(a, file$2, 8, 20, 221);
    			add_location(li, file$2, 8, 16, 217);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			append_dev(a, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*result*/ 1 && t_value !== (t_value = /*word*/ ctx[4] + "")) set_data_dev(t, t_value);

    			if (dirty & /*result*/ 1 && a_href_value !== (a_href_value = "" + (dictionaryUrlPrefix + /*word*/ ctx[4]))) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(8:12) {#each wordSet as word}",
    		ctx
    	});

    	return block;
    }

    // (6:4) {#each result as wordSet}
    function create_each_block$1(ctx) {
    	let ul;
    	let t;
    	let each_value_1 = /*wordSet*/ ctx[1];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			attr_dev(ul, "class", "svelte-141jf7s");
    			add_location(ul, file$2, 6, 8, 160);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			append_dev(ul, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*dictionaryUrlPrefix, result*/ 1) {
    				each_value_1 = /*wordSet*/ ctx[1];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, t);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(6:4) {#each result as wordSet}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div;
    	let each_value = /*result*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "svelte-141jf7s");
    			add_location(div, file$2, 4, 0, 116);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*result, dictionaryUrlPrefix*/ 1) {
    				each_value = /*result*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const dictionaryUrlPrefix = 'https://www.dictionary.com/browse/';

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AnagramResult', slots, []);
    	let { result } = $$props;
    	const writable_props = ['result'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AnagramResult> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('result' in $$props) $$invalidate(0, result = $$props.result);
    	};

    	$$self.$capture_state = () => ({ result, dictionaryUrlPrefix });

    	$$self.$inject_state = $$props => {
    		if ('result' in $$props) $$invalidate(0, result = $$props.result);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [result];
    }

    class AnagramResult extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { result: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AnagramResult",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*result*/ ctx[0] === undefined && !('result' in props)) {
    			console.warn("<AnagramResult> was created without expected prop 'result'");
    		}
    	}

    	get result() {
    		throw new Error("<AnagramResult>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set result(value) {
    		throw new Error("<AnagramResult>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Anagrams.svelte generated by Svelte v3.44.2 */
    const file$1 = "src\\components\\Anagrams.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    // (33:8) {#each results as result}
    function create_each_block(ctx) {
    	let result;
    	let current;

    	result = new AnagramResult({
    			props: { result: /*result*/ ctx[8] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(result.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(result, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const result_changes = {};
    			if (dirty & /*results*/ 1) result_changes.result = /*result*/ ctx[8];
    			result.$set(result_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(result.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(result.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(result, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(33:8) {#each results as result}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div1;
    	let h2;
    	let t1;
    	let p0;
    	let button0;
    	let t3;
    	let t4;
    	let p1;
    	let button1;
    	let t6;
    	let t7;
    	let input;
    	let t8;
    	let div0;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*results*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Find Anagrams";
    			t1 = space();
    			p0 = element("p");
    			button0 = element("button");
    			button0.textContent = "Find single words";
    			t3 = text(" Find all single word anagrams within the input, not necessarily using all letters");
    			t4 = space();
    			p1 = element("p");
    			button1 = element("button");
    			button1.textContent = "Find full anagrams";
    			t6 = text(" Find full multi-word anagrams (up to 1000 results)");
    			t7 = space();
    			input = element("input");
    			t8 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(h2, file$1, 27, 4, 837);
    			add_location(button0, file$1, 28, 7, 867);
    			add_location(p0, file$1, 28, 4, 864);
    			add_location(button1, file$1, 29, 7, 1029);
    			add_location(p1, file$1, 29, 4, 1026);
    			add_location(input, file$1, 30, 4, 1151);
    			add_location(div0, file$1, 31, 4, 1216);
    			attr_dev(div1, "class", "content-block");
    			add_location(div1, file$1, 26, 0, 805);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h2);
    			append_dev(div1, t1);
    			append_dev(div1, p0);
    			append_dev(p0, button0);
    			append_dev(p0, t3);
    			append_dev(div1, t4);
    			append_dev(div1, p1);
    			append_dev(p1, button1);
    			append_dev(p1, t6);
    			append_dev(div1, t7);
    			append_dev(div1, input);
    			set_input_value(input, /*letters*/ ctx[1]);
    			append_dev(div1, t8);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*findSingleWordAnagrams*/ ctx[2], false, false, false),
    					listen_dev(button1, "click", /*findAllAnagrams*/ ctx[3], false, false, false),
    					listen_dev(input, "input", /*input_input_handler*/ ctx[6]),
    					listen_dev(input, "keydown", /*handleKeyDownAll*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*letters*/ 2 && input.value !== /*letters*/ ctx[1]) {
    				set_input_value(input, /*letters*/ ctx[1]);
    			}

    			if (dirty & /*results*/ 1) {
    				each_value = /*results*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div0, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Anagrams', slots, []);
    	let { wordList } = $$props;
    	let anagramList;
    	let results = [];
    	let letters = "";

    	function findSingleWordAnagrams() {
    		if (!wordList) {
    			alert("Word list not downloaded yet, please try again");
    		}

    		$$invalidate(0, results = findAllSingleWordAnagrams(letters, anagramList));
    	}

    	function findAllAnagrams() {
    		if (!wordList) {
    			alert("Word list not downloaded yet, please try again");
    		}

    		$$invalidate(0, results = findAnagrams(letters, anagramList));
    	}

    	function handleKeyDownAll(event) {
    		if (event.key === "Enter") {
    			findAllAnagrams();
    		}
    	}

    	const writable_props = ['wordList'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Anagrams> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		letters = this.value;
    		$$invalidate(1, letters);
    	}

    	$$self.$$set = $$props => {
    		if ('wordList' in $$props) $$invalidate(5, wordList = $$props.wordList);
    	};

    	$$self.$capture_state = () => ({
    		createAnagramList,
    		findAllSingleWordAnagrams,
    		findAnagrams,
    		Result: AnagramResult,
    		wordList,
    		anagramList,
    		results,
    		letters,
    		findSingleWordAnagrams,
    		findAllAnagrams,
    		handleKeyDownAll
    	});

    	$$self.$inject_state = $$props => {
    		if ('wordList' in $$props) $$invalidate(5, wordList = $$props.wordList);
    		if ('anagramList' in $$props) anagramList = $$props.anagramList;
    		if ('results' in $$props) $$invalidate(0, results = $$props.results);
    		if ('letters' in $$props) $$invalidate(1, letters = $$props.letters);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*wordList*/ 32) {
    			anagramList = !wordList ? null : createAnagramList(wordList);
    		}
    	};

    	return [
    		results,
    		letters,
    		findSingleWordAnagrams,
    		findAllAnagrams,
    		handleKeyDownAll,
    		wordList,
    		input_input_handler
    	];
    }

    class Anagrams extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { wordList: 5 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Anagrams",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*wordList*/ ctx[5] === undefined && !('wordList' in props)) {
    			console.warn("<Anagrams> was created without expected prop 'wordList'");
    		}
    	}

    	get wordList() {
    		throw new Error("<Anagrams>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set wordList(value) {
    		throw new Error("<Anagrams>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.44.2 */
    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let div2;
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
    	let wordfit;
    	let t12;
    	let anagrams;
    	let t13;
    	let div1;
    	let a5;
    	let current;

    	wordfit = new WordFit({
    			props: { wordList: /*wordList*/ ctx[0] },
    			$$inline: true
    		});

    	anagrams = new Anagrams({
    			props: { wordList: /*wordList*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div2 = element("div");
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
    			create_component(wordfit.$$.fragment);
    			t12 = space();
    			create_component(anagrams.$$.fragment);
    			t13 = space();
    			div1 = element("div");
    			a5 = element("a");
    			a5.textContent = "Credits/Copyright";
    			add_location(h1, file, 15, 8, 478);
    			attr_dev(a0, "href", "https://www.wordplays.com/anagrammer");
    			attr_dev(a0, "target", "_blank");
    			add_location(a0, file, 18, 16, 575);
    			add_location(li0, file, 18, 12, 571);
    			attr_dev(a1, "href", "https://www.dictionary.com/");
    			attr_dev(a1, "target", "_blank");
    			add_location(a1, file, 19, 16, 672);
    			add_location(li1, file, 19, 12, 668);
    			attr_dev(a2, "href", "https://www.thesaurus.com/");
    			attr_dev(a2, "target", "_blank");
    			add_location(a2, file, 20, 16, 767);
    			add_location(li2, file, 20, 12, 763);
    			attr_dev(a3, "href", "https://puzzling.stackexchange.com/questions/45984/cryptic-clue-guide|");
    			attr_dev(a3, "target", "_blank");
    			add_location(a3, file, 21, 16, 860);
    			add_location(li3, file, 21, 12, 856);
    			attr_dev(a4, "href", "https://en.wikipedia.org/wiki/Crossword_abbreviations");
    			attr_dev(a4, "target", "_blank");
    			add_location(a4, file, 22, 16, 1003);
    			add_location(li4, file, 22, 12, 999);
    			add_location(ul, file, 17, 8, 554);
    			attr_dev(div0, "class", "content-block");
    			add_location(div0, file, 14, 4, 442);
    			attr_dev(a5, "href", "/CrosswordCreator/credits");
    			add_location(a5, file, 31, 8, 1233);
    			attr_dev(div1, "class", "content-block");
    			add_location(div1, file, 30, 4, 1197);
    			attr_dev(div2, "class", "main");
    			add_location(div2, file, 13, 0, 419);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
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
    			append_dev(div2, t11);
    			mount_component(wordfit, div2, null);
    			append_dev(div2, t12);
    			mount_component(anagrams, div2, null);
    			append_dev(div2, t13);
    			append_dev(div2, div1);
    			append_dev(div1, a5);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const wordfit_changes = {};
    			if (dirty & /*wordList*/ 1) wordfit_changes.wordList = /*wordList*/ ctx[0];
    			wordfit.$set(wordfit_changes);
    			const anagrams_changes = {};
    			if (dirty & /*wordList*/ 1) anagrams_changes.wordList = /*wordList*/ ctx[0];
    			anagrams.$set(anagrams_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(wordfit.$$.fragment, local);
    			transition_in(anagrams.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(wordfit.$$.fragment, local);
    			transition_out(anagrams.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(wordfit);
    			destroy_component(anagrams);
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

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let wordList = null;
    	let anagramList = null;

    	fetch('assets/js/processedWordList.json').then(response => response.json()).then(data => {
    		$$invalidate(0, wordList = data);
    		anagramList = createAnagramList(wordList);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		createAnagramList,
    		WordFit,
    		Anagrams,
    		wordList,
    		anagramList
    	});

    	$$self.$inject_state = $$props => {
    		if ('wordList' in $$props) $$invalidate(0, wordList = $$props.wordList);
    		if ('anagramList' in $$props) anagramList = $$props.anagramList;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [wordList];
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
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
