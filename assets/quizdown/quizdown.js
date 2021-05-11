/* Version: 0.1.4 - May 7, 2021 16:20:39 */

(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.quizdown = {}));
}(this, (function (exports) { 'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
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
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
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
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
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
    function get_binding_group_value(group, __value, checked) {
        const value = new Set();
        for (let i = 0; i < group.length; i += 1) {
            if (group[i].checked)
                value.add(group[i].__value);
        }
        if (!checked) {
            value.delete(__value);
        }
        return Array.from(value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }
    class HtmlTag {
        constructor(anchor = null) {
            this.a = anchor;
            this.e = this.n = null;
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                this.e = element(target.nodeName);
                this.t = target;
                this.h(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = node.ownerDocument;
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = doc.head.appendChild(element('style')).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    function create_animation(node, from, fn, params) {
        if (!from)
            return noop;
        const to = node.getBoundingClientRect();
        if (from.left === to.left && from.right === to.right && from.top === to.top && from.bottom === to.bottom)
            return noop;
        const { delay = 0, duration = 300, easing = identity, 
        // @ts-ignore todo: should this be separated from destructuring? Or start/end added to public api and documentation?
        start: start_time = now() + delay, 
        // @ts-ignore todo:
        end = start_time + duration, tick = noop, css } = fn(node, { from, to }, params);
        let running = true;
        let started = false;
        let name;
        function start() {
            if (css) {
                name = create_rule(node, 0, 1, duration, delay, easing, css);
            }
            if (!delay) {
                started = true;
            }
        }
        function stop() {
            if (css)
                delete_rule(node, name);
            running = false;
        }
        loop(now => {
            if (!started && now >= start_time) {
                started = true;
            }
            if (started && now >= end) {
                tick(1, 0);
                stop();
            }
            if (!running) {
                return false;
            }
            if (started) {
                const p = now - start_time;
                const t = 0 + 1 * easing(p / duration);
                tick(t, 1 - t);
            }
            return true;
        });
        start();
        tick(0, 1);
        return stop;
    }
    function fix_position(node) {
        const style = getComputedStyle(node);
        if (style.position !== 'absolute' && style.position !== 'fixed') {
            const { width, height } = style;
            const a = node.getBoundingClientRect();
            node.style.position = 'absolute';
            node.style.width = width;
            node.style.height = height;
            add_transform(node, a);
        }
    }
    function add_transform(node, a) {
        const b = node.getBoundingClientRect();
        if (a.left !== b.left || a.top !== b.top) {
            const style = getComputedStyle(node);
            const transform = style.transform === 'none' ? '' : style.transform;
            node.style.transform = `${transform} translate(${a.left - b.left}px, ${a.top - b.top}px)`;
        }
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
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
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
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

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
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
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }

    function destroy_block(block, lookup) {
        block.d(1);
        lookup.delete(block.key);
    }
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function fix_and_destroy_block(block, lookup) {
        block.f();
        destroy_block(block, lookup);
    }
    function fix_and_outro_and_destroy_block(block, lookup) {
        block.f();
        outro_and_destroy_block(block, lookup);
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
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
    function init$1(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
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
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.37.0' }, detail)));
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
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
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

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }
    function elasticOut(t) {
        return (Math.sin((-13.0 * (t + 1.0) * Math.PI) / 2) * Math.pow(2.0, -10.0 * t) + 1.0);
    }
    function quintOut(t) {
        return --t * t * t * t * t + 1;
    }

    function flip(node, animation, params = {}) {
        const style = getComputedStyle(node);
        const transform = style.transform === 'none' ? '' : style.transform;
        const scaleX = animation.from.width / node.clientWidth;
        const scaleY = animation.from.height / node.clientHeight;
        const dx = (animation.from.left - animation.to.left) / scaleX;
        const dy = (animation.from.top - animation.to.top) / scaleY;
        const d = Math.sqrt(dx * dx + dy * dy);
        const { delay = 0, duration = (d) => Math.sqrt(d) * 120, easing = cubicOut } = params;
        return {
            delay,
            duration: is_function(duration) ? duration(d) : duration,
            easing,
            css: (_t, u) => `transform: ${transform} translate(${u * dx}px, ${u * dy}px);`
        };
    }

    /* node_modules\svelte-dragdroplist\DragDropList.svelte generated by Svelte v3.37.0 */
    const file$b = "node_modules\\svelte-dragdroplist\\DragDropList.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[27] = list[i];
    	child_ctx[29] = i;
    	return child_ctx;
    }

    // (212:20) {:else}
    function create_else_block$3(ctx) {
    	let p;
    	let t_value = /*datum*/ ctx[27] + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			add_location(p, file$b, 212, 24, 6897);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*data*/ 1 && t_value !== (t_value = /*datum*/ ctx[27] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(212:20) {:else}",
    		ctx
    	});

    	return block;
    }

    // (210:41) 
    function create_if_block_2$2(ctx) {
    	let p;
    	let t_value = /*datum*/ ctx[27].text + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			add_location(p, file$b, 210, 24, 6825);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*data*/ 1 && t_value !== (t_value = /*datum*/ ctx[27].text + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(210:41) ",
    		ctx
    	});

    	return block;
    }

    // (208:20) {#if datum.html}
    function create_if_block_1$3(ctx) {
    	let html_tag;
    	let raw_value = /*datum*/ ctx[27].html + "";
    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_anchor = empty();
    			html_tag = new HtmlTag(html_anchor);
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(raw_value, target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*data*/ 1 && raw_value !== (raw_value = /*datum*/ ctx[27].html + "")) html_tag.p(raw_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(208:20) {#if datum.html}",
    		ctx
    	});

    	return block;
    }

    // (218:20) {#if removesItems}
    function create_if_block$6(ctx) {
    	let button;
    	let svg;
    	let path0;
    	let path1;
    	let mounted;
    	let dispose;

    	function click_handler_2(...args) {
    		return /*click_handler_2*/ ctx[17](/*i*/ ctx[29], ...args);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M0 0h24v24H0z");
    			attr_dev(path0, "fill", "none");
    			add_location(path0, file$b, 220, 111, 7260);
    			attr_dev(path1, "d", "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z");
    			add_location(path1, file$b, 220, 148, 7297);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "height", "16");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "width", "16");
    			add_location(svg, file$b, 220, 28, 7177);
    			attr_dev(button, "class", "svelte-1g3zabj");
    			add_location(button, file$b, 218, 24, 7070);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, svg);
    			append_dev(svg, path0);
    			append_dev(svg, path1);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_2, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(218:20) {#if removesItems}",
    		ctx
    	});

    	return block;
    }

    // (180:8) {#each data as datum, i (datum.id ? datum.id : JSON.stringify(datum))}
    function create_each_block$3(key_1, ctx) {
    	let div3;
    	let div0;
    	let button0;
    	let svg0;
    	let path0;
    	let path1;
    	let button0_style_value;
    	let t0;
    	let button1;
    	let svg1;
    	let path2;
    	let path3;
    	let button1_style_value;
    	let t1;
    	let div1;
    	let t2;
    	let div2;
    	let t3;
    	let div3_id_value;
    	let div3_data_index_value;
    	let div3_data_id_value;
    	let rect;
    	let stop_animation = noop;
    	let mounted;
    	let dispose;

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[15](/*i*/ ctx[29], ...args);
    	}

    	function click_handler_1(...args) {
    		return /*click_handler_1*/ ctx[16](/*i*/ ctx[29], ...args);
    	}

    	function select_block_type(ctx, dirty) {
    		if (/*datum*/ ctx[27].html) return create_if_block_1$3;
    		if (/*datum*/ ctx[27].text) return create_if_block_2$2;
    		return create_else_block$3;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*removesItems*/ ctx[1] && create_if_block$6(ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			button0 = element("button");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			t0 = space();
    			button1 = element("button");
    			svg1 = svg_element("svg");
    			path2 = svg_element("path");
    			path3 = svg_element("path");
    			t1 = space();
    			div1 = element("div");
    			if_block0.c();
    			t2 = space();
    			div2 = element("div");
    			if (if_block1) if_block1.c();
    			t3 = space();
    			attr_dev(path0, "d", "M0 0h24v24H0V0z");
    			attr_dev(path0, "fill", "none");
    			add_location(path0, file$b, 196, 111, 5988);
    			attr_dev(path1, "d", "M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6 1.41 1.41z");
    			add_location(path1, file$b, 196, 150, 6027);
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "viewBox", "0 0 24 24");
    			attr_dev(svg0, "width", "16px");
    			attr_dev(svg0, "height", "16px");
    			add_location(svg0, file$b, 196, 24, 5901);
    			attr_dev(button0, "class", "up svelte-1g3zabj");
    			attr_dev(button0, "style", button0_style_value = "visibility: " + (/*i*/ ctx[29] > 0 ? "" : "hidden") + ";");
    			add_location(button0, file$b, 192, 20, 5682);
    			attr_dev(path2, "d", "M0 0h24v24H0V0z");
    			attr_dev(path2, "fill", "none");
    			add_location(path2, file$b, 202, 111, 6474);
    			attr_dev(path3, "d", "M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z");
    			add_location(path3, file$b, 202, 150, 6513);
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "viewBox", "0 0 24 24");
    			attr_dev(svg1, "width", "16px");
    			attr_dev(svg1, "height", "16px");
    			add_location(svg1, file$b, 202, 24, 6387);
    			attr_dev(button1, "class", "down svelte-1g3zabj");

    			attr_dev(button1, "style", button1_style_value = "visibility: " + (/*i*/ ctx[29] < /*data*/ ctx[0].length - 1
    			? ""
    			: "hidden") + ";");

    			add_location(button1, file$b, 198, 20, 6152);
    			attr_dev(div0, "class", "buttons svelte-1g3zabj");
    			add_location(div0, file$b, 191, 16, 5640);
    			attr_dev(div1, "class", "content svelte-1g3zabj");
    			add_location(div1, file$b, 206, 16, 6657);
    			attr_dev(div2, "class", "buttons delete svelte-1g3zabj");
    			add_location(div2, file$b, 216, 16, 6978);

    			attr_dev(div3, "id", div3_id_value = /*grabbed*/ ctx[3] && (/*datum*/ ctx[27].id
    			? /*datum*/ ctx[27].id
    			: JSON.stringify(/*datum*/ ctx[27])) == /*grabbed*/ ctx[3].dataset.id
    			? "grabbed"
    			: "");

    			attr_dev(div3, "class", "item svelte-1g3zabj");
    			attr_dev(div3, "data-index", div3_data_index_value = /*i*/ ctx[29]);

    			attr_dev(div3, "data-id", div3_data_id_value = /*datum*/ ctx[27].id
    			? /*datum*/ ctx[27].id
    			: JSON.stringify(/*datum*/ ctx[27]));

    			attr_dev(div3, "data-graby", "0");
    			add_location(div3, file$b, 180, 12, 4919);
    			this.first = div3;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div0, button0);
    			append_dev(button0, svg0);
    			append_dev(svg0, path0);
    			append_dev(svg0, path1);
    			append_dev(div0, t0);
    			append_dev(div0, button1);
    			append_dev(button1, svg1);
    			append_dev(svg1, path2);
    			append_dev(svg1, path3);
    			append_dev(div3, t1);
    			append_dev(div3, div1);
    			if_block0.m(div1, null);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			if (if_block1) if_block1.m(div2, null);
    			append_dev(div3, t3);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", click_handler, false, false, false),
    					listen_dev(button1, "click", click_handler_1, false, false, false),
    					listen_dev(div3, "mousedown", /*mousedown_handler*/ ctx[18], false, false, false),
    					listen_dev(div3, "touchstart", /*touchstart_handler*/ ctx[19], false, false, false),
    					listen_dev(div3, "mouseenter", /*mouseenter_handler*/ ctx[20], false, false, false),
    					listen_dev(div3, "touchmove", /*touchmove_handler*/ ctx[21], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*data*/ 1 && button0_style_value !== (button0_style_value = "visibility: " + (/*i*/ ctx[29] > 0 ? "" : "hidden") + ";")) {
    				attr_dev(button0, "style", button0_style_value);
    			}

    			if (dirty & /*data*/ 1 && button1_style_value !== (button1_style_value = "visibility: " + (/*i*/ ctx[29] < /*data*/ ctx[0].length - 1
    			? ""
    			: "hidden") + ";")) {
    				attr_dev(button1, "style", button1_style_value);
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div1, null);
    				}
    			}

    			if (/*removesItems*/ ctx[1]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$6(ctx);
    					if_block1.c();
    					if_block1.m(div2, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty & /*grabbed, data*/ 9 && div3_id_value !== (div3_id_value = /*grabbed*/ ctx[3] && (/*datum*/ ctx[27].id
    			? /*datum*/ ctx[27].id
    			: JSON.stringify(/*datum*/ ctx[27])) == /*grabbed*/ ctx[3].dataset.id
    			? "grabbed"
    			: "")) {
    				attr_dev(div3, "id", div3_id_value);
    			}

    			if (dirty & /*data*/ 1 && div3_data_index_value !== (div3_data_index_value = /*i*/ ctx[29])) {
    				attr_dev(div3, "data-index", div3_data_index_value);
    			}

    			if (dirty & /*data*/ 1 && div3_data_id_value !== (div3_data_id_value = /*datum*/ ctx[27].id
    			? /*datum*/ ctx[27].id
    			: JSON.stringify(/*datum*/ ctx[27]))) {
    				attr_dev(div3, "data-id", div3_data_id_value);
    			}
    		},
    		r: function measure() {
    			rect = div3.getBoundingClientRect();
    		},
    		f: function fix() {
    			fix_position(div3);
    			stop_animation();
    		},
    		a: function animate() {
    			stop_animation();
    			stop_animation = create_animation(div3, rect, flip, { duration: 200 });
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if_block0.d();
    			if (if_block1) if_block1.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(180:8) {#each data as datum, i (datum.id ? datum.id : JSON.stringify(datum))}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let main;
    	let div0;
    	let p;
    	let div0_class_value;
    	let div0_style_value;
    	let t;
    	let div1;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let mounted;
    	let dispose;
    	let each_value = /*data*/ ctx[0];
    	validate_each_argument(each_value);

    	const get_key = ctx => /*datum*/ ctx[27].id
    	? /*datum*/ ctx[27].id
    	: JSON.stringify(/*datum*/ ctx[27]);

    	validate_each_keys(ctx, each_value, get_each_context$3, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$3(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$3(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
    			div0 = element("div");
    			p = element("p");
    			t = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(p, "class", "svelte-1g3zabj");
    			add_location(p, file$b, 172, 61, 4461);
    			attr_dev(div0, "id", "ghost");
    			attr_dev(div0, "class", div0_class_value = "" + (null_to_empty(/*grabbed*/ ctx[3] ? "item haunting" : "item") + " svelte-1g3zabj"));
    			attr_dev(div0, "style", div0_style_value = "top: " + (/*mouseY*/ ctx[4] + /*offsetY*/ ctx[5] - /*layerY*/ ctx[6]) + "px");
    			add_location(div0, file$b, 168, 4, 4298);
    			attr_dev(div1, "class", "list svelte-1g3zabj");
    			add_location(div1, file$b, 173, 4, 4479);
    			attr_dev(main, "class", "dragdroplist svelte-1g3zabj");
    			add_location(main, file$b, 167, 0, 4266);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div0);
    			append_dev(div0, p);
    			/*div0_binding*/ ctx[14](div0);
    			append_dev(main, t);
    			append_dev(main, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			if (!mounted) {
    				dispose = [
    					listen_dev(div1, "mousemove", /*mousemove_handler*/ ctx[22], false, false, false),
    					listen_dev(div1, "touchmove", /*touchmove_handler_1*/ ctx[23], false, false, false),
    					listen_dev(div1, "mouseup", /*mouseup_handler*/ ctx[24], false, false, false),
    					listen_dev(div1, "touchend", /*touchend_handler*/ ctx[25], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*grabbed*/ 8 && div0_class_value !== (div0_class_value = "" + (null_to_empty(/*grabbed*/ ctx[3] ? "item haunting" : "item") + " svelte-1g3zabj"))) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (dirty & /*mouseY, offsetY, layerY*/ 112 && div0_style_value !== (div0_style_value = "top: " + (/*mouseY*/ ctx[4] + /*offsetY*/ ctx[5] - /*layerY*/ ctx[6]) + "px")) {
    				attr_dev(div0, "style", div0_style_value);
    			}

    			if (dirty & /*grabbed, data, JSON, grab, dragEnter, touchEnter, removeDatum, removesItems, moveDatum*/ 11915) {
    				each_value = /*data*/ ctx[0];
    				validate_each_argument(each_value);
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].r();
    				validate_each_keys(ctx, each_value, get_each_context$3, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div1, fix_and_destroy_block, create_each_block$3, null, get_each_context$3);
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].a();
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			/*div0_binding*/ ctx[14](null);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("DragDropList", slots, []);
    	let { data = [] } = $$props;
    	let { removesItems = false } = $$props;
    	let ghost;
    	let grabbed;
    	let lastTarget;
    	let mouseY = 0; // pointer y coordinate within client
    	let offsetY = 0; // y distance from top of grabbed element to pointer
    	let layerY = 0; // distance from top of list to top of client

    	function grab(clientY, element) {
    		// modify grabbed element
    		$$invalidate(3, grabbed = element);

    		$$invalidate(3, grabbed.dataset.grabY = clientY, grabbed);

    		// modify ghost element (which is actually dragged)
    		$$invalidate(2, ghost.innerHTML = grabbed.innerHTML, ghost);

    		// record offset from cursor to top of element
    		// (used for positioning ghost)
    		$$invalidate(5, offsetY = grabbed.getBoundingClientRect().y - clientY);

    		drag(clientY);
    	}

    	// drag handler updates cursor position
    	function drag(clientY) {
    		if (grabbed) {
    			$$invalidate(4, mouseY = clientY);
    			$$invalidate(6, layerY = ghost.parentNode.getBoundingClientRect().y);
    		}
    	}

    	// touchEnter handler emulates the mouseenter event for touch input
    	// (more or less)
    	function touchEnter(ev) {
    		drag(ev.clientY);

    		// trigger dragEnter the first time the cursor moves over a list item
    		let target = document.elementFromPoint(ev.clientX, ev.clientY).closest(".item");

    		if (target && target != lastTarget) {
    			lastTarget = target;
    			dragEnter(ev, target);
    		}
    	}

    	function dragEnter(ev, target) {
    		// swap items in data
    		if (grabbed && target != grabbed && target.classList.contains("item")) {
    			moveDatum(parseInt(grabbed.dataset.index), parseInt(target.dataset.index));
    		}
    	}

    	// does the actual moving of items in data
    	function moveDatum(from, to) {
    		let temp = data[from];
    		$$invalidate(0, data = [...data.slice(0, from), ...data.slice(from + 1)]);
    		$$invalidate(0, data = [...data.slice(0, to), temp, ...data.slice(to)]);
    	}

    	function release(ev) {
    		$$invalidate(3, grabbed = null);
    	}

    	function removeDatum(index) {
    		$$invalidate(0, data = [...data.slice(0, index), ...data.slice(index + 1)]);
    	}

    	const writable_props = ["data", "removesItems"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<DragDropList> was created with unknown prop '${key}'`);
    	});

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			ghost = $$value;
    			$$invalidate(2, ghost);
    		});
    	}

    	const click_handler = function (i, ev) {
    		moveDatum(i, i - 1);
    	};

    	const click_handler_1 = function (i, ev) {
    		moveDatum(i, i + 1);
    	};

    	const click_handler_2 = function (i, ev) {
    		removeDatum(i);
    	};

    	const mousedown_handler = function (ev) {
    		grab(ev.clientY, this);
    	};

    	const touchstart_handler = function (ev) {
    		grab(ev.touches[0].clientY, this);
    	};

    	const mouseenter_handler = function (ev) {
    		ev.stopPropagation();
    		dragEnter(ev, ev.target);
    	};

    	const touchmove_handler = function (ev) {
    		ev.stopPropagation();
    		ev.preventDefault();
    		touchEnter(ev.touches[0]);
    	};

    	const mousemove_handler = function (ev) {
    		ev.stopPropagation();
    		drag(ev.clientY);
    	};

    	const touchmove_handler_1 = function (ev) {
    		ev.stopPropagation();
    		drag(ev.touches[0].clientY);
    	};

    	const mouseup_handler = function (ev) {
    		ev.stopPropagation();
    		release();
    	};

    	const touchend_handler = function (ev) {
    		ev.stopPropagation();
    		release(ev.touches[0]);
    	};

    	$$self.$$set = $$props => {
    		if ("data" in $$props) $$invalidate(0, data = $$props.data);
    		if ("removesItems" in $$props) $$invalidate(1, removesItems = $$props.removesItems);
    	};

    	$$self.$capture_state = () => ({
    		flip,
    		data,
    		removesItems,
    		ghost,
    		grabbed,
    		lastTarget,
    		mouseY,
    		offsetY,
    		layerY,
    		grab,
    		drag,
    		touchEnter,
    		dragEnter,
    		moveDatum,
    		release,
    		removeDatum
    	});

    	$$self.$inject_state = $$props => {
    		if ("data" in $$props) $$invalidate(0, data = $$props.data);
    		if ("removesItems" in $$props) $$invalidate(1, removesItems = $$props.removesItems);
    		if ("ghost" in $$props) $$invalidate(2, ghost = $$props.ghost);
    		if ("grabbed" in $$props) $$invalidate(3, grabbed = $$props.grabbed);
    		if ("lastTarget" in $$props) lastTarget = $$props.lastTarget;
    		if ("mouseY" in $$props) $$invalidate(4, mouseY = $$props.mouseY);
    		if ("offsetY" in $$props) $$invalidate(5, offsetY = $$props.offsetY);
    		if ("layerY" in $$props) $$invalidate(6, layerY = $$props.layerY);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		data,
    		removesItems,
    		ghost,
    		grabbed,
    		mouseY,
    		offsetY,
    		layerY,
    		grab,
    		drag,
    		touchEnter,
    		dragEnter,
    		moveDatum,
    		release,
    		removeDatum,
    		div0_binding,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		mousedown_handler,
    		touchstart_handler,
    		mouseenter_handler,
    		touchmove_handler,
    		mousemove_handler,
    		touchmove_handler_1,
    		mouseup_handler,
    		touchend_handler
    	];
    }

    class DragDropList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$d, create_fragment$d, safe_not_equal, { data: 0, removesItems: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DragDropList",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get data() {
    		throw new Error("<DragDropList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<DragDropList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get removesItems() {
    		throw new Error("<DragDropList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set removesItems(value) {
    		throw new Error("<DragDropList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\SequenceView.svelte generated by Svelte v3.37.0 */

    function create_fragment$c(ctx) {
    	let dragdroplist;
    	let updating_data;
    	let current;

    	function dragdroplist_data_binding(value) {
    		/*dragdroplist_data_binding*/ ctx[4](value);
    	}

    	let dragdroplist_props = {};

    	if (/*current*/ ctx[0].answers !== void 0) {
    		dragdroplist_props.data = /*current*/ ctx[0].answers;
    	}

    	dragdroplist = new DragDropList({
    			props: dragdroplist_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(dragdroplist, "data", dragdroplist_data_binding));

    	const block = {
    		c: function create() {
    			create_component(dragdroplist.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(dragdroplist, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const dragdroplist_changes = {};

    			if (!updating_data && dirty & /*current*/ 1) {
    				updating_data = true;
    				dragdroplist_changes.data = /*current*/ ctx[0].answers;
    				add_flush_callback(() => updating_data = false);
    			}

    			dragdroplist.$set(dragdroplist_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dragdroplist.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dragdroplist.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dragdroplist, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let counter;
    	let current;

    	let $counter,
    		$$unsubscribe_counter = noop,
    		$$subscribe_counter = () => ($$unsubscribe_counter(), $$unsubscribe_counter = subscribe(counter, $$value => $$invalidate(3, $counter = $$value)), counter);

    	$$self.$$.on_destroy.push(() => $$unsubscribe_counter());
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SequenceView", slots, []);
    	
    	let { quiz } = $$props;
    	const writable_props = ["quiz"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SequenceView> was created with unknown prop '${key}'`);
    	});

    	function dragdroplist_data_binding(value) {
    		if ($$self.$$.not_equal(current.answers, value)) {
    			current.answers = value;
    			(($$invalidate(0, current), $$invalidate(2, quiz)), $$invalidate(3, $counter));
    		}
    	}

    	$$self.$$set = $$props => {
    		if ("quiz" in $$props) $$invalidate(2, quiz = $$props.quiz);
    	};

    	$$self.$capture_state = () => ({
    		current_component,
    		get_current_component,
    		DragDropList,
    		quiz,
    		counter,
    		current,
    		$counter
    	});

    	$$self.$inject_state = $$props => {
    		if ("quiz" in $$props) $$invalidate(2, quiz = $$props.quiz);
    		if ("counter" in $$props) $$subscribe_counter($$invalidate(1, counter = $$props.counter));
    		if ("current" in $$props) $$invalidate(0, current = $$props.current);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*quiz*/ 4) {
    			$$subscribe_counter($$invalidate(1, counter = quiz.counter));
    		}

    		if ($$self.$$.dirty & /*quiz, $counter*/ 12) {
    			$$invalidate(0, current = quiz.questions[$counter]);
    		}

    		if ($$self.$$.dirty & /*current*/ 1) {
    			{
    				$$invalidate(0, current.selected = current.answers.map(answer => answer.id), current);
    			}
    		}
    	};

    	return [current, counter, quiz, $counter, dragdroplist_data_binding];
    }

    class SequenceView extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$c, create_fragment$c, safe_not_equal, { quiz: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SequenceView",
    			options,
    			id: create_fragment$c.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*quiz*/ ctx[2] === undefined && !("quiz" in props)) {
    			console.warn("<SequenceView> was created without expected prop 'quiz'");
    		}
    	}

    	get quiz() {
    		throw new Error("<SequenceView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set quiz(value) {
    		throw new Error("<SequenceView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\ChoiceView.svelte generated by Svelte v3.37.0 */

    const file$a = "src\\components\\ChoiceView.svelte";

    function get_each_context_1$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	child_ctx[9] = i;
    	return child_ctx;
    }

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	child_ctx[9] = i;
    	return child_ctx;
    }

    // (18:0) {:else}
    function create_else_block$2(ctx) {
    	let each_1_anchor;
    	let each_value_1 = /*current*/ ctx[1].answers;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*current*/ 2) {
    				each_value_1 = /*current*/ ctx[1].answers;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(18:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (7:0) {#if current.type === 'MultipleChoice'}
    function create_if_block$5(ctx) {
    	let each_1_anchor;
    	let each_value = /*current*/ ctx[1].answers;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*current*/ 2) {
    				each_value = /*current*/ ctx[1].answers;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(7:0) {#if current.type === 'MultipleChoice'}",
    		ctx
    	});

    	return block;
    }

    // (19:4) {#each current.answers as answer, i}
    function create_each_block_1$2(ctx) {
    	let label;
    	let input;
    	let t0;
    	let span;
    	let raw_value = /*answer*/ ctx[7].html + "";
    	let t1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			input = element("input");
    			t0 = space();
    			span = element("span");
    			t1 = space();
    			attr_dev(input, "type", "radio");
    			input.__value = /*i*/ ctx[9];
    			input.value = input.__value;
    			attr_dev(input, "class", "svelte-ob4y2m");
    			/*$$binding_groups*/ ctx[5][0].push(input);
    			add_location(input, file$a, 20, 12, 508);
    			attr_dev(span, "class", "svelte-ob4y2m");
    			add_location(span, file$a, 21, 12, 587);
    			attr_dev(label, "class", "svelte-ob4y2m");
    			add_location(label, file$a, 19, 8, 488);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, input);
    			input.checked = input.__value === /*current*/ ctx[1].selected;
    			append_dev(label, t0);
    			append_dev(label, span);
    			span.innerHTML = raw_value;
    			append_dev(label, t1);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*input_change_handler_1*/ ctx[6]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*current*/ 2) {
    				input.checked = input.__value === /*current*/ ctx[1].selected;
    			}

    			if (dirty & /*current*/ 2 && raw_value !== (raw_value = /*answer*/ ctx[7].html + "")) span.innerHTML = raw_value;		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			/*$$binding_groups*/ ctx[5][0].splice(/*$$binding_groups*/ ctx[5][0].indexOf(input), 1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$2.name,
    		type: "each",
    		source: "(19:4) {#each current.answers as answer, i}",
    		ctx
    	});

    	return block;
    }

    // (8:4) {#each current.answers as answer, i}
    function create_each_block$2(ctx) {
    	let label;
    	let input;
    	let t0;
    	let span;
    	let raw_value = /*answer*/ ctx[7].html + "";
    	let t1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			input = element("input");
    			t0 = space();
    			span = element("span");
    			t1 = space();
    			attr_dev(input, "type", "checkbox");
    			input.__value = /*i*/ ctx[9];
    			input.value = input.__value;
    			attr_dev(input, "class", "svelte-ob4y2m");
    			/*$$binding_groups*/ ctx[5][0].push(input);
    			add_location(input, file$a, 9, 12, 227);
    			attr_dev(span, "class", "svelte-ob4y2m");
    			add_location(span, file$a, 14, 12, 369);
    			attr_dev(label, "class", "svelte-ob4y2m");
    			add_location(label, file$a, 8, 8, 207);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, input);
    			input.checked = ~/*current*/ ctx[1].selected.indexOf(input.__value);
    			append_dev(label, t0);
    			append_dev(label, span);
    			span.innerHTML = raw_value;
    			append_dev(label, t1);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*input_change_handler*/ ctx[4]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*current*/ 2) {
    				input.checked = ~/*current*/ ctx[1].selected.indexOf(input.__value);
    			}

    			if (dirty & /*current*/ 2 && raw_value !== (raw_value = /*answer*/ ctx[7].html + "")) span.innerHTML = raw_value;		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			/*$$binding_groups*/ ctx[5][0].splice(/*$$binding_groups*/ ctx[5][0].indexOf(input), 1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(8:4) {#each current.answers as answer, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*current*/ ctx[1].type === "MultipleChoice") return create_if_block$5;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let counter;
    	let current;

    	let $counter,
    		$$unsubscribe_counter = noop,
    		$$subscribe_counter = () => ($$unsubscribe_counter(), $$unsubscribe_counter = subscribe(counter, $$value => $$invalidate(3, $counter = $$value)), counter);

    	$$self.$$.on_destroy.push(() => $$unsubscribe_counter());
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ChoiceView", slots, []);
    	
    	let { quiz } = $$props;
    	const writable_props = ["quiz"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ChoiceView> was created with unknown prop '${key}'`);
    	});

    	const $$binding_groups = [[]];

    	function input_change_handler() {
    		current.selected = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
    		(($$invalidate(1, current), $$invalidate(2, quiz)), $$invalidate(3, $counter));
    	}

    	function input_change_handler_1() {
    		current.selected = this.__value;
    		(($$invalidate(1, current), $$invalidate(2, quiz)), $$invalidate(3, $counter));
    	}

    	$$self.$$set = $$props => {
    		if ("quiz" in $$props) $$invalidate(2, quiz = $$props.quiz);
    	};

    	$$self.$capture_state = () => ({ quiz, counter, current, $counter });

    	$$self.$inject_state = $$props => {
    		if ("quiz" in $$props) $$invalidate(2, quiz = $$props.quiz);
    		if ("counter" in $$props) $$subscribe_counter($$invalidate(0, counter = $$props.counter));
    		if ("current" in $$props) $$invalidate(1, current = $$props.current);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*quiz*/ 4) {
    			$$subscribe_counter($$invalidate(0, counter = quiz.counter));
    		}

    		if ($$self.$$.dirty & /*quiz, $counter*/ 12) {
    			$$invalidate(1, current = quiz.questions[$counter]);
    		}
    	};

    	return [
    		counter,
    		current,
    		quiz,
    		$counter,
    		input_change_handler,
    		$$binding_groups,
    		input_change_handler_1
    	];
    }

    class ChoiceView extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$b, create_fragment$b, safe_not_equal, { quiz: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ChoiceView",
    			options,
    			id: create_fragment$b.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*quiz*/ ctx[2] === undefined && !("quiz" in props)) {
    			console.warn("<ChoiceView> was created without expected prop 'quiz'");
    		}
    	}

    	get quiz() {
    		throw new Error("<ChoiceView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set quiz(value) {
    		throw new Error("<ChoiceView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\BlanksView.svelte generated by Svelte v3.37.0 */

    function create_fragment$a(ctx) {
    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("BlanksView", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<BlanksView> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class BlanksView extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BlanksView",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    function is_date(obj) {
        return Object.prototype.toString.call(obj) === '[object Date]';
    }

    function tick_spring(ctx, last_value, current_value, target_value) {
        if (typeof current_value === 'number' || is_date(current_value)) {
            // @ts-ignore
            const delta = target_value - current_value;
            // @ts-ignore
            const velocity = (current_value - last_value) / (ctx.dt || 1 / 60); // guard div by 0
            const spring = ctx.opts.stiffness * delta;
            const damper = ctx.opts.damping * velocity;
            const acceleration = (spring - damper) * ctx.inv_mass;
            const d = (velocity + acceleration) * ctx.dt;
            if (Math.abs(d) < ctx.opts.precision && Math.abs(delta) < ctx.opts.precision) {
                return target_value; // settled
            }
            else {
                ctx.settled = false; // signal loop to keep ticking
                // @ts-ignore
                return is_date(current_value) ?
                    new Date(current_value.getTime() + d) : current_value + d;
            }
        }
        else if (Array.isArray(current_value)) {
            // @ts-ignore
            return current_value.map((_, i) => tick_spring(ctx, last_value[i], current_value[i], target_value[i]));
        }
        else if (typeof current_value === 'object') {
            const next_value = {};
            for (const k in current_value) {
                // @ts-ignore
                next_value[k] = tick_spring(ctx, last_value[k], current_value[k], target_value[k]);
            }
            // @ts-ignore
            return next_value;
        }
        else {
            throw new Error(`Cannot spring ${typeof current_value} values`);
        }
    }
    function spring(value, opts = {}) {
        const store = writable(value);
        const { stiffness = 0.15, damping = 0.8, precision = 0.01 } = opts;
        let last_time;
        let task;
        let current_token;
        let last_value = value;
        let target_value = value;
        let inv_mass = 1;
        let inv_mass_recovery_rate = 0;
        let cancel_task = false;
        function set(new_value, opts = {}) {
            target_value = new_value;
            const token = current_token = {};
            if (value == null || opts.hard || (spring.stiffness >= 1 && spring.damping >= 1)) {
                cancel_task = true; // cancel any running animation
                last_time = now();
                last_value = new_value;
                store.set(value = target_value);
                return Promise.resolve();
            }
            else if (opts.soft) {
                const rate = opts.soft === true ? .5 : +opts.soft;
                inv_mass_recovery_rate = 1 / (rate * 60);
                inv_mass = 0; // infinite mass, unaffected by spring forces
            }
            if (!task) {
                last_time = now();
                cancel_task = false;
                task = loop(now => {
                    if (cancel_task) {
                        cancel_task = false;
                        task = null;
                        return false;
                    }
                    inv_mass = Math.min(inv_mass + inv_mass_recovery_rate, 1);
                    const ctx = {
                        inv_mass,
                        opts: spring,
                        settled: true,
                        dt: (now - last_time) * 60 / 1000
                    };
                    const next_value = tick_spring(ctx, last_value, value, target_value);
                    last_time = now;
                    last_value = value;
                    store.set(value = next_value);
                    if (ctx.settled) {
                        task = null;
                    }
                    return !ctx.settled;
                });
            }
            return new Promise(fulfil => {
                task.promise.then(() => {
                    if (token === current_token)
                        fulfil();
                });
            });
        }
        const spring = {
            set,
            update: (fn, opts) => set(fn(target_value, value), opts),
            subscribe: store.subscribe,
            stiffness,
            damping,
            precision
        };
        return spring;
    }

    function get_interpolator(a, b) {
        if (a === b || a !== a)
            return () => a;
        const type = typeof a;
        if (type !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
            throw new Error('Cannot interpolate values of different type');
        }
        if (Array.isArray(a)) {
            const arr = b.map((bi, i) => {
                return get_interpolator(a[i], bi);
            });
            return t => arr.map(fn => fn(t));
        }
        if (type === 'object') {
            if (!a || !b)
                throw new Error('Object cannot be null');
            if (is_date(a) && is_date(b)) {
                a = a.getTime();
                b = b.getTime();
                const delta = b - a;
                return t => new Date(a + t * delta);
            }
            const keys = Object.keys(b);
            const interpolators = {};
            keys.forEach(key => {
                interpolators[key] = get_interpolator(a[key], b[key]);
            });
            return t => {
                const result = {};
                keys.forEach(key => {
                    result[key] = interpolators[key](t);
                });
                return result;
            };
        }
        if (type === 'number') {
            const delta = b - a;
            return t => a + t * delta;
        }
        throw new Error(`Cannot interpolate ${type} values`);
    }
    function tweened(value, defaults = {}) {
        const store = writable(value);
        let task;
        let target_value = value;
        function set(new_value, opts) {
            if (value == null) {
                store.set(value = new_value);
                return Promise.resolve();
            }
            target_value = new_value;
            let previous_task = task;
            let started = false;
            let { delay = 0, duration = 400, easing = identity, interpolate = get_interpolator } = assign(assign({}, defaults), opts);
            if (duration === 0) {
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                store.set(value = target_value);
                return Promise.resolve();
            }
            const start = now() + delay;
            let fn;
            task = loop(now => {
                if (now < start)
                    return true;
                if (!started) {
                    fn = interpolate(value, new_value);
                    if (typeof duration === 'function')
                        duration = duration(value, new_value);
                    started = true;
                }
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                const elapsed = now - start;
                if (elapsed > duration) {
                    store.set(value = new_value);
                    return false;
                }
                // @ts-ignore
                store.set(value = fn(easing(elapsed / duration)));
                return true;
            });
            return task.promise;
        }
        return {
            set,
            update: (fn, opts) => set(fn(target_value, value), opts),
            subscribe: store.subscribe
        };
    }

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }
    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }
    function crossfade(_a) {
        var { fallback } = _a, defaults = __rest(_a, ["fallback"]);
        const to_receive = new Map();
        const to_send = new Map();
        function crossfade(from, node, params) {
            const { delay = 0, duration = d => Math.sqrt(d) * 30, easing = cubicOut } = assign(assign({}, defaults), params);
            const to = node.getBoundingClientRect();
            const dx = from.left - to.left;
            const dy = from.top - to.top;
            const dw = from.width / to.width;
            const dh = from.height / to.height;
            const d = Math.sqrt(dx * dx + dy * dy);
            const style = getComputedStyle(node);
            const transform = style.transform === 'none' ? '' : style.transform;
            const opacity = +style.opacity;
            return {
                delay,
                duration: is_function(duration) ? duration(d) : duration,
                easing,
                css: (t, u) => `
				opacity: ${t * opacity};
				transform-origin: top left;
				transform: ${transform} translate(${u * dx}px,${u * dy}px) scale(${t + (1 - t) * dw}, ${t + (1 - t) * dh});
			`
            };
        }
        function transition(items, counterparts, intro) {
            return (node, params) => {
                items.set(params.key, {
                    rect: node.getBoundingClientRect()
                });
                return () => {
                    if (counterparts.has(params.key)) {
                        const { rect } = counterparts.get(params.key);
                        counterparts.delete(params.key);
                        return crossfade(rect, node, params);
                    }
                    // if the node is disappearing altogether
                    // (i.e. wasn't claimed by the other list)
                    // then we need to supply an outro
                    items.delete(params.key);
                    return fallback && fallback(node, params, intro);
                };
            };
        }
        return [
            transition(to_send, to_receive, false),
            transition(to_receive, to_send, true)
        ];
    }

    // taken from https://svelte.dev/repl/7c9964de18604b2582ddd844cebdf218?version=3.15.0
    crossfade({
        duration: (d) => 600,
        easing: elasticOut,
        fallback(node, params) {
            const style = getComputedStyle(node);
            const transform = style.transform === 'none' ? '' : style.transform;
            return {
                duration: 600,
                easing: quintOut,
                css: (t) => `
        transform: ${transform} scale(${t});
        opacity: ${t}
      `,
            };
        },
    });
    let dropTarget;
    function draggable(node, params) {
        let lastX;
        let lastY;
        let startRect;
        let offsetX = 0;
        let offsetY = 0;
        const offset = spring({ x: offsetX, y: offsetY }, {
            stiffness: 0.2,
            damping: 0.4,
        });
        offset.subscribe((offset) => {
            node.style.left = offset.x + 'px';
            node.style.top = offset.y + 'px';
        });
        node.addEventListener('mousedown', handleMousedown);
        function handleMousedown(event) {
            event.preventDefault();
            lastX = event.clientX;
            lastY = event.clientY;
            if (!startRect)
                startRect = node.getBoundingClientRect();
            node.classList.add('dragged');
            node.dispatchEvent(new CustomEvent('dragstart', {
                detail: { lastX, lastY },
            }));
            window.addEventListener('mousemove', handleMousemove);
            window.addEventListener('mouseup', handleMouseup);
        }
        function handleMousemove(event) {
            const dx = event.clientX - lastX;
            const dy = event.clientY - lastY;
            offsetX += dx;
            offsetY += dy;
            lastX = event.clientX;
            lastY = event.clientY;
            const rect = node.getBoundingClientRect();
            const midX = rect.x + rect.width / 2;
            const midY = rect.y + rect.height / 2;
            if (dropTarget)
                dropTarget.classList.remove('droptarget');
            dropTarget = null;
            const candidate = document.elementFromPoint(midX, midY);
            params.targets.map((t) => {
                if (candidate !== null && candidate.matches(t))
                    dropTarget = candidate;
            });
            if (dropTarget)
                dropTarget.classList.add('droptarget');
            offset.set({ x: offsetX + dx, y: offsetY });
            node.dispatchEvent(new CustomEvent('drag', {
                detail: { lastX, lastY, dx, dy },
            }));
        }
        function handleMouseup(event) {
            if (dropTarget) {
                dropTarget.classList.remove('droptarget');
                const targetRect = dropTarget.getBoundingClientRect();
                offsetX = targetRect.x - startRect.x;
                offsetY = targetRect.y - startRect.y;
            }
            else {
                offsetX = 0;
                offsetY = 0;
            }
            node.classList.remove('dragged');
            lastX = event.clientX;
            lastY = event.clientY;
            offset.set({ x: offsetX, y: offsetY });
            node.dispatchEvent(new CustomEvent('dragend', {
                detail: { dropTarget, lastX, lastY },
            }));
            if (dropTarget) {
                dropTarget.dispatchEvent(new CustomEvent('dropped', {
                    detail: params.data,
                }));
            }
            dropTarget = null;
            window.removeEventListener('mousemove', handleMousemove);
            window.removeEventListener('mouseup', handleMouseup);
        }
        return {
            destroy() {
                node.removeEventListener('mousedown', handleMousedown);
            },
        };
    }

    /* src\components\PairsView.svelte generated by Svelte v3.37.0 */
    const file$9 = "src\\components\\PairsView.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	child_ctx[12] = i;
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	return child_ctx;
    }

    // (41:12) {#if item}
    function create_if_block$4(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let current;
    	let each_value_1 = [/*item*/ ctx[10]];
    	validate_each_argument(each_value_1);
    	const get_key = ctx => /*item*/ ctx[10].key;
    	validate_each_keys(ctx, each_value_1, get_each_context_1$1, get_key);

    	for (let i = 0; i < 1; i += 1) {
    		let child_ctx = get_each_context_1$1(ctx, each_value_1, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block_1$1(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < 1; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < 1; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*shelf, putInShelf*/ 5) {
    				each_value_1 = [/*item*/ ctx[10]];
    				validate_each_argument(each_value_1);
    				group_outros();
    				for (let i = 0; i < 1; i += 1) each_blocks[i].r();
    				validate_each_keys(ctx, each_value_1, get_each_context_1$1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_1, each_1_lookup, each_1_anchor.parentNode, fix_and_outro_and_destroy_block, create_each_block_1$1, each_1_anchor, get_each_context_1$1);
    				for (let i = 0; i < 1; i += 1) each_blocks[i].a();
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < 1; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 1; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			for (let i = 0; i < 1; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(41:12) {#if item}",
    		ctx
    	});

    	return block;
    }

    // (42:16) {#each [item] as item (item.key)}
    function create_each_block_1$1(key_1, ctx) {
    	let span;
    	let t0_value = /*item*/ ctx[10].name + "";
    	let t0;
    	let t1;
    	let draggable_action;
    	let span_intro;
    	let span_outro;
    	let rect;
    	let stop_animation = noop;
    	let current;
    	let mounted;
    	let dispose;

    	function drop_handler(...args) {
    		return /*drop_handler*/ ctx[7](/*index*/ ctx[12], ...args);
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(span, "class", "item svelte-1jbowbm");
    			add_location(span, file$9, 42, 20, 1299);
    			this.first = span;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			append_dev(span, t1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(draggable_action = draggable.call(null, span, {
    						data: /*item*/ ctx[10],
    						targets: [".slot", ".slot .item"]
    					})),
    					listen_dev(span, "drop", drop_handler, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty & /*shelf*/ 1) && t0_value !== (t0_value = /*item*/ ctx[10].name + "")) set_data_dev(t0, t0_value);

    			if (draggable_action && is_function(draggable_action.update) && dirty & /*shelf*/ 1) draggable_action.update.call(null, {
    				data: /*item*/ ctx[10],
    				targets: [".slot", ".slot .item"]
    			});
    		},
    		r: function measure() {
    			rect = span.getBoundingClientRect();
    		},
    		f: function fix() {
    			fix_position(span);
    			stop_animation();
    			add_transform(span, rect);
    		},
    		a: function animate() {
    			stop_animation();
    			stop_animation = create_animation(span, rect, flip, {});
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (span_outro) span_outro.end(1);
    				if (!span_intro) span_intro = create_in_transition(span, /*receive*/ ctx[4], /*item*/ ctx[10]);
    				span_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (span_intro) span_intro.invalidate();
    			span_outro = create_out_transition(span, /*send*/ ctx[3], /*item*/ ctx[10]);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (detaching && span_outro) span_outro.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(42:16) {#each [item] as item (item.key)}",
    		ctx
    	});

    	return block;
    }

    // (39:4) {#each shelf as item, index}
    function create_each_block$1(ctx) {
    	let span;
    	let t;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*item*/ ctx[10] && create_if_block$4(ctx);

    	function drop_handler_1(...args) {
    		return /*drop_handler_1*/ ctx[8](/*index*/ ctx[12], ...args);
    	}

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (if_block) if_block.c();
    			t = space();
    			attr_dev(span, "class", "slot svelte-1jbowbm");
    			add_location(span, file$9, 39, 8, 1139);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			if (if_block) if_block.m(span, null);
    			append_dev(span, t);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(span, "drop", drop_handler_1, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (/*item*/ ctx[10]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*shelf*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(span, t);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(39:4) {#each shelf as item, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div;
    	let current;
    	let each_value = /*shelf*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "shelf");
    			add_location(div, file$9, 37, 0, 1078);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*putInShelf, shelf*/ 5) {
    				each_value = /*shelf*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
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
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let counter;
    	let current;

    	let $counter,
    		$$unsubscribe_counter = noop,
    		$$subscribe_counter = () => ($$unsubscribe_counter(), $$unsubscribe_counter = subscribe(counter, $$value => $$invalidate(6, $counter = $$value)), counter);

    	$$self.$$.on_destroy.push(() => $$unsubscribe_counter());
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("PairsView", slots, []);
    	
    	let { quiz } = $$props;
    	const shelf = current.answers.map(answer => ({ key: answer.id, name: answer.html }));

    	function putInShelf(item, index) {
    		const oldItem = shelf[index];
    		const oldShelfIndex = shelf.indexOf(item);
    		if (oldShelfIndex !== -1) $$invalidate(0, shelf[oldShelfIndex] = oldItem, shelf);
    		$$invalidate(0, shelf[index] = item, shelf);
    	}

    	const [send, receive] = crossfade({
    		duration: d => Math.sqrt(d * 500),
    		easing: elasticOut,
    		fallback(node, params) {
    			const style = getComputedStyle(node);
    			const transform = style.transform === "none" ? "" : style.transform;

    			return {
    				duration: 600,
    				easing: quintOut,
    				css: t => `
			transform: ${transform} scale(${t});
			opacity: ${t}
		  `
    			};
    		}
    	});

    	const writable_props = ["quiz"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<PairsView> was created with unknown prop '${key}'`);
    	});

    	const drop_handler = (index, e) => putInShelf(e.detail, index);
    	const drop_handler_1 = (index, e) => putInShelf(e.detail, index);

    	$$self.$$set = $$props => {
    		if ("quiz" in $$props) $$invalidate(5, quiz = $$props.quiz);
    	};

    	$$self.$capture_state = () => ({
    		draggable,
    		crossfade,
    		quintOut,
    		elasticOut,
    		flip,
    		quiz,
    		shelf,
    		putInShelf,
    		send,
    		receive,
    		counter,
    		current,
    		$counter
    	});

    	$$self.$inject_state = $$props => {
    		if ("quiz" in $$props) $$invalidate(5, quiz = $$props.quiz);
    		if ("counter" in $$props) $$subscribe_counter($$invalidate(1, counter = $$props.counter));
    		if ("current" in $$props) current = $$props.current;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*quiz*/ 32) {
    			$$subscribe_counter($$invalidate(1, counter = quiz.counter));
    		}

    		if ($$self.$$.dirty & /*quiz, $counter*/ 96) {
    			current = quiz.questions[$counter];
    		}
    	};

    	return [
    		shelf,
    		counter,
    		putInShelf,
    		send,
    		receive,
    		quiz,
    		$counter,
    		drop_handler,
    		drop_handler_1
    	];
    }

    class PairsView extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$9, create_fragment$9, safe_not_equal, { quiz: 5 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PairsView",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*quiz*/ ctx[5] === undefined && !("quiz" in props)) {
    			console.warn("<PairsView> was created without expected prop 'quiz'");
    		}
    	}

    	get quiz() {
    		throw new Error("<PairsView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set quiz(value) {
    		throw new Error("<PairsView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\slots\Headline.svelte generated by Svelte v3.37.0 */
    const file$8 = "src\\slots\\Headline.svelte";

    function create_fragment$8(ctx) {
    	let div;
    	let span;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			if (default_slot) default_slot.c();
    			attr_dev(span, "class", "quizdown-headline-content");
    			add_location(span, file$8, 19, 4, 530);
    			attr_dev(div, "class", "quizdown-headline svelte-19y5m2p");
    			add_location(div, file$8, 18, 0, 473);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);

    			if (default_slot) {
    				default_slot.m(span, null);
    			}

    			/*span_binding*/ ctx[4](span);
    			/*div_binding*/ ctx[5](div);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 4) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[2], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*span_binding*/ ctx[4](null);
    			/*div_binding*/ ctx[5](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Headline", slots, ['default']);
    	let child;
    	let parent;

    	// dynamically adjust the fontsize to fit the maximum height
    	afterUpdate(() => {
    		let size = 2;
    		let h = parent.offsetHeight;
    		let texth;
    		let ops_left = 1000;

    		do {
    			$$invalidate(0, child.style.fontSize = size.toString() + "em", child);
    			texth = child.offsetHeight;
    			size -= 0.01;
    			ops_left -= 1;
    		} while (texth > h - 10 && ops_left > 0);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Headline> was created with unknown prop '${key}'`);
    	});

    	function span_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			child = $$value;
    			$$invalidate(0, child);
    		});
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			parent = $$value;
    			$$invalidate(1, parent);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ afterUpdate, child, parent });

    	$$self.$inject_state = $$props => {
    		if ("child" in $$props) $$invalidate(0, child = $$props.child);
    		if ("parent" in $$props) $$invalidate(1, parent = $$props.parent);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [child, parent, $$scope, slots, span_binding, div_binding];
    }

    class Headline extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Headline",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src\components\ResultView.svelte generated by Svelte v3.37.0 */

    const file$7 = "src\\components\\ResultView.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	child_ctx[7] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	child_ctx[10] = i;
    	return child_ctx;
    }

    // (26:91) 
    function create_if_block_2$1(ctx) {
    	let li;
    	let b;
    	let raw0_value = /*question*/ ctx[5].answers[/*question*/ ctx[5].selected].html + "";
    	let br;
    	let html_tag;
    	let raw1_value = /*question*/ ctx[5].answers[/*question*/ ctx[5].selected].comment + "";

    	const block = {
    		c: function create() {
    			li = element("li");
    			b = element("b");
    			br = element("br");
    			add_location(b, file$7, 26, 30, 894);
    			add_location(br, file$7, 26, 85, 949);
    			html_tag = new HtmlTag(null);
    			attr_dev(li, "class", "list-comment svelte-7r3rz");
    			add_location(li, file$7, 26, 5, 869);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, b);
    			b.innerHTML = raw0_value;
    			append_dev(li, br);
    			html_tag.m(raw1_value, li);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*quiz*/ 1 && raw0_value !== (raw0_value = /*question*/ ctx[5].answers[/*question*/ ctx[5].selected].html + "")) b.innerHTML = raw0_value;			if (dirty & /*quiz*/ 1 && raw1_value !== (raw1_value = /*question*/ ctx[5].answers[/*question*/ ctx[5].selected].comment + "")) html_tag.p(raw1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(26:91) ",
    		ctx
    	});

    	return block;
    }

    // (20:4) {#if question.selected instanceof Array}
    function create_if_block$3(ctx) {
    	let each_1_anchor;
    	let each_value_1 = /*question*/ ctx[5].selected;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*quiz*/ 1) {
    				each_value_1 = /*question*/ ctx[5].selected;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(20:4) {#if question.selected instanceof Array}",
    		ctx
    	});

    	return block;
    }

    // (22:6) {#if question.answers[selected].comment}
    function create_if_block_1$2(ctx) {
    	let li;
    	let b;
    	let raw0_value = /*question*/ ctx[5].answers[/*selected*/ ctx[8]].html + "";
    	let br;
    	let html_tag;
    	let raw1_value = /*question*/ ctx[5].answers[/*selected*/ ctx[8]].comment + "";

    	const block = {
    		c: function create() {
    			li = element("li");
    			b = element("b");
    			br = element("br");
    			add_location(b, file$7, 22, 32, 647);
    			add_location(br, file$7, 22, 78, 693);
    			html_tag = new HtmlTag(null);
    			attr_dev(li, "class", "list-comment svelte-7r3rz");
    			add_location(li, file$7, 22, 7, 622);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, b);
    			b.innerHTML = raw0_value;
    			append_dev(li, br);
    			html_tag.m(raw1_value, li);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*quiz*/ 1 && raw0_value !== (raw0_value = /*question*/ ctx[5].answers[/*selected*/ ctx[8]].html + "")) b.innerHTML = raw0_value;			if (dirty & /*quiz*/ 1 && raw1_value !== (raw1_value = /*question*/ ctx[5].answers[/*selected*/ ctx[8]].comment + "")) html_tag.p(raw1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(22:6) {#if question.answers[selected].comment}",
    		ctx
    	});

    	return block;
    }

    // (21:5) {#each question.selected as selected, k}
    function create_each_block_1(ctx) {
    	let if_block_anchor;
    	let if_block = /*question*/ ctx[5].answers[/*selected*/ ctx[8]].comment && create_if_block_1$2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*question*/ ctx[5].answers[/*selected*/ ctx[8]].comment) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$2(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(21:5) {#each question.selected as selected, k}",
    		ctx
    	});

    	return block;
    }

    // (17:1) {#each quiz.questions as question, i}
    function create_each_block(ctx) {
    	let li;
    	let t0_value = /*emojis*/ ctx[1][+/*question*/ ctx[5].solved] + "";
    	let t0;
    	let t1;
    	let html_tag;
    	let raw_value = /*question*/ ctx[5].text + "";
    	let t2;
    	let ol;
    	let t3;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*question*/ ctx[5].selected instanceof Array) return create_if_block$3;
    		if (/*question*/ ctx[5].selected != null && /*question*/ ctx[5].answers[/*question*/ ctx[5].selected].comment) return create_if_block_2$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	function click_handler() {
    		return /*click_handler*/ ctx[3](/*i*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text(t0_value);
    			t1 = space();
    			t2 = space();
    			ol = element("ol");
    			if (if_block) if_block.c();
    			t3 = space();
    			html_tag = new HtmlTag(t2);
    			add_location(ol, file$7, 18, 3, 472);
    			attr_dev(li, "class", "svelte-7r3rz");
    			add_location(li, file$7, 17, 2, 393);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    			html_tag.m(raw_value, li);
    			append_dev(li, t2);
    			append_dev(li, ol);
    			if (if_block) if_block.m(ol, null);
    			append_dev(li, t3);

    			if (!mounted) {
    				dispose = listen_dev(li, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*quiz*/ 1 && t0_value !== (t0_value = /*emojis*/ ctx[1][+/*question*/ ctx[5].solved] + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*quiz*/ 1 && raw_value !== (raw_value = /*question*/ ctx[5].text + "")) html_tag.p(raw_value);

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(ol, null);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);

    			if (if_block) {
    				if_block.d();
    			}

    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(17:1) {#each quiz.questions as question, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let p;
    	let t0;
    	let b;
    	let t1_value = /*quiz*/ ctx[0].points + "";
    	let t1;
    	let t2;
    	let t3_value = /*quiz*/ ctx[0].counter.max + "";
    	let t3;
    	let t4;
    	let t5;
    	let ul;
    	let each_value = /*quiz*/ ctx[0].questions;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("Sie haben ");
    			b = element("b");
    			t1 = text(t1_value);
    			t2 = text(" aus ");
    			t3 = text(t3_value);
    			t4 = text(" Fragen richtig beantwortet!\n     Sie können auf einen Fragentitel klicken, um zurückzuspringen.");
    			t5 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(b, file$7, 11, 15, 199);
    			add_location(p, file$7, 10, 0, 180);
    			add_location(ul, file$7, 15, 0, 347);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, b);
    			append_dev(b, t1);
    			append_dev(b, t2);
    			append_dev(b, t3);
    			append_dev(p, t4);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*quiz*/ 1 && t1_value !== (t1_value = /*quiz*/ ctx[0].points + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*quiz*/ 1 && t3_value !== (t3_value = /*quiz*/ ctx[0].counter.max + "")) set_data_dev(t3, t3_value);

    			if (dirty & /*jump, quiz, Array, emojis*/ 7) {
    				each_value = /*quiz*/ ctx[0].questions;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
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
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let counter;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ResultView", slots, []);
    	
    	let { quiz } = $$props;
    	let emojis = ["❌", "✅"];

    	function jump(i) {
    		quiz.finished.set(false);
    		counter.jump(i);
    	}

    	const writable_props = ["quiz"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ResultView> was created with unknown prop '${key}'`);
    	});

    	const click_handler = i => jump(i);

    	$$self.$$set = $$props => {
    		if ("quiz" in $$props) $$invalidate(0, quiz = $$props.quiz);
    	};

    	$$self.$capture_state = () => ({ quiz, emojis, jump, counter });

    	$$self.$inject_state = $$props => {
    		if ("quiz" in $$props) $$invalidate(0, quiz = $$props.quiz);
    		if ("emojis" in $$props) $$invalidate(1, emojis = $$props.emojis);
    		if ("counter" in $$props) counter = $$props.counter;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*quiz*/ 1) {
    			counter = quiz.counter;
    		}
    	};

    	return [quiz, emojis, jump, click_handler];
    }

    class ResultView extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$7, create_fragment$7, safe_not_equal, { quiz: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ResultView",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*quiz*/ ctx[0] === undefined && !("quiz" in props)) {
    			console.warn("<ResultView> was created without expected prop 'quiz'");
    		}
    	}

    	get quiz() {
    		throw new Error("<ResultView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set quiz(value) {
    		throw new Error("<ResultView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\slots\Gallery.svelte generated by Svelte v3.37.0 */
    const file$6 = "src\\slots\\Gallery.svelte";

    // (7:4) {#key key}
    function create_key_block(ctx) {
    	let div;
    	let div_intro;
    	let div_outro;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "gallery-item svelte-106dxur");
    			add_location(div, file$6, 7, 8, 168);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 2) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[1], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);

    			add_render_callback(() => {
    				if (div_outro) div_outro.end(1);
    				if (!div_intro) div_intro = create_in_transition(div, fade, { duration: 300, delay: 300 });
    				div_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			if (div_intro) div_intro.invalidate();
    			div_outro = create_out_transition(div, fade, { duration: 300 });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching && div_outro) div_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_key_block.name,
    		type: "key",
    		source: "(7:4) {#key key}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div;
    	let previous_key = /*key*/ ctx[0];
    	let current;
    	let key_block = create_key_block(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			key_block.c();
    			attr_dev(div, "class", "gallery-wrapper svelte-106dxur");
    			add_location(div, file$6, 5, 0, 115);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			key_block.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*key*/ 1 && safe_not_equal(previous_key, previous_key = /*key*/ ctx[0])) {
    				group_outros();
    				transition_out(key_block, 1, 1, noop);
    				check_outros();
    				key_block = create_key_block(ctx);
    				key_block.c();
    				transition_in(key_block);
    				key_block.m(div, null);
    			} else {
    				key_block.p(ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(key_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(key_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			key_block.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Gallery", slots, ['default']);
    	let direction = -1;
    	let { key } = $$props;
    	const writable_props = ["key"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Gallery> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("key" in $$props) $$invalidate(0, key = $$props.key);
    		if ("$$scope" in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ fly, fade, direction, key });

    	$$self.$inject_state = $$props => {
    		if ("direction" in $$props) direction = $$props.direction;
    		if ("key" in $$props) $$invalidate(0, key = $$props.key);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [key, $$scope, slots];
    }

    class Gallery extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$6, create_fragment$6, safe_not_equal, { key: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Gallery",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*key*/ ctx[0] === undefined && !("key" in props)) {
    			console.warn("<Gallery> was created without expected prop 'key'");
    		}
    	}

    	get key() {
    		throw new Error("<Gallery>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set key(value) {
    		throw new Error("<Gallery>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\QuizSection.svelte generated by Svelte v3.37.0 */
    const file$5 = "src\\components\\QuizSection.svelte";

    // (27:0) {:else}
    function create_else_block$1(ctx) {
    	let headline;
    	let t0;
    	let t1;
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	headline = new Headline({
    			props: {
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block = /*current*/ ctx[2].explanation !== null && /*current*/ ctx[2].explanation !== "" && create_if_block_1$1(ctx);
    	var switch_value = /*views*/ ctx[5][/*current*/ ctx[2].type];

    	function switch_props(ctx) {
    		return {
    			props: { quiz: /*quiz*/ ctx[0] },
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			create_component(headline.$$.fragment);
    			t0 = space();
    			if (if_block) if_block.c();
    			t1 = space();
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			mount_component(headline, target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t1, anchor);

    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const headline_changes = {};

    			if (dirty & /*$$scope, current*/ 132) {
    				headline_changes.$$scope = { dirty, ctx };
    			}

    			headline.$set(headline_changes);

    			if (/*current*/ ctx[2].explanation !== null && /*current*/ ctx[2].explanation !== "") {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$1(ctx);
    					if_block.c();
    					if_block.m(t1.parentNode, t1);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			const switch_instance_changes = {};
    			if (dirty & /*quiz*/ 1) switch_instance_changes.quiz = /*quiz*/ ctx[0];

    			if (switch_value !== (switch_value = /*views*/ ctx[5][/*current*/ ctx[2].type])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(headline.$$.fragment, local);
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(headline.$$.fragment, local);
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(headline, detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(27:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (23:0) {#if $finished}
    function create_if_block$2(ctx) {
    	let headline;
    	let t;
    	let resultview;
    	let current;

    	headline = new Headline({
    			props: {
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	resultview = new ResultView({
    			props: { quiz: /*quiz*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(headline.$$.fragment);
    			t = space();
    			create_component(resultview.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(headline, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(resultview, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const headline_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				headline_changes.$$scope = { dirty, ctx };
    			}

    			headline.$set(headline_changes);
    			const resultview_changes = {};
    			if (dirty & /*quiz*/ 1) resultview_changes.quiz = /*quiz*/ ctx[0];
    			resultview.$set(resultview_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(headline.$$.fragment, local);
    			transition_in(resultview.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(headline.$$.fragment, local);
    			transition_out(resultview.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(headline, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(resultview, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(23:0) {#if $finished}",
    		ctx
    	});

    	return block;
    }

    // (29:4) <Headline>
    function create_default_slot_1$1(ctx) {
    	let html_tag;
    	let raw_value = /*current*/ ctx[2].text + "";
    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_anchor = empty();
    			html_tag = new HtmlTag(html_anchor);
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(raw_value, target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*current*/ 4 && raw_value !== (raw_value = /*current*/ ctx[2].text + "")) html_tag.p(raw_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(29:4) <Headline>",
    		ctx
    	});

    	return block;
    }

    // (30:4) {#if current.explanation !== null && current.explanation !== ''}
    function create_if_block_1$1(ctx) {
    	let p;
    	let raw_value = /*current*/ ctx[2].explanation + "";

    	const block = {
    		c: function create() {
    			p = element("p");
    			attr_dev(p, "class", "quizdown-explanation");
    			add_location(p, file$5, 30, 8, 944);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			p.innerHTML = raw_value;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*current*/ 4 && raw_value !== (raw_value = /*current*/ ctx[2].explanation + "")) p.innerHTML = raw_value;		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(30:4) {#if current.explanation !== null && current.explanation !== ''}",
    		ctx
    	});

    	return block;
    }

    // (25:4) <Headline>
    function create_default_slot$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Ihr Quiz Ergebnis");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(25:4) <Headline>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$2, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$finished*/ ctx[4]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let counter;
    	let current;
    	let finished;

    	let $counter,
    		$$unsubscribe_counter = noop,
    		$$subscribe_counter = () => ($$unsubscribe_counter(), $$unsubscribe_counter = subscribe(counter, $$value => $$invalidate(6, $counter = $$value)), counter);

    	let $finished,
    		$$unsubscribe_finished = noop,
    		$$subscribe_finished = () => ($$unsubscribe_finished(), $$unsubscribe_finished = subscribe(finished, $$value => $$invalidate(4, $finished = $$value)), finished);

    	$$self.$$.on_destroy.push(() => $$unsubscribe_counter());
    	$$self.$$.on_destroy.push(() => $$unsubscribe_finished());
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("QuizSection", slots, []);
    	
    	let { quiz } = $$props;

    	const views = {
    		MultipleChoice: ChoiceView,
    		SingleChoice: ChoiceView,
    		Sequence: SequenceView,
    		Gaps: BlanksView,
    		Pairs: PairsView
    	};

    	const writable_props = ["quiz"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<QuizSection> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("quiz" in $$props) $$invalidate(0, quiz = $$props.quiz);
    	};

    	$$self.$capture_state = () => ({
    		SequenceView,
    		ChoiceView,
    		BlanksView,
    		PairsView,
    		Headline,
    		ResultView,
    		Gallery,
    		quiz,
    		views,
    		counter,
    		current,
    		$counter,
    		finished,
    		$finished
    	});

    	$$self.$inject_state = $$props => {
    		if ("quiz" in $$props) $$invalidate(0, quiz = $$props.quiz);
    		if ("counter" in $$props) $$subscribe_counter($$invalidate(1, counter = $$props.counter));
    		if ("current" in $$props) $$invalidate(2, current = $$props.current);
    		if ("finished" in $$props) $$subscribe_finished($$invalidate(3, finished = $$props.finished));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*quiz*/ 1) {
    			$$subscribe_counter($$invalidate(1, counter = quiz.counter));
    		}

    		if ($$self.$$.dirty & /*quiz, $counter*/ 65) {
    			$$invalidate(2, current = quiz.questions[$counter]);
    		}

    		if ($$self.$$.dirty & /*quiz*/ 1) {
    			$$subscribe_finished($$invalidate(3, finished = quiz.finished));
    		}
    	};

    	return [quiz, counter, current, finished, $finished, views, $counter];
    }

    class QuizSection extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$5, create_fragment$5, safe_not_equal, { quiz: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "QuizSection",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*quiz*/ ctx[0] === undefined && !("quiz" in props)) {
    			console.warn("<QuizSection> was created without expected prop 'quiz'");
    		}
    	}

    	get quiz() {
    		throw new Error("<QuizSection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set quiz(value) {
    		throw new Error("<QuizSection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Button.svelte generated by Svelte v3.37.0 */

    const file$4 = "src\\components\\Button.svelte";

    // (6:10) Hello World
    function fallback_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Hello World");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(6:10) Hello World",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let button;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);
    	const default_slot_or_fallback = default_slot || fallback_block(ctx);

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			button.disabled = /*disabled*/ ctx[1];
    			attr_dev(button, "class", "svelte-9twfad");
    			add_location(button, file$4, 4, 0, 131);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(button, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*buttonAction*/ ctx[0])) /*buttonAction*/ ctx[0].apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 4) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[2], dirty, null, null);
    				}
    			}

    			if (!current || dirty & /*disabled*/ 2) {
    				prop_dev(button, "disabled", /*disabled*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			mounted = false;
    			dispose();
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

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Button", slots, ['default']);
    	let { buttonAction = () => alert("Life has never Svelte better") } = $$props;
    	let { disabled = false } = $$props;
    	const writable_props = ["buttonAction", "disabled"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Button> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("buttonAction" in $$props) $$invalidate(0, buttonAction = $$props.buttonAction);
    		if ("disabled" in $$props) $$invalidate(1, disabled = $$props.disabled);
    		if ("$$scope" in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ buttonAction, disabled });

    	$$self.$inject_state = $$props => {
    		if ("buttonAction" in $$props) $$invalidate(0, buttonAction = $$props.buttonAction);
    		if ("disabled" in $$props) $$invalidate(1, disabled = $$props.disabled);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [buttonAction, disabled, $$scope, slots];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$4, create_fragment$4, safe_not_equal, { buttonAction: 0, disabled: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get buttonAction() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set buttonAction(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\slots\SpeechBubble.svelte generated by Svelte v3.37.0 */

    const file$3 = "src\\slots\\SpeechBubble.svelte";

    function create_fragment$3(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "quizdown-bubble svelte-kuoqm7");
    			add_location(div, file$3, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 1) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[0], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
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
    	validate_slots("SpeechBubble", slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SpeechBubble> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class SpeechBubble extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SpeechBubble",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\components\Footer.svelte generated by Svelte v3.37.0 */
    const file$2 = "src\\components\\Footer.svelte";

    // (37:4) {:else}
    function create_else_block_1(ctx) {
    	let button;
    	let current;

    	button = new Button({
    			props: {
    				buttonAction: /*quiz*/ ctx[0].reset,
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(button.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_changes = {};
    			if (dirty & /*quiz*/ 1) button_changes.buttonAction = /*quiz*/ ctx[0].reset;

    			if (dirty & /*$$scope*/ 256) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(37:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (17:4) {#if !$finished}
    function create_if_block$1(ctx) {
    	let button0;
    	let t0;
    	let span;
    	let button1;
    	let t1;
    	let t2;
    	let current_block_type_index;
    	let if_block1;
    	let if_block1_anchor;
    	let current;

    	button0 = new Button({
    			props: {
    				disabled: /*$counter*/ ctx[1] === 0,
    				buttonAction: /*quiz*/ ctx[0].previous,
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1 = new Button({
    			props: {
    				disabled: /*current*/ ctx[5].hint === null || /*current*/ ctx[5].hint === "",
    				buttonAction: /*func*/ ctx[7],
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block0 = /*show_hint*/ ctx[2] && create_if_block_2(ctx);
    	const if_block_creators = [create_if_block_1, create_else_block];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*$counter*/ ctx[1] === /*counter*/ ctx[3].max - 1) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			create_component(button0.$$.fragment);
    			t0 = space();
    			span = element("span");
    			create_component(button1.$$.fragment);
    			t1 = space();
    			if (if_block0) if_block0.c();
    			t2 = space();
    			if_block1.c();
    			if_block1_anchor = empty();
    			add_location(span, file$2, 22, 8, 636);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button0, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, span, anchor);
    			mount_component(button1, span, null);
    			append_dev(span, t1);
    			if (if_block0) if_block0.m(span, null);
    			insert_dev(target, t2, anchor);
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button0_changes = {};
    			if (dirty & /*$counter*/ 2) button0_changes.disabled = /*$counter*/ ctx[1] === 0;
    			if (dirty & /*quiz*/ 1) button0_changes.buttonAction = /*quiz*/ ctx[0].previous;

    			if (dirty & /*$$scope*/ 256) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};
    			if (dirty & /*current*/ 32) button1_changes.disabled = /*current*/ ctx[5].hint === null || /*current*/ ctx[5].hint === "";
    			if (dirty & /*show_hint*/ 4) button1_changes.buttonAction = /*func*/ ctx[7];

    			if (dirty & /*$$scope*/ 256) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);

    			if (/*show_hint*/ ctx[2]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*show_hint*/ 4) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_2(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(span, null);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block1 = if_blocks[current_block_type_index];

    				if (!if_block1) {
    					if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block1.c();
    				} else {
    					if_block1.p(ctx, dirty);
    				}

    				transition_in(if_block1, 1);
    				if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button0, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(span);
    			destroy_component(button1);
    			if (if_block0) if_block0.d();
    			if (detaching) detach_dev(t2);
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(17:4) {#if !$finished}",
    		ctx
    	});

    	return block;
    }

    // (39:8) <Button buttonAction="{quiz.reset}">
    function create_default_slot_5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Quiz neu starten!");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(39:8) <Button buttonAction=\\\"{quiz.reset}\\\">",
    		ctx
    	});

    	return block;
    }

    // (19:8) <Button disabled="{$counter === 0}" buttonAction="{quiz.previous}"             >
    function create_default_slot_4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Zurück");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(19:8) <Button disabled=\\\"{$counter === 0}\\\" buttonAction=\\\"{quiz.previous}\\\"             >",
    		ctx
    	});

    	return block;
    }

    // (24:12) <Button                 disabled="{current.hint === null || current.hint === ''}"                 buttonAction="{() => (show_hint = !show_hint)}">
    function create_default_slot_3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Hilfe!");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(24:12) <Button                 disabled=\\\"{current.hint === null || current.hint === ''}\\\"                 buttonAction=\\\"{() => (show_hint = !show_hint)}\\\">",
    		ctx
    	});

    	return block;
    }

    // (28:12) {#if show_hint}
    function create_if_block_2(ctx) {
    	let speechbubble;
    	let current;

    	speechbubble = new SpeechBubble({
    			props: {
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(speechbubble.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(speechbubble, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const speechbubble_changes = {};

    			if (dirty & /*$$scope, current*/ 288) {
    				speechbubble_changes.$$scope = { dirty, ctx };
    			}

    			speechbubble.$set(speechbubble_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(speechbubble.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(speechbubble.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(speechbubble, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(28:12) {#if show_hint}",
    		ctx
    	});

    	return block;
    }

    // (28:27) <SpeechBubble>
    function create_default_slot_2(ctx) {
    	let html_tag;
    	let raw_value = /*current*/ ctx[5].hint + "";
    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_anchor = empty();
    			html_tag = new HtmlTag(html_anchor);
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(raw_value, target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*current*/ 32 && raw_value !== (raw_value = /*current*/ ctx[5].hint + "")) html_tag.p(raw_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(28:27) <SpeechBubble>",
    		ctx
    	});

    	return block;
    }

    // (34:8) {:else}
    function create_else_block(ctx) {
    	let button;
    	let current;

    	button = new Button({
    			props: {
    				buttonAction: /*quiz*/ ctx[0].next,
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(button.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_changes = {};
    			if (dirty & /*quiz*/ 1) button_changes.buttonAction = /*quiz*/ ctx[0].next;

    			if (dirty & /*$$scope*/ 256) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(34:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (32:8) {#if $counter === counter.max - 1}
    function create_if_block_1(ctx) {
    	let button;
    	let current;

    	button = new Button({
    			props: {
    				buttonAction: /*quiz*/ ctx[0].calc_points,
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(button.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_changes = {};
    			if (dirty & /*quiz*/ 1) button_changes.buttonAction = /*quiz*/ ctx[0].calc_points;

    			if (dirty & /*$$scope*/ 256) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(32:8) {#if $counter === counter.max - 1}",
    		ctx
    	});

    	return block;
    }

    // (35:12) <Button buttonAction="{quiz.next}">
    function create_default_slot_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Weiter");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(35:12) <Button buttonAction=\\\"{quiz.next}\\\">",
    		ctx
    	});

    	return block;
    }

    // (33:12) <Button buttonAction="{quiz.calc_points}">
    function create_default_slot(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Außwertung");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(33:12) <Button buttonAction=\\\"{quiz.calc_points}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div0;
    	let current_block_type_index;
    	let if_block;
    	let t0;
    	let hr;
    	let t1;
    	let div1;
    	let t2;
    	let a;
    	let t5;
    	let current;
    	const if_block_creators = [create_if_block$1, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (!/*$finished*/ ctx[6]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			if_block.c();
    			t0 = space();
    			hr = element("hr");
    			t1 = space();
    			div1 = element("div");
    			t2 = text("Made with\n    ");
    			a = element("a");
    			a.textContent = `quizdown-js ${"v0.1.4"}`;
    			t5 = text(".");
    			attr_dev(div0, "class", "quizdown-button-row svelte-cdtbcn");
    			add_location(div0, file$2, 15, 0, 350);
    			attr_dev(hr, "class", "svelte-cdtbcn");
    			add_location(hr, file$2, 42, 0, 1358);
    			attr_dev(a, "href", "https://github.com/bonartm/quizdown-js");
    			attr_dev(a, "class", "svelte-cdtbcn");
    			add_location(a, file$2, 47, 4, 1491);
    			attr_dev(div1, "class", "quizdown-credits svelte-cdtbcn");
    			add_location(div1, file$2, 44, 0, 1366);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			if_blocks[current_block_type_index].m(div0, null);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, hr, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, t2);
    			append_dev(div1, a);
    			append_dev(div1, t5);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div0, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if_blocks[current_block_type_index].d();
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(hr);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
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

    function instance$2($$self, $$props, $$invalidate) {
    	let counter;
    	let finished;
    	let current;

    	let $counter,
    		$$unsubscribe_counter = noop,
    		$$subscribe_counter = () => ($$unsubscribe_counter(), $$unsubscribe_counter = subscribe(counter, $$value => $$invalidate(1, $counter = $$value)), counter);

    	let $finished,
    		$$unsubscribe_finished = noop,
    		$$subscribe_finished = () => ($$unsubscribe_finished(), $$unsubscribe_finished = subscribe(finished, $$value => $$invalidate(6, $finished = $$value)), finished);

    	$$self.$$.on_destroy.push(() => $$unsubscribe_counter());
    	$$self.$$.on_destroy.push(() => $$unsubscribe_finished());
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Footer", slots, []);
    	
    	let { quiz } = $$props;
    	let show_hint = false;
    	const writable_props = ["quiz"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	const func = () => $$invalidate(2, show_hint = !show_hint);

    	$$self.$$set = $$props => {
    		if ("quiz" in $$props) $$invalidate(0, quiz = $$props.quiz);
    	};

    	$$self.$capture_state = () => ({
    		Button,
    		quiz,
    		SpeechBubble,
    		show_hint,
    		counter,
    		finished,
    		current,
    		$counter,
    		$finished
    	});

    	$$self.$inject_state = $$props => {
    		if ("quiz" in $$props) $$invalidate(0, quiz = $$props.quiz);
    		if ("show_hint" in $$props) $$invalidate(2, show_hint = $$props.show_hint);
    		if ("counter" in $$props) $$subscribe_counter($$invalidate(3, counter = $$props.counter));
    		if ("finished" in $$props) $$subscribe_finished($$invalidate(4, finished = $$props.finished));
    		if ("current" in $$props) $$invalidate(5, current = $$props.current);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*quiz*/ 1) {
    			$$subscribe_counter($$invalidate(3, counter = quiz.counter));
    		}

    		if ($$self.$$.dirty & /*quiz*/ 1) {
    			$$subscribe_finished($$invalidate(4, finished = quiz.finished));
    		}

    		if ($$self.$$.dirty & /*quiz, $counter*/ 3) {
    			$$invalidate(5, current = quiz.questions[$counter]);
    		}

    		if ($$self.$$.dirty & /*$counter*/ 2) {
    			// disable hint on new question
    			{
    				$$invalidate(2, show_hint = false);
    			}
    		}
    	};

    	return [quiz, $counter, show_hint, counter, finished, current, $finished, func];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$2, create_fragment$2, safe_not_equal, { quiz: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*quiz*/ ctx[0] === undefined && !("quiz" in props)) {
    			console.warn("<Footer> was created without expected prop 'quiz'");
    		}
    	}

    	get quiz() {
    		throw new Error("<Footer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set quiz(value) {
    		throw new Error("<Footer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\ProgressBar.svelte generated by Svelte v3.37.0 */
    const file$1 = "src\\components\\ProgressBar.svelte";

    // (28:8) {#if !$finished}
    function create_if_block(ctx) {
    	let t0_value = /*$counter*/ ctx[1] + 1 + "";
    	let t0;
    	let t1;
    	let t2_value = /*counter*/ ctx[2].max + "";
    	let t2;

    	const block = {
    		c: function create() {
    			t0 = text(t0_value);
    			t1 = text("/");
    			t2 = text(t2_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$counter*/ 2 && t0_value !== (t0_value = /*$counter*/ ctx[1] + 1 + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*counter*/ 4 && t2_value !== (t2_value = /*counter*/ ctx[2].max + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(28:8) {#if !$finished}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div1;
    	let div0;
    	let t;
    	let span;
    	let if_block = !/*$finished*/ ctx[0] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t = space();
    			span = element("span");
    			if (if_block) if_block.c();
    			attr_dev(div0, "class", "progress-slider svelte-7cctah");
    			set_style(div0, "width", /*progress_percent*/ ctx[4]);
    			add_location(div0, file$1, 24, 4, 618);
    			attr_dev(span, "class", "progress-text svelte-7cctah");
    			add_location(span, file$1, 26, 4, 692);
    			attr_dev(div1, "class", "quizdown-progress svelte-7cctah");
    			attr_dev(div1, "data-label", "");
    			add_location(div1, file$1, 23, 0, 568);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div1, t);
    			append_dev(div1, span);
    			if (if_block) if_block.m(span, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*progress_percent*/ 16) {
    				set_style(div0, "width", /*progress_percent*/ ctx[4]);
    			}

    			if (!/*$finished*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(span, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
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
    	let counter;
    	let finished;
    	let progress_percent;

    	let $finished,
    		$$unsubscribe_finished = noop,
    		$$subscribe_finished = () => ($$unsubscribe_finished(), $$unsubscribe_finished = subscribe(finished, $$value => $$invalidate(0, $finished = $$value)), finished);

    	let $counter,
    		$$unsubscribe_counter = noop,
    		$$subscribe_counter = () => ($$unsubscribe_counter(), $$unsubscribe_counter = subscribe(counter, $$value => $$invalidate(1, $counter = $$value)), counter);

    	let $animated_current_block;
    	$$self.$$.on_destroy.push(() => $$unsubscribe_finished());
    	$$self.$$.on_destroy.push(() => $$unsubscribe_counter());
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ProgressBar", slots, []);
    	
    	let { quiz } = $$props;
    	const animated_current_block = tweened(0, { duration: 400, easing: cubicOut });
    	validate_store(animated_current_block, "animated_current_block");
    	component_subscribe($$self, animated_current_block, value => $$invalidate(7, $animated_current_block = value));
    	const writable_props = ["quiz"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ProgressBar> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("quiz" in $$props) $$invalidate(6, quiz = $$props.quiz);
    	};

    	$$self.$capture_state = () => ({
    		tweened,
    		cubicOut,
    		quiz,
    		animated_current_block,
    		counter,
    		finished,
    		$finished,
    		$counter,
    		progress_percent,
    		$animated_current_block
    	});

    	$$self.$inject_state = $$props => {
    		if ("quiz" in $$props) $$invalidate(6, quiz = $$props.quiz);
    		if ("counter" in $$props) $$subscribe_counter($$invalidate(2, counter = $$props.counter));
    		if ("finished" in $$props) $$subscribe_finished($$invalidate(3, finished = $$props.finished));
    		if ("progress_percent" in $$props) $$invalidate(4, progress_percent = $$props.progress_percent);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*quiz*/ 64) {
    			$$subscribe_counter($$invalidate(2, counter = quiz.counter));
    		}

    		if ($$self.$$.dirty & /*quiz*/ 64) {
    			$$subscribe_finished($$invalidate(3, finished = quiz.finished));
    		}

    		if ($$self.$$.dirty & /*$finished, quiz, $counter*/ 67) {
    			{
    				if ($finished) {
    					animated_current_block.set(quiz.counter.max - 0.5);
    				} else {
    					animated_current_block.set($counter + 0.1);
    				}
    			}
    		}

    		if ($$self.$$.dirty & /*$animated_current_block, quiz*/ 192) {
    			$$invalidate(4, progress_percent = String($animated_current_block / (quiz.counter.max - 0.5) * 100) + "%");
    		}
    	};

    	return [
    		$finished,
    		$counter,
    		counter,
    		finished,
    		progress_percent,
    		animated_current_block,
    		quiz,
    		$animated_current_block
    	];
    }

    class ProgressBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$1, create_fragment$1, safe_not_equal, { quiz: 6 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ProgressBar",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*quiz*/ ctx[6] === undefined && !("quiz" in props)) {
    			console.warn("<ProgressBar> was created without expected prop 'quiz'");
    		}
    	}

    	get quiz() {
    		throw new Error("<ProgressBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set quiz(value) {
    		throw new Error("<ProgressBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.37.0 */
    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let div;
    	let progressbar;
    	let t0;
    	let quizsection;
    	let t1;
    	let footer;
    	let current;

    	progressbar = new ProgressBar({
    			props: { quiz: /*quiz*/ ctx[0] },
    			$$inline: true
    		});

    	quizsection = new QuizSection({
    			props: { quiz: /*quiz*/ ctx[0] },
    			$$inline: true
    		});

    	footer = new Footer({
    			props: { quiz: /*quiz*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(progressbar.$$.fragment);
    			t0 = space();
    			create_component(quizsection.$$.fragment);
    			t1 = space();
    			create_component(footer.$$.fragment);
    			attr_dev(div, "class", "quizdown-content");
    			add_location(div, file, 27, 0, 1430);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(progressbar, div, null);
    			append_dev(div, t0);
    			mount_component(quizsection, div, null);
    			append_dev(div, t1);
    			mount_component(footer, div, null);
    			/*div_binding*/ ctx[2](div);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const progressbar_changes = {};
    			if (dirty & /*quiz*/ 1) progressbar_changes.quiz = /*quiz*/ ctx[0];
    			progressbar.$set(progressbar_changes);
    			const quizsection_changes = {};
    			if (dirty & /*quiz*/ 1) quizsection_changes.quiz = /*quiz*/ ctx[0];
    			quizsection.$set(quizsection_changes);
    			const footer_changes = {};
    			if (dirty & /*quiz*/ 1) footer_changes.quiz = /*quiz*/ ctx[0];
    			footer.$set(footer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(progressbar.$$.fragment, local);
    			transition_in(quizsection.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(progressbar.$$.fragment, local);
    			transition_out(quizsection.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(progressbar);
    			destroy_component(quizsection);
    			destroy_component(footer);
    			/*div_binding*/ ctx[2](null);
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
    	validate_slots("App", slots, []);

    	var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
    		function adopt(value) {
    			return value instanceof P
    			? value
    			: new P(function (resolve) {
    						resolve(value);
    					});
    		}

    		return new (P || (P = Promise))(function (resolve, reject) {
    				function fulfilled(value) {
    					try {
    						step(generator.next(value));
    					} catch(e) {
    						reject(e);
    					}
    				}

    				function rejected(value) {
    					try {
    						step(generator["throw"](value));
    					} catch(e) {
    						reject(e);
    					}
    				}

    				function step(result) {
    					result.done
    					? resolve(result.value)
    					: adopt(result.value).then(fulfilled, rejected);
    				}

    				step((generator = generator.apply(thisArg, _arguments || [])).next());
    			});
    	};

    	
    	let { quiz } = $$props;
    	let node;

    	// set global options
    	onMount(() => __awaiter(void 0, void 0, void 0, function* () {
    		let primary_color = quiz.config["primary_color"];
    		let secondary_color = quiz.config["secondary_color"];
    		let title_color = quiz.config["title_color"];
    		node.style.setProperty("--quizdown-color-primary", primary_color);
    		node.style.setProperty("--quizdown-color-secondary", secondary_color);
    		node.style.setProperty("--quizdown-color-title", title_color);
    	}));

    	const writable_props = ["quiz"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			node = $$value;
    			$$invalidate(1, node);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ("quiz" in $$props) $$invalidate(0, quiz = $$props.quiz);
    	};

    	$$self.$capture_state = () => ({
    		__awaiter,
    		QuizSection,
    		Footer,
    		ProgressBar,
    		onMount,
    		quiz,
    		node
    	});

    	$$self.$inject_state = $$props => {
    		if ("__awaiter" in $$props) __awaiter = $$props.__awaiter;
    		if ("quiz" in $$props) $$invalidate(0, quiz = $$props.quiz);
    		if ("node" in $$props) $$invalidate(1, node = $$props.node);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [quiz, node, div_binding];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance, create_fragment, safe_not_equal, { quiz: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*quiz*/ ctx[0] === undefined && !("quiz" in props)) {
    			console.warn("<App> was created without expected prop 'quiz'");
    		}
    	}

    	get quiz() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set quiz(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function getAugmentedNamespace(n) {
    	if (n.__esModule) return n;
    	var a = Object.defineProperty({}, '__esModule', {value: true});
    	Object.keys(n).forEach(function (k) {
    		var d = Object.getOwnPropertyDescriptor(n, k);
    		Object.defineProperty(a, k, d.get ? d : {
    			enumerable: true,
    			get: function () {
    				return n[k];
    			}
    		});
    	});
    	return a;
    }

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    /**
     * marked - a markdown parser
     * Copyright (c) 2011-2021, Christopher Jeffrey. (MIT Licensed)
     * https://github.com/markedjs/marked
     */

    var marked = createCommonjsModule(function (module, exports) {
    /**
     * DO NOT EDIT THIS FILE
     * The code in this file is generated from files in ./src/
     */

    (function (global, factory) {
      module.exports = factory() ;
    }(commonjsGlobal, (function () {
      function _defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }

      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps) _defineProperties(Constructor.prototype, protoProps);
        if (staticProps) _defineProperties(Constructor, staticProps);
        return Constructor;
      }

      function _unsupportedIterableToArray(o, minLen) {
        if (!o) return;
        if (typeof o === "string") return _arrayLikeToArray(o, minLen);
        var n = Object.prototype.toString.call(o).slice(8, -1);
        if (n === "Object" && o.constructor) n = o.constructor.name;
        if (n === "Map" || n === "Set") return Array.from(o);
        if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
      }

      function _arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length) len = arr.length;

        for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

        return arr2;
      }

      function _createForOfIteratorHelperLoose(o, allowArrayLike) {
        var it;

        if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
          if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
            if (it) o = it;
            var i = 0;
            return function () {
              if (i >= o.length) return {
                done: true
              };
              return {
                done: false,
                value: o[i++]
              };
            };
          }

          throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
        }

        it = o[Symbol.iterator]();
        return it.next.bind(it);
      }

      function createCommonjsModule(fn) {
        var module = { exports: {} };
      	return fn(module, module.exports), module.exports;
      }

      var defaults$5 = createCommonjsModule(function (module) {
        function getDefaults() {
          return {
            baseUrl: null,
            breaks: false,
            gfm: true,
            headerIds: true,
            headerPrefix: '',
            highlight: null,
            langPrefix: 'language-',
            mangle: true,
            pedantic: false,
            renderer: null,
            sanitize: false,
            sanitizer: null,
            silent: false,
            smartLists: false,
            smartypants: false,
            tokenizer: null,
            walkTokens: null,
            xhtml: false
          };
        }

        function changeDefaults(newDefaults) {
          module.exports.defaults = newDefaults;
        }

        module.exports = {
          defaults: getDefaults(),
          getDefaults: getDefaults,
          changeDefaults: changeDefaults
        };
      });

      /**
       * Helpers
       */
      var escapeTest = /[&<>"']/;
      var escapeReplace = /[&<>"']/g;
      var escapeTestNoEncode = /[<>"']|&(?!#?\w+;)/;
      var escapeReplaceNoEncode = /[<>"']|&(?!#?\w+;)/g;
      var escapeReplacements = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      };

      var getEscapeReplacement = function getEscapeReplacement(ch) {
        return escapeReplacements[ch];
      };

      function escape$2(html, encode) {
        if (encode) {
          if (escapeTest.test(html)) {
            return html.replace(escapeReplace, getEscapeReplacement);
          }
        } else {
          if (escapeTestNoEncode.test(html)) {
            return html.replace(escapeReplaceNoEncode, getEscapeReplacement);
          }
        }

        return html;
      }

      var unescapeTest = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig;

      function unescape$1(html) {
        // explicitly match decimal, hex, and named HTML entities
        return html.replace(unescapeTest, function (_, n) {
          n = n.toLowerCase();
          if (n === 'colon') return ':';

          if (n.charAt(0) === '#') {
            return n.charAt(1) === 'x' ? String.fromCharCode(parseInt(n.substring(2), 16)) : String.fromCharCode(+n.substring(1));
          }

          return '';
        });
      }

      var caret = /(^|[^\[])\^/g;

      function edit$1(regex, opt) {
        regex = regex.source || regex;
        opt = opt || '';
        var obj = {
          replace: function replace(name, val) {
            val = val.source || val;
            val = val.replace(caret, '$1');
            regex = regex.replace(name, val);
            return obj;
          },
          getRegex: function getRegex() {
            return new RegExp(regex, opt);
          }
        };
        return obj;
      }

      var nonWordAndColonTest = /[^\w:]/g;
      var originIndependentUrl = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;

      function cleanUrl$1(sanitize, base, href) {
        if (sanitize) {
          var prot;

          try {
            prot = decodeURIComponent(unescape$1(href)).replace(nonWordAndColonTest, '').toLowerCase();
          } catch (e) {
            return null;
          }

          if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0 || prot.indexOf('data:') === 0) {
            return null;
          }
        }

        if (base && !originIndependentUrl.test(href)) {
          href = resolveUrl(base, href);
        }

        try {
          href = encodeURI(href).replace(/%25/g, '%');
        } catch (e) {
          return null;
        }

        return href;
      }

      var baseUrls = {};
      var justDomain = /^[^:]+:\/*[^/]*$/;
      var protocol = /^([^:]+:)[\s\S]*$/;
      var domain = /^([^:]+:\/*[^/]*)[\s\S]*$/;

      function resolveUrl(base, href) {
        if (!baseUrls[' ' + base]) {
          // we can ignore everything in base after the last slash of its path component,
          // but we might need to add _that_
          // https://tools.ietf.org/html/rfc3986#section-3
          if (justDomain.test(base)) {
            baseUrls[' ' + base] = base + '/';
          } else {
            baseUrls[' ' + base] = rtrim$1(base, '/', true);
          }
        }

        base = baseUrls[' ' + base];
        var relativeBase = base.indexOf(':') === -1;

        if (href.substring(0, 2) === '//') {
          if (relativeBase) {
            return href;
          }

          return base.replace(protocol, '$1') + href;
        } else if (href.charAt(0) === '/') {
          if (relativeBase) {
            return href;
          }

          return base.replace(domain, '$1') + href;
        } else {
          return base + href;
        }
      }

      var noopTest$1 = {
        exec: function noopTest() {}
      };

      function merge$2(obj) {
        var i = 1,
            target,
            key;

        for (; i < arguments.length; i++) {
          target = arguments[i];

          for (key in target) {
            if (Object.prototype.hasOwnProperty.call(target, key)) {
              obj[key] = target[key];
            }
          }
        }

        return obj;
      }

      function splitCells$1(tableRow, count) {
        // ensure that every cell-delimiting pipe has a space
        // before it to distinguish it from an escaped pipe
        var row = tableRow.replace(/\|/g, function (match, offset, str) {
          var escaped = false,
              curr = offset;

          while (--curr >= 0 && str[curr] === '\\') {
            escaped = !escaped;
          }

          if (escaped) {
            // odd number of slashes means | is escaped
            // so we leave it alone
            return '|';
          } else {
            // add space before unescaped |
            return ' |';
          }
        }),
            cells = row.split(/ \|/);
        var i = 0;

        if (cells.length > count) {
          cells.splice(count);
        } else {
          while (cells.length < count) {
            cells.push('');
          }
        }

        for (; i < cells.length; i++) {
          // leading or trailing whitespace is ignored per the gfm spec
          cells[i] = cells[i].trim().replace(/\\\|/g, '|');
        }

        return cells;
      } // Remove trailing 'c's. Equivalent to str.replace(/c*$/, '').
      // /c*$/ is vulnerable to REDOS.
      // invert: Remove suffix of non-c chars instead. Default falsey.


      function rtrim$1(str, c, invert) {
        var l = str.length;

        if (l === 0) {
          return '';
        } // Length of suffix matching the invert condition.


        var suffLen = 0; // Step left until we fail to match the invert condition.

        while (suffLen < l) {
          var currChar = str.charAt(l - suffLen - 1);

          if (currChar === c && !invert) {
            suffLen++;
          } else if (currChar !== c && invert) {
            suffLen++;
          } else {
            break;
          }
        }

        return str.substr(0, l - suffLen);
      }

      function findClosingBracket$1(str, b) {
        if (str.indexOf(b[1]) === -1) {
          return -1;
        }

        var l = str.length;
        var level = 0,
            i = 0;

        for (; i < l; i++) {
          if (str[i] === '\\') {
            i++;
          } else if (str[i] === b[0]) {
            level++;
          } else if (str[i] === b[1]) {
            level--;

            if (level < 0) {
              return i;
            }
          }
        }

        return -1;
      }

      function checkSanitizeDeprecation$1(opt) {
        if (opt && opt.sanitize && !opt.silent) {
          console.warn('marked(): sanitize and sanitizer parameters are deprecated since version 0.7.0, should not be used and will be removed in the future. Read more here: https://marked.js.org/#/USING_ADVANCED.md#options');
        }
      } // copied from https://stackoverflow.com/a/5450113/806777


      function repeatString$1(pattern, count) {
        if (count < 1) {
          return '';
        }

        var result = '';

        while (count > 1) {
          if (count & 1) {
            result += pattern;
          }

          count >>= 1;
          pattern += pattern;
        }

        return result + pattern;
      }

      var helpers = {
        escape: escape$2,
        unescape: unescape$1,
        edit: edit$1,
        cleanUrl: cleanUrl$1,
        resolveUrl: resolveUrl,
        noopTest: noopTest$1,
        merge: merge$2,
        splitCells: splitCells$1,
        rtrim: rtrim$1,
        findClosingBracket: findClosingBracket$1,
        checkSanitizeDeprecation: checkSanitizeDeprecation$1,
        repeatString: repeatString$1
      };

      var defaults$4 = defaults$5.defaults;
      var rtrim = helpers.rtrim,
          splitCells = helpers.splitCells,
          _escape = helpers.escape,
          findClosingBracket = helpers.findClosingBracket;

      function outputLink(cap, link, raw) {
        var href = link.href;
        var title = link.title ? _escape(link.title) : null;
        var text = cap[1].replace(/\\([\[\]])/g, '$1');

        if (cap[0].charAt(0) !== '!') {
          return {
            type: 'link',
            raw: raw,
            href: href,
            title: title,
            text: text
          };
        } else {
          return {
            type: 'image',
            raw: raw,
            href: href,
            title: title,
            text: _escape(text)
          };
        }
      }

      function indentCodeCompensation(raw, text) {
        var matchIndentToCode = raw.match(/^(\s+)(?:```)/);

        if (matchIndentToCode === null) {
          return text;
        }

        var indentToCode = matchIndentToCode[1];
        return text.split('\n').map(function (node) {
          var matchIndentInNode = node.match(/^\s+/);

          if (matchIndentInNode === null) {
            return node;
          }

          var indentInNode = matchIndentInNode[0];

          if (indentInNode.length >= indentToCode.length) {
            return node.slice(indentToCode.length);
          }

          return node;
        }).join('\n');
      }
      /**
       * Tokenizer
       */


      var Tokenizer_1 = /*#__PURE__*/function () {
        function Tokenizer(options) {
          this.options = options || defaults$4;
        }

        var _proto = Tokenizer.prototype;

        _proto.space = function space(src) {
          var cap = this.rules.block.newline.exec(src);

          if (cap) {
            if (cap[0].length > 1) {
              return {
                type: 'space',
                raw: cap[0]
              };
            }

            return {
              raw: '\n'
            };
          }
        };

        _proto.code = function code(src) {
          var cap = this.rules.block.code.exec(src);

          if (cap) {
            var text = cap[0].replace(/^ {1,4}/gm, '');
            return {
              type: 'code',
              raw: cap[0],
              codeBlockStyle: 'indented',
              text: !this.options.pedantic ? rtrim(text, '\n') : text
            };
          }
        };

        _proto.fences = function fences(src) {
          var cap = this.rules.block.fences.exec(src);

          if (cap) {
            var raw = cap[0];
            var text = indentCodeCompensation(raw, cap[3] || '');
            return {
              type: 'code',
              raw: raw,
              lang: cap[2] ? cap[2].trim() : cap[2],
              text: text
            };
          }
        };

        _proto.heading = function heading(src) {
          var cap = this.rules.block.heading.exec(src);

          if (cap) {
            var text = cap[2].trim(); // remove trailing #s

            if (/#$/.test(text)) {
              var trimmed = rtrim(text, '#');

              if (this.options.pedantic) {
                text = trimmed.trim();
              } else if (!trimmed || / $/.test(trimmed)) {
                // CommonMark requires space before trailing #s
                text = trimmed.trim();
              }
            }

            return {
              type: 'heading',
              raw: cap[0],
              depth: cap[1].length,
              text: text
            };
          }
        };

        _proto.nptable = function nptable(src) {
          var cap = this.rules.block.nptable.exec(src);

          if (cap) {
            var item = {
              type: 'table',
              header: splitCells(cap[1].replace(/^ *| *\| *$/g, '')),
              align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
              cells: cap[3] ? cap[3].replace(/\n$/, '').split('\n') : [],
              raw: cap[0]
            };

            if (item.header.length === item.align.length) {
              var l = item.align.length;
              var i;

              for (i = 0; i < l; i++) {
                if (/^ *-+: *$/.test(item.align[i])) {
                  item.align[i] = 'right';
                } else if (/^ *:-+: *$/.test(item.align[i])) {
                  item.align[i] = 'center';
                } else if (/^ *:-+ *$/.test(item.align[i])) {
                  item.align[i] = 'left';
                } else {
                  item.align[i] = null;
                }
              }

              l = item.cells.length;

              for (i = 0; i < l; i++) {
                item.cells[i] = splitCells(item.cells[i], item.header.length);
              }

              return item;
            }
          }
        };

        _proto.hr = function hr(src) {
          var cap = this.rules.block.hr.exec(src);

          if (cap) {
            return {
              type: 'hr',
              raw: cap[0]
            };
          }
        };

        _proto.blockquote = function blockquote(src) {
          var cap = this.rules.block.blockquote.exec(src);

          if (cap) {
            var text = cap[0].replace(/^ *> ?/gm, '');
            return {
              type: 'blockquote',
              raw: cap[0],
              text: text
            };
          }
        };

        _proto.list = function list(src) {
          var cap = this.rules.block.list.exec(src);

          if (cap) {
            var raw = cap[0];
            var bull = cap[2];
            var isordered = bull.length > 1;
            var list = {
              type: 'list',
              raw: raw,
              ordered: isordered,
              start: isordered ? +bull.slice(0, -1) : '',
              loose: false,
              items: []
            }; // Get each top-level item.

            var itemMatch = cap[0].match(this.rules.block.item);
            var next = false,
                item,
                space,
                bcurr,
                bnext,
                addBack,
                loose,
                istask,
                ischecked,
                endMatch;
            var l = itemMatch.length;
            bcurr = this.rules.block.listItemStart.exec(itemMatch[0]);

            for (var i = 0; i < l; i++) {
              item = itemMatch[i];
              raw = item;

              if (!this.options.pedantic) {
                // Determine if current item contains the end of the list
                endMatch = item.match(new RegExp('\\n\\s*\\n {0,' + (bcurr[0].length - 1) + '}\\S'));

                if (endMatch) {
                  addBack = item.length - endMatch.index + itemMatch.slice(i + 1).join('\n').length;
                  list.raw = list.raw.substring(0, list.raw.length - addBack);
                  item = item.substring(0, endMatch.index);
                  raw = item;
                  l = i + 1;
                }
              } // Determine whether the next list item belongs here.
              // Backpedal if it does not belong in this list.


              if (i !== l - 1) {
                bnext = this.rules.block.listItemStart.exec(itemMatch[i + 1]);

                if (!this.options.pedantic ? bnext[1].length >= bcurr[0].length || bnext[1].length > 3 : bnext[1].length > bcurr[1].length) {
                  // nested list or continuation
                  itemMatch.splice(i, 2, itemMatch[i] + (!this.options.pedantic && bnext[1].length < bcurr[0].length && !itemMatch[i].match(/\n$/) ? '' : '\n') + itemMatch[i + 1]);
                  i--;
                  l--;
                  continue;
                } else if ( // different bullet style
                !this.options.pedantic || this.options.smartLists ? bnext[2][bnext[2].length - 1] !== bull[bull.length - 1] : isordered === (bnext[2].length === 1)) {
                  addBack = itemMatch.slice(i + 1).join('\n').length;
                  list.raw = list.raw.substring(0, list.raw.length - addBack);
                  i = l - 1;
                }

                bcurr = bnext;
              } // Remove the list item's bullet
              // so it is seen as the next token.


              space = item.length;
              item = item.replace(/^ *([*+-]|\d+[.)]) ?/, ''); // Outdent whatever the
              // list item contains. Hacky.

              if (~item.indexOf('\n ')) {
                space -= item.length;
                item = !this.options.pedantic ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '') : item.replace(/^ {1,4}/gm, '');
              } // trim item newlines at end


              item = rtrim(item, '\n');

              if (i !== l - 1) {
                raw = raw + '\n';
              } // Determine whether item is loose or not.
              // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
              // for discount behavior.


              loose = next || /\n\n(?!\s*$)/.test(raw);

              if (i !== l - 1) {
                next = raw.slice(-2) === '\n\n';
                if (!loose) loose = next;
              }

              if (loose) {
                list.loose = true;
              } // Check for task list items


              if (this.options.gfm) {
                istask = /^\[[ xX]\] /.test(item);
                ischecked = undefined;

                if (istask) {
                  ischecked = item[1] !== ' ';
                  item = item.replace(/^\[[ xX]\] +/, '');
                }
              }

              list.items.push({
                type: 'list_item',
                raw: raw,
                task: istask,
                checked: ischecked,
                loose: loose,
                text: item
              });
            }

            return list;
          }
        };

        _proto.html = function html(src) {
          var cap = this.rules.block.html.exec(src);

          if (cap) {
            return {
              type: this.options.sanitize ? 'paragraph' : 'html',
              raw: cap[0],
              pre: !this.options.sanitizer && (cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style'),
              text: this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(cap[0]) : _escape(cap[0]) : cap[0]
            };
          }
        };

        _proto.def = function def(src) {
          var cap = this.rules.block.def.exec(src);

          if (cap) {
            if (cap[3]) cap[3] = cap[3].substring(1, cap[3].length - 1);
            var tag = cap[1].toLowerCase().replace(/\s+/g, ' ');
            return {
              type: 'def',
              tag: tag,
              raw: cap[0],
              href: cap[2],
              title: cap[3]
            };
          }
        };

        _proto.table = function table(src) {
          var cap = this.rules.block.table.exec(src);

          if (cap) {
            var item = {
              type: 'table',
              header: splitCells(cap[1].replace(/^ *| *\| *$/g, '')),
              align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
              cells: cap[3] ? cap[3].replace(/\n$/, '').split('\n') : []
            };

            if (item.header.length === item.align.length) {
              item.raw = cap[0];
              var l = item.align.length;
              var i;

              for (i = 0; i < l; i++) {
                if (/^ *-+: *$/.test(item.align[i])) {
                  item.align[i] = 'right';
                } else if (/^ *:-+: *$/.test(item.align[i])) {
                  item.align[i] = 'center';
                } else if (/^ *:-+ *$/.test(item.align[i])) {
                  item.align[i] = 'left';
                } else {
                  item.align[i] = null;
                }
              }

              l = item.cells.length;

              for (i = 0; i < l; i++) {
                item.cells[i] = splitCells(item.cells[i].replace(/^ *\| *| *\| *$/g, ''), item.header.length);
              }

              return item;
            }
          }
        };

        _proto.lheading = function lheading(src) {
          var cap = this.rules.block.lheading.exec(src);

          if (cap) {
            return {
              type: 'heading',
              raw: cap[0],
              depth: cap[2].charAt(0) === '=' ? 1 : 2,
              text: cap[1]
            };
          }
        };

        _proto.paragraph = function paragraph(src) {
          var cap = this.rules.block.paragraph.exec(src);

          if (cap) {
            return {
              type: 'paragraph',
              raw: cap[0],
              text: cap[1].charAt(cap[1].length - 1) === '\n' ? cap[1].slice(0, -1) : cap[1]
            };
          }
        };

        _proto.text = function text(src) {
          var cap = this.rules.block.text.exec(src);

          if (cap) {
            return {
              type: 'text',
              raw: cap[0],
              text: cap[0]
            };
          }
        };

        _proto.escape = function escape(src) {
          var cap = this.rules.inline.escape.exec(src);

          if (cap) {
            return {
              type: 'escape',
              raw: cap[0],
              text: _escape(cap[1])
            };
          }
        };

        _proto.tag = function tag(src, inLink, inRawBlock) {
          var cap = this.rules.inline.tag.exec(src);

          if (cap) {
            if (!inLink && /^<a /i.test(cap[0])) {
              inLink = true;
            } else if (inLink && /^<\/a>/i.test(cap[0])) {
              inLink = false;
            }

            if (!inRawBlock && /^<(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
              inRawBlock = true;
            } else if (inRawBlock && /^<\/(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
              inRawBlock = false;
            }

            return {
              type: this.options.sanitize ? 'text' : 'html',
              raw: cap[0],
              inLink: inLink,
              inRawBlock: inRawBlock,
              text: this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(cap[0]) : _escape(cap[0]) : cap[0]
            };
          }
        };

        _proto.link = function link(src) {
          var cap = this.rules.inline.link.exec(src);

          if (cap) {
            var trimmedUrl = cap[2].trim();

            if (!this.options.pedantic && /^</.test(trimmedUrl)) {
              // commonmark requires matching angle brackets
              if (!/>$/.test(trimmedUrl)) {
                return;
              } // ending angle bracket cannot be escaped


              var rtrimSlash = rtrim(trimmedUrl.slice(0, -1), '\\');

              if ((trimmedUrl.length - rtrimSlash.length) % 2 === 0) {
                return;
              }
            } else {
              // find closing parenthesis
              var lastParenIndex = findClosingBracket(cap[2], '()');

              if (lastParenIndex > -1) {
                var start = cap[0].indexOf('!') === 0 ? 5 : 4;
                var linkLen = start + cap[1].length + lastParenIndex;
                cap[2] = cap[2].substring(0, lastParenIndex);
                cap[0] = cap[0].substring(0, linkLen).trim();
                cap[3] = '';
              }
            }

            var href = cap[2];
            var title = '';

            if (this.options.pedantic) {
              // split pedantic href and title
              var link = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(href);

              if (link) {
                href = link[1];
                title = link[3];
              }
            } else {
              title = cap[3] ? cap[3].slice(1, -1) : '';
            }

            href = href.trim();

            if (/^</.test(href)) {
              if (this.options.pedantic && !/>$/.test(trimmedUrl)) {
                // pedantic allows starting angle bracket without ending angle bracket
                href = href.slice(1);
              } else {
                href = href.slice(1, -1);
              }
            }

            return outputLink(cap, {
              href: href ? href.replace(this.rules.inline._escapes, '$1') : href,
              title: title ? title.replace(this.rules.inline._escapes, '$1') : title
            }, cap[0]);
          }
        };

        _proto.reflink = function reflink(src, links) {
          var cap;

          if ((cap = this.rules.inline.reflink.exec(src)) || (cap = this.rules.inline.nolink.exec(src))) {
            var link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
            link = links[link.toLowerCase()];

            if (!link || !link.href) {
              var text = cap[0].charAt(0);
              return {
                type: 'text',
                raw: text,
                text: text
              };
            }

            return outputLink(cap, link, cap[0]);
          }
        };

        _proto.emStrong = function emStrong(src, maskedSrc, prevChar) {
          if (prevChar === void 0) {
            prevChar = '';
          }

          var match = this.rules.inline.emStrong.lDelim.exec(src);
          if (!match) return;
          if (match[3] && prevChar.match(/(?:[0-9A-Za-z\xAA\xB2\xB3\xB5\xB9\xBA\xBC-\xBE\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u0660-\u0669\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07C0-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u08A0-\u08B4\u08B6-\u08C7\u0904-\u0939\u093D\u0950\u0958-\u0961\u0966-\u096F\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09E6-\u09F1\u09F4-\u09F9\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A66-\u0A6F\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AE6-\u0AEF\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B66-\u0B6F\u0B71-\u0B77\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0BE6-\u0BF2\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C66-\u0C6F\u0C78-\u0C7E\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CE6-\u0CEF\u0CF1\u0CF2\u0D04-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D58-\u0D61\u0D66-\u0D78\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DE6-\u0DEF\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F20-\u0F33\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F-\u1049\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u1090-\u1099\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1369-\u137C\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1820-\u1878\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A16\u1A20-\u1A54\u1A80-\u1A89\u1A90-\u1A99\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B50-\u1B59\u1B83-\u1BA0\u1BAE-\u1BE5\u1C00-\u1C23\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2070\u2071\u2074-\u2079\u207F-\u2089\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2150-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2CFD\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u3192-\u3195\u31A0-\u31BF\u31F0-\u31FF\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\u3400-\u4DBF\u4E00-\u9FFC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7BF\uA7C2-\uA7CA\uA7F5-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA830-\uA835\uA840-\uA873\uA882-\uA8B3\uA8D0-\uA8D9\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA900-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF-\uA9D9\uA9E0-\uA9E4\uA9E6-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA50-\uAA59\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABE2\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD07-\uDD33\uDD40-\uDD78\uDD8A\uDD8B\uDE80-\uDE9C\uDEA0-\uDED0\uDEE1-\uDEFB\uDF00-\uDF23\uDF2D-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC58-\uDC76\uDC79-\uDC9E\uDCA7-\uDCAF\uDCE0-\uDCF2\uDCF4\uDCF5\uDCFB-\uDD1B\uDD20-\uDD39\uDD80-\uDDB7\uDDBC-\uDDCF\uDDD2-\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE40-\uDE48\uDE60-\uDE7E\uDE80-\uDE9F\uDEC0-\uDEC7\uDEC9-\uDEE4\uDEEB-\uDEEF\uDF00-\uDF35\uDF40-\uDF55\uDF58-\uDF72\uDF78-\uDF91\uDFA9-\uDFAF]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2\uDCFA-\uDD23\uDD30-\uDD39\uDE60-\uDE7E\uDE80-\uDEA9\uDEB0\uDEB1\uDF00-\uDF27\uDF30-\uDF45\uDF51-\uDF54\uDFB0-\uDFCB\uDFE0-\uDFF6]|\uD804[\uDC03-\uDC37\uDC52-\uDC6F\uDC83-\uDCAF\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD03-\uDD26\uDD36-\uDD3F\uDD44\uDD47\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDD0-\uDDDA\uDDDC\uDDE1-\uDDF4\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDEF0-\uDEF9\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC50-\uDC59\uDC5F-\uDC61\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE50-\uDE59\uDE80-\uDEAA\uDEB8\uDEC0-\uDEC9\uDF00-\uDF1A\uDF30-\uDF3B]|\uD806[\uDC00-\uDC2B\uDCA0-\uDCF2\uDCFF-\uDD06\uDD09\uDD0C-\uDD13\uDD15\uDD16\uDD18-\uDD2F\uDD3F\uDD41\uDD50-\uDD59\uDDA0-\uDDA7\uDDAA-\uDDD0\uDDE1\uDDE3\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE89\uDE9D\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC50-\uDC6C\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46\uDD50-\uDD59\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD89\uDD98\uDDA0-\uDDA9\uDEE0-\uDEF2\uDFB0\uDFC0-\uDFD4]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD822\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879\uD880-\uD883][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF50-\uDF59\uDF5B-\uDF61\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDE40-\uDE96\uDF00-\uDF4A\uDF50\uDF93-\uDF9F\uDFE0\uDFE1\uDFE3]|\uD821[\uDC00-\uDFF7]|\uD823[\uDC00-\uDCD5\uDD00-\uDD08]|\uD82C[\uDC00-\uDD1E\uDD50-\uDD52\uDD64-\uDD67\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD834[\uDEE0-\uDEF3\uDF60-\uDF78]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD838[\uDD00-\uDD2C\uDD37-\uDD3D\uDD40-\uDD49\uDD4E\uDEC0-\uDEEB\uDEF0-\uDEF9]|\uD83A[\uDC00-\uDCC4\uDCC7-\uDCCF\uDD00-\uDD43\uDD4B\uDD50-\uDD59]|\uD83B[\uDC71-\uDCAB\uDCAD-\uDCAF\uDCB1-\uDCB4\uDD01-\uDD2D\uDD2F-\uDD3D\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD83C[\uDD00-\uDD0C]|\uD83E[\uDFF0-\uDFF9]|\uD869[\uDC00-\uDEDD\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A])/)) return; // _ can't be between two alphanumerics. \p{L}\p{N} includes non-english alphabet/numbers as well

          var nextChar = match[1] || match[2] || '';

          if (!nextChar || nextChar && (prevChar === '' || this.rules.inline.punctuation.exec(prevChar))) {
            var lLength = match[0].length - 1;
            var rDelim,
                rLength,
                delimTotal = lLength,
                midDelimTotal = 0;
            var endReg = match[0][0] === '*' ? this.rules.inline.emStrong.rDelimAst : this.rules.inline.emStrong.rDelimUnd;
            endReg.lastIndex = 0;
            maskedSrc = maskedSrc.slice(-1 * src.length + lLength); // Bump maskedSrc to same section of string as src (move to lexer?)

            while ((match = endReg.exec(maskedSrc)) != null) {
              rDelim = match[1] || match[2] || match[3] || match[4] || match[5] || match[6];
              if (!rDelim) continue; // matched the first alternative in rules.js (skip the * in __abc*abc__)

              rLength = rDelim.length;

              if (match[3] || match[4]) {
                // found another Left Delim
                delimTotal += rLength;
                continue;
              } else if (match[5] || match[6]) {
                // either Left or Right Delim
                if (lLength % 3 && !((lLength + rLength) % 3)) {
                  midDelimTotal += rLength;
                  continue; // CommonMark Emphasis Rules 9-10
                }
              }

              delimTotal -= rLength;
              if (delimTotal > 0) continue; // Haven't found enough closing delimiters
              // If this is the last rDelimiter, remove extra characters. *a*** -> *a*

              if (delimTotal + midDelimTotal - rLength <= 0 && !maskedSrc.slice(endReg.lastIndex).match(endReg)) {
                rLength = Math.min(rLength, rLength + delimTotal + midDelimTotal);
              }

              if (Math.min(lLength, rLength) % 2) {
                return {
                  type: 'em',
                  raw: src.slice(0, lLength + match.index + rLength + 1),
                  text: src.slice(1, lLength + match.index + rLength)
                };
              }

              if (Math.min(lLength, rLength) % 2 === 0) {
                return {
                  type: 'strong',
                  raw: src.slice(0, lLength + match.index + rLength + 1),
                  text: src.slice(2, lLength + match.index + rLength - 1)
                };
              }
            }
          }
        };

        _proto.codespan = function codespan(src) {
          var cap = this.rules.inline.code.exec(src);

          if (cap) {
            var text = cap[2].replace(/\n/g, ' ');
            var hasNonSpaceChars = /[^ ]/.test(text);
            var hasSpaceCharsOnBothEnds = /^ /.test(text) && / $/.test(text);

            if (hasNonSpaceChars && hasSpaceCharsOnBothEnds) {
              text = text.substring(1, text.length - 1);
            }

            text = _escape(text, true);
            return {
              type: 'codespan',
              raw: cap[0],
              text: text
            };
          }
        };

        _proto.br = function br(src) {
          var cap = this.rules.inline.br.exec(src);

          if (cap) {
            return {
              type: 'br',
              raw: cap[0]
            };
          }
        };

        _proto.del = function del(src) {
          var cap = this.rules.inline.del.exec(src);

          if (cap) {
            return {
              type: 'del',
              raw: cap[0],
              text: cap[2]
            };
          }
        };

        _proto.autolink = function autolink(src, mangle) {
          var cap = this.rules.inline.autolink.exec(src);

          if (cap) {
            var text, href;

            if (cap[2] === '@') {
              text = _escape(this.options.mangle ? mangle(cap[1]) : cap[1]);
              href = 'mailto:' + text;
            } else {
              text = _escape(cap[1]);
              href = text;
            }

            return {
              type: 'link',
              raw: cap[0],
              text: text,
              href: href,
              tokens: [{
                type: 'text',
                raw: text,
                text: text
              }]
            };
          }
        };

        _proto.url = function url(src, mangle) {
          var cap;

          if (cap = this.rules.inline.url.exec(src)) {
            var text, href;

            if (cap[2] === '@') {
              text = _escape(this.options.mangle ? mangle(cap[0]) : cap[0]);
              href = 'mailto:' + text;
            } else {
              // do extended autolink path validation
              var prevCapZero;

              do {
                prevCapZero = cap[0];
                cap[0] = this.rules.inline._backpedal.exec(cap[0])[0];
              } while (prevCapZero !== cap[0]);

              text = _escape(cap[0]);

              if (cap[1] === 'www.') {
                href = 'http://' + text;
              } else {
                href = text;
              }
            }

            return {
              type: 'link',
              raw: cap[0],
              text: text,
              href: href,
              tokens: [{
                type: 'text',
                raw: text,
                text: text
              }]
            };
          }
        };

        _proto.inlineText = function inlineText(src, inRawBlock, smartypants) {
          var cap = this.rules.inline.text.exec(src);

          if (cap) {
            var text;

            if (inRawBlock) {
              text = this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(cap[0]) : _escape(cap[0]) : cap[0];
            } else {
              text = _escape(this.options.smartypants ? smartypants(cap[0]) : cap[0]);
            }

            return {
              type: 'text',
              raw: cap[0],
              text: text
            };
          }
        };

        return Tokenizer;
      }();

      var noopTest = helpers.noopTest,
          edit = helpers.edit,
          merge$1 = helpers.merge;
      /**
       * Block-Level Grammar
       */

      var block$1 = {
        newline: /^(?: *(?:\n|$))+/,
        code: /^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/,
        fences: /^ {0,3}(`{3,}(?=[^`\n]*\n)|~{3,})([^\n]*)\n(?:|([\s\S]*?)\n)(?: {0,3}\1[~`]* *(?:\n+|$)|$)/,
        hr: /^ {0,3}((?:- *){3,}|(?:_ *){3,}|(?:\* *){3,})(?:\n+|$)/,
        heading: /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,
        blockquote: /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,
        list: /^( {0,3})(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?! {0,3}bull )\n*|\s*$)/,
        html: '^ {0,3}(?:' // optional indentation
        + '<(script|pre|style)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)' // (1)
        + '|comment[^\\n]*(\\n+|$)' // (2)
        + '|<\\?[\\s\\S]*?(?:\\?>\\n*|$)' // (3)
        + '|<![A-Z][\\s\\S]*?(?:>\\n*|$)' // (4)
        + '|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)' // (5)
        + '|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:\\n{2,}|$)' // (6)
        + '|<(?!script|pre|style)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:\\n{2,}|$)' // (7) open tag
        + '|</(?!script|pre|style)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:\\n{2,}|$)' // (7) closing tag
        + ')',
        def: /^ {0,3}\[(label)\]: *\n? *<?([^\s>]+)>?(?:(?: +\n? *| *\n *)(title))? *(?:\n+|$)/,
        nptable: noopTest,
        table: noopTest,
        lheading: /^([^\n]+)\n {0,3}(=+|-+) *(?:\n+|$)/,
        // regex template, placeholders will be replaced according to different paragraph
        // interruption rules of commonmark and the original markdown spec:
        _paragraph: /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html| +\n)[^\n]+)*)/,
        text: /^[^\n]+/
      };
      block$1._label = /(?!\s*\])(?:\\[\[\]]|[^\[\]])+/;
      block$1._title = /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/;
      block$1.def = edit(block$1.def).replace('label', block$1._label).replace('title', block$1._title).getRegex();
      block$1.bullet = /(?:[*+-]|\d{1,9}[.)])/;
      block$1.item = /^( *)(bull) ?[^\n]*(?:\n(?! *bull ?)[^\n]*)*/;
      block$1.item = edit(block$1.item, 'gm').replace(/bull/g, block$1.bullet).getRegex();
      block$1.listItemStart = edit(/^( *)(bull) */).replace('bull', block$1.bullet).getRegex();
      block$1.list = edit(block$1.list).replace(/bull/g, block$1.bullet).replace('hr', '\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))').replace('def', '\\n+(?=' + block$1.def.source + ')').getRegex();
      block$1._tag = 'address|article|aside|base|basefont|blockquote|body|caption' + '|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption' + '|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe' + '|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option' + '|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr' + '|track|ul';
      block$1._comment = /<!--(?!-?>)[\s\S]*?(?:-->|$)/;
      block$1.html = edit(block$1.html, 'i').replace('comment', block$1._comment).replace('tag', block$1._tag).replace('attribute', / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex();
      block$1.paragraph = edit(block$1._paragraph).replace('hr', block$1.hr).replace('heading', ' {0,3}#{1,6} ').replace('|lheading', '') // setex headings don't interrupt commonmark paragraphs
      .replace('blockquote', ' {0,3}>').replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n').replace('list', ' {0,3}(?:[*+-]|1[.)]) ') // only lists starting from 1 can interrupt
      .replace('html', '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|!--)').replace('tag', block$1._tag) // pars can be interrupted by type (6) html blocks
      .getRegex();
      block$1.blockquote = edit(block$1.blockquote).replace('paragraph', block$1.paragraph).getRegex();
      /**
       * Normal Block Grammar
       */

      block$1.normal = merge$1({}, block$1);
      /**
       * GFM Block Grammar
       */

      block$1.gfm = merge$1({}, block$1.normal, {
        nptable: '^ *([^|\\n ].*\\|.*)\\n' // Header
        + ' {0,3}([-:]+ *\\|[-| :]*)' // Align
        + '(?:\\n((?:(?!\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)',
        // Cells
        table: '^ *\\|(.+)\\n' // Header
        + ' {0,3}\\|?( *[-:]+[-| :]*)' // Align
        + '(?:\\n *((?:(?!\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)' // Cells

      });
      block$1.gfm.nptable = edit(block$1.gfm.nptable).replace('hr', block$1.hr).replace('heading', ' {0,3}#{1,6} ').replace('blockquote', ' {0,3}>').replace('code', ' {4}[^\\n]').replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n').replace('list', ' {0,3}(?:[*+-]|1[.)]) ') // only lists starting from 1 can interrupt
      .replace('html', '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|!--)').replace('tag', block$1._tag) // tables can be interrupted by type (6) html blocks
      .getRegex();
      block$1.gfm.table = edit(block$1.gfm.table).replace('hr', block$1.hr).replace('heading', ' {0,3}#{1,6} ').replace('blockquote', ' {0,3}>').replace('code', ' {4}[^\\n]').replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n').replace('list', ' {0,3}(?:[*+-]|1[.)]) ') // only lists starting from 1 can interrupt
      .replace('html', '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|!--)').replace('tag', block$1._tag) // tables can be interrupted by type (6) html blocks
      .getRegex();
      /**
       * Pedantic grammar (original John Gruber's loose markdown specification)
       */

      block$1.pedantic = merge$1({}, block$1.normal, {
        html: edit('^ *(?:comment *(?:\\n|\\s*$)' + '|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)' // closed tag
        + '|<tag(?:"[^"]*"|\'[^\']*\'|\\s[^\'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))').replace('comment', block$1._comment).replace(/tag/g, '(?!(?:' + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub' + '|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)' + '\\b)\\w+(?!:|[^\\w\\s@]*@)\\b').getRegex(),
        def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
        heading: /^(#{1,6})(.*)(?:\n+|$)/,
        fences: noopTest,
        // fences not supported
        paragraph: edit(block$1.normal._paragraph).replace('hr', block$1.hr).replace('heading', ' *#{1,6} *[^\n]').replace('lheading', block$1.lheading).replace('blockquote', ' {0,3}>').replace('|fences', '').replace('|list', '').replace('|html', '').getRegex()
      });
      /**
       * Inline-Level Grammar
       */

      var inline$1 = {
        escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
        autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/,
        url: noopTest,
        tag: '^comment' + '|^</[a-zA-Z][\\w:-]*\\s*>' // self-closing tag
        + '|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>' // open tag
        + '|^<\\?[\\s\\S]*?\\?>' // processing instruction, e.g. <?php ?>
        + '|^<![a-zA-Z]+\\s[\\s\\S]*?>' // declaration, e.g. <!DOCTYPE html>
        + '|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>',
        // CDATA section
        link: /^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/,
        reflink: /^!?\[(label)\]\[(?!\s*\])((?:\\[\[\]]?|[^\[\]\\])+)\]/,
        nolink: /^!?\[(?!\s*\])((?:\[[^\[\]]*\]|\\[\[\]]|[^\[\]])*)\](?:\[\])?/,
        reflinkSearch: 'reflink|nolink(?!\\()',
        emStrong: {
          lDelim: /^(?:\*+(?:([punct_])|[^\s*]))|^_+(?:([punct*])|([^\s_]))/,
          //        (1) and (2) can only be a Right Delimiter. (3) and (4) can only be Left.  (5) and (6) can be either Left or Right.
          //        () Skip other delimiter (1) #***                (2) a***#, a***                   (3) #***a, ***a                 (4) ***#              (5) #***#                 (6) a***a
          rDelimAst: /\_\_[^_]*?\*[^_]*?\_\_|[punct_](\*+)(?=[\s]|$)|[^punct*_\s](\*+)(?=[punct_\s]|$)|[punct_\s](\*+)(?=[^punct*_\s])|[\s](\*+)(?=[punct_])|[punct_](\*+)(?=[punct_])|[^punct*_\s](\*+)(?=[^punct*_\s])/,
          rDelimUnd: /\*\*[^*]*?\_[^*]*?\*\*|[punct*](\_+)(?=[\s]|$)|[^punct*_\s](\_+)(?=[punct*\s]|$)|[punct*\s](\_+)(?=[^punct*_\s])|[\s](\_+)(?=[punct*])|[punct*](\_+)(?=[punct*])/ // ^- Not allowed for _

        },
        code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
        br: /^( {2,}|\\)\n(?!\s*$)/,
        del: noopTest,
        text: /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,
        punctuation: /^([\spunctuation])/
      }; // list of punctuation marks from CommonMark spec
      // without * and _ to handle the different emphasis markers * and _

      inline$1._punctuation = '!"#$%&\'()+\\-.,/:;<=>?@\\[\\]`^{|}~';
      inline$1.punctuation = edit(inline$1.punctuation).replace(/punctuation/g, inline$1._punctuation).getRegex(); // sequences em should skip over [title](link), `code`, <html>

      inline$1.blockSkip = /\[[^\]]*?\]\([^\)]*?\)|`[^`]*?`|<[^>]*?>/g;
      inline$1.escapedEmSt = /\\\*|\\_/g;
      inline$1._comment = edit(block$1._comment).replace('(?:-->|$)', '-->').getRegex();
      inline$1.emStrong.lDelim = edit(inline$1.emStrong.lDelim).replace(/punct/g, inline$1._punctuation).getRegex();
      inline$1.emStrong.rDelimAst = edit(inline$1.emStrong.rDelimAst, 'g').replace(/punct/g, inline$1._punctuation).getRegex();
      inline$1.emStrong.rDelimUnd = edit(inline$1.emStrong.rDelimUnd, 'g').replace(/punct/g, inline$1._punctuation).getRegex();
      inline$1._escapes = /\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g;
      inline$1._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/;
      inline$1._email = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/;
      inline$1.autolink = edit(inline$1.autolink).replace('scheme', inline$1._scheme).replace('email', inline$1._email).getRegex();
      inline$1._attribute = /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/;
      inline$1.tag = edit(inline$1.tag).replace('comment', inline$1._comment).replace('attribute', inline$1._attribute).getRegex();
      inline$1._label = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/;
      inline$1._href = /<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/;
      inline$1._title = /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/;
      inline$1.link = edit(inline$1.link).replace('label', inline$1._label).replace('href', inline$1._href).replace('title', inline$1._title).getRegex();
      inline$1.reflink = edit(inline$1.reflink).replace('label', inline$1._label).getRegex();
      inline$1.reflinkSearch = edit(inline$1.reflinkSearch, 'g').replace('reflink', inline$1.reflink).replace('nolink', inline$1.nolink).getRegex();
      /**
       * Normal Inline Grammar
       */

      inline$1.normal = merge$1({}, inline$1);
      /**
       * Pedantic Inline Grammar
       */

      inline$1.pedantic = merge$1({}, inline$1.normal, {
        strong: {
          start: /^__|\*\*/,
          middle: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
          endAst: /\*\*(?!\*)/g,
          endUnd: /__(?!_)/g
        },
        em: {
          start: /^_|\*/,
          middle: /^()\*(?=\S)([\s\S]*?\S)\*(?!\*)|^_(?=\S)([\s\S]*?\S)_(?!_)/,
          endAst: /\*(?!\*)/g,
          endUnd: /_(?!_)/g
        },
        link: edit(/^!?\[(label)\]\((.*?)\)/).replace('label', inline$1._label).getRegex(),
        reflink: edit(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace('label', inline$1._label).getRegex()
      });
      /**
       * GFM Inline Grammar
       */

      inline$1.gfm = merge$1({}, inline$1.normal, {
        escape: edit(inline$1.escape).replace('])', '~|])').getRegex(),
        _extended_email: /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,
        url: /^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,
        _backpedal: /(?:[^?!.,:;*_~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_~)]+(?!$))+/,
        del: /^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,
        text: /^([`~]+|[^`~])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))/
      });
      inline$1.gfm.url = edit(inline$1.gfm.url, 'i').replace('email', inline$1.gfm._extended_email).getRegex();
      /**
       * GFM + Line Breaks Inline Grammar
       */

      inline$1.breaks = merge$1({}, inline$1.gfm, {
        br: edit(inline$1.br).replace('{2,}', '*').getRegex(),
        text: edit(inline$1.gfm.text).replace('\\b_', '\\b_| {2,}\\n').replace(/\{2,\}/g, '*').getRegex()
      });
      var rules = {
        block: block$1,
        inline: inline$1
      };

      var defaults$3 = defaults$5.defaults;
      var block = rules.block,
          inline = rules.inline;
      var repeatString = helpers.repeatString;
      /**
       * smartypants text replacement
       */

      function smartypants(text) {
        return text // em-dashes
        .replace(/---/g, "\u2014") // en-dashes
        .replace(/--/g, "\u2013") // opening singles
        .replace(/(^|[-\u2014/(\[{"\s])'/g, "$1\u2018") // closing singles & apostrophes
        .replace(/'/g, "\u2019") // opening doubles
        .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, "$1\u201C") // closing doubles
        .replace(/"/g, "\u201D") // ellipses
        .replace(/\.{3}/g, "\u2026");
      }
      /**
       * mangle email addresses
       */


      function mangle(text) {
        var out = '',
            i,
            ch;
        var l = text.length;

        for (i = 0; i < l; i++) {
          ch = text.charCodeAt(i);

          if (Math.random() > 0.5) {
            ch = 'x' + ch.toString(16);
          }

          out += '&#' + ch + ';';
        }

        return out;
      }
      /**
       * Block Lexer
       */


      var Lexer_1 = /*#__PURE__*/function () {
        function Lexer(options) {
          this.tokens = [];
          this.tokens.links = Object.create(null);
          this.options = options || defaults$3;
          this.options.tokenizer = this.options.tokenizer || new Tokenizer_1();
          this.tokenizer = this.options.tokenizer;
          this.tokenizer.options = this.options;
          var rules = {
            block: block.normal,
            inline: inline.normal
          };

          if (this.options.pedantic) {
            rules.block = block.pedantic;
            rules.inline = inline.pedantic;
          } else if (this.options.gfm) {
            rules.block = block.gfm;

            if (this.options.breaks) {
              rules.inline = inline.breaks;
            } else {
              rules.inline = inline.gfm;
            }
          }

          this.tokenizer.rules = rules;
        }
        /**
         * Expose Rules
         */


        /**
         * Static Lex Method
         */
        Lexer.lex = function lex(src, options) {
          var lexer = new Lexer(options);
          return lexer.lex(src);
        }
        /**
         * Static Lex Inline Method
         */
        ;

        Lexer.lexInline = function lexInline(src, options) {
          var lexer = new Lexer(options);
          return lexer.inlineTokens(src);
        }
        /**
         * Preprocessing
         */
        ;

        var _proto = Lexer.prototype;

        _proto.lex = function lex(src) {
          src = src.replace(/\r\n|\r/g, '\n').replace(/\t/g, '    ');
          this.blockTokens(src, this.tokens, true);
          this.inline(this.tokens);
          return this.tokens;
        }
        /**
         * Lexing
         */
        ;

        _proto.blockTokens = function blockTokens(src, tokens, top) {
          if (tokens === void 0) {
            tokens = [];
          }

          if (top === void 0) {
            top = true;
          }

          if (this.options.pedantic) {
            src = src.replace(/^ +$/gm, '');
          }

          var token, i, l, lastToken;

          while (src) {
            // newline
            if (token = this.tokenizer.space(src)) {
              src = src.substring(token.raw.length);

              if (token.type) {
                tokens.push(token);
              }

              continue;
            } // code


            if (token = this.tokenizer.code(src)) {
              src = src.substring(token.raw.length);
              lastToken = tokens[tokens.length - 1]; // An indented code block cannot interrupt a paragraph.

              if (lastToken && lastToken.type === 'paragraph') {
                lastToken.raw += '\n' + token.raw;
                lastToken.text += '\n' + token.text;
              } else {
                tokens.push(token);
              }

              continue;
            } // fences


            if (token = this.tokenizer.fences(src)) {
              src = src.substring(token.raw.length);
              tokens.push(token);
              continue;
            } // heading


            if (token = this.tokenizer.heading(src)) {
              src = src.substring(token.raw.length);
              tokens.push(token);
              continue;
            } // table no leading pipe (gfm)


            if (token = this.tokenizer.nptable(src)) {
              src = src.substring(token.raw.length);
              tokens.push(token);
              continue;
            } // hr


            if (token = this.tokenizer.hr(src)) {
              src = src.substring(token.raw.length);
              tokens.push(token);
              continue;
            } // blockquote


            if (token = this.tokenizer.blockquote(src)) {
              src = src.substring(token.raw.length);
              token.tokens = this.blockTokens(token.text, [], top);
              tokens.push(token);
              continue;
            } // list


            if (token = this.tokenizer.list(src)) {
              src = src.substring(token.raw.length);
              l = token.items.length;

              for (i = 0; i < l; i++) {
                token.items[i].tokens = this.blockTokens(token.items[i].text, [], false);
              }

              tokens.push(token);
              continue;
            } // html


            if (token = this.tokenizer.html(src)) {
              src = src.substring(token.raw.length);
              tokens.push(token);
              continue;
            } // def


            if (top && (token = this.tokenizer.def(src))) {
              src = src.substring(token.raw.length);

              if (!this.tokens.links[token.tag]) {
                this.tokens.links[token.tag] = {
                  href: token.href,
                  title: token.title
                };
              }

              continue;
            } // table (gfm)


            if (token = this.tokenizer.table(src)) {
              src = src.substring(token.raw.length);
              tokens.push(token);
              continue;
            } // lheading


            if (token = this.tokenizer.lheading(src)) {
              src = src.substring(token.raw.length);
              tokens.push(token);
              continue;
            } // top-level paragraph


            if (top && (token = this.tokenizer.paragraph(src))) {
              src = src.substring(token.raw.length);
              tokens.push(token);
              continue;
            } // text


            if (token = this.tokenizer.text(src)) {
              src = src.substring(token.raw.length);
              lastToken = tokens[tokens.length - 1];

              if (lastToken && lastToken.type === 'text') {
                lastToken.raw += '\n' + token.raw;
                lastToken.text += '\n' + token.text;
              } else {
                tokens.push(token);
              }

              continue;
            }

            if (src) {
              var errMsg = 'Infinite loop on byte: ' + src.charCodeAt(0);

              if (this.options.silent) {
                console.error(errMsg);
                break;
              } else {
                throw new Error(errMsg);
              }
            }
          }

          return tokens;
        };

        _proto.inline = function inline(tokens) {
          var i, j, k, l2, row, token;
          var l = tokens.length;

          for (i = 0; i < l; i++) {
            token = tokens[i];

            switch (token.type) {
              case 'paragraph':
              case 'text':
              case 'heading':
                {
                  token.tokens = [];
                  this.inlineTokens(token.text, token.tokens);
                  break;
                }

              case 'table':
                {
                  token.tokens = {
                    header: [],
                    cells: []
                  }; // header

                  l2 = token.header.length;

                  for (j = 0; j < l2; j++) {
                    token.tokens.header[j] = [];
                    this.inlineTokens(token.header[j], token.tokens.header[j]);
                  } // cells


                  l2 = token.cells.length;

                  for (j = 0; j < l2; j++) {
                    row = token.cells[j];
                    token.tokens.cells[j] = [];

                    for (k = 0; k < row.length; k++) {
                      token.tokens.cells[j][k] = [];
                      this.inlineTokens(row[k], token.tokens.cells[j][k]);
                    }
                  }

                  break;
                }

              case 'blockquote':
                {
                  this.inline(token.tokens);
                  break;
                }

              case 'list':
                {
                  l2 = token.items.length;

                  for (j = 0; j < l2; j++) {
                    this.inline(token.items[j].tokens);
                  }

                  break;
                }
            }
          }

          return tokens;
        }
        /**
         * Lexing/Compiling
         */
        ;

        _proto.inlineTokens = function inlineTokens(src, tokens, inLink, inRawBlock) {
          if (tokens === void 0) {
            tokens = [];
          }

          if (inLink === void 0) {
            inLink = false;
          }

          if (inRawBlock === void 0) {
            inRawBlock = false;
          }

          var token, lastToken; // String with links masked to avoid interference with em and strong

          var maskedSrc = src;
          var match;
          var keepPrevChar, prevChar; // Mask out reflinks

          if (this.tokens.links) {
            var links = Object.keys(this.tokens.links);

            if (links.length > 0) {
              while ((match = this.tokenizer.rules.inline.reflinkSearch.exec(maskedSrc)) != null) {
                if (links.includes(match[0].slice(match[0].lastIndexOf('[') + 1, -1))) {
                  maskedSrc = maskedSrc.slice(0, match.index) + '[' + repeatString('a', match[0].length - 2) + ']' + maskedSrc.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex);
                }
              }
            }
          } // Mask out other blocks


          while ((match = this.tokenizer.rules.inline.blockSkip.exec(maskedSrc)) != null) {
            maskedSrc = maskedSrc.slice(0, match.index) + '[' + repeatString('a', match[0].length - 2) + ']' + maskedSrc.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
          } // Mask out escaped em & strong delimiters


          while ((match = this.tokenizer.rules.inline.escapedEmSt.exec(maskedSrc)) != null) {
            maskedSrc = maskedSrc.slice(0, match.index) + '++' + maskedSrc.slice(this.tokenizer.rules.inline.escapedEmSt.lastIndex);
          }

          while (src) {
            if (!keepPrevChar) {
              prevChar = '';
            }

            keepPrevChar = false; // escape

            if (token = this.tokenizer.escape(src)) {
              src = src.substring(token.raw.length);
              tokens.push(token);
              continue;
            } // tag


            if (token = this.tokenizer.tag(src, inLink, inRawBlock)) {
              src = src.substring(token.raw.length);
              inLink = token.inLink;
              inRawBlock = token.inRawBlock;
              var _lastToken = tokens[tokens.length - 1];

              if (_lastToken && token.type === 'text' && _lastToken.type === 'text') {
                _lastToken.raw += token.raw;
                _lastToken.text += token.text;
              } else {
                tokens.push(token);
              }

              continue;
            } // link


            if (token = this.tokenizer.link(src)) {
              src = src.substring(token.raw.length);

              if (token.type === 'link') {
                token.tokens = this.inlineTokens(token.text, [], true, inRawBlock);
              }

              tokens.push(token);
              continue;
            } // reflink, nolink


            if (token = this.tokenizer.reflink(src, this.tokens.links)) {
              src = src.substring(token.raw.length);
              var _lastToken2 = tokens[tokens.length - 1];

              if (token.type === 'link') {
                token.tokens = this.inlineTokens(token.text, [], true, inRawBlock);
                tokens.push(token);
              } else if (_lastToken2 && token.type === 'text' && _lastToken2.type === 'text') {
                _lastToken2.raw += token.raw;
                _lastToken2.text += token.text;
              } else {
                tokens.push(token);
              }

              continue;
            } // em & strong


            if (token = this.tokenizer.emStrong(src, maskedSrc, prevChar)) {
              src = src.substring(token.raw.length);
              token.tokens = this.inlineTokens(token.text, [], inLink, inRawBlock);
              tokens.push(token);
              continue;
            } // code


            if (token = this.tokenizer.codespan(src)) {
              src = src.substring(token.raw.length);
              tokens.push(token);
              continue;
            } // br


            if (token = this.tokenizer.br(src)) {
              src = src.substring(token.raw.length);
              tokens.push(token);
              continue;
            } // del (gfm)


            if (token = this.tokenizer.del(src)) {
              src = src.substring(token.raw.length);
              token.tokens = this.inlineTokens(token.text, [], inLink, inRawBlock);
              tokens.push(token);
              continue;
            } // autolink


            if (token = this.tokenizer.autolink(src, mangle)) {
              src = src.substring(token.raw.length);
              tokens.push(token);
              continue;
            } // url (gfm)


            if (!inLink && (token = this.tokenizer.url(src, mangle))) {
              src = src.substring(token.raw.length);
              tokens.push(token);
              continue;
            } // text


            if (token = this.tokenizer.inlineText(src, inRawBlock, smartypants)) {
              src = src.substring(token.raw.length);

              if (token.raw.slice(-1) !== '_') {
                // Track prevChar before string of ____ started
                prevChar = token.raw.slice(-1);
              }

              keepPrevChar = true;
              lastToken = tokens[tokens.length - 1];

              if (lastToken && lastToken.type === 'text') {
                lastToken.raw += token.raw;
                lastToken.text += token.text;
              } else {
                tokens.push(token);
              }

              continue;
            }

            if (src) {
              var errMsg = 'Infinite loop on byte: ' + src.charCodeAt(0);

              if (this.options.silent) {
                console.error(errMsg);
                break;
              } else {
                throw new Error(errMsg);
              }
            }
          }

          return tokens;
        };

        _createClass(Lexer, null, [{
          key: "rules",
          get: function get() {
            return {
              block: block,
              inline: inline
            };
          }
        }]);

        return Lexer;
      }();

      var defaults$2 = defaults$5.defaults;
      var cleanUrl = helpers.cleanUrl,
          escape$1 = helpers.escape;
      /**
       * Renderer
       */

      var Renderer_1 = /*#__PURE__*/function () {
        function Renderer(options) {
          this.options = options || defaults$2;
        }

        var _proto = Renderer.prototype;

        _proto.code = function code(_code, infostring, escaped) {
          var lang = (infostring || '').match(/\S*/)[0];

          if (this.options.highlight) {
            var out = this.options.highlight(_code, lang);

            if (out != null && out !== _code) {
              escaped = true;
              _code = out;
            }
          }

          _code = _code.replace(/\n$/, '') + '\n';

          if (!lang) {
            return '<pre><code>' + (escaped ? _code : escape$1(_code, true)) + '</code></pre>\n';
          }

          return '<pre><code class="' + this.options.langPrefix + escape$1(lang, true) + '">' + (escaped ? _code : escape$1(_code, true)) + '</code></pre>\n';
        };

        _proto.blockquote = function blockquote(quote) {
          return '<blockquote>\n' + quote + '</blockquote>\n';
        };

        _proto.html = function html(_html) {
          return _html;
        };

        _proto.heading = function heading(text, level, raw, slugger) {
          if (this.options.headerIds) {
            return '<h' + level + ' id="' + this.options.headerPrefix + slugger.slug(raw) + '">' + text + '</h' + level + '>\n';
          } // ignore IDs


          return '<h' + level + '>' + text + '</h' + level + '>\n';
        };

        _proto.hr = function hr() {
          return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
        };

        _proto.list = function list(body, ordered, start) {
          var type = ordered ? 'ol' : 'ul',
              startatt = ordered && start !== 1 ? ' start="' + start + '"' : '';
          return '<' + type + startatt + '>\n' + body + '</' + type + '>\n';
        };

        _proto.listitem = function listitem(text) {
          return '<li>' + text + '</li>\n';
        };

        _proto.checkbox = function checkbox(checked) {
          return '<input ' + (checked ? 'checked="" ' : '') + 'disabled="" type="checkbox"' + (this.options.xhtml ? ' /' : '') + '> ';
        };

        _proto.paragraph = function paragraph(text) {
          return '<p>' + text + '</p>\n';
        };

        _proto.table = function table(header, body) {
          if (body) body = '<tbody>' + body + '</tbody>';
          return '<table>\n' + '<thead>\n' + header + '</thead>\n' + body + '</table>\n';
        };

        _proto.tablerow = function tablerow(content) {
          return '<tr>\n' + content + '</tr>\n';
        };

        _proto.tablecell = function tablecell(content, flags) {
          var type = flags.header ? 'th' : 'td';
          var tag = flags.align ? '<' + type + ' align="' + flags.align + '">' : '<' + type + '>';
          return tag + content + '</' + type + '>\n';
        } // span level renderer
        ;

        _proto.strong = function strong(text) {
          return '<strong>' + text + '</strong>';
        };

        _proto.em = function em(text) {
          return '<em>' + text + '</em>';
        };

        _proto.codespan = function codespan(text) {
          return '<code>' + text + '</code>';
        };

        _proto.br = function br() {
          return this.options.xhtml ? '<br/>' : '<br>';
        };

        _proto.del = function del(text) {
          return '<del>' + text + '</del>';
        };

        _proto.link = function link(href, title, text) {
          href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);

          if (href === null) {
            return text;
          }

          var out = '<a href="' + escape$1(href) + '"';

          if (title) {
            out += ' title="' + title + '"';
          }

          out += '>' + text + '</a>';
          return out;
        };

        _proto.image = function image(href, title, text) {
          href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);

          if (href === null) {
            return text;
          }

          var out = '<img src="' + href + '" alt="' + text + '"';

          if (title) {
            out += ' title="' + title + '"';
          }

          out += this.options.xhtml ? '/>' : '>';
          return out;
        };

        _proto.text = function text(_text) {
          return _text;
        };

        return Renderer;
      }();

      /**
       * TextRenderer
       * returns only the textual part of the token
       */
      var TextRenderer_1 = /*#__PURE__*/function () {
        function TextRenderer() {}

        var _proto = TextRenderer.prototype;

        // no need for block level renderers
        _proto.strong = function strong(text) {
          return text;
        };

        _proto.em = function em(text) {
          return text;
        };

        _proto.codespan = function codespan(text) {
          return text;
        };

        _proto.del = function del(text) {
          return text;
        };

        _proto.html = function html(text) {
          return text;
        };

        _proto.text = function text(_text) {
          return _text;
        };

        _proto.link = function link(href, title, text) {
          return '' + text;
        };

        _proto.image = function image(href, title, text) {
          return '' + text;
        };

        _proto.br = function br() {
          return '';
        };

        return TextRenderer;
      }();

      /**
       * Slugger generates header id
       */
      var Slugger_1 = /*#__PURE__*/function () {
        function Slugger() {
          this.seen = {};
        }

        var _proto = Slugger.prototype;

        _proto.serialize = function serialize(value) {
          return value.toLowerCase().trim() // remove html tags
          .replace(/<[!\/a-z].*?>/ig, '') // remove unwanted chars
          .replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g, '').replace(/\s/g, '-');
        }
        /**
         * Finds the next safe (unique) slug to use
         */
        ;

        _proto.getNextSafeSlug = function getNextSafeSlug(originalSlug, isDryRun) {
          var slug = originalSlug;
          var occurenceAccumulator = 0;

          if (this.seen.hasOwnProperty(slug)) {
            occurenceAccumulator = this.seen[originalSlug];

            do {
              occurenceAccumulator++;
              slug = originalSlug + '-' + occurenceAccumulator;
            } while (this.seen.hasOwnProperty(slug));
          }

          if (!isDryRun) {
            this.seen[originalSlug] = occurenceAccumulator;
            this.seen[slug] = 0;
          }

          return slug;
        }
        /**
         * Convert string to unique id
         * @param {object} options
         * @param {boolean} options.dryrun Generates the next unique slug without updating the internal accumulator.
         */
        ;

        _proto.slug = function slug(value, options) {
          if (options === void 0) {
            options = {};
          }

          var slug = this.serialize(value);
          return this.getNextSafeSlug(slug, options.dryrun);
        };

        return Slugger;
      }();

      var defaults$1 = defaults$5.defaults;
      var unescape = helpers.unescape;
      /**
       * Parsing & Compiling
       */

      var Parser_1 = /*#__PURE__*/function () {
        function Parser(options) {
          this.options = options || defaults$1;
          this.options.renderer = this.options.renderer || new Renderer_1();
          this.renderer = this.options.renderer;
          this.renderer.options = this.options;
          this.textRenderer = new TextRenderer_1();
          this.slugger = new Slugger_1();
        }
        /**
         * Static Parse Method
         */


        Parser.parse = function parse(tokens, options) {
          var parser = new Parser(options);
          return parser.parse(tokens);
        }
        /**
         * Static Parse Inline Method
         */
        ;

        Parser.parseInline = function parseInline(tokens, options) {
          var parser = new Parser(options);
          return parser.parseInline(tokens);
        }
        /**
         * Parse Loop
         */
        ;

        var _proto = Parser.prototype;

        _proto.parse = function parse(tokens, top) {
          if (top === void 0) {
            top = true;
          }

          var out = '',
              i,
              j,
              k,
              l2,
              l3,
              row,
              cell,
              header,
              body,
              token,
              ordered,
              start,
              loose,
              itemBody,
              item,
              checked,
              task,
              checkbox;
          var l = tokens.length;

          for (i = 0; i < l; i++) {
            token = tokens[i];

            switch (token.type) {
              case 'space':
                {
                  continue;
                }

              case 'hr':
                {
                  out += this.renderer.hr();
                  continue;
                }

              case 'heading':
                {
                  out += this.renderer.heading(this.parseInline(token.tokens), token.depth, unescape(this.parseInline(token.tokens, this.textRenderer)), this.slugger);
                  continue;
                }

              case 'code':
                {
                  out += this.renderer.code(token.text, token.lang, token.escaped);
                  continue;
                }

              case 'table':
                {
                  header = ''; // header

                  cell = '';
                  l2 = token.header.length;

                  for (j = 0; j < l2; j++) {
                    cell += this.renderer.tablecell(this.parseInline(token.tokens.header[j]), {
                      header: true,
                      align: token.align[j]
                    });
                  }

                  header += this.renderer.tablerow(cell);
                  body = '';
                  l2 = token.cells.length;

                  for (j = 0; j < l2; j++) {
                    row = token.tokens.cells[j];
                    cell = '';
                    l3 = row.length;

                    for (k = 0; k < l3; k++) {
                      cell += this.renderer.tablecell(this.parseInline(row[k]), {
                        header: false,
                        align: token.align[k]
                      });
                    }

                    body += this.renderer.tablerow(cell);
                  }

                  out += this.renderer.table(header, body);
                  continue;
                }

              case 'blockquote':
                {
                  body = this.parse(token.tokens);
                  out += this.renderer.blockquote(body);
                  continue;
                }

              case 'list':
                {
                  ordered = token.ordered;
                  start = token.start;
                  loose = token.loose;
                  l2 = token.items.length;
                  body = '';

                  for (j = 0; j < l2; j++) {
                    item = token.items[j];
                    checked = item.checked;
                    task = item.task;
                    itemBody = '';

                    if (item.task) {
                      checkbox = this.renderer.checkbox(checked);

                      if (loose) {
                        if (item.tokens.length > 0 && item.tokens[0].type === 'text') {
                          item.tokens[0].text = checkbox + ' ' + item.tokens[0].text;

                          if (item.tokens[0].tokens && item.tokens[0].tokens.length > 0 && item.tokens[0].tokens[0].type === 'text') {
                            item.tokens[0].tokens[0].text = checkbox + ' ' + item.tokens[0].tokens[0].text;
                          }
                        } else {
                          item.tokens.unshift({
                            type: 'text',
                            text: checkbox
                          });
                        }
                      } else {
                        itemBody += checkbox;
                      }
                    }

                    itemBody += this.parse(item.tokens, loose);
                    body += this.renderer.listitem(itemBody, task, checked);
                  }

                  out += this.renderer.list(body, ordered, start);
                  continue;
                }

              case 'html':
                {
                  // TODO parse inline content if parameter markdown=1
                  out += this.renderer.html(token.text);
                  continue;
                }

              case 'paragraph':
                {
                  out += this.renderer.paragraph(this.parseInline(token.tokens));
                  continue;
                }

              case 'text':
                {
                  body = token.tokens ? this.parseInline(token.tokens) : token.text;

                  while (i + 1 < l && tokens[i + 1].type === 'text') {
                    token = tokens[++i];
                    body += '\n' + (token.tokens ? this.parseInline(token.tokens) : token.text);
                  }

                  out += top ? this.renderer.paragraph(body) : body;
                  continue;
                }

              default:
                {
                  var errMsg = 'Token with "' + token.type + '" type was not found.';

                  if (this.options.silent) {
                    console.error(errMsg);
                    return;
                  } else {
                    throw new Error(errMsg);
                  }
                }
            }
          }

          return out;
        }
        /**
         * Parse Inline Tokens
         */
        ;

        _proto.parseInline = function parseInline(tokens, renderer) {
          renderer = renderer || this.renderer;
          var out = '',
              i,
              token;
          var l = tokens.length;

          for (i = 0; i < l; i++) {
            token = tokens[i];

            switch (token.type) {
              case 'escape':
                {
                  out += renderer.text(token.text);
                  break;
                }

              case 'html':
                {
                  out += renderer.html(token.text);
                  break;
                }

              case 'link':
                {
                  out += renderer.link(token.href, token.title, this.parseInline(token.tokens, renderer));
                  break;
                }

              case 'image':
                {
                  out += renderer.image(token.href, token.title, token.text);
                  break;
                }

              case 'strong':
                {
                  out += renderer.strong(this.parseInline(token.tokens, renderer));
                  break;
                }

              case 'em':
                {
                  out += renderer.em(this.parseInline(token.tokens, renderer));
                  break;
                }

              case 'codespan':
                {
                  out += renderer.codespan(token.text);
                  break;
                }

              case 'br':
                {
                  out += renderer.br();
                  break;
                }

              case 'del':
                {
                  out += renderer.del(this.parseInline(token.tokens, renderer));
                  break;
                }

              case 'text':
                {
                  out += renderer.text(token.text);
                  break;
                }

              default:
                {
                  var errMsg = 'Token with "' + token.type + '" type was not found.';

                  if (this.options.silent) {
                    console.error(errMsg);
                    return;
                  } else {
                    throw new Error(errMsg);
                  }
                }
            }
          }

          return out;
        };

        return Parser;
      }();

      var merge = helpers.merge,
          checkSanitizeDeprecation = helpers.checkSanitizeDeprecation,
          escape = helpers.escape;
      var getDefaults = defaults$5.getDefaults,
          changeDefaults = defaults$5.changeDefaults,
          defaults = defaults$5.defaults;
      /**
       * Marked
       */

      function marked(src, opt, callback) {
        // throw error in case of non string input
        if (typeof src === 'undefined' || src === null) {
          throw new Error('marked(): input parameter is undefined or null');
        }

        if (typeof src !== 'string') {
          throw new Error('marked(): input parameter is of type ' + Object.prototype.toString.call(src) + ', string expected');
        }

        if (typeof opt === 'function') {
          callback = opt;
          opt = null;
        }

        opt = merge({}, marked.defaults, opt || {});
        checkSanitizeDeprecation(opt);

        if (callback) {
          var highlight = opt.highlight;
          var tokens;

          try {
            tokens = Lexer_1.lex(src, opt);
          } catch (e) {
            return callback(e);
          }

          var done = function done(err) {
            var out;

            if (!err) {
              try {
                out = Parser_1.parse(tokens, opt);
              } catch (e) {
                err = e;
              }
            }

            opt.highlight = highlight;
            return err ? callback(err) : callback(null, out);
          };

          if (!highlight || highlight.length < 3) {
            return done();
          }

          delete opt.highlight;
          if (!tokens.length) return done();
          var pending = 0;
          marked.walkTokens(tokens, function (token) {
            if (token.type === 'code') {
              pending++;
              setTimeout(function () {
                highlight(token.text, token.lang, function (err, code) {
                  if (err) {
                    return done(err);
                  }

                  if (code != null && code !== token.text) {
                    token.text = code;
                    token.escaped = true;
                  }

                  pending--;

                  if (pending === 0) {
                    done();
                  }
                });
              }, 0);
            }
          });

          if (pending === 0) {
            done();
          }

          return;
        }

        try {
          var _tokens = Lexer_1.lex(src, opt);

          if (opt.walkTokens) {
            marked.walkTokens(_tokens, opt.walkTokens);
          }

          return Parser_1.parse(_tokens, opt);
        } catch (e) {
          e.message += '\nPlease report this to https://github.com/markedjs/marked.';

          if (opt.silent) {
            return '<p>An error occurred:</p><pre>' + escape(e.message + '', true) + '</pre>';
          }

          throw e;
        }
      }
      /**
       * Options
       */


      marked.options = marked.setOptions = function (opt) {
        merge(marked.defaults, opt);
        changeDefaults(marked.defaults);
        return marked;
      };

      marked.getDefaults = getDefaults;
      marked.defaults = defaults;
      /**
       * Use Extension
       */

      marked.use = function (extension) {
        var opts = merge({}, extension);

        if (extension.renderer) {
          (function () {
            var renderer = marked.defaults.renderer || new Renderer_1();

            var _loop = function _loop(prop) {
              var prevRenderer = renderer[prop];

              renderer[prop] = function () {
                for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                  args[_key] = arguments[_key];
                }

                var ret = extension.renderer[prop].apply(renderer, args);

                if (ret === false) {
                  ret = prevRenderer.apply(renderer, args);
                }

                return ret;
              };
            };

            for (var prop in extension.renderer) {
              _loop(prop);
            }

            opts.renderer = renderer;
          })();
        }

        if (extension.tokenizer) {
          (function () {
            var tokenizer = marked.defaults.tokenizer || new Tokenizer_1();

            var _loop2 = function _loop2(prop) {
              var prevTokenizer = tokenizer[prop];

              tokenizer[prop] = function () {
                for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                  args[_key2] = arguments[_key2];
                }

                var ret = extension.tokenizer[prop].apply(tokenizer, args);

                if (ret === false) {
                  ret = prevTokenizer.apply(tokenizer, args);
                }

                return ret;
              };
            };

            for (var prop in extension.tokenizer) {
              _loop2(prop);
            }

            opts.tokenizer = tokenizer;
          })();
        }

        if (extension.walkTokens) {
          var walkTokens = marked.defaults.walkTokens;

          opts.walkTokens = function (token) {
            extension.walkTokens(token);

            if (walkTokens) {
              walkTokens(token);
            }
          };
        }

        marked.setOptions(opts);
      };
      /**
       * Run callback for every token
       */


      marked.walkTokens = function (tokens, callback) {
        for (var _iterator = _createForOfIteratorHelperLoose(tokens), _step; !(_step = _iterator()).done;) {
          var token = _step.value;
          callback(token);

          switch (token.type) {
            case 'table':
              {
                for (var _iterator2 = _createForOfIteratorHelperLoose(token.tokens.header), _step2; !(_step2 = _iterator2()).done;) {
                  var cell = _step2.value;
                  marked.walkTokens(cell, callback);
                }

                for (var _iterator3 = _createForOfIteratorHelperLoose(token.tokens.cells), _step3; !(_step3 = _iterator3()).done;) {
                  var row = _step3.value;

                  for (var _iterator4 = _createForOfIteratorHelperLoose(row), _step4; !(_step4 = _iterator4()).done;) {
                    var _cell = _step4.value;
                    marked.walkTokens(_cell, callback);
                  }
                }

                break;
              }

            case 'list':
              {
                marked.walkTokens(token.items, callback);
                break;
              }

            default:
              {
                if (token.tokens) {
                  marked.walkTokens(token.tokens, callback);
                }
              }
          }
        }
      };
      /**
       * Parse Inline
       */


      marked.parseInline = function (src, opt) {
        // throw error in case of non string input
        if (typeof src === 'undefined' || src === null) {
          throw new Error('marked.parseInline(): input parameter is undefined or null');
        }

        if (typeof src !== 'string') {
          throw new Error('marked.parseInline(): input parameter is of type ' + Object.prototype.toString.call(src) + ', string expected');
        }

        opt = merge({}, marked.defaults, opt || {});
        checkSanitizeDeprecation(opt);

        try {
          var tokens = Lexer_1.lexInline(src, opt);

          if (opt.walkTokens) {
            marked.walkTokens(tokens, opt.walkTokens);
          }

          return Parser_1.parseInline(tokens, opt);
        } catch (e) {
          e.message += '\nPlease report this to https://github.com/markedjs/marked.';

          if (opt.silent) {
            return '<p>An error occurred:</p><pre>' + escape(e.message + '', true) + '</pre>';
          }

          throw e;
        }
      };
      /**
       * Expose
       */


      marked.Parser = Parser_1;
      marked.parser = Parser_1.parse;
      marked.Renderer = Renderer_1;
      marked.TextRenderer = TextRenderer_1;
      marked.Lexer = Lexer_1;
      marked.lexer = Lexer_1.lex;
      marked.Tokenizer = Tokenizer_1;
      marked.Slugger = Slugger_1;
      marked.parse = marked;
      var marked_1 = marked;

      return marked_1;

    })));
    });

    /*! @license DOMPurify | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/2.2.2/LICENSE */

    var purify = createCommonjsModule(function (module, exports) {
    (function (global, factory) {
      module.exports = factory() ;
    }(commonjsGlobal, function () {
      function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

      var hasOwnProperty = Object.hasOwnProperty,
          setPrototypeOf = Object.setPrototypeOf,
          isFrozen = Object.isFrozen,
          getPrototypeOf = Object.getPrototypeOf,
          getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
      var freeze = Object.freeze,
          seal = Object.seal,
          create = Object.create; // eslint-disable-line import/no-mutable-exports

      var _ref = typeof Reflect !== 'undefined' && Reflect,
          apply = _ref.apply,
          construct = _ref.construct;

      if (!apply) {
        apply = function apply(fun, thisValue, args) {
          return fun.apply(thisValue, args);
        };
      }

      if (!freeze) {
        freeze = function freeze(x) {
          return x;
        };
      }

      if (!seal) {
        seal = function seal(x) {
          return x;
        };
      }

      if (!construct) {
        construct = function construct(Func, args) {
          return new (Function.prototype.bind.apply(Func, [null].concat(_toConsumableArray(args))))();
        };
      }

      var arrayForEach = unapply(Array.prototype.forEach);
      var arrayPop = unapply(Array.prototype.pop);
      var arrayPush = unapply(Array.prototype.push);

      var stringToLowerCase = unapply(String.prototype.toLowerCase);
      var stringMatch = unapply(String.prototype.match);
      var stringReplace = unapply(String.prototype.replace);
      var stringIndexOf = unapply(String.prototype.indexOf);
      var stringTrim = unapply(String.prototype.trim);

      var regExpTest = unapply(RegExp.prototype.test);

      var typeErrorCreate = unconstruct(TypeError);

      function unapply(func) {
        return function (thisArg) {
          for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
          }

          return apply(func, thisArg, args);
        };
      }

      function unconstruct(func) {
        return function () {
          for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          return construct(func, args);
        };
      }

      /* Add properties to a lookup table */
      function addToSet(set, array) {
        if (setPrototypeOf) {
          // Make 'in' and truthy checks like Boolean(set.constructor)
          // independent of any properties defined on Object.prototype.
          // Prevent prototype setters from intercepting set as a this value.
          setPrototypeOf(set, null);
        }

        var l = array.length;
        while (l--) {
          var element = array[l];
          if (typeof element === 'string') {
            var lcElement = stringToLowerCase(element);
            if (lcElement !== element) {
              // Config presets (e.g. tags.js, attrs.js) are immutable.
              if (!isFrozen(array)) {
                array[l] = lcElement;
              }

              element = lcElement;
            }
          }

          set[element] = true;
        }

        return set;
      }

      /* Shallow clone an object */
      function clone(object) {
        var newObject = create(null);

        var property = void 0;
        for (property in object) {
          if (apply(hasOwnProperty, object, [property])) {
            newObject[property] = object[property];
          }
        }

        return newObject;
      }

      /* IE10 doesn't support __lookupGetter__ so lets'
       * simulate it. It also automatically checks
       * if the prop is function or getter and behaves
       * accordingly. */
      function lookupGetter(object, prop) {
        while (object !== null) {
          var desc = getOwnPropertyDescriptor(object, prop);
          if (desc) {
            if (desc.get) {
              return unapply(desc.get);
            }

            if (typeof desc.value === 'function') {
              return unapply(desc.value);
            }
          }

          object = getPrototypeOf(object);
        }

        function fallbackValue(element) {
          console.warn('fallback value for', element);
          return null;
        }

        return fallbackValue;
      }

      var html = freeze(['a', 'abbr', 'acronym', 'address', 'area', 'article', 'aside', 'audio', 'b', 'bdi', 'bdo', 'big', 'blink', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'content', 'data', 'datalist', 'dd', 'decorator', 'del', 'details', 'dfn', 'dialog', 'dir', 'div', 'dl', 'dt', 'element', 'em', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'img', 'input', 'ins', 'kbd', 'label', 'legend', 'li', 'main', 'map', 'mark', 'marquee', 'menu', 'menuitem', 'meter', 'nav', 'nobr', 'ol', 'optgroup', 'option', 'output', 'p', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'section', 'select', 'shadow', 'small', 'source', 'spacer', 'span', 'strike', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'tr', 'track', 'tt', 'u', 'ul', 'var', 'video', 'wbr']);

      // SVG
      var svg = freeze(['svg', 'a', 'altglyph', 'altglyphdef', 'altglyphitem', 'animatecolor', 'animatemotion', 'animatetransform', 'circle', 'clippath', 'defs', 'desc', 'ellipse', 'filter', 'font', 'g', 'glyph', 'glyphref', 'hkern', 'image', 'line', 'lineargradient', 'marker', 'mask', 'metadata', 'mpath', 'path', 'pattern', 'polygon', 'polyline', 'radialgradient', 'rect', 'stop', 'style', 'switch', 'symbol', 'text', 'textpath', 'title', 'tref', 'tspan', 'view', 'vkern']);

      var svgFilters = freeze(['feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence']);

      // List of SVG elements that are disallowed by default.
      // We still need to know them so that we can do namespace
      // checks properly in case one wants to add them to
      // allow-list.
      var svgDisallowed = freeze(['animate', 'color-profile', 'cursor', 'discard', 'fedropshadow', 'feimage', 'font-face', 'font-face-format', 'font-face-name', 'font-face-src', 'font-face-uri', 'foreignobject', 'hatch', 'hatchpath', 'mesh', 'meshgradient', 'meshpatch', 'meshrow', 'missing-glyph', 'script', 'set', 'solidcolor', 'unknown', 'use']);

      var mathMl = freeze(['math', 'menclose', 'merror', 'mfenced', 'mfrac', 'mglyph', 'mi', 'mlabeledtr', 'mmultiscripts', 'mn', 'mo', 'mover', 'mpadded', 'mphantom', 'mroot', 'mrow', 'ms', 'mspace', 'msqrt', 'mstyle', 'msub', 'msup', 'msubsup', 'mtable', 'mtd', 'mtext', 'mtr', 'munder', 'munderover']);

      // Similarly to SVG, we want to know all MathML elements,
      // even those that we disallow by default.
      var mathMlDisallowed = freeze(['maction', 'maligngroup', 'malignmark', 'mlongdiv', 'mscarries', 'mscarry', 'msgroup', 'mstack', 'msline', 'msrow', 'semantics', 'annotation', 'annotation-xml', 'mprescripts', 'none']);

      var text = freeze(['#text']);

      var html$1 = freeze(['accept', 'action', 'align', 'alt', 'autocapitalize', 'autocomplete', 'autopictureinpicture', 'autoplay', 'background', 'bgcolor', 'border', 'capture', 'cellpadding', 'cellspacing', 'checked', 'cite', 'class', 'clear', 'color', 'cols', 'colspan', 'controls', 'controlslist', 'coords', 'crossorigin', 'datetime', 'decoding', 'default', 'dir', 'disabled', 'disablepictureinpicture', 'disableremoteplayback', 'download', 'draggable', 'enctype', 'enterkeyhint', 'face', 'for', 'headers', 'height', 'hidden', 'high', 'href', 'hreflang', 'id', 'inputmode', 'integrity', 'ismap', 'kind', 'label', 'lang', 'list', 'loading', 'loop', 'low', 'max', 'maxlength', 'media', 'method', 'min', 'minlength', 'multiple', 'muted', 'name', 'noshade', 'novalidate', 'nowrap', 'open', 'optimum', 'pattern', 'placeholder', 'playsinline', 'poster', 'preload', 'pubdate', 'radiogroup', 'readonly', 'rel', 'required', 'rev', 'reversed', 'role', 'rows', 'rowspan', 'spellcheck', 'scope', 'selected', 'shape', 'size', 'sizes', 'span', 'srclang', 'start', 'src', 'srcset', 'step', 'style', 'summary', 'tabindex', 'title', 'translate', 'type', 'usemap', 'valign', 'value', 'width', 'xmlns']);

      var svg$1 = freeze(['accent-height', 'accumulate', 'additive', 'alignment-baseline', 'ascent', 'attributename', 'attributetype', 'azimuth', 'basefrequency', 'baseline-shift', 'begin', 'bias', 'by', 'class', 'clip', 'clippathunits', 'clip-path', 'clip-rule', 'color', 'color-interpolation', 'color-interpolation-filters', 'color-profile', 'color-rendering', 'cx', 'cy', 'd', 'dx', 'dy', 'diffuseconstant', 'direction', 'display', 'divisor', 'dur', 'edgemode', 'elevation', 'end', 'fill', 'fill-opacity', 'fill-rule', 'filter', 'filterunits', 'flood-color', 'flood-opacity', 'font-family', 'font-size', 'font-size-adjust', 'font-stretch', 'font-style', 'font-variant', 'font-weight', 'fx', 'fy', 'g1', 'g2', 'glyph-name', 'glyphref', 'gradientunits', 'gradienttransform', 'height', 'href', 'id', 'image-rendering', 'in', 'in2', 'k', 'k1', 'k2', 'k3', 'k4', 'kerning', 'keypoints', 'keysplines', 'keytimes', 'lang', 'lengthadjust', 'letter-spacing', 'kernelmatrix', 'kernelunitlength', 'lighting-color', 'local', 'marker-end', 'marker-mid', 'marker-start', 'markerheight', 'markerunits', 'markerwidth', 'maskcontentunits', 'maskunits', 'max', 'mask', 'media', 'method', 'mode', 'min', 'name', 'numoctaves', 'offset', 'operator', 'opacity', 'order', 'orient', 'orientation', 'origin', 'overflow', 'paint-order', 'path', 'pathlength', 'patterncontentunits', 'patterntransform', 'patternunits', 'points', 'preservealpha', 'preserveaspectratio', 'primitiveunits', 'r', 'rx', 'ry', 'radius', 'refx', 'refy', 'repeatcount', 'repeatdur', 'restart', 'result', 'rotate', 'scale', 'seed', 'shape-rendering', 'specularconstant', 'specularexponent', 'spreadmethod', 'startoffset', 'stddeviation', 'stitchtiles', 'stop-color', 'stop-opacity', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity', 'stroke', 'stroke-width', 'style', 'surfacescale', 'systemlanguage', 'tabindex', 'targetx', 'targety', 'transform', 'text-anchor', 'text-decoration', 'text-rendering', 'textlength', 'type', 'u1', 'u2', 'unicode', 'values', 'viewbox', 'visibility', 'version', 'vert-adv-y', 'vert-origin-x', 'vert-origin-y', 'width', 'word-spacing', 'wrap', 'writing-mode', 'xchannelselector', 'ychannelselector', 'x', 'x1', 'x2', 'xmlns', 'y', 'y1', 'y2', 'z', 'zoomandpan']);

      var mathMl$1 = freeze(['accent', 'accentunder', 'align', 'bevelled', 'close', 'columnsalign', 'columnlines', 'columnspan', 'denomalign', 'depth', 'dir', 'display', 'displaystyle', 'encoding', 'fence', 'frame', 'height', 'href', 'id', 'largeop', 'length', 'linethickness', 'lspace', 'lquote', 'mathbackground', 'mathcolor', 'mathsize', 'mathvariant', 'maxsize', 'minsize', 'movablelimits', 'notation', 'numalign', 'open', 'rowalign', 'rowlines', 'rowspacing', 'rowspan', 'rspace', 'rquote', 'scriptlevel', 'scriptminsize', 'scriptsizemultiplier', 'selection', 'separator', 'separators', 'stretchy', 'subscriptshift', 'supscriptshift', 'symmetric', 'voffset', 'width', 'xmlns']);

      var xml = freeze(['xlink:href', 'xml:id', 'xlink:title', 'xml:space', 'xmlns:xlink']);

      // eslint-disable-next-line unicorn/better-regex
      var MUSTACHE_EXPR = seal(/\{\{[\s\S]*|[\s\S]*\}\}/gm); // Specify template detection regex for SAFE_FOR_TEMPLATES mode
      var ERB_EXPR = seal(/<%[\s\S]*|[\s\S]*%>/gm);
      var DATA_ATTR = seal(/^data-[\-\w.\u00B7-\uFFFF]/); // eslint-disable-line no-useless-escape
      var ARIA_ATTR = seal(/^aria-[\-\w]+$/); // eslint-disable-line no-useless-escape
      var IS_ALLOWED_URI = seal(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i // eslint-disable-line no-useless-escape
      );
      var IS_SCRIPT_OR_DATA = seal(/^(?:\w+script|data):/i);
      var ATTR_WHITESPACE = seal(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g // eslint-disable-line no-control-regex
      );

      var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

      function _toConsumableArray$1(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

      var getGlobal = function getGlobal() {
        return typeof window === 'undefined' ? null : window;
      };

      /**
       * Creates a no-op policy for internal use only.
       * Don't export this function outside this module!
       * @param {?TrustedTypePolicyFactory} trustedTypes The policy factory.
       * @param {Document} document The document object (to determine policy name suffix)
       * @return {?TrustedTypePolicy} The policy created (or null, if Trusted Types
       * are not supported).
       */
      var _createTrustedTypesPolicy = function _createTrustedTypesPolicy(trustedTypes, document) {
        if ((typeof trustedTypes === 'undefined' ? 'undefined' : _typeof(trustedTypes)) !== 'object' || typeof trustedTypes.createPolicy !== 'function') {
          return null;
        }

        // Allow the callers to control the unique policy name
        // by adding a data-tt-policy-suffix to the script element with the DOMPurify.
        // Policy creation with duplicate names throws in Trusted Types.
        var suffix = null;
        var ATTR_NAME = 'data-tt-policy-suffix';
        if (document.currentScript && document.currentScript.hasAttribute(ATTR_NAME)) {
          suffix = document.currentScript.getAttribute(ATTR_NAME);
        }

        var policyName = 'dompurify' + (suffix ? '#' + suffix : '');

        try {
          return trustedTypes.createPolicy(policyName, {
            createHTML: function createHTML(html$$1) {
              return html$$1;
            }
          });
        } catch (_) {
          // Policy creation failed (most likely another DOMPurify script has
          // already run). Skip creating the policy, as this will only cause errors
          // if TT are enforced.
          console.warn('TrustedTypes policy ' + policyName + ' could not be created.');
          return null;
        }
      };

      function createDOMPurify() {
        var window = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getGlobal();

        var DOMPurify = function DOMPurify(root) {
          return createDOMPurify(root);
        };

        /**
         * Version label, exposed for easier checks
         * if DOMPurify is up to date or not
         */
        DOMPurify.version = '2.2.7';

        /**
         * Array of elements that DOMPurify removed during sanitation.
         * Empty if nothing was removed.
         */
        DOMPurify.removed = [];

        if (!window || !window.document || window.document.nodeType !== 9) {
          // Not running in a browser, provide a factory function
          // so that you can pass your own Window
          DOMPurify.isSupported = false;

          return DOMPurify;
        }

        var originalDocument = window.document;

        var document = window.document;
        var DocumentFragment = window.DocumentFragment,
            HTMLTemplateElement = window.HTMLTemplateElement,
            Node = window.Node,
            Element = window.Element,
            NodeFilter = window.NodeFilter,
            _window$NamedNodeMap = window.NamedNodeMap,
            NamedNodeMap = _window$NamedNodeMap === undefined ? window.NamedNodeMap || window.MozNamedAttrMap : _window$NamedNodeMap,
            Text = window.Text,
            Comment = window.Comment,
            DOMParser = window.DOMParser,
            trustedTypes = window.trustedTypes;


        var ElementPrototype = Element.prototype;

        var cloneNode = lookupGetter(ElementPrototype, 'cloneNode');
        var getNextSibling = lookupGetter(ElementPrototype, 'nextSibling');
        var getChildNodes = lookupGetter(ElementPrototype, 'childNodes');
        var getParentNode = lookupGetter(ElementPrototype, 'parentNode');

        // As per issue #47, the web-components registry is inherited by a
        // new document created via createHTMLDocument. As per the spec
        // (http://w3c.github.io/webcomponents/spec/custom/#creating-and-passing-registries)
        // a new empty registry is used when creating a template contents owner
        // document, so we use that as our parent document to ensure nothing
        // is inherited.
        if (typeof HTMLTemplateElement === 'function') {
          var template = document.createElement('template');
          if (template.content && template.content.ownerDocument) {
            document = template.content.ownerDocument;
          }
        }

        var trustedTypesPolicy = _createTrustedTypesPolicy(trustedTypes, originalDocument);
        var emptyHTML = trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML('') : '';

        var _document = document,
            implementation = _document.implementation,
            createNodeIterator = _document.createNodeIterator,
            getElementsByTagName = _document.getElementsByTagName,
            createDocumentFragment = _document.createDocumentFragment;
        var importNode = originalDocument.importNode;


        var documentMode = {};
        try {
          documentMode = clone(document).documentMode ? document.documentMode : {};
        } catch (_) {}

        var hooks = {};

        /**
         * Expose whether this browser supports running the full DOMPurify.
         */
        DOMPurify.isSupported = typeof getParentNode === 'function' && implementation && typeof implementation.createHTMLDocument !== 'undefined' && documentMode !== 9;

        var MUSTACHE_EXPR$$1 = MUSTACHE_EXPR,
            ERB_EXPR$$1 = ERB_EXPR,
            DATA_ATTR$$1 = DATA_ATTR,
            ARIA_ATTR$$1 = ARIA_ATTR,
            IS_SCRIPT_OR_DATA$$1 = IS_SCRIPT_OR_DATA,
            ATTR_WHITESPACE$$1 = ATTR_WHITESPACE;
        var IS_ALLOWED_URI$$1 = IS_ALLOWED_URI;

        /**
         * We consider the elements and attributes below to be safe. Ideally
         * don't add any new ones but feel free to remove unwanted ones.
         */

        /* allowed element names */

        var ALLOWED_TAGS = null;
        var DEFAULT_ALLOWED_TAGS = addToSet({}, [].concat(_toConsumableArray$1(html), _toConsumableArray$1(svg), _toConsumableArray$1(svgFilters), _toConsumableArray$1(mathMl), _toConsumableArray$1(text)));

        /* Allowed attribute names */
        var ALLOWED_ATTR = null;
        var DEFAULT_ALLOWED_ATTR = addToSet({}, [].concat(_toConsumableArray$1(html$1), _toConsumableArray$1(svg$1), _toConsumableArray$1(mathMl$1), _toConsumableArray$1(xml)));

        /* Explicitly forbidden tags (overrides ALLOWED_TAGS/ADD_TAGS) */
        var FORBID_TAGS = null;

        /* Explicitly forbidden attributes (overrides ALLOWED_ATTR/ADD_ATTR) */
        var FORBID_ATTR = null;

        /* Decide if ARIA attributes are okay */
        var ALLOW_ARIA_ATTR = true;

        /* Decide if custom data attributes are okay */
        var ALLOW_DATA_ATTR = true;

        /* Decide if unknown protocols are okay */
        var ALLOW_UNKNOWN_PROTOCOLS = false;

        /* Output should be safe for common template engines.
         * This means, DOMPurify removes data attributes, mustaches and ERB
         */
        var SAFE_FOR_TEMPLATES = false;

        /* Decide if document with <html>... should be returned */
        var WHOLE_DOCUMENT = false;

        /* Track whether config is already set on this instance of DOMPurify. */
        var SET_CONFIG = false;

        /* Decide if all elements (e.g. style, script) must be children of
         * document.body. By default, browsers might move them to document.head */
        var FORCE_BODY = false;

        /* Decide if a DOM `HTMLBodyElement` should be returned, instead of a html
         * string (or a TrustedHTML object if Trusted Types are supported).
         * If `WHOLE_DOCUMENT` is enabled a `HTMLHtmlElement` will be returned instead
         */
        var RETURN_DOM = false;

        /* Decide if a DOM `DocumentFragment` should be returned, instead of a html
         * string  (or a TrustedHTML object if Trusted Types are supported) */
        var RETURN_DOM_FRAGMENT = false;

        /* If `RETURN_DOM` or `RETURN_DOM_FRAGMENT` is enabled, decide if the returned DOM
         * `Node` is imported into the current `Document`. If this flag is not enabled the
         * `Node` will belong (its ownerDocument) to a fresh `HTMLDocument`, created by
         * DOMPurify.
         *
         * This defaults to `true` starting DOMPurify 2.2.0. Note that setting it to `false`
         * might cause XSS from attacks hidden in closed shadowroots in case the browser
         * supports Declarative Shadow: DOM https://web.dev/declarative-shadow-dom/
         */
        var RETURN_DOM_IMPORT = true;

        /* Try to return a Trusted Type object instead of a string, return a string in
         * case Trusted Types are not supported  */
        var RETURN_TRUSTED_TYPE = false;

        /* Output should be free from DOM clobbering attacks? */
        var SANITIZE_DOM = true;

        /* Keep element content when removing element? */
        var KEEP_CONTENT = true;

        /* If a `Node` is passed to sanitize(), then performs sanitization in-place instead
         * of importing it into a new Document and returning a sanitized copy */
        var IN_PLACE = false;

        /* Allow usage of profiles like html, svg and mathMl */
        var USE_PROFILES = {};

        /* Tags to ignore content of when KEEP_CONTENT is true */
        var FORBID_CONTENTS = addToSet({}, ['annotation-xml', 'audio', 'colgroup', 'desc', 'foreignobject', 'head', 'iframe', 'math', 'mi', 'mn', 'mo', 'ms', 'mtext', 'noembed', 'noframes', 'noscript', 'plaintext', 'script', 'style', 'svg', 'template', 'thead', 'title', 'video', 'xmp']);

        /* Tags that are safe for data: URIs */
        var DATA_URI_TAGS = null;
        var DEFAULT_DATA_URI_TAGS = addToSet({}, ['audio', 'video', 'img', 'source', 'image', 'track']);

        /* Attributes safe for values like "javascript:" */
        var URI_SAFE_ATTRIBUTES = null;
        var DEFAULT_URI_SAFE_ATTRIBUTES = addToSet({}, ['alt', 'class', 'for', 'id', 'label', 'name', 'pattern', 'placeholder', 'summary', 'title', 'value', 'style', 'xmlns']);

        /* Keep a reference to config to pass to hooks */
        var CONFIG = null;

        /* Ideally, do not touch anything below this line */
        /* ______________________________________________ */

        var formElement = document.createElement('form');

        /**
         * _parseConfig
         *
         * @param  {Object} cfg optional config literal
         */
        // eslint-disable-next-line complexity
        var _parseConfig = function _parseConfig(cfg) {
          if (CONFIG && CONFIG === cfg) {
            return;
          }

          /* Shield configuration object from tampering */
          if (!cfg || (typeof cfg === 'undefined' ? 'undefined' : _typeof(cfg)) !== 'object') {
            cfg = {};
          }

          /* Shield configuration object from prototype pollution */
          cfg = clone(cfg);

          /* Set configuration parameters */
          ALLOWED_TAGS = 'ALLOWED_TAGS' in cfg ? addToSet({}, cfg.ALLOWED_TAGS) : DEFAULT_ALLOWED_TAGS;
          ALLOWED_ATTR = 'ALLOWED_ATTR' in cfg ? addToSet({}, cfg.ALLOWED_ATTR) : DEFAULT_ALLOWED_ATTR;
          URI_SAFE_ATTRIBUTES = 'ADD_URI_SAFE_ATTR' in cfg ? addToSet(clone(DEFAULT_URI_SAFE_ATTRIBUTES), cfg.ADD_URI_SAFE_ATTR) : DEFAULT_URI_SAFE_ATTRIBUTES;
          DATA_URI_TAGS = 'ADD_DATA_URI_TAGS' in cfg ? addToSet(clone(DEFAULT_DATA_URI_TAGS), cfg.ADD_DATA_URI_TAGS) : DEFAULT_DATA_URI_TAGS;
          FORBID_TAGS = 'FORBID_TAGS' in cfg ? addToSet({}, cfg.FORBID_TAGS) : {};
          FORBID_ATTR = 'FORBID_ATTR' in cfg ? addToSet({}, cfg.FORBID_ATTR) : {};
          USE_PROFILES = 'USE_PROFILES' in cfg ? cfg.USE_PROFILES : false;
          ALLOW_ARIA_ATTR = cfg.ALLOW_ARIA_ATTR !== false; // Default true
          ALLOW_DATA_ATTR = cfg.ALLOW_DATA_ATTR !== false; // Default true
          ALLOW_UNKNOWN_PROTOCOLS = cfg.ALLOW_UNKNOWN_PROTOCOLS || false; // Default false
          SAFE_FOR_TEMPLATES = cfg.SAFE_FOR_TEMPLATES || false; // Default false
          WHOLE_DOCUMENT = cfg.WHOLE_DOCUMENT || false; // Default false
          RETURN_DOM = cfg.RETURN_DOM || false; // Default false
          RETURN_DOM_FRAGMENT = cfg.RETURN_DOM_FRAGMENT || false; // Default false
          RETURN_DOM_IMPORT = cfg.RETURN_DOM_IMPORT !== false; // Default true
          RETURN_TRUSTED_TYPE = cfg.RETURN_TRUSTED_TYPE || false; // Default false
          FORCE_BODY = cfg.FORCE_BODY || false; // Default false
          SANITIZE_DOM = cfg.SANITIZE_DOM !== false; // Default true
          KEEP_CONTENT = cfg.KEEP_CONTENT !== false; // Default true
          IN_PLACE = cfg.IN_PLACE || false; // Default false
          IS_ALLOWED_URI$$1 = cfg.ALLOWED_URI_REGEXP || IS_ALLOWED_URI$$1;
          if (SAFE_FOR_TEMPLATES) {
            ALLOW_DATA_ATTR = false;
          }

          if (RETURN_DOM_FRAGMENT) {
            RETURN_DOM = true;
          }

          /* Parse profile info */
          if (USE_PROFILES) {
            ALLOWED_TAGS = addToSet({}, [].concat(_toConsumableArray$1(text)));
            ALLOWED_ATTR = [];
            if (USE_PROFILES.html === true) {
              addToSet(ALLOWED_TAGS, html);
              addToSet(ALLOWED_ATTR, html$1);
            }

            if (USE_PROFILES.svg === true) {
              addToSet(ALLOWED_TAGS, svg);
              addToSet(ALLOWED_ATTR, svg$1);
              addToSet(ALLOWED_ATTR, xml);
            }

            if (USE_PROFILES.svgFilters === true) {
              addToSet(ALLOWED_TAGS, svgFilters);
              addToSet(ALLOWED_ATTR, svg$1);
              addToSet(ALLOWED_ATTR, xml);
            }

            if (USE_PROFILES.mathMl === true) {
              addToSet(ALLOWED_TAGS, mathMl);
              addToSet(ALLOWED_ATTR, mathMl$1);
              addToSet(ALLOWED_ATTR, xml);
            }
          }

          /* Merge configuration parameters */
          if (cfg.ADD_TAGS) {
            if (ALLOWED_TAGS === DEFAULT_ALLOWED_TAGS) {
              ALLOWED_TAGS = clone(ALLOWED_TAGS);
            }

            addToSet(ALLOWED_TAGS, cfg.ADD_TAGS);
          }

          if (cfg.ADD_ATTR) {
            if (ALLOWED_ATTR === DEFAULT_ALLOWED_ATTR) {
              ALLOWED_ATTR = clone(ALLOWED_ATTR);
            }

            addToSet(ALLOWED_ATTR, cfg.ADD_ATTR);
          }

          if (cfg.ADD_URI_SAFE_ATTR) {
            addToSet(URI_SAFE_ATTRIBUTES, cfg.ADD_URI_SAFE_ATTR);
          }

          /* Add #text in case KEEP_CONTENT is set to true */
          if (KEEP_CONTENT) {
            ALLOWED_TAGS['#text'] = true;
          }

          /* Add html, head and body to ALLOWED_TAGS in case WHOLE_DOCUMENT is true */
          if (WHOLE_DOCUMENT) {
            addToSet(ALLOWED_TAGS, ['html', 'head', 'body']);
          }

          /* Add tbody to ALLOWED_TAGS in case tables are permitted, see #286, #365 */
          if (ALLOWED_TAGS.table) {
            addToSet(ALLOWED_TAGS, ['tbody']);
            delete FORBID_TAGS.tbody;
          }

          // Prevent further manipulation of configuration.
          // Not available in IE8, Safari 5, etc.
          if (freeze) {
            freeze(cfg);
          }

          CONFIG = cfg;
        };

        var MATHML_TEXT_INTEGRATION_POINTS = addToSet({}, ['mi', 'mo', 'mn', 'ms', 'mtext']);

        var HTML_INTEGRATION_POINTS = addToSet({}, ['foreignobject', 'desc', 'title', 'annotation-xml']);

        /* Keep track of all possible SVG and MathML tags
         * so that we can perform the namespace checks
         * correctly. */
        var ALL_SVG_TAGS = addToSet({}, svg);
        addToSet(ALL_SVG_TAGS, svgFilters);
        addToSet(ALL_SVG_TAGS, svgDisallowed);

        var ALL_MATHML_TAGS = addToSet({}, mathMl);
        addToSet(ALL_MATHML_TAGS, mathMlDisallowed);

        var MATHML_NAMESPACE = 'http://www.w3.org/1998/Math/MathML';
        var SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
        var HTML_NAMESPACE = 'http://www.w3.org/1999/xhtml';

        /**
         *
         *
         * @param  {Element} element a DOM element whose namespace is being checked
         * @returns {boolean} Return false if the element has a
         *  namespace that a spec-compliant parser would never
         *  return. Return true otherwise.
         */
        var _checkValidNamespace = function _checkValidNamespace(element) {
          var parent = getParentNode(element);

          // In JSDOM, if we're inside shadow DOM, then parentNode
          // can be null. We just simulate parent in this case.
          if (!parent || !parent.tagName) {
            parent = {
              namespaceURI: HTML_NAMESPACE,
              tagName: 'template'
            };
          }

          var tagName = stringToLowerCase(element.tagName);
          var parentTagName = stringToLowerCase(parent.tagName);

          if (element.namespaceURI === SVG_NAMESPACE) {
            // The only way to switch from HTML namespace to SVG
            // is via <svg>. If it happens via any other tag, then
            // it should be killed.
            if (parent.namespaceURI === HTML_NAMESPACE) {
              return tagName === 'svg';
            }

            // The only way to switch from MathML to SVG is via
            // svg if parent is either <annotation-xml> or MathML
            // text integration points.
            if (parent.namespaceURI === MATHML_NAMESPACE) {
              return tagName === 'svg' && (parentTagName === 'annotation-xml' || MATHML_TEXT_INTEGRATION_POINTS[parentTagName]);
            }

            // We only allow elements that are defined in SVG
            // spec. All others are disallowed in SVG namespace.
            return Boolean(ALL_SVG_TAGS[tagName]);
          }

          if (element.namespaceURI === MATHML_NAMESPACE) {
            // The only way to switch from HTML namespace to MathML
            // is via <math>. If it happens via any other tag, then
            // it should be killed.
            if (parent.namespaceURI === HTML_NAMESPACE) {
              return tagName === 'math';
            }

            // The only way to switch from SVG to MathML is via
            // <math> and HTML integration points
            if (parent.namespaceURI === SVG_NAMESPACE) {
              return tagName === 'math' && HTML_INTEGRATION_POINTS[parentTagName];
            }

            // We only allow elements that are defined in MathML
            // spec. All others are disallowed in MathML namespace.
            return Boolean(ALL_MATHML_TAGS[tagName]);
          }

          if (element.namespaceURI === HTML_NAMESPACE) {
            // The only way to switch from SVG to HTML is via
            // HTML integration points, and from MathML to HTML
            // is via MathML text integration points
            if (parent.namespaceURI === SVG_NAMESPACE && !HTML_INTEGRATION_POINTS[parentTagName]) {
              return false;
            }

            if (parent.namespaceURI === MATHML_NAMESPACE && !MATHML_TEXT_INTEGRATION_POINTS[parentTagName]) {
              return false;
            }

            // Certain elements are allowed in both SVG and HTML
            // namespace. We need to specify them explicitly
            // so that they don't get erronously deleted from
            // HTML namespace.
            var commonSvgAndHTMLElements = addToSet({}, ['title', 'style', 'font', 'a', 'script']);

            // We disallow tags that are specific for MathML
            // or SVG and should never appear in HTML namespace
            return !ALL_MATHML_TAGS[tagName] && (commonSvgAndHTMLElements[tagName] || !ALL_SVG_TAGS[tagName]);
          }

          // The code should never reach this place (this means
          // that the element somehow got namespace that is not
          // HTML, SVG or MathML). Return false just in case.
          return false;
        };

        /**
         * _forceRemove
         *
         * @param  {Node} node a DOM node
         */
        var _forceRemove = function _forceRemove(node) {
          arrayPush(DOMPurify.removed, { element: node });
          try {
            node.parentNode.removeChild(node);
          } catch (_) {
            try {
              node.outerHTML = emptyHTML;
            } catch (_) {
              node.remove();
            }
          }
        };

        /**
         * _removeAttribute
         *
         * @param  {String} name an Attribute name
         * @param  {Node} node a DOM node
         */
        var _removeAttribute = function _removeAttribute(name, node) {
          try {
            arrayPush(DOMPurify.removed, {
              attribute: node.getAttributeNode(name),
              from: node
            });
          } catch (_) {
            arrayPush(DOMPurify.removed, {
              attribute: null,
              from: node
            });
          }

          node.removeAttribute(name);

          // We void attribute values for unremovable "is"" attributes
          if (name === 'is' && !ALLOWED_ATTR[name]) {
            if (RETURN_DOM || RETURN_DOM_FRAGMENT) {
              try {
                _forceRemove(node);
              } catch (_) {}
            } else {
              try {
                node.setAttribute(name, '');
              } catch (_) {}
            }
          }
        };

        /**
         * _initDocument
         *
         * @param  {String} dirty a string of dirty markup
         * @return {Document} a DOM, filled with the dirty markup
         */
        var _initDocument = function _initDocument(dirty) {
          /* Create a HTML document */
          var doc = void 0;
          var leadingWhitespace = void 0;

          if (FORCE_BODY) {
            dirty = '<remove></remove>' + dirty;
          } else {
            /* If FORCE_BODY isn't used, leading whitespace needs to be preserved manually */
            var matches = stringMatch(dirty, /^[\r\n\t ]+/);
            leadingWhitespace = matches && matches[0];
          }

          var dirtyPayload = trustedTypesPolicy ? trustedTypesPolicy.createHTML(dirty) : dirty;
          /* Use the DOMParser API by default, fallback later if needs be */
          try {
            doc = new DOMParser().parseFromString(dirtyPayload, 'text/html');
          } catch (_) {}

          /* Use createHTMLDocument in case DOMParser is not available */
          if (!doc || !doc.documentElement) {
            doc = implementation.createHTMLDocument('');
            var _doc = doc,
                body = _doc.body;

            body.parentNode.removeChild(body.parentNode.firstElementChild);
            body.outerHTML = dirtyPayload;
          }

          if (dirty && leadingWhitespace) {
            doc.body.insertBefore(document.createTextNode(leadingWhitespace), doc.body.childNodes[0] || null);
          }

          /* Work on whole document or just its body */
          return getElementsByTagName.call(doc, WHOLE_DOCUMENT ? 'html' : 'body')[0];
        };

        /**
         * _createIterator
         *
         * @param  {Document} root document/fragment to create iterator for
         * @return {Iterator} iterator instance
         */
        var _createIterator = function _createIterator(root) {
          return createNodeIterator.call(root.ownerDocument || root, root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_TEXT, function () {
            return NodeFilter.FILTER_ACCEPT;
          }, false);
        };

        /**
         * _isClobbered
         *
         * @param  {Node} elm element to check for clobbering attacks
         * @return {Boolean} true if clobbered, false if safe
         */
        var _isClobbered = function _isClobbered(elm) {
          if (elm instanceof Text || elm instanceof Comment) {
            return false;
          }

          if (typeof elm.nodeName !== 'string' || typeof elm.textContent !== 'string' || typeof elm.removeChild !== 'function' || !(elm.attributes instanceof NamedNodeMap) || typeof elm.removeAttribute !== 'function' || typeof elm.setAttribute !== 'function' || typeof elm.namespaceURI !== 'string' || typeof elm.insertBefore !== 'function') {
            return true;
          }

          return false;
        };

        /**
         * _isNode
         *
         * @param  {Node} obj object to check whether it's a DOM node
         * @return {Boolean} true is object is a DOM node
         */
        var _isNode = function _isNode(object) {
          return (typeof Node === 'undefined' ? 'undefined' : _typeof(Node)) === 'object' ? object instanceof Node : object && (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object' && typeof object.nodeType === 'number' && typeof object.nodeName === 'string';
        };

        /**
         * _executeHook
         * Execute user configurable hooks
         *
         * @param  {String} entryPoint  Name of the hook's entry point
         * @param  {Node} currentNode node to work on with the hook
         * @param  {Object} data additional hook parameters
         */
        var _executeHook = function _executeHook(entryPoint, currentNode, data) {
          if (!hooks[entryPoint]) {
            return;
          }

          arrayForEach(hooks[entryPoint], function (hook) {
            hook.call(DOMPurify, currentNode, data, CONFIG);
          });
        };

        /**
         * _sanitizeElements
         *
         * @protect nodeName
         * @protect textContent
         * @protect removeChild
         *
         * @param   {Node} currentNode to check for permission to exist
         * @return  {Boolean} true if node was killed, false if left alive
         */
        var _sanitizeElements = function _sanitizeElements(currentNode) {
          var content = void 0;

          /* Execute a hook if present */
          _executeHook('beforeSanitizeElements', currentNode, null);

          /* Check if element is clobbered or can clobber */
          if (_isClobbered(currentNode)) {
            _forceRemove(currentNode);
            return true;
          }

          /* Check if tagname contains Unicode */
          if (stringMatch(currentNode.nodeName, /[\u0080-\uFFFF]/)) {
            _forceRemove(currentNode);
            return true;
          }

          /* Now let's check the element's type and name */
          var tagName = stringToLowerCase(currentNode.nodeName);

          /* Execute a hook if present */
          _executeHook('uponSanitizeElement', currentNode, {
            tagName: tagName,
            allowedTags: ALLOWED_TAGS
          });

          /* Detect mXSS attempts abusing namespace confusion */
          if (!_isNode(currentNode.firstElementChild) && (!_isNode(currentNode.content) || !_isNode(currentNode.content.firstElementChild)) && regExpTest(/<[/\w]/g, currentNode.innerHTML) && regExpTest(/<[/\w]/g, currentNode.textContent)) {
            _forceRemove(currentNode);
            return true;
          }

          /* Remove element if anything forbids its presence */
          if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
            /* Keep content except for bad-listed elements */
            if (KEEP_CONTENT && !FORBID_CONTENTS[tagName]) {
              var parentNode = getParentNode(currentNode);
              var childNodes = getChildNodes(currentNode);

              if (childNodes && parentNode) {
                var childCount = childNodes.length;

                for (var i = childCount - 1; i >= 0; --i) {
                  parentNode.insertBefore(cloneNode(childNodes[i], true), getNextSibling(currentNode));
                }
              }
            }

            _forceRemove(currentNode);
            return true;
          }

          /* Check whether element has a valid namespace */
          if (currentNode instanceof Element && !_checkValidNamespace(currentNode)) {
            _forceRemove(currentNode);
            return true;
          }

          if ((tagName === 'noscript' || tagName === 'noembed') && regExpTest(/<\/no(script|embed)/i, currentNode.innerHTML)) {
            _forceRemove(currentNode);
            return true;
          }

          /* Sanitize element content to be template-safe */
          if (SAFE_FOR_TEMPLATES && currentNode.nodeType === 3) {
            /* Get the element's text content */
            content = currentNode.textContent;
            content = stringReplace(content, MUSTACHE_EXPR$$1, ' ');
            content = stringReplace(content, ERB_EXPR$$1, ' ');
            if (currentNode.textContent !== content) {
              arrayPush(DOMPurify.removed, { element: currentNode.cloneNode() });
              currentNode.textContent = content;
            }
          }

          /* Execute a hook if present */
          _executeHook('afterSanitizeElements', currentNode, null);

          return false;
        };

        /**
         * _isValidAttribute
         *
         * @param  {string} lcTag Lowercase tag name of containing element.
         * @param  {string} lcName Lowercase attribute name.
         * @param  {string} value Attribute value.
         * @return {Boolean} Returns true if `value` is valid, otherwise false.
         */
        // eslint-disable-next-line complexity
        var _isValidAttribute = function _isValidAttribute(lcTag, lcName, value) {
          /* Make sure attribute cannot clobber */
          if (SANITIZE_DOM && (lcName === 'id' || lcName === 'name') && (value in document || value in formElement)) {
            return false;
          }

          /* Allow valid data-* attributes: At least one character after "-"
              (https://html.spec.whatwg.org/multipage/dom.html#embedding-custom-non-visible-data-with-the-data-*-attributes)
              XML-compatible (https://html.spec.whatwg.org/multipage/infrastructure.html#xml-compatible and http://www.w3.org/TR/xml/#d0e804)
              We don't need to check the value; it's always URI safe. */
          if (ALLOW_DATA_ATTR && regExpTest(DATA_ATTR$$1, lcName)) ; else if (ALLOW_ARIA_ATTR && regExpTest(ARIA_ATTR$$1, lcName)) ; else if (!ALLOWED_ATTR[lcName] || FORBID_ATTR[lcName]) {
            return false;

            /* Check value is safe. First, is attr inert? If so, is safe */
          } else if (URI_SAFE_ATTRIBUTES[lcName]) ; else if (regExpTest(IS_ALLOWED_URI$$1, stringReplace(value, ATTR_WHITESPACE$$1, ''))) ; else if ((lcName === 'src' || lcName === 'xlink:href' || lcName === 'href') && lcTag !== 'script' && stringIndexOf(value, 'data:') === 0 && DATA_URI_TAGS[lcTag]) ; else if (ALLOW_UNKNOWN_PROTOCOLS && !regExpTest(IS_SCRIPT_OR_DATA$$1, stringReplace(value, ATTR_WHITESPACE$$1, ''))) ; else if (!value) ; else {
            return false;
          }

          return true;
        };

        /**
         * _sanitizeAttributes
         *
         * @protect attributes
         * @protect nodeName
         * @protect removeAttribute
         * @protect setAttribute
         *
         * @param  {Node} currentNode to sanitize
         */
        var _sanitizeAttributes = function _sanitizeAttributes(currentNode) {
          var attr = void 0;
          var value = void 0;
          var lcName = void 0;
          var l = void 0;
          /* Execute a hook if present */
          _executeHook('beforeSanitizeAttributes', currentNode, null);

          var attributes = currentNode.attributes;

          /* Check if we have attributes; if not we might have a text node */

          if (!attributes) {
            return;
          }

          var hookEvent = {
            attrName: '',
            attrValue: '',
            keepAttr: true,
            allowedAttributes: ALLOWED_ATTR
          };
          l = attributes.length;

          /* Go backwards over all attributes; safely remove bad ones */
          while (l--) {
            attr = attributes[l];
            var _attr = attr,
                name = _attr.name,
                namespaceURI = _attr.namespaceURI;

            value = stringTrim(attr.value);
            lcName = stringToLowerCase(name);

            /* Execute a hook if present */
            hookEvent.attrName = lcName;
            hookEvent.attrValue = value;
            hookEvent.keepAttr = true;
            hookEvent.forceKeepAttr = undefined; // Allows developers to see this is a property they can set
            _executeHook('uponSanitizeAttribute', currentNode, hookEvent);
            value = hookEvent.attrValue;
            /* Did the hooks approve of the attribute? */
            if (hookEvent.forceKeepAttr) {
              continue;
            }

            /* Remove attribute */
            _removeAttribute(name, currentNode);

            /* Did the hooks approve of the attribute? */
            if (!hookEvent.keepAttr) {
              continue;
            }

            /* Work around a security issue in jQuery 3.0 */
            if (regExpTest(/\/>/i, value)) {
              _removeAttribute(name, currentNode);
              continue;
            }

            /* Sanitize attribute content to be template-safe */
            if (SAFE_FOR_TEMPLATES) {
              value = stringReplace(value, MUSTACHE_EXPR$$1, ' ');
              value = stringReplace(value, ERB_EXPR$$1, ' ');
            }

            /* Is `value` valid for this attribute? */
            var lcTag = currentNode.nodeName.toLowerCase();
            if (!_isValidAttribute(lcTag, lcName, value)) {
              continue;
            }

            /* Handle invalid data-* attribute set by try-catching it */
            try {
              if (namespaceURI) {
                currentNode.setAttributeNS(namespaceURI, name, value);
              } else {
                /* Fallback to setAttribute() for browser-unrecognized namespaces e.g. "x-schema". */
                currentNode.setAttribute(name, value);
              }

              arrayPop(DOMPurify.removed);
            } catch (_) {}
          }

          /* Execute a hook if present */
          _executeHook('afterSanitizeAttributes', currentNode, null);
        };

        /**
         * _sanitizeShadowDOM
         *
         * @param  {DocumentFragment} fragment to iterate over recursively
         */
        var _sanitizeShadowDOM = function _sanitizeShadowDOM(fragment) {
          var shadowNode = void 0;
          var shadowIterator = _createIterator(fragment);

          /* Execute a hook if present */
          _executeHook('beforeSanitizeShadowDOM', fragment, null);

          while (shadowNode = shadowIterator.nextNode()) {
            /* Execute a hook if present */
            _executeHook('uponSanitizeShadowNode', shadowNode, null);

            /* Sanitize tags and elements */
            if (_sanitizeElements(shadowNode)) {
              continue;
            }

            /* Deep shadow DOM detected */
            if (shadowNode.content instanceof DocumentFragment) {
              _sanitizeShadowDOM(shadowNode.content);
            }

            /* Check attributes, sanitize if necessary */
            _sanitizeAttributes(shadowNode);
          }

          /* Execute a hook if present */
          _executeHook('afterSanitizeShadowDOM', fragment, null);
        };

        /**
         * Sanitize
         * Public method providing core sanitation functionality
         *
         * @param {String|Node} dirty string or DOM node
         * @param {Object} configuration object
         */
        // eslint-disable-next-line complexity
        DOMPurify.sanitize = function (dirty, cfg) {
          var body = void 0;
          var importedNode = void 0;
          var currentNode = void 0;
          var oldNode = void 0;
          var returnNode = void 0;
          /* Make sure we have a string to sanitize.
            DO NOT return early, as this will return the wrong type if
            the user has requested a DOM object rather than a string */
          if (!dirty) {
            dirty = '<!-->';
          }

          /* Stringify, in case dirty is an object */
          if (typeof dirty !== 'string' && !_isNode(dirty)) {
            // eslint-disable-next-line no-negated-condition
            if (typeof dirty.toString !== 'function') {
              throw typeErrorCreate('toString is not a function');
            } else {
              dirty = dirty.toString();
              if (typeof dirty !== 'string') {
                throw typeErrorCreate('dirty is not a string, aborting');
              }
            }
          }

          /* Check we can run. Otherwise fall back or ignore */
          if (!DOMPurify.isSupported) {
            if (_typeof(window.toStaticHTML) === 'object' || typeof window.toStaticHTML === 'function') {
              if (typeof dirty === 'string') {
                return window.toStaticHTML(dirty);
              }

              if (_isNode(dirty)) {
                return window.toStaticHTML(dirty.outerHTML);
              }
            }

            return dirty;
          }

          /* Assign config vars */
          if (!SET_CONFIG) {
            _parseConfig(cfg);
          }

          /* Clean up removed elements */
          DOMPurify.removed = [];

          /* Check if dirty is correctly typed for IN_PLACE */
          if (typeof dirty === 'string') {
            IN_PLACE = false;
          }

          if (IN_PLACE) ; else if (dirty instanceof Node) {
            /* If dirty is a DOM element, append to an empty document to avoid
               elements being stripped by the parser */
            body = _initDocument('<!---->');
            importedNode = body.ownerDocument.importNode(dirty, true);
            if (importedNode.nodeType === 1 && importedNode.nodeName === 'BODY') {
              /* Node is already a body, use as is */
              body = importedNode;
            } else if (importedNode.nodeName === 'HTML') {
              body = importedNode;
            } else {
              // eslint-disable-next-line unicorn/prefer-node-append
              body.appendChild(importedNode);
            }
          } else {
            /* Exit directly if we have nothing to do */
            if (!RETURN_DOM && !SAFE_FOR_TEMPLATES && !WHOLE_DOCUMENT &&
            // eslint-disable-next-line unicorn/prefer-includes
            dirty.indexOf('<') === -1) {
              return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(dirty) : dirty;
            }

            /* Initialize the document to work on */
            body = _initDocument(dirty);

            /* Check we have a DOM node from the data */
            if (!body) {
              return RETURN_DOM ? null : emptyHTML;
            }
          }

          /* Remove first element node (ours) if FORCE_BODY is set */
          if (body && FORCE_BODY) {
            _forceRemove(body.firstChild);
          }

          /* Get node iterator */
          var nodeIterator = _createIterator(IN_PLACE ? dirty : body);

          /* Now start iterating over the created document */
          while (currentNode = nodeIterator.nextNode()) {
            /* Fix IE's strange behavior with manipulated textNodes #89 */
            if (currentNode.nodeType === 3 && currentNode === oldNode) {
              continue;
            }

            /* Sanitize tags and elements */
            if (_sanitizeElements(currentNode)) {
              continue;
            }

            /* Shadow DOM detected, sanitize it */
            if (currentNode.content instanceof DocumentFragment) {
              _sanitizeShadowDOM(currentNode.content);
            }

            /* Check attributes, sanitize if necessary */
            _sanitizeAttributes(currentNode);

            oldNode = currentNode;
          }

          oldNode = null;

          /* If we sanitized `dirty` in-place, return it. */
          if (IN_PLACE) {
            return dirty;
          }

          /* Return sanitized string or DOM */
          if (RETURN_DOM) {
            if (RETURN_DOM_FRAGMENT) {
              returnNode = createDocumentFragment.call(body.ownerDocument);

              while (body.firstChild) {
                // eslint-disable-next-line unicorn/prefer-node-append
                returnNode.appendChild(body.firstChild);
              }
            } else {
              returnNode = body;
            }

            if (RETURN_DOM_IMPORT) {
              /*
                AdoptNode() is not used because internal state is not reset
                (e.g. the past names map of a HTMLFormElement), this is safe
                in theory but we would rather not risk another attack vector.
                The state that is cloned by importNode() is explicitly defined
                by the specs.
              */
              returnNode = importNode.call(originalDocument, returnNode, true);
            }

            return returnNode;
          }

          var serializedHTML = WHOLE_DOCUMENT ? body.outerHTML : body.innerHTML;

          /* Sanitize final string template-safe */
          if (SAFE_FOR_TEMPLATES) {
            serializedHTML = stringReplace(serializedHTML, MUSTACHE_EXPR$$1, ' ');
            serializedHTML = stringReplace(serializedHTML, ERB_EXPR$$1, ' ');
          }

          return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(serializedHTML) : serializedHTML;
        };

        /**
         * Public method to set the configuration once
         * setConfig
         *
         * @param {Object} cfg configuration object
         */
        DOMPurify.setConfig = function (cfg) {
          _parseConfig(cfg);
          SET_CONFIG = true;
        };

        /**
         * Public method to remove the configuration
         * clearConfig
         *
         */
        DOMPurify.clearConfig = function () {
          CONFIG = null;
          SET_CONFIG = false;
        };

        /**
         * Public method to check if an attribute value is valid.
         * Uses last set config, if any. Otherwise, uses config defaults.
         * isValidAttribute
         *
         * @param  {string} tag Tag name of containing element.
         * @param  {string} attr Attribute name.
         * @param  {string} value Attribute value.
         * @return {Boolean} Returns true if `value` is valid. Otherwise, returns false.
         */
        DOMPurify.isValidAttribute = function (tag, attr, value) {
          /* Initialize shared config vars if necessary. */
          if (!CONFIG) {
            _parseConfig({});
          }

          var lcTag = stringToLowerCase(tag);
          var lcName = stringToLowerCase(attr);
          return _isValidAttribute(lcTag, lcName, value);
        };

        /**
         * AddHook
         * Public method to add DOMPurify hooks
         *
         * @param {String} entryPoint entry point for the hook to add
         * @param {Function} hookFunction function to execute
         */
        DOMPurify.addHook = function (entryPoint, hookFunction) {
          if (typeof hookFunction !== 'function') {
            return;
          }

          hooks[entryPoint] = hooks[entryPoint] || [];
          arrayPush(hooks[entryPoint], hookFunction);
        };

        /**
         * RemoveHook
         * Public method to remove a DOMPurify hook at a given entryPoint
         * (pops it from the stack of hooks if more are present)
         *
         * @param {String} entryPoint entry point for the hook to remove
         */
        DOMPurify.removeHook = function (entryPoint) {
          if (hooks[entryPoint]) {
            arrayPop(hooks[entryPoint]);
          }
        };

        /**
         * RemoveHooks
         * Public method to remove all DOMPurify hooks at a given entryPoint
         *
         * @param  {String} entryPoint entry point for the hooks to remove
         */
        DOMPurify.removeHooks = function (entryPoint) {
          if (hooks[entryPoint]) {
            hooks[entryPoint] = [];
          }
        };

        /**
         * RemoveAllHooks
         * Public method to remove all DOMPurify hooks
         *
         */
        DOMPurify.removeAllHooks = function () {
          hooks = {};
        };

        return DOMPurify;
      }

      var purify = createDOMPurify();

      return purify;

    }));
    //# sourceMappingURL=purify.js.map
    });

    var minIndent = string => {
    	const match = string.match(/^[ \t]*(?=\S)/gm);

    	if (!match) {
    		return 0;
    	}

    	return match.reduce((r, a) => Math.min(r, a.length), Infinity);
    };

    var stripIndent = string => {
    	const indent = minIndent(string);

    	if (indent === 0) {
    		return string;
    	}

    	const regex = new RegExp(`^[ \\t]{${indent}}`, 'gm');

    	return string.replace(regex, '');
    };

    function deepFreeze(obj) {
        if (obj instanceof Map) {
            obj.clear = obj.delete = obj.set = function () {
                throw new Error('map is read-only');
            };
        } else if (obj instanceof Set) {
            obj.add = obj.clear = obj.delete = function () {
                throw new Error('set is read-only');
            };
        }

        // Freeze self
        Object.freeze(obj);

        Object.getOwnPropertyNames(obj).forEach(function (name) {
            var prop = obj[name];

            // Freeze prop if it is an object
            if (typeof prop == 'object' && !Object.isFrozen(prop)) {
                deepFreeze(prop);
            }
        });

        return obj;
    }

    var deepFreezeEs6 = deepFreeze;
    var _default = deepFreeze;
    deepFreezeEs6.default = _default;

    /** @implements CallbackResponse */
    class Response {
      /**
       * @param {CompiledMode} mode
       */
      constructor(mode) {
        // eslint-disable-next-line no-undefined
        if (mode.data === undefined) mode.data = {};

        this.data = mode.data;
        this.isMatchIgnored = false;
      }

      ignoreMatch() {
        this.isMatchIgnored = true;
      }
    }

    /**
     * @param {string} value
     * @returns {string}
     */
    function escapeHTML(value) {
      return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
    }

    /**
     * performs a shallow merge of multiple objects into one
     *
     * @template T
     * @param {T} original
     * @param {Record<string,any>[]} objects
     * @returns {T} a single new object
     */
    function inherit(original, ...objects) {
      /** @type Record<string,any> */
      const result = Object.create(null);

      for (const key in original) {
        result[key] = original[key];
      }
      objects.forEach(function(obj) {
        for (const key in obj) {
          result[key] = obj[key];
        }
      });
      return /** @type {T} */ (result);
    }

    /**
     * @typedef {object} Renderer
     * @property {(text: string) => void} addText
     * @property {(node: Node) => void} openNode
     * @property {(node: Node) => void} closeNode
     * @property {() => string} value
     */

    /** @typedef {{kind?: string, sublanguage?: boolean}} Node */
    /** @typedef {{walk: (r: Renderer) => void}} Tree */
    /** */

    const SPAN_CLOSE = '</span>';

    /**
     * Determines if a node needs to be wrapped in <span>
     *
     * @param {Node} node */
    const emitsWrappingTags = (node) => {
      return !!node.kind;
    };

    /** @type {Renderer} */
    class HTMLRenderer {
      /**
       * Creates a new HTMLRenderer
       *
       * @param {Tree} parseTree - the parse tree (must support `walk` API)
       * @param {{classPrefix: string}} options
       */
      constructor(parseTree, options) {
        this.buffer = "";
        this.classPrefix = options.classPrefix;
        parseTree.walk(this);
      }

      /**
       * Adds texts to the output stream
       *
       * @param {string} text */
      addText(text) {
        this.buffer += escapeHTML(text);
      }

      /**
       * Adds a node open to the output stream (if needed)
       *
       * @param {Node} node */
      openNode(node) {
        if (!emitsWrappingTags(node)) return;

        let className = node.kind;
        if (!node.sublanguage) {
          className = `${this.classPrefix}${className}`;
        }
        this.span(className);
      }

      /**
       * Adds a node close to the output stream (if needed)
       *
       * @param {Node} node */
      closeNode(node) {
        if (!emitsWrappingTags(node)) return;

        this.buffer += SPAN_CLOSE;
      }

      /**
       * returns the accumulated buffer
      */
      value() {
        return this.buffer;
      }

      // helpers

      /**
       * Builds a span element
       *
       * @param {string} className */
      span(className) {
        this.buffer += `<span class="${className}">`;
      }
    }

    /** @typedef {{kind?: string, sublanguage?: boolean, children: Node[]} | string} Node */
    /** @typedef {{kind?: string, sublanguage?: boolean, children: Node[]} } DataNode */
    /**  */

    class TokenTree {
      constructor() {
        /** @type DataNode */
        this.rootNode = { children: [] };
        this.stack = [this.rootNode];
      }

      get top() {
        return this.stack[this.stack.length - 1];
      }

      get root() { return this.rootNode; }

      /** @param {Node} node */
      add(node) {
        this.top.children.push(node);
      }

      /** @param {string} kind */
      openNode(kind) {
        /** @type Node */
        const node = { kind, children: [] };
        this.add(node);
        this.stack.push(node);
      }

      closeNode() {
        if (this.stack.length > 1) {
          return this.stack.pop();
        }
        // eslint-disable-next-line no-undefined
        return undefined;
      }

      closeAllNodes() {
        while (this.closeNode());
      }

      toJSON() {
        return JSON.stringify(this.rootNode, null, 4);
      }

      /**
       * @typedef { import("./html_renderer").Renderer } Renderer
       * @param {Renderer} builder
       */
      walk(builder) {
        // this does not
        return this.constructor._walk(builder, this.rootNode);
        // this works
        // return TokenTree._walk(builder, this.rootNode);
      }

      /**
       * @param {Renderer} builder
       * @param {Node} node
       */
      static _walk(builder, node) {
        if (typeof node === "string") {
          builder.addText(node);
        } else if (node.children) {
          builder.openNode(node);
          node.children.forEach((child) => this._walk(builder, child));
          builder.closeNode(node);
        }
        return builder;
      }

      /**
       * @param {Node} node
       */
      static _collapse(node) {
        if (typeof node === "string") return;
        if (!node.children) return;

        if (node.children.every(el => typeof el === "string")) {
          // node.text = node.children.join("");
          // delete node.children;
          node.children = [node.children.join("")];
        } else {
          node.children.forEach((child) => {
            TokenTree._collapse(child);
          });
        }
      }
    }

    /**
      Currently this is all private API, but this is the minimal API necessary
      that an Emitter must implement to fully support the parser.

      Minimal interface:

      - addKeyword(text, kind)
      - addText(text)
      - addSublanguage(emitter, subLanguageName)
      - finalize()
      - openNode(kind)
      - closeNode()
      - closeAllNodes()
      - toHTML()

    */

    /**
     * @implements {Emitter}
     */
    class TokenTreeEmitter extends TokenTree {
      /**
       * @param {*} options
       */
      constructor(options) {
        super();
        this.options = options;
      }

      /**
       * @param {string} text
       * @param {string} kind
       */
      addKeyword(text, kind) {
        if (text === "") { return; }

        this.openNode(kind);
        this.addText(text);
        this.closeNode();
      }

      /**
       * @param {string} text
       */
      addText(text) {
        if (text === "") { return; }

        this.add(text);
      }

      /**
       * @param {Emitter & {root: DataNode}} emitter
       * @param {string} name
       */
      addSublanguage(emitter, name) {
        /** @type DataNode */
        const node = emitter.root;
        node.kind = name;
        node.sublanguage = true;
        this.add(node);
      }

      toHTML() {
        const renderer = new HTMLRenderer(this, this.options);
        return renderer.value();
      }

      finalize() {
        return true;
      }
    }

    /**
     * @param {string} value
     * @returns {RegExp}
     * */
    function escape(value) {
      return new RegExp(value.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'm');
    }

    /**
     * @param {RegExp | string } re
     * @returns {string}
     */
    function source$1(re) {
      if (!re) return null;
      if (typeof re === "string") return re;

      return re.source;
    }

    /**
     * @param {...(RegExp | string) } args
     * @returns {string}
     */
    function concat$1(...args) {
      const joined = args.map((x) => source$1(x)).join("");
      return joined;
    }

    /**
     * Any of the passed expresssions may match
     *
     * Creates a huge this | this | that | that match
     * @param {(RegExp | string)[] } args
     * @returns {string}
     */
    function either(...args) {
      const joined = '(' + args.map((x) => source$1(x)).join("|") + ")";
      return joined;
    }

    /**
     * @param {RegExp} re
     * @returns {number}
     */
    function countMatchGroups(re) {
      return (new RegExp(re.toString() + '|')).exec('').length - 1;
    }

    /**
     * Does lexeme start with a regular expression match at the beginning
     * @param {RegExp} re
     * @param {string} lexeme
     */
    function startsWith(re, lexeme) {
      const match = re && re.exec(lexeme);
      return match && match.index === 0;
    }

    // BACKREF_RE matches an open parenthesis or backreference. To avoid
    // an incorrect parse, it additionally matches the following:
    // - [...] elements, where the meaning of parentheses and escapes change
    // - other escape sequences, so we do not misparse escape sequences as
    //   interesting elements
    // - non-matching or lookahead parentheses, which do not capture. These
    //   follow the '(' with a '?'.
    const BACKREF_RE = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;

    // join logically computes regexps.join(separator), but fixes the
    // backreferences so they continue to match.
    // it also places each individual regular expression into it's own
    // match group, keeping track of the sequencing of those match groups
    // is currently an exercise for the caller. :-)
    /**
     * @param {(string | RegExp)[]} regexps
     * @param {string} separator
     * @returns {string}
     */
    function join(regexps, separator = "|") {
      let numCaptures = 0;

      return regexps.map((regex) => {
        numCaptures += 1;
        const offset = numCaptures;
        let re = source$1(regex);
        let out = '';

        while (re.length > 0) {
          const match = BACKREF_RE.exec(re);
          if (!match) {
            out += re;
            break;
          }
          out += re.substring(0, match.index);
          re = re.substring(match.index + match[0].length);
          if (match[0][0] === '\\' && match[1]) {
            // Adjust the backreference.
            out += '\\' + String(Number(match[1]) + offset);
          } else {
            out += match[0];
            if (match[0] === '(') {
              numCaptures++;
            }
          }
        }
        return out;
      }).map(re => `(${re})`).join(separator);
    }

    // Common regexps
    const MATCH_NOTHING_RE = /\b\B/;
    const IDENT_RE = '[a-zA-Z]\\w*';
    const UNDERSCORE_IDENT_RE = '[a-zA-Z_]\\w*';
    const NUMBER_RE = '\\b\\d+(\\.\\d+)?';
    const C_NUMBER_RE = '(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)'; // 0x..., 0..., decimal, float
    const BINARY_NUMBER_RE = '\\b(0b[01]+)'; // 0b...
    const RE_STARTERS_RE = '!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~';

    /**
    * @param { Partial<Mode> & {binary?: string | RegExp} } opts
    */
    const SHEBANG = (opts = {}) => {
      const beginShebang = /^#![ ]*\//;
      if (opts.binary) {
        opts.begin = concat$1(
          beginShebang,
          /.*\b/,
          opts.binary,
          /\b.*/);
      }
      return inherit({
        className: 'meta',
        begin: beginShebang,
        end: /$/,
        relevance: 0,
        /** @type {ModeCallback} */
        "on:begin": (m, resp) => {
          if (m.index !== 0) resp.ignoreMatch();
        }
      }, opts);
    };

    // Common modes
    const BACKSLASH_ESCAPE = {
      begin: '\\\\[\\s\\S]', relevance: 0
    };
    const APOS_STRING_MODE = {
      className: 'string',
      begin: '\'',
      end: '\'',
      illegal: '\\n',
      contains: [BACKSLASH_ESCAPE]
    };
    const QUOTE_STRING_MODE = {
      className: 'string',
      begin: '"',
      end: '"',
      illegal: '\\n',
      contains: [BACKSLASH_ESCAPE]
    };
    const PHRASAL_WORDS_MODE = {
      begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
    };
    /**
     * Creates a comment mode
     *
     * @param {string | RegExp} begin
     * @param {string | RegExp} end
     * @param {Mode | {}} [modeOptions]
     * @returns {Partial<Mode>}
     */
    const COMMENT = function(begin, end, modeOptions = {}) {
      const mode = inherit(
        {
          className: 'comment',
          begin,
          end,
          contains: []
        },
        modeOptions
      );
      mode.contains.push(PHRASAL_WORDS_MODE);
      mode.contains.push({
        className: 'doctag',
        begin: '(?:TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):',
        relevance: 0
      });
      return mode;
    };
    const C_LINE_COMMENT_MODE = COMMENT('//', '$');
    const C_BLOCK_COMMENT_MODE = COMMENT('/\\*', '\\*/');
    const HASH_COMMENT_MODE = COMMENT('#', '$');
    const NUMBER_MODE = {
      className: 'number',
      begin: NUMBER_RE,
      relevance: 0
    };
    const C_NUMBER_MODE = {
      className: 'number',
      begin: C_NUMBER_RE,
      relevance: 0
    };
    const BINARY_NUMBER_MODE = {
      className: 'number',
      begin: BINARY_NUMBER_RE,
      relevance: 0
    };
    const CSS_NUMBER_MODE = {
      className: 'number',
      begin: NUMBER_RE + '(' +
        '%|em|ex|ch|rem' +
        '|vw|vh|vmin|vmax' +
        '|cm|mm|in|pt|pc|px' +
        '|deg|grad|rad|turn' +
        '|s|ms' +
        '|Hz|kHz' +
        '|dpi|dpcm|dppx' +
        ')?',
      relevance: 0
    };
    const REGEXP_MODE = {
      // this outer rule makes sure we actually have a WHOLE regex and not simply
      // an expression such as:
      //
      //     3 / something
      //
      // (which will then blow up when regex's `illegal` sees the newline)
      begin: /(?=\/[^/\n]*\/)/,
      contains: [{
        className: 'regexp',
        begin: /\//,
        end: /\/[gimuy]*/,
        illegal: /\n/,
        contains: [
          BACKSLASH_ESCAPE,
          {
            begin: /\[/,
            end: /\]/,
            relevance: 0,
            contains: [BACKSLASH_ESCAPE]
          }
        ]
      }]
    };
    const TITLE_MODE = {
      className: 'title',
      begin: IDENT_RE,
      relevance: 0
    };
    const UNDERSCORE_TITLE_MODE = {
      className: 'title',
      begin: UNDERSCORE_IDENT_RE,
      relevance: 0
    };
    const METHOD_GUARD = {
      // excludes method names from keyword processing
      begin: '\\.\\s*' + UNDERSCORE_IDENT_RE,
      relevance: 0
    };

    /**
     * Adds end same as begin mechanics to a mode
     *
     * Your mode must include at least a single () match group as that first match
     * group is what is used for comparison
     * @param {Partial<Mode>} mode
     */
    const END_SAME_AS_BEGIN = function(mode) {
      return Object.assign(mode,
        {
          /** @type {ModeCallback} */
          'on:begin': (m, resp) => { resp.data._beginMatch = m[1]; },
          /** @type {ModeCallback} */
          'on:end': (m, resp) => { if (resp.data._beginMatch !== m[1]) resp.ignoreMatch(); }
        });
    };

    var MODES = /*#__PURE__*/Object.freeze({
        __proto__: null,
        MATCH_NOTHING_RE: MATCH_NOTHING_RE,
        IDENT_RE: IDENT_RE,
        UNDERSCORE_IDENT_RE: UNDERSCORE_IDENT_RE,
        NUMBER_RE: NUMBER_RE,
        C_NUMBER_RE: C_NUMBER_RE,
        BINARY_NUMBER_RE: BINARY_NUMBER_RE,
        RE_STARTERS_RE: RE_STARTERS_RE,
        SHEBANG: SHEBANG,
        BACKSLASH_ESCAPE: BACKSLASH_ESCAPE,
        APOS_STRING_MODE: APOS_STRING_MODE,
        QUOTE_STRING_MODE: QUOTE_STRING_MODE,
        PHRASAL_WORDS_MODE: PHRASAL_WORDS_MODE,
        COMMENT: COMMENT,
        C_LINE_COMMENT_MODE: C_LINE_COMMENT_MODE,
        C_BLOCK_COMMENT_MODE: C_BLOCK_COMMENT_MODE,
        HASH_COMMENT_MODE: HASH_COMMENT_MODE,
        NUMBER_MODE: NUMBER_MODE,
        C_NUMBER_MODE: C_NUMBER_MODE,
        BINARY_NUMBER_MODE: BINARY_NUMBER_MODE,
        CSS_NUMBER_MODE: CSS_NUMBER_MODE,
        REGEXP_MODE: REGEXP_MODE,
        TITLE_MODE: TITLE_MODE,
        UNDERSCORE_TITLE_MODE: UNDERSCORE_TITLE_MODE,
        METHOD_GUARD: METHOD_GUARD,
        END_SAME_AS_BEGIN: END_SAME_AS_BEGIN
    });

    // Grammar extensions / plugins
    // See: https://github.com/highlightjs/highlight.js/issues/2833

    // Grammar extensions allow "syntactic sugar" to be added to the grammar modes
    // without requiring any underlying changes to the compiler internals.

    // `compileMatch` being the perfect small example of now allowing a grammar
    // author to write `match` when they desire to match a single expression rather
    // than being forced to use `begin`.  The extension then just moves `match` into
    // `begin` when it runs.  Ie, no features have been added, but we've just made
    // the experience of writing (and reading grammars) a little bit nicer.

    // ------

    // TODO: We need negative look-behind support to do this properly
    /**
     * Skip a match if it has a preceding dot
     *
     * This is used for `beginKeywords` to prevent matching expressions such as
     * `bob.keyword.do()`. The mode compiler automatically wires this up as a
     * special _internal_ 'on:begin' callback for modes with `beginKeywords`
     * @param {RegExpMatchArray} match
     * @param {CallbackResponse} response
     */
    function skipIfhasPrecedingDot(match, response) {
      const before = match.input[match.index - 1];
      if (before === ".") {
        response.ignoreMatch();
      }
    }


    /**
     * `beginKeywords` syntactic sugar
     * @type {CompilerExt}
     */
    function beginKeywords(mode, parent) {
      if (!parent) return;
      if (!mode.beginKeywords) return;

      // for languages with keywords that include non-word characters checking for
      // a word boundary is not sufficient, so instead we check for a word boundary
      // or whitespace - this does no harm in any case since our keyword engine
      // doesn't allow spaces in keywords anyways and we still check for the boundary
      // first
      mode.begin = '\\b(' + mode.beginKeywords.split(' ').join('|') + ')(?!\\.)(?=\\b|\\s)';
      mode.__beforeBegin = skipIfhasPrecedingDot;
      mode.keywords = mode.keywords || mode.beginKeywords;
      delete mode.beginKeywords;

      // prevents double relevance, the keywords themselves provide
      // relevance, the mode doesn't need to double it
      // eslint-disable-next-line no-undefined
      if (mode.relevance === undefined) mode.relevance = 0;
    }

    /**
     * Allow `illegal` to contain an array of illegal values
     * @type {CompilerExt}
     */
    function compileIllegal(mode, _parent) {
      if (!Array.isArray(mode.illegal)) return;

      mode.illegal = either(...mode.illegal);
    }

    /**
     * `match` to match a single expression for readability
     * @type {CompilerExt}
     */
    function compileMatch(mode, _parent) {
      if (!mode.match) return;
      if (mode.begin || mode.end) throw new Error("begin & end are not supported with match");

      mode.begin = mode.match;
      delete mode.match;
    }

    /**
     * provides the default 1 relevance to all modes
     * @type {CompilerExt}
     */
    function compileRelevance(mode, _parent) {
      // eslint-disable-next-line no-undefined
      if (mode.relevance === undefined) mode.relevance = 1;
    }

    // keywords that should have no default relevance value
    const COMMON_KEYWORDS = [
      'of',
      'and',
      'for',
      'in',
      'not',
      'or',
      'if',
      'then',
      'parent', // common variable name
      'list', // common variable name
      'value' // common variable name
    ];

    const DEFAULT_KEYWORD_CLASSNAME = "keyword";

    /**
     * Given raw keywords from a language definition, compile them.
     *
     * @param {string | Record<string,string|string[]> | Array<string>} rawKeywords
     * @param {boolean} caseInsensitive
     */
    function compileKeywords(rawKeywords, caseInsensitive, className = DEFAULT_KEYWORD_CLASSNAME) {
      /** @type KeywordDict */
      const compiledKeywords = {};

      // input can be a string of keywords, an array of keywords, or a object with
      // named keys representing className (which can then point to a string or array)
      if (typeof rawKeywords === 'string') {
        compileList(className, rawKeywords.split(" "));
      } else if (Array.isArray(rawKeywords)) {
        compileList(className, rawKeywords);
      } else {
        Object.keys(rawKeywords).forEach(function(className) {
          // collapse all our objects back into the parent object
          Object.assign(
            compiledKeywords,
            compileKeywords(rawKeywords[className], caseInsensitive, className)
          );
        });
      }
      return compiledKeywords;

      // ---

      /**
       * Compiles an individual list of keywords
       *
       * Ex: "for if when while|5"
       *
       * @param {string} className
       * @param {Array<string>} keywordList
       */
      function compileList(className, keywordList) {
        if (caseInsensitive) {
          keywordList = keywordList.map(x => x.toLowerCase());
        }
        keywordList.forEach(function(keyword) {
          const pair = keyword.split('|');
          compiledKeywords[pair[0]] = [className, scoreForKeyword(pair[0], pair[1])];
        });
      }
    }

    /**
     * Returns the proper score for a given keyword
     *
     * Also takes into account comment keywords, which will be scored 0 UNLESS
     * another score has been manually assigned.
     * @param {string} keyword
     * @param {string} [providedScore]
     */
    function scoreForKeyword(keyword, providedScore) {
      // manual scores always win over common keywords
      // so you can force a score of 1 if you really insist
      if (providedScore) {
        return Number(providedScore);
      }

      return commonKeyword(keyword) ? 0 : 1;
    }

    /**
     * Determines if a given keyword is common or not
     *
     * @param {string} keyword */
    function commonKeyword(keyword) {
      return COMMON_KEYWORDS.includes(keyword.toLowerCase());
    }

    // compilation

    /**
     * Compiles a language definition result
     *
     * Given the raw result of a language definition (Language), compiles this so
     * that it is ready for highlighting code.
     * @param {Language} language
     * @param {{plugins: HLJSPlugin[]}} opts
     * @returns {CompiledLanguage}
     */
    function compileLanguage(language, { plugins }) {
      /**
       * Builds a regex with the case sensativility of the current language
       *
       * @param {RegExp | string} value
       * @param {boolean} [global]
       */
      function langRe(value, global) {
        return new RegExp(
          source$1(value),
          'm' + (language.case_insensitive ? 'i' : '') + (global ? 'g' : '')
        );
      }

      /**
        Stores multiple regular expressions and allows you to quickly search for
        them all in a string simultaneously - returning the first match.  It does
        this by creating a huge (a|b|c) regex - each individual item wrapped with ()
        and joined by `|` - using match groups to track position.  When a match is
        found checking which position in the array has content allows us to figure
        out which of the original regexes / match groups triggered the match.

        The match object itself (the result of `Regex.exec`) is returned but also
        enhanced by merging in any meta-data that was registered with the regex.
        This is how we keep track of which mode matched, and what type of rule
        (`illegal`, `begin`, end, etc).
      */
      class MultiRegex {
        constructor() {
          this.matchIndexes = {};
          // @ts-ignore
          this.regexes = [];
          this.matchAt = 1;
          this.position = 0;
        }

        // @ts-ignore
        addRule(re, opts) {
          opts.position = this.position++;
          // @ts-ignore
          this.matchIndexes[this.matchAt] = opts;
          this.regexes.push([opts, re]);
          this.matchAt += countMatchGroups(re) + 1;
        }

        compile() {
          if (this.regexes.length === 0) {
            // avoids the need to check length every time exec is called
            // @ts-ignore
            this.exec = () => null;
          }
          const terminators = this.regexes.map(el => el[1]);
          this.matcherRe = langRe(join(terminators), true);
          this.lastIndex = 0;
        }

        /** @param {string} s */
        exec(s) {
          this.matcherRe.lastIndex = this.lastIndex;
          const match = this.matcherRe.exec(s);
          if (!match) { return null; }

          // eslint-disable-next-line no-undefined
          const i = match.findIndex((el, i) => i > 0 && el !== undefined);
          // @ts-ignore
          const matchData = this.matchIndexes[i];
          // trim off any earlier non-relevant match groups (ie, the other regex
          // match groups that make up the multi-matcher)
          match.splice(0, i);

          return Object.assign(match, matchData);
        }
      }

      /*
        Created to solve the key deficiently with MultiRegex - there is no way to
        test for multiple matches at a single location.  Why would we need to do
        that?  In the future a more dynamic engine will allow certain matches to be
        ignored.  An example: if we matched say the 3rd regex in a large group but
        decided to ignore it - we'd need to started testing again at the 4th
        regex... but MultiRegex itself gives us no real way to do that.

        So what this class creates MultiRegexs on the fly for whatever search
        position they are needed.

        NOTE: These additional MultiRegex objects are created dynamically.  For most
        grammars most of the time we will never actually need anything more than the
        first MultiRegex - so this shouldn't have too much overhead.

        Say this is our search group, and we match regex3, but wish to ignore it.

          regex1 | regex2 | regex3 | regex4 | regex5    ' ie, startAt = 0

        What we need is a new MultiRegex that only includes the remaining
        possibilities:

          regex4 | regex5                               ' ie, startAt = 3

        This class wraps all that complexity up in a simple API... `startAt` decides
        where in the array of expressions to start doing the matching. It
        auto-increments, so if a match is found at position 2, then startAt will be
        set to 3.  If the end is reached startAt will return to 0.

        MOST of the time the parser will be setting startAt manually to 0.
      */
      class ResumableMultiRegex {
        constructor() {
          // @ts-ignore
          this.rules = [];
          // @ts-ignore
          this.multiRegexes = [];
          this.count = 0;

          this.lastIndex = 0;
          this.regexIndex = 0;
        }

        // @ts-ignore
        getMatcher(index) {
          if (this.multiRegexes[index]) return this.multiRegexes[index];

          const matcher = new MultiRegex();
          this.rules.slice(index).forEach(([re, opts]) => matcher.addRule(re, opts));
          matcher.compile();
          this.multiRegexes[index] = matcher;
          return matcher;
        }

        resumingScanAtSamePosition() {
          return this.regexIndex !== 0;
        }

        considerAll() {
          this.regexIndex = 0;
        }

        // @ts-ignore
        addRule(re, opts) {
          this.rules.push([re, opts]);
          if (opts.type === "begin") this.count++;
        }

        /** @param {string} s */
        exec(s) {
          const m = this.getMatcher(this.regexIndex);
          m.lastIndex = this.lastIndex;
          let result = m.exec(s);

          // The following is because we have no easy way to say "resume scanning at the
          // existing position but also skip the current rule ONLY". What happens is
          // all prior rules are also skipped which can result in matching the wrong
          // thing. Example of matching "booger":

          // our matcher is [string, "booger", number]
          //
          // ....booger....

          // if "booger" is ignored then we'd really need a regex to scan from the
          // SAME position for only: [string, number] but ignoring "booger" (if it
          // was the first match), a simple resume would scan ahead who knows how
          // far looking only for "number", ignoring potential string matches (or
          // future "booger" matches that might be valid.)

          // So what we do: We execute two matchers, one resuming at the same
          // position, but the second full matcher starting at the position after:

          //     /--- resume first regex match here (for [number])
          //     |/---- full match here for [string, "booger", number]
          //     vv
          // ....booger....

          // Which ever results in a match first is then used. So this 3-4 step
          // process essentially allows us to say "match at this position, excluding
          // a prior rule that was ignored".
          //
          // 1. Match "booger" first, ignore. Also proves that [string] does non match.
          // 2. Resume matching for [number]
          // 3. Match at index + 1 for [string, "booger", number]
          // 4. If #2 and #3 result in matches, which came first?
          if (this.resumingScanAtSamePosition()) {
            if (result && result.index === this.lastIndex) ; else { // use the second matcher result
              const m2 = this.getMatcher(0);
              m2.lastIndex = this.lastIndex + 1;
              result = m2.exec(s);
            }
          }

          if (result) {
            this.regexIndex += result.position + 1;
            if (this.regexIndex === this.count) {
              // wrap-around to considering all matches again
              this.considerAll();
            }
          }

          return result;
        }
      }

      /**
       * Given a mode, builds a huge ResumableMultiRegex that can be used to walk
       * the content and find matches.
       *
       * @param {CompiledMode} mode
       * @returns {ResumableMultiRegex}
       */
      function buildModeRegex(mode) {
        const mm = new ResumableMultiRegex();

        mode.contains.forEach(term => mm.addRule(term.begin, { rule: term, type: "begin" }));

        if (mode.terminatorEnd) {
          mm.addRule(mode.terminatorEnd, { type: "end" });
        }
        if (mode.illegal) {
          mm.addRule(mode.illegal, { type: "illegal" });
        }

        return mm;
      }

      /** skip vs abort vs ignore
       *
       * @skip   - The mode is still entered and exited normally (and contains rules apply),
       *           but all content is held and added to the parent buffer rather than being
       *           output when the mode ends.  Mostly used with `sublanguage` to build up
       *           a single large buffer than can be parsed by sublanguage.
       *
       *             - The mode begin ands ends normally.
       *             - Content matched is added to the parent mode buffer.
       *             - The parser cursor is moved forward normally.
       *
       * @abort  - A hack placeholder until we have ignore.  Aborts the mode (as if it
       *           never matched) but DOES NOT continue to match subsequent `contains`
       *           modes.  Abort is bad/suboptimal because it can result in modes
       *           farther down not getting applied because an earlier rule eats the
       *           content but then aborts.
       *
       *             - The mode does not begin.
       *             - Content matched by `begin` is added to the mode buffer.
       *             - The parser cursor is moved forward accordingly.
       *
       * @ignore - Ignores the mode (as if it never matched) and continues to match any
       *           subsequent `contains` modes.  Ignore isn't technically possible with
       *           the current parser implementation.
       *
       *             - The mode does not begin.
       *             - Content matched by `begin` is ignored.
       *             - The parser cursor is not moved forward.
       */

      /**
       * Compiles an individual mode
       *
       * This can raise an error if the mode contains certain detectable known logic
       * issues.
       * @param {Mode} mode
       * @param {CompiledMode | null} [parent]
       * @returns {CompiledMode | never}
       */
      function compileMode(mode, parent) {
        const cmode = /** @type CompiledMode */ (mode);
        if (mode.isCompiled) return cmode;

        [
          // do this early so compiler extensions generally don't have to worry about
          // the distinction between match/begin
          compileMatch
        ].forEach(ext => ext(mode, parent));

        language.compilerExtensions.forEach(ext => ext(mode, parent));

        // __beforeBegin is considered private API, internal use only
        mode.__beforeBegin = null;

        [
          beginKeywords,
          // do this later so compiler extensions that come earlier have access to the
          // raw array if they wanted to perhaps manipulate it, etc.
          compileIllegal,
          // default to 1 relevance if not specified
          compileRelevance
        ].forEach(ext => ext(mode, parent));

        mode.isCompiled = true;

        let keywordPattern = null;
        if (typeof mode.keywords === "object") {
          keywordPattern = mode.keywords.$pattern;
          delete mode.keywords.$pattern;
        }

        if (mode.keywords) {
          mode.keywords = compileKeywords(mode.keywords, language.case_insensitive);
        }

        // both are not allowed
        if (mode.lexemes && keywordPattern) {
          throw new Error("ERR: Prefer `keywords.$pattern` to `mode.lexemes`, BOTH are not allowed. (see mode reference) ");
        }

        // `mode.lexemes` was the old standard before we added and now recommend
        // using `keywords.$pattern` to pass the keyword pattern
        keywordPattern = keywordPattern || mode.lexemes || /\w+/;
        cmode.keywordPatternRe = langRe(keywordPattern, true);

        if (parent) {
          if (!mode.begin) mode.begin = /\B|\b/;
          cmode.beginRe = langRe(mode.begin);
          if (mode.endSameAsBegin) mode.end = mode.begin;
          if (!mode.end && !mode.endsWithParent) mode.end = /\B|\b/;
          if (mode.end) cmode.endRe = langRe(mode.end);
          cmode.terminatorEnd = source$1(mode.end) || '';
          if (mode.endsWithParent && parent.terminatorEnd) {
            cmode.terminatorEnd += (mode.end ? '|' : '') + parent.terminatorEnd;
          }
        }
        if (mode.illegal) cmode.illegalRe = langRe(/** @type {RegExp | string} */ (mode.illegal));
        if (!mode.contains) mode.contains = [];

        mode.contains = [].concat(...mode.contains.map(function(c) {
          return expandOrCloneMode(c === 'self' ? mode : c);
        }));
        mode.contains.forEach(function(c) { compileMode(/** @type Mode */ (c), cmode); });

        if (mode.starts) {
          compileMode(mode.starts, parent);
        }

        cmode.matcher = buildModeRegex(cmode);
        return cmode;
      }

      if (!language.compilerExtensions) language.compilerExtensions = [];

      // self is not valid at the top-level
      if (language.contains && language.contains.includes('self')) {
        throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
      }

      // we need a null object, which inherit will guarantee
      language.classNameAliases = inherit(language.classNameAliases || {});

      return compileMode(/** @type Mode */ (language));
    }

    /**
     * Determines if a mode has a dependency on it's parent or not
     *
     * If a mode does have a parent dependency then often we need to clone it if
     * it's used in multiple places so that each copy points to the correct parent,
     * where-as modes without a parent can often safely be re-used at the bottom of
     * a mode chain.
     *
     * @param {Mode | null} mode
     * @returns {boolean} - is there a dependency on the parent?
     * */
    function dependencyOnParent(mode) {
      if (!mode) return false;

      return mode.endsWithParent || dependencyOnParent(mode.starts);
    }

    /**
     * Expands a mode or clones it if necessary
     *
     * This is necessary for modes with parental dependenceis (see notes on
     * `dependencyOnParent`) and for nodes that have `variants` - which must then be
     * exploded into their own individual modes at compile time.
     *
     * @param {Mode} mode
     * @returns {Mode | Mode[]}
     * */
    function expandOrCloneMode(mode) {
      if (mode.variants && !mode.cachedVariants) {
        mode.cachedVariants = mode.variants.map(function(variant) {
          return inherit(mode, { variants: null }, variant);
        });
      }

      // EXPAND
      // if we have variants then essentially "replace" the mode with the variants
      // this happens in compileMode, where this function is called from
      if (mode.cachedVariants) {
        return mode.cachedVariants;
      }

      // CLONE
      // if we have dependencies on parents then we need a unique
      // instance of ourselves, so we can be reused with many
      // different parents without issue
      if (dependencyOnParent(mode)) {
        return inherit(mode, { starts: mode.starts ? inherit(mode.starts) : null });
      }

      if (Object.isFrozen(mode)) {
        return inherit(mode);
      }

      // no special dependency issues, just return ourselves
      return mode;
    }

    var version = "10.7.2";

    // @ts-nocheck

    function hasValueOrEmptyAttribute(value) {
      return Boolean(value || value === "");
    }

    function BuildVuePlugin(hljs) {
      const Component = {
        props: ["language", "code", "autodetect"],
        data: function() {
          return {
            detectedLanguage: "",
            unknownLanguage: false
          };
        },
        computed: {
          className() {
            if (this.unknownLanguage) return "";

            return "hljs " + this.detectedLanguage;
          },
          highlighted() {
            // no idea what language to use, return raw code
            if (!this.autoDetect && !hljs.getLanguage(this.language)) {
              console.warn(`The language "${this.language}" you specified could not be found.`);
              this.unknownLanguage = true;
              return escapeHTML(this.code);
            }

            let result = {};
            if (this.autoDetect) {
              result = hljs.highlightAuto(this.code);
              this.detectedLanguage = result.language;
            } else {
              result = hljs.highlight(this.language, this.code, this.ignoreIllegals);
              this.detectedLanguage = this.language;
            }
            return result.value;
          },
          autoDetect() {
            return !this.language || hasValueOrEmptyAttribute(this.autodetect);
          },
          ignoreIllegals() {
            return true;
          }
        },
        // this avoids needing to use a whole Vue compilation pipeline just
        // to build Highlight.js
        render(createElement) {
          return createElement("pre", {}, [
            createElement("code", {
              class: this.className,
              domProps: { innerHTML: this.highlighted }
            })
          ]);
        }
        // template: `<pre><code :class="className" v-html="highlighted"></code></pre>`
      };

      const VuePlugin = {
        install(Vue) {
          Vue.component('highlightjs', Component);
        }
      };

      return { Component, VuePlugin };
    }

    /* plugin itself */

    /** @type {HLJSPlugin} */
    const mergeHTMLPlugin = {
      "after:highlightElement": ({ el, result, text }) => {
        const originalStream = nodeStream(el);
        if (!originalStream.length) return;

        const resultNode = document.createElement('div');
        resultNode.innerHTML = result.value;
        result.value = mergeStreams(originalStream, nodeStream(resultNode), text);
      }
    };

    /* Stream merging support functions */

    /**
     * @typedef Event
     * @property {'start'|'stop'} event
     * @property {number} offset
     * @property {Node} node
     */

    /**
     * @param {Node} node
     */
    function tag(node) {
      return node.nodeName.toLowerCase();
    }

    /**
     * @param {Node} node
     */
    function nodeStream(node) {
      /** @type Event[] */
      const result = [];
      (function _nodeStream(node, offset) {
        for (let child = node.firstChild; child; child = child.nextSibling) {
          if (child.nodeType === 3) {
            offset += child.nodeValue.length;
          } else if (child.nodeType === 1) {
            result.push({
              event: 'start',
              offset: offset,
              node: child
            });
            offset = _nodeStream(child, offset);
            // Prevent void elements from having an end tag that would actually
            // double them in the output. There are more void elements in HTML
            // but we list only those realistically expected in code display.
            if (!tag(child).match(/br|hr|img|input/)) {
              result.push({
                event: 'stop',
                offset: offset,
                node: child
              });
            }
          }
        }
        return offset;
      })(node, 0);
      return result;
    }

    /**
     * @param {any} original - the original stream
     * @param {any} highlighted - stream of the highlighted source
     * @param {string} value - the original source itself
     */
    function mergeStreams(original, highlighted, value) {
      let processed = 0;
      let result = '';
      const nodeStack = [];

      function selectStream() {
        if (!original.length || !highlighted.length) {
          return original.length ? original : highlighted;
        }
        if (original[0].offset !== highlighted[0].offset) {
          return (original[0].offset < highlighted[0].offset) ? original : highlighted;
        }

        /*
        To avoid starting the stream just before it should stop the order is
        ensured that original always starts first and closes last:

        if (event1 == 'start' && event2 == 'start')
          return original;
        if (event1 == 'start' && event2 == 'stop')
          return highlighted;
        if (event1 == 'stop' && event2 == 'start')
          return original;
        if (event1 == 'stop' && event2 == 'stop')
          return highlighted;

        ... which is collapsed to:
        */
        return highlighted[0].event === 'start' ? original : highlighted;
      }

      /**
       * @param {Node} node
       */
      function open(node) {
        /** @param {Attr} attr */
        function attributeString(attr) {
          return ' ' + attr.nodeName + '="' + escapeHTML(attr.value) + '"';
        }
        // @ts-ignore
        result += '<' + tag(node) + [].map.call(node.attributes, attributeString).join('') + '>';
      }

      /**
       * @param {Node} node
       */
      function close(node) {
        result += '</' + tag(node) + '>';
      }

      /**
       * @param {Event} event
       */
      function render(event) {
        (event.event === 'start' ? open : close)(event.node);
      }

      while (original.length || highlighted.length) {
        let stream = selectStream();
        result += escapeHTML(value.substring(processed, stream[0].offset));
        processed = stream[0].offset;
        if (stream === original) {
          /*
          On any opening or closing tag of the original markup we first close
          the entire highlighted node stack, then render the original tag along
          with all the following original tags at the same offset and then
          reopen all the tags on the highlighted stack.
          */
          nodeStack.reverse().forEach(close);
          do {
            render(stream.splice(0, 1)[0]);
            stream = selectStream();
          } while (stream === original && stream.length && stream[0].offset === processed);
          nodeStack.reverse().forEach(open);
        } else {
          if (stream[0].event === 'start') {
            nodeStack.push(stream[0].node);
          } else {
            nodeStack.pop();
          }
          render(stream.splice(0, 1)[0]);
        }
      }
      return result + escapeHTML(value.substr(processed));
    }

    /*

    For the reasoning behind this please see:
    https://github.com/highlightjs/highlight.js/issues/2880#issuecomment-747275419

    */

    /**
     * @type {Record<string, boolean>}
     */
    const seenDeprecations = {};

    /**
     * @param {string} message
     */
    const error = (message) => {
      console.error(message);
    };

    /**
     * @param {string} message
     * @param {any} args
     */
    const warn$1 = (message, ...args) => {
      console.log(`WARN: ${message}`, ...args);
    };

    /**
     * @param {string} version
     * @param {string} message
     */
    const deprecated = (version, message) => {
      if (seenDeprecations[`${version}/${message}`]) return;

      console.log(`Deprecated as of ${version}. ${message}`);
      seenDeprecations[`${version}/${message}`] = true;
    };

    /*
    Syntax highlighting with language autodetection.
    https://highlightjs.org/
    */

    const escape$1 = escapeHTML;
    const inherit$1 = inherit;
    const NO_MATCH = Symbol("nomatch");

    /**
     * @param {any} hljs - object that is extended (legacy)
     * @returns {HLJSApi}
     */
    const HLJS = function(hljs) {
      // Global internal variables used within the highlight.js library.
      /** @type {Record<string, Language>} */
      const languages = Object.create(null);
      /** @type {Record<string, string>} */
      const aliases = Object.create(null);
      /** @type {HLJSPlugin[]} */
      const plugins = [];

      // safe/production mode - swallows more errors, tries to keep running
      // even if a single syntax or parse hits a fatal error
      let SAFE_MODE = true;
      const fixMarkupRe = /(^(<[^>]+>|\t|)+|\n)/gm;
      const LANGUAGE_NOT_FOUND = "Could not find the language '{}', did you forget to load/include a language module?";
      /** @type {Language} */
      const PLAINTEXT_LANGUAGE = { disableAutodetect: true, name: 'Plain text', contains: [] };

      // Global options used when within external APIs. This is modified when
      // calling the `hljs.configure` function.
      /** @type HLJSOptions */
      let options = {
        noHighlightRe: /^(no-?highlight)$/i,
        languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
        classPrefix: 'hljs-',
        tabReplace: null,
        useBR: false,
        languages: null,
        // beta configuration options, subject to change, welcome to discuss
        // https://github.com/highlightjs/highlight.js/issues/1086
        __emitter: TokenTreeEmitter
      };

      /* Utility functions */

      /**
       * Tests a language name to see if highlighting should be skipped
       * @param {string} languageName
       */
      function shouldNotHighlight(languageName) {
        return options.noHighlightRe.test(languageName);
      }

      /**
       * @param {HighlightedHTMLElement} block - the HTML element to determine language for
       */
      function blockLanguage(block) {
        let classes = block.className + ' ';

        classes += block.parentNode ? block.parentNode.className : '';

        // language-* takes precedence over non-prefixed class names.
        const match = options.languageDetectRe.exec(classes);
        if (match) {
          const language = getLanguage(match[1]);
          if (!language) {
            warn$1(LANGUAGE_NOT_FOUND.replace("{}", match[1]));
            warn$1("Falling back to no-highlight mode for this block.", block);
          }
          return language ? match[1] : 'no-highlight';
        }

        return classes
          .split(/\s+/)
          .find((_class) => shouldNotHighlight(_class) || getLanguage(_class));
      }

      /**
       * Core highlighting function.
       *
       * OLD API
       * highlight(lang, code, ignoreIllegals, continuation)
       *
       * NEW API
       * highlight(code, {lang, ignoreIllegals})
       *
       * @param {string} codeOrlanguageName - the language to use for highlighting
       * @param {string | HighlightOptions} optionsOrCode - the code to highlight
       * @param {boolean} [ignoreIllegals] - whether to ignore illegal matches, default is to bail
       * @param {CompiledMode} [continuation] - current continuation mode, if any
       *
       * @returns {HighlightResult} Result - an object that represents the result
       * @property {string} language - the language name
       * @property {number} relevance - the relevance score
       * @property {string} value - the highlighted HTML code
       * @property {string} code - the original raw code
       * @property {CompiledMode} top - top of the current mode stack
       * @property {boolean} illegal - indicates whether any illegal matches were found
      */
      function highlight(codeOrlanguageName, optionsOrCode, ignoreIllegals, continuation) {
        let code = "";
        let languageName = "";
        if (typeof optionsOrCode === "object") {
          code = codeOrlanguageName;
          ignoreIllegals = optionsOrCode.ignoreIllegals;
          languageName = optionsOrCode.language;
          // continuation not supported at all via the new API
          // eslint-disable-next-line no-undefined
          continuation = undefined;
        } else {
          // old API
          deprecated("10.7.0", "highlight(lang, code, ...args) has been deprecated.");
          deprecated("10.7.0", "Please use highlight(code, options) instead.\nhttps://github.com/highlightjs/highlight.js/issues/2277");
          languageName = codeOrlanguageName;
          code = optionsOrCode;
        }

        /** @type {BeforeHighlightContext} */
        const context = {
          code,
          language: languageName
        };
        // the plugin can change the desired language or the code to be highlighted
        // just be changing the object it was passed
        fire("before:highlight", context);

        // a before plugin can usurp the result completely by providing it's own
        // in which case we don't even need to call highlight
        const result = context.result
          ? context.result
          : _highlight(context.language, context.code, ignoreIllegals, continuation);

        result.code = context.code;
        // the plugin can change anything in result to suite it
        fire("after:highlight", result);

        return result;
      }

      /**
       * private highlight that's used internally and does not fire callbacks
       *
       * @param {string} languageName - the language to use for highlighting
       * @param {string} codeToHighlight - the code to highlight
       * @param {boolean?} [ignoreIllegals] - whether to ignore illegal matches, default is to bail
       * @param {CompiledMode?} [continuation] - current continuation mode, if any
       * @returns {HighlightResult} - result of the highlight operation
      */
      function _highlight(languageName, codeToHighlight, ignoreIllegals, continuation) {
        /**
         * Return keyword data if a match is a keyword
         * @param {CompiledMode} mode - current mode
         * @param {RegExpMatchArray} match - regexp match data
         * @returns {KeywordData | false}
         */
        function keywordData(mode, match) {
          const matchText = language.case_insensitive ? match[0].toLowerCase() : match[0];
          return Object.prototype.hasOwnProperty.call(mode.keywords, matchText) && mode.keywords[matchText];
        }

        function processKeywords() {
          if (!top.keywords) {
            emitter.addText(modeBuffer);
            return;
          }

          let lastIndex = 0;
          top.keywordPatternRe.lastIndex = 0;
          let match = top.keywordPatternRe.exec(modeBuffer);
          let buf = "";

          while (match) {
            buf += modeBuffer.substring(lastIndex, match.index);
            const data = keywordData(top, match);
            if (data) {
              const [kind, keywordRelevance] = data;
              emitter.addText(buf);
              buf = "";

              relevance += keywordRelevance;
              if (kind.startsWith("_")) {
                // _ implied for relevance only, do not highlight
                // by applying a class name
                buf += match[0];
              } else {
                const cssClass = language.classNameAliases[kind] || kind;
                emitter.addKeyword(match[0], cssClass);
              }
            } else {
              buf += match[0];
            }
            lastIndex = top.keywordPatternRe.lastIndex;
            match = top.keywordPatternRe.exec(modeBuffer);
          }
          buf += modeBuffer.substr(lastIndex);
          emitter.addText(buf);
        }

        function processSubLanguage() {
          if (modeBuffer === "") return;
          /** @type HighlightResult */
          let result = null;

          if (typeof top.subLanguage === 'string') {
            if (!languages[top.subLanguage]) {
              emitter.addText(modeBuffer);
              return;
            }
            result = _highlight(top.subLanguage, modeBuffer, true, continuations[top.subLanguage]);
            continuations[top.subLanguage] = /** @type {CompiledMode} */ (result.top);
          } else {
            result = highlightAuto(modeBuffer, top.subLanguage.length ? top.subLanguage : null);
          }

          // Counting embedded language score towards the host language may be disabled
          // with zeroing the containing mode relevance. Use case in point is Markdown that
          // allows XML everywhere and makes every XML snippet to have a much larger Markdown
          // score.
          if (top.relevance > 0) {
            relevance += result.relevance;
          }
          emitter.addSublanguage(result.emitter, result.language);
        }

        function processBuffer() {
          if (top.subLanguage != null) {
            processSubLanguage();
          } else {
            processKeywords();
          }
          modeBuffer = '';
        }

        /**
         * @param {Mode} mode - new mode to start
         */
        function startNewMode(mode) {
          if (mode.className) {
            emitter.openNode(language.classNameAliases[mode.className] || mode.className);
          }
          top = Object.create(mode, { parent: { value: top } });
          return top;
        }

        /**
         * @param {CompiledMode } mode - the mode to potentially end
         * @param {RegExpMatchArray} match - the latest match
         * @param {string} matchPlusRemainder - match plus remainder of content
         * @returns {CompiledMode | void} - the next mode, or if void continue on in current mode
         */
        function endOfMode(mode, match, matchPlusRemainder) {
          let matched = startsWith(mode.endRe, matchPlusRemainder);

          if (matched) {
            if (mode["on:end"]) {
              const resp = new Response(mode);
              mode["on:end"](match, resp);
              if (resp.isMatchIgnored) matched = false;
            }

            if (matched) {
              while (mode.endsParent && mode.parent) {
                mode = mode.parent;
              }
              return mode;
            }
          }
          // even if on:end fires an `ignore` it's still possible
          // that we might trigger the end node because of a parent mode
          if (mode.endsWithParent) {
            return endOfMode(mode.parent, match, matchPlusRemainder);
          }
        }

        /**
         * Handle matching but then ignoring a sequence of text
         *
         * @param {string} lexeme - string containing full match text
         */
        function doIgnore(lexeme) {
          if (top.matcher.regexIndex === 0) {
            // no more regexs to potentially match here, so we move the cursor forward one
            // space
            modeBuffer += lexeme[0];
            return 1;
          } else {
            // no need to move the cursor, we still have additional regexes to try and
            // match at this very spot
            resumeScanAtSamePosition = true;
            return 0;
          }
        }

        /**
         * Handle the start of a new potential mode match
         *
         * @param {EnhancedMatch} match - the current match
         * @returns {number} how far to advance the parse cursor
         */
        function doBeginMatch(match) {
          const lexeme = match[0];
          const newMode = match.rule;

          const resp = new Response(newMode);
          // first internal before callbacks, then the public ones
          const beforeCallbacks = [newMode.__beforeBegin, newMode["on:begin"]];
          for (const cb of beforeCallbacks) {
            if (!cb) continue;
            cb(match, resp);
            if (resp.isMatchIgnored) return doIgnore(lexeme);
          }

          if (newMode && newMode.endSameAsBegin) {
            newMode.endRe = escape(lexeme);
          }

          if (newMode.skip) {
            modeBuffer += lexeme;
          } else {
            if (newMode.excludeBegin) {
              modeBuffer += lexeme;
            }
            processBuffer();
            if (!newMode.returnBegin && !newMode.excludeBegin) {
              modeBuffer = lexeme;
            }
          }
          startNewMode(newMode);
          // if (mode["after:begin"]) {
          //   let resp = new Response(mode);
          //   mode["after:begin"](match, resp);
          // }
          return newMode.returnBegin ? 0 : lexeme.length;
        }

        /**
         * Handle the potential end of mode
         *
         * @param {RegExpMatchArray} match - the current match
         */
        function doEndMatch(match) {
          const lexeme = match[0];
          const matchPlusRemainder = codeToHighlight.substr(match.index);

          const endMode = endOfMode(top, match, matchPlusRemainder);
          if (!endMode) { return NO_MATCH; }

          const origin = top;
          if (origin.skip) {
            modeBuffer += lexeme;
          } else {
            if (!(origin.returnEnd || origin.excludeEnd)) {
              modeBuffer += lexeme;
            }
            processBuffer();
            if (origin.excludeEnd) {
              modeBuffer = lexeme;
            }
          }
          do {
            if (top.className) {
              emitter.closeNode();
            }
            if (!top.skip && !top.subLanguage) {
              relevance += top.relevance;
            }
            top = top.parent;
          } while (top !== endMode.parent);
          if (endMode.starts) {
            if (endMode.endSameAsBegin) {
              endMode.starts.endRe = endMode.endRe;
            }
            startNewMode(endMode.starts);
          }
          return origin.returnEnd ? 0 : lexeme.length;
        }

        function processContinuations() {
          const list = [];
          for (let current = top; current !== language; current = current.parent) {
            if (current.className) {
              list.unshift(current.className);
            }
          }
          list.forEach(item => emitter.openNode(item));
        }

        /** @type {{type?: MatchType, index?: number, rule?: Mode}}} */
        let lastMatch = {};

        /**
         *  Process an individual match
         *
         * @param {string} textBeforeMatch - text preceeding the match (since the last match)
         * @param {EnhancedMatch} [match] - the match itself
         */
        function processLexeme(textBeforeMatch, match) {
          const lexeme = match && match[0];

          // add non-matched text to the current mode buffer
          modeBuffer += textBeforeMatch;

          if (lexeme == null) {
            processBuffer();
            return 0;
          }

          // we've found a 0 width match and we're stuck, so we need to advance
          // this happens when we have badly behaved rules that have optional matchers to the degree that
          // sometimes they can end up matching nothing at all
          // Ref: https://github.com/highlightjs/highlight.js/issues/2140
          if (lastMatch.type === "begin" && match.type === "end" && lastMatch.index === match.index && lexeme === "") {
            // spit the "skipped" character that our regex choked on back into the output sequence
            modeBuffer += codeToHighlight.slice(match.index, match.index + 1);
            if (!SAFE_MODE) {
              /** @type {AnnotatedError} */
              const err = new Error('0 width match regex');
              err.languageName = languageName;
              err.badRule = lastMatch.rule;
              throw err;
            }
            return 1;
          }
          lastMatch = match;

          if (match.type === "begin") {
            return doBeginMatch(match);
          } else if (match.type === "illegal" && !ignoreIllegals) {
            // illegal match, we do not continue processing
            /** @type {AnnotatedError} */
            const err = new Error('Illegal lexeme "' + lexeme + '" for mode "' + (top.className || '<unnamed>') + '"');
            err.mode = top;
            throw err;
          } else if (match.type === "end") {
            const processed = doEndMatch(match);
            if (processed !== NO_MATCH) {
              return processed;
            }
          }

          // edge case for when illegal matches $ (end of line) which is technically
          // a 0 width match but not a begin/end match so it's not caught by the
          // first handler (when ignoreIllegals is true)
          if (match.type === "illegal" && lexeme === "") {
            // advance so we aren't stuck in an infinite loop
            return 1;
          }

          // infinite loops are BAD, this is a last ditch catch all. if we have a
          // decent number of iterations yet our index (cursor position in our
          // parsing) still 3x behind our index then something is very wrong
          // so we bail
          if (iterations > 100000 && iterations > match.index * 3) {
            const err = new Error('potential infinite loop, way more iterations than matches');
            throw err;
          }

          /*
          Why might be find ourselves here?  Only one occasion now.  An end match that was
          triggered but could not be completed.  When might this happen?  When an `endSameasBegin`
          rule sets the end rule to a specific match.  Since the overall mode termination rule that's
          being used to scan the text isn't recompiled that means that any match that LOOKS like
          the end (but is not, because it is not an exact match to the beginning) will
          end up here.  A definite end match, but when `doEndMatch` tries to "reapply"
          the end rule and fails to match, we wind up here, and just silently ignore the end.

          This causes no real harm other than stopping a few times too many.
          */

          modeBuffer += lexeme;
          return lexeme.length;
        }

        const language = getLanguage(languageName);
        if (!language) {
          error(LANGUAGE_NOT_FOUND.replace("{}", languageName));
          throw new Error('Unknown language: "' + languageName + '"');
        }

        const md = compileLanguage(language, { plugins });
        let result = '';
        /** @type {CompiledMode} */
        let top = continuation || md;
        /** @type Record<string,CompiledMode> */
        const continuations = {}; // keep continuations for sub-languages
        const emitter = new options.__emitter(options);
        processContinuations();
        let modeBuffer = '';
        let relevance = 0;
        let index = 0;
        let iterations = 0;
        let resumeScanAtSamePosition = false;

        try {
          top.matcher.considerAll();

          for (;;) {
            iterations++;
            if (resumeScanAtSamePosition) {
              // only regexes not matched previously will now be
              // considered for a potential match
              resumeScanAtSamePosition = false;
            } else {
              top.matcher.considerAll();
            }
            top.matcher.lastIndex = index;

            const match = top.matcher.exec(codeToHighlight);
            // console.log("match", match[0], match.rule && match.rule.begin)

            if (!match) break;

            const beforeMatch = codeToHighlight.substring(index, match.index);
            const processedCount = processLexeme(beforeMatch, match);
            index = match.index + processedCount;
          }
          processLexeme(codeToHighlight.substr(index));
          emitter.closeAllNodes();
          emitter.finalize();
          result = emitter.toHTML();

          return {
            // avoid possible breakage with v10 clients expecting
            // this to always be an integer
            relevance: Math.floor(relevance),
            value: result,
            language: languageName,
            illegal: false,
            emitter: emitter,
            top: top
          };
        } catch (err) {
          if (err.message && err.message.includes('Illegal')) {
            return {
              illegal: true,
              illegalBy: {
                msg: err.message,
                context: codeToHighlight.slice(index - 100, index + 100),
                mode: err.mode
              },
              sofar: result,
              relevance: 0,
              value: escape$1(codeToHighlight),
              emitter: emitter
            };
          } else if (SAFE_MODE) {
            return {
              illegal: false,
              relevance: 0,
              value: escape$1(codeToHighlight),
              emitter: emitter,
              language: languageName,
              top: top,
              errorRaised: err
            };
          } else {
            throw err;
          }
        }
      }

      /**
       * returns a valid highlight result, without actually doing any actual work,
       * auto highlight starts with this and it's possible for small snippets that
       * auto-detection may not find a better match
       * @param {string} code
       * @returns {HighlightResult}
       */
      function justTextHighlightResult(code) {
        const result = {
          relevance: 0,
          emitter: new options.__emitter(options),
          value: escape$1(code),
          illegal: false,
          top: PLAINTEXT_LANGUAGE
        };
        result.emitter.addText(code);
        return result;
      }

      /**
      Highlighting with language detection. Accepts a string with the code to
      highlight. Returns an object with the following properties:

      - language (detected language)
      - relevance (int)
      - value (an HTML string with highlighting markup)
      - second_best (object with the same structure for second-best heuristically
        detected language, may be absent)

        @param {string} code
        @param {Array<string>} [languageSubset]
        @returns {AutoHighlightResult}
      */
      function highlightAuto(code, languageSubset) {
        languageSubset = languageSubset || options.languages || Object.keys(languages);
        const plaintext = justTextHighlightResult(code);

        const results = languageSubset.filter(getLanguage).filter(autoDetection).map(name =>
          _highlight(name, code, false)
        );
        results.unshift(plaintext); // plaintext is always an option

        const sorted = results.sort((a, b) => {
          // sort base on relevance
          if (a.relevance !== b.relevance) return b.relevance - a.relevance;

          // always award the tie to the base language
          // ie if C++ and Arduino are tied, it's more likely to be C++
          if (a.language && b.language) {
            if (getLanguage(a.language).supersetOf === b.language) {
              return 1;
            } else if (getLanguage(b.language).supersetOf === a.language) {
              return -1;
            }
          }

          // otherwise say they are equal, which has the effect of sorting on
          // relevance while preserving the original ordering - which is how ties
          // have historically been settled, ie the language that comes first always
          // wins in the case of a tie
          return 0;
        });

        const [best, secondBest] = sorted;

        /** @type {AutoHighlightResult} */
        const result = best;
        result.second_best = secondBest;

        return result;
      }

      /**
      Post-processing of the highlighted markup:

      - replace TABs with something more useful
      - replace real line-breaks with '<br>' for non-pre containers

        @param {string} html
        @returns {string}
      */
      function fixMarkup(html) {
        if (!(options.tabReplace || options.useBR)) {
          return html;
        }

        return html.replace(fixMarkupRe, match => {
          if (match === '\n') {
            return options.useBR ? '<br>' : match;
          } else if (options.tabReplace) {
            return match.replace(/\t/g, options.tabReplace);
          }
          return match;
        });
      }

      /**
       * Builds new class name for block given the language name
       *
       * @param {HTMLElement} element
       * @param {string} [currentLang]
       * @param {string} [resultLang]
       */
      function updateClassName(element, currentLang, resultLang) {
        const language = currentLang ? aliases[currentLang] : resultLang;

        element.classList.add("hljs");
        if (language) element.classList.add(language);
      }

      /** @type {HLJSPlugin} */
      const brPlugin = {
        "before:highlightElement": ({ el }) => {
          if (options.useBR) {
            el.innerHTML = el.innerHTML.replace(/\n/g, '').replace(/<br[ /]*>/g, '\n');
          }
        },
        "after:highlightElement": ({ result }) => {
          if (options.useBR) {
            result.value = result.value.replace(/\n/g, "<br>");
          }
        }
      };

      const TAB_REPLACE_RE = /^(<[^>]+>|\t)+/gm;
      /** @type {HLJSPlugin} */
      const tabReplacePlugin = {
        "after:highlightElement": ({ result }) => {
          if (options.tabReplace) {
            result.value = result.value.replace(TAB_REPLACE_RE, (m) =>
              m.replace(/\t/g, options.tabReplace)
            );
          }
        }
      };

      /**
       * Applies highlighting to a DOM node containing code. Accepts a DOM node and
       * two optional parameters for fixMarkup.
       *
       * @param {HighlightedHTMLElement} element - the HTML element to highlight
      */
      function highlightElement(element) {
        /** @type HTMLElement */
        let node = null;
        const language = blockLanguage(element);

        if (shouldNotHighlight(language)) return;

        // support for v10 API
        fire("before:highlightElement",
          { el: element, language: language });

        node = element;
        const text = node.textContent;
        const result = language ? highlight(text, { language, ignoreIllegals: true }) : highlightAuto(text);

        // support for v10 API
        fire("after:highlightElement", { el: element, result, text });

        element.innerHTML = result.value;
        updateClassName(element, language, result.language);
        element.result = {
          language: result.language,
          // TODO: remove with version 11.0
          re: result.relevance,
          relavance: result.relevance
        };
        if (result.second_best) {
          element.second_best = {
            language: result.second_best.language,
            // TODO: remove with version 11.0
            re: result.second_best.relevance,
            relavance: result.second_best.relevance
          };
        }
      }

      /**
       * Updates highlight.js global options with the passed options
       *
       * @param {Partial<HLJSOptions>} userOptions
       */
      function configure(userOptions) {
        if (userOptions.useBR) {
          deprecated("10.3.0", "'useBR' will be removed entirely in v11.0");
          deprecated("10.3.0", "Please see https://github.com/highlightjs/highlight.js/issues/2559");
        }
        options = inherit$1(options, userOptions);
      }

      /**
       * Highlights to all <pre><code> blocks on a page
       *
       * @type {Function & {called?: boolean}}
       */
      // TODO: remove v12, deprecated
      const initHighlighting = () => {
        if (initHighlighting.called) return;
        initHighlighting.called = true;

        deprecated("10.6.0", "initHighlighting() is deprecated.  Use highlightAll() instead.");

        const blocks = document.querySelectorAll('pre code');
        blocks.forEach(highlightElement);
      };

      // Higlights all when DOMContentLoaded fires
      // TODO: remove v12, deprecated
      function initHighlightingOnLoad() {
        deprecated("10.6.0", "initHighlightingOnLoad() is deprecated.  Use highlightAll() instead.");
        wantsHighlight = true;
      }

      let wantsHighlight = false;

      /**
       * auto-highlights all pre>code elements on the page
       */
      function highlightAll() {
        // if we are called too early in the loading process
        if (document.readyState === "loading") {
          wantsHighlight = true;
          return;
        }

        const blocks = document.querySelectorAll('pre code');
        blocks.forEach(highlightElement);
      }

      function boot() {
        // if a highlight was requested before DOM was loaded, do now
        if (wantsHighlight) highlightAll();
      }

      // make sure we are in the browser environment
      if (typeof window !== 'undefined' && window.addEventListener) {
        window.addEventListener('DOMContentLoaded', boot, false);
      }

      /**
       * Register a language grammar module
       *
       * @param {string} languageName
       * @param {LanguageFn} languageDefinition
       */
      function registerLanguage(languageName, languageDefinition) {
        let lang = null;
        try {
          lang = languageDefinition(hljs);
        } catch (error$1) {
          error("Language definition for '{}' could not be registered.".replace("{}", languageName));
          // hard or soft error
          if (!SAFE_MODE) { throw error$1; } else { error(error$1); }
          // languages that have serious errors are replaced with essentially a
          // "plaintext" stand-in so that the code blocks will still get normal
          // css classes applied to them - and one bad language won't break the
          // entire highlighter
          lang = PLAINTEXT_LANGUAGE;
        }
        // give it a temporary name if it doesn't have one in the meta-data
        if (!lang.name) lang.name = languageName;
        languages[languageName] = lang;
        lang.rawDefinition = languageDefinition.bind(null, hljs);

        if (lang.aliases) {
          registerAliases(lang.aliases, { languageName });
        }
      }

      /**
       * Remove a language grammar module
       *
       * @param {string} languageName
       */
      function unregisterLanguage(languageName) {
        delete languages[languageName];
        for (const alias of Object.keys(aliases)) {
          if (aliases[alias] === languageName) {
            delete aliases[alias];
          }
        }
      }

      /**
       * @returns {string[]} List of language internal names
       */
      function listLanguages() {
        return Object.keys(languages);
      }

      /**
        intended usage: When one language truly requires another

        Unlike `getLanguage`, this will throw when the requested language
        is not available.

        @param {string} name - name of the language to fetch/require
        @returns {Language | never}
      */
      function requireLanguage(name) {
        deprecated("10.4.0", "requireLanguage will be removed entirely in v11.");
        deprecated("10.4.0", "Please see https://github.com/highlightjs/highlight.js/pull/2844");

        const lang = getLanguage(name);
        if (lang) { return lang; }

        const err = new Error('The \'{}\' language is required, but not loaded.'.replace('{}', name));
        throw err;
      }

      /**
       * @param {string} name - name of the language to retrieve
       * @returns {Language | undefined}
       */
      function getLanguage(name) {
        name = (name || '').toLowerCase();
        return languages[name] || languages[aliases[name]];
      }

      /**
       *
       * @param {string|string[]} aliasList - single alias or list of aliases
       * @param {{languageName: string}} opts
       */
      function registerAliases(aliasList, { languageName }) {
        if (typeof aliasList === 'string') {
          aliasList = [aliasList];
        }
        aliasList.forEach(alias => { aliases[alias.toLowerCase()] = languageName; });
      }

      /**
       * Determines if a given language has auto-detection enabled
       * @param {string} name - name of the language
       */
      function autoDetection(name) {
        const lang = getLanguage(name);
        return lang && !lang.disableAutodetect;
      }

      /**
       * Upgrades the old highlightBlock plugins to the new
       * highlightElement API
       * @param {HLJSPlugin} plugin
       */
      function upgradePluginAPI(plugin) {
        // TODO: remove with v12
        if (plugin["before:highlightBlock"] && !plugin["before:highlightElement"]) {
          plugin["before:highlightElement"] = (data) => {
            plugin["before:highlightBlock"](
              Object.assign({ block: data.el }, data)
            );
          };
        }
        if (plugin["after:highlightBlock"] && !plugin["after:highlightElement"]) {
          plugin["after:highlightElement"] = (data) => {
            plugin["after:highlightBlock"](
              Object.assign({ block: data.el }, data)
            );
          };
        }
      }

      /**
       * @param {HLJSPlugin} plugin
       */
      function addPlugin(plugin) {
        upgradePluginAPI(plugin);
        plugins.push(plugin);
      }

      /**
       *
       * @param {PluginEvent} event
       * @param {any} args
       */
      function fire(event, args) {
        const cb = event;
        plugins.forEach(function(plugin) {
          if (plugin[cb]) {
            plugin[cb](args);
          }
        });
      }

      /**
      Note: fixMarkup is deprecated and will be removed entirely in v11

      @param {string} arg
      @returns {string}
      */
      function deprecateFixMarkup(arg) {
        deprecated("10.2.0", "fixMarkup will be removed entirely in v11.0");
        deprecated("10.2.0", "Please see https://github.com/highlightjs/highlight.js/issues/2534");

        return fixMarkup(arg);
      }

      /**
       *
       * @param {HighlightedHTMLElement} el
       */
      function deprecateHighlightBlock(el) {
        deprecated("10.7.0", "highlightBlock will be removed entirely in v12.0");
        deprecated("10.7.0", "Please use highlightElement now.");

        return highlightElement(el);
      }

      /* Interface definition */
      Object.assign(hljs, {
        highlight,
        highlightAuto,
        highlightAll,
        fixMarkup: deprecateFixMarkup,
        highlightElement,
        // TODO: Remove with v12 API
        highlightBlock: deprecateHighlightBlock,
        configure,
        initHighlighting,
        initHighlightingOnLoad,
        registerLanguage,
        unregisterLanguage,
        listLanguages,
        getLanguage,
        registerAliases,
        requireLanguage,
        autoDetection,
        inherit: inherit$1,
        addPlugin,
        // plugins for frameworks
        vuePlugin: BuildVuePlugin(hljs).VuePlugin
      });

      hljs.debugMode = function() { SAFE_MODE = false; };
      hljs.safeMode = function() { SAFE_MODE = true; };
      hljs.versionString = version;

      for (const key in MODES) {
        // @ts-ignore
        if (typeof MODES[key] === "object") {
          // @ts-ignore
          deepFreezeEs6(MODES[key]);
        }
      }

      // merge all the modes/regexs into our main object
      Object.assign(hljs, MODES);

      // built-in plugins, likely to be moved out of core in the future
      hljs.addPlugin(brPlugin); // slated to be removed in v11
      hljs.addPlugin(mergeHTMLPlugin);
      hljs.addPlugin(tabReplacePlugin);
      return hljs;
    };

    // export an "instance" of the highlighter
    var highlight = HLJS({});

    var core$1 = highlight;

    /**
     * @param {string} value
     * @returns {RegExp}
     * */
    /**
     * @param {RegExp | string } re
     * @returns {string}
     */
    function source(re) {
      if (!re) return null;
      if (typeof re === "string") return re;

      return re.source;
    }

    /**
     * @param {RegExp | string } re
     * @returns {string}
     */
    function lookahead(re) {
      return concat('(?=', re, ')');
    }

    /**
     * @param {...(RegExp | string) } args
     * @returns {string}
     */
    function concat(...args) {
      const joined = args.map((x) => source(x)).join("");
      return joined;
    }

    /*
    Language: Python
    Description: Python is an interpreted, object-oriented, high-level programming language with dynamic semantics.
    Website: https://www.python.org
    Category: common
    */

    function python(hljs) {
      const RESERVED_WORDS = [
        'and',
        'as',
        'assert',
        'async',
        'await',
        'break',
        'class',
        'continue',
        'def',
        'del',
        'elif',
        'else',
        'except',
        'finally',
        'for',
        'from',
        'global',
        'if',
        'import',
        'in',
        'is',
        'lambda',
        'nonlocal|10',
        'not',
        'or',
        'pass',
        'raise',
        'return',
        'try',
        'while',
        'with',
        'yield'
      ];

      const BUILT_INS = [
        '__import__',
        'abs',
        'all',
        'any',
        'ascii',
        'bin',
        'bool',
        'breakpoint',
        'bytearray',
        'bytes',
        'callable',
        'chr',
        'classmethod',
        'compile',
        'complex',
        'delattr',
        'dict',
        'dir',
        'divmod',
        'enumerate',
        'eval',
        'exec',
        'filter',
        'float',
        'format',
        'frozenset',
        'getattr',
        'globals',
        'hasattr',
        'hash',
        'help',
        'hex',
        'id',
        'input',
        'int',
        'isinstance',
        'issubclass',
        'iter',
        'len',
        'list',
        'locals',
        'map',
        'max',
        'memoryview',
        'min',
        'next',
        'object',
        'oct',
        'open',
        'ord',
        'pow',
        'print',
        'property',
        'range',
        'repr',
        'reversed',
        'round',
        'set',
        'setattr',
        'slice',
        'sorted',
        'staticmethod',
        'str',
        'sum',
        'super',
        'tuple',
        'type',
        'vars',
        'zip'
      ];

      const LITERALS = [
        '__debug__',
        'Ellipsis',
        'False',
        'None',
        'NotImplemented',
        'True'
      ];

      // https://docs.python.org/3/library/typing.html
      // TODO: Could these be supplemented by a CamelCase matcher in certain
      // contexts, leaving these remaining only for relevance hinting?
      const TYPES = [
        "Any",
        "Callable",
        "Coroutine",
        "Dict",
        "List",
        "Literal",
        "Generic",
        "Optional",
        "Sequence",
        "Set",
        "Tuple",
        "Type",
        "Union"
      ];

      const KEYWORDS = {
        $pattern: /[A-Za-z]\w+|__\w+__/,
        keyword: RESERVED_WORDS,
        built_in: BUILT_INS,
        literal: LITERALS,
        type: TYPES
      };

      const PROMPT = {
        className: 'meta',
        begin: /^(>>>|\.\.\.) /
      };

      const SUBST = {
        className: 'subst',
        begin: /\{/,
        end: /\}/,
        keywords: KEYWORDS,
        illegal: /#/
      };

      const LITERAL_BRACKET = {
        begin: /\{\{/,
        relevance: 0
      };

      const STRING = {
        className: 'string',
        contains: [ hljs.BACKSLASH_ESCAPE ],
        variants: [
          {
            begin: /([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?'''/,
            end: /'''/,
            contains: [
              hljs.BACKSLASH_ESCAPE,
              PROMPT
            ],
            relevance: 10
          },
          {
            begin: /([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?"""/,
            end: /"""/,
            contains: [
              hljs.BACKSLASH_ESCAPE,
              PROMPT
            ],
            relevance: 10
          },
          {
            begin: /([fF][rR]|[rR][fF]|[fF])'''/,
            end: /'''/,
            contains: [
              hljs.BACKSLASH_ESCAPE,
              PROMPT,
              LITERAL_BRACKET,
              SUBST
            ]
          },
          {
            begin: /([fF][rR]|[rR][fF]|[fF])"""/,
            end: /"""/,
            contains: [
              hljs.BACKSLASH_ESCAPE,
              PROMPT,
              LITERAL_BRACKET,
              SUBST
            ]
          },
          {
            begin: /([uU]|[rR])'/,
            end: /'/,
            relevance: 10
          },
          {
            begin: /([uU]|[rR])"/,
            end: /"/,
            relevance: 10
          },
          {
            begin: /([bB]|[bB][rR]|[rR][bB])'/,
            end: /'/
          },
          {
            begin: /([bB]|[bB][rR]|[rR][bB])"/,
            end: /"/
          },
          {
            begin: /([fF][rR]|[rR][fF]|[fF])'/,
            end: /'/,
            contains: [
              hljs.BACKSLASH_ESCAPE,
              LITERAL_BRACKET,
              SUBST
            ]
          },
          {
            begin: /([fF][rR]|[rR][fF]|[fF])"/,
            end: /"/,
            contains: [
              hljs.BACKSLASH_ESCAPE,
              LITERAL_BRACKET,
              SUBST
            ]
          },
          hljs.APOS_STRING_MODE,
          hljs.QUOTE_STRING_MODE
        ]
      };

      // https://docs.python.org/3.9/reference/lexical_analysis.html#numeric-literals
      const digitpart = '[0-9](_?[0-9])*';
      const pointfloat = `(\\b(${digitpart}))?\\.(${digitpart})|\\b(${digitpart})\\.`;
      const NUMBER = {
        className: 'number',
        relevance: 0,
        variants: [
          // exponentfloat, pointfloat
          // https://docs.python.org/3.9/reference/lexical_analysis.html#floating-point-literals
          // optionally imaginary
          // https://docs.python.org/3.9/reference/lexical_analysis.html#imaginary-literals
          // Note: no leading \b because floats can start with a decimal point
          // and we don't want to mishandle e.g. `fn(.5)`,
          // no trailing \b for pointfloat because it can end with a decimal point
          // and we don't want to mishandle e.g. `0..hex()`; this should be safe
          // because both MUST contain a decimal point and so cannot be confused with
          // the interior part of an identifier
          {
            begin: `(\\b(${digitpart})|(${pointfloat}))[eE][+-]?(${digitpart})[jJ]?\\b`
          },
          {
            begin: `(${pointfloat})[jJ]?`
          },

          // decinteger, bininteger, octinteger, hexinteger
          // https://docs.python.org/3.9/reference/lexical_analysis.html#integer-literals
          // optionally "long" in Python 2
          // https://docs.python.org/2.7/reference/lexical_analysis.html#integer-and-long-integer-literals
          // decinteger is optionally imaginary
          // https://docs.python.org/3.9/reference/lexical_analysis.html#imaginary-literals
          {
            begin: '\\b([1-9](_?[0-9])*|0+(_?0)*)[lLjJ]?\\b'
          },
          {
            begin: '\\b0[bB](_?[01])+[lL]?\\b'
          },
          {
            begin: '\\b0[oO](_?[0-7])+[lL]?\\b'
          },
          {
            begin: '\\b0[xX](_?[0-9a-fA-F])+[lL]?\\b'
          },

          // imagnumber (digitpart-based)
          // https://docs.python.org/3.9/reference/lexical_analysis.html#imaginary-literals
          {
            begin: `\\b(${digitpart})[jJ]\\b`
          }
        ]
      };
      const COMMENT_TYPE = {
        className: "comment",
        begin: lookahead(/# type:/),
        end: /$/,
        keywords: KEYWORDS,
        contains: [
          { // prevent keywords from coloring `type`
            begin: /# type:/
          },
          // comment within a datatype comment includes no keywords
          {
            begin: /#/,
            end: /\b\B/,
            endsWithParent: true
          }
        ]
      };
      const PARAMS = {
        className: 'params',
        variants: [
          // Exclude params in functions without params
          {
            className: "",
            begin: /\(\s*\)/,
            skip: true
          },
          {
            begin: /\(/,
            end: /\)/,
            excludeBegin: true,
            excludeEnd: true,
            keywords: KEYWORDS,
            contains: [
              'self',
              PROMPT,
              NUMBER,
              STRING,
              hljs.HASH_COMMENT_MODE
            ]
          }
        ]
      };
      SUBST.contains = [
        STRING,
        NUMBER,
        PROMPT
      ];

      return {
        name: 'Python',
        aliases: [
          'py',
          'gyp',
          'ipython'
        ],
        keywords: KEYWORDS,
        illegal: /(<\/|->|\?)|=>/,
        contains: [
          PROMPT,
          NUMBER,
          {
            // very common convention
            begin: /\bself\b/
          },
          {
            // eat "if" prior to string so that it won't accidentally be
            // labeled as an f-string
            beginKeywords: "if",
            relevance: 0
          },
          STRING,
          COMMENT_TYPE,
          hljs.HASH_COMMENT_MODE,
          {
            variants: [
              {
                className: 'function',
                beginKeywords: 'def'
              },
              {
                className: 'class',
                beginKeywords: 'class'
              }
            ],
            end: /:/,
            illegal: /[${=;\n,]/,
            contains: [
              hljs.UNDERSCORE_TITLE_MODE,
              PARAMS,
              {
                begin: /->/,
                endsWithParent: true,
                keywords: KEYWORDS
              }
            ]
          },
          {
            className: 'meta',
            begin: /^[\t ]*@/,
            end: /(?=#)|$/,
            contains: [
              NUMBER,
              PARAMS,
              STRING
            ]
          }
        ]
      };
    }

    var python_1 = python;

    /*
    Language: Plain text
    Author: Egor Rogov (e.rogov@postgrespro.ru)
    Description: Plain text without any highlighting.
    Category: common
    */
    function plaintext(hljs) {
      return {
        name: 'Plain text',
        aliases: [
          'text',
          'txt'
        ],
        disableAutodetect: true
      };
    }

    var plaintext_1 = plaintext;

    function _typeof(obj) {
      "@babel/helpers - typeof";

      if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof = function (obj) {
          return typeof obj;
        };
      } else {
        _typeof = function (obj) {
          return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
      }

      return _typeof(obj);
    }

    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }

    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties(Constructor, staticProps);
      return Constructor;
    }

    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }

      return obj;
    }

    function _inherits(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
      }

      subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
          value: subClass,
          writable: true,
          configurable: true
        }
      });
      if (superClass) _setPrototypeOf(subClass, superClass);
    }

    function _getPrototypeOf(o) {
      _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
      };
      return _getPrototypeOf(o);
    }

    function _setPrototypeOf(o, p) {
      _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
      };

      return _setPrototypeOf(o, p);
    }

    function _isNativeReflectConstruct() {
      if (typeof Reflect === "undefined" || !Reflect.construct) return false;
      if (Reflect.construct.sham) return false;
      if (typeof Proxy === "function") return true;

      try {
        Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
        return true;
      } catch (e) {
        return false;
      }
    }

    function _construct(Parent, args, Class) {
      if (_isNativeReflectConstruct()) {
        _construct = Reflect.construct;
      } else {
        _construct = function _construct(Parent, args, Class) {
          var a = [null];
          a.push.apply(a, args);
          var Constructor = Function.bind.apply(Parent, a);
          var instance = new Constructor();
          if (Class) _setPrototypeOf(instance, Class.prototype);
          return instance;
        };
      }

      return _construct.apply(null, arguments);
    }

    function _isNativeFunction(fn) {
      return Function.toString.call(fn).indexOf("[native code]") !== -1;
    }

    function _wrapNativeSuper(Class) {
      var _cache = typeof Map === "function" ? new Map() : undefined;

      _wrapNativeSuper = function _wrapNativeSuper(Class) {
        if (Class === null || !_isNativeFunction(Class)) return Class;

        if (typeof Class !== "function") {
          throw new TypeError("Super expression must either be null or a function");
        }

        if (typeof _cache !== "undefined") {
          if (_cache.has(Class)) return _cache.get(Class);

          _cache.set(Class, Wrapper);
        }

        function Wrapper() {
          return _construct(Class, arguments, _getPrototypeOf(this).constructor);
        }

        Wrapper.prototype = Object.create(Class.prototype, {
          constructor: {
            value: Wrapper,
            enumerable: false,
            writable: true,
            configurable: true
          }
        });
        return _setPrototypeOf(Wrapper, Class);
      };

      return _wrapNativeSuper(Class);
    }

    function _assertThisInitialized(self) {
      if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }

      return self;
    }

    function _possibleConstructorReturn(self, call) {
      if (call && (typeof call === "object" || typeof call === "function")) {
        return call;
      }

      return _assertThisInitialized(self);
    }

    function _createSuper(Derived) {
      var hasNativeReflectConstruct = _isNativeReflectConstruct();

      return function _createSuperInternal() {
        var Super = _getPrototypeOf(Derived),
            result;

        if (hasNativeReflectConstruct) {
          var NewTarget = _getPrototypeOf(this).constructor;

          result = Reflect.construct(Super, arguments, NewTarget);
        } else {
          result = Super.apply(this, arguments);
        }

        return _possibleConstructorReturn(this, result);
      };
    }

    function _superPropBase(object, property) {
      while (!Object.prototype.hasOwnProperty.call(object, property)) {
        object = _getPrototypeOf(object);
        if (object === null) break;
      }

      return object;
    }

    function _get(target, property, receiver) {
      if (typeof Reflect !== "undefined" && Reflect.get) {
        _get = Reflect.get;
      } else {
        _get = function _get(target, property, receiver) {
          var base = _superPropBase(target, property);

          if (!base) return;
          var desc = Object.getOwnPropertyDescriptor(base, property);

          if (desc.get) {
            return desc.get.call(receiver);
          }

          return desc.value;
        };
      }

      return _get(target, property, receiver || target);
    }

    function _slicedToArray(arr, i) {
      return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
    }

    function _toArray(arr) {
      return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest();
    }

    function _arrayWithHoles(arr) {
      if (Array.isArray(arr)) return arr;
    }

    function _iterableToArray(iter) {
      if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
    }

    function _iterableToArrayLimit(arr, i) {
      if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"] != null) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    function _unsupportedIterableToArray(o, minLen) {
      if (!o) return;
      if (typeof o === "string") return _arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor) n = o.constructor.name;
      if (n === "Map" || n === "Set") return Array.from(o);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
    }

    function _arrayLikeToArray(arr, len) {
      if (len == null || len > arr.length) len = arr.length;

      for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

      return arr2;
    }

    function _nonIterableRest() {
      throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    function _createForOfIteratorHelper(o, allowArrayLike) {
      var it;

      if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
        if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
          if (it) o = it;
          var i = 0;

          var F = function () {};

          return {
            s: F,
            n: function () {
              if (i >= o.length) return {
                done: true
              };
              return {
                done: false,
                value: o[i++]
              };
            },
            e: function (e) {
              throw e;
            },
            f: F
          };
        }

        throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }

      var normalCompletion = true,
          didErr = false,
          err;
      return {
        s: function () {
          it = o[Symbol.iterator]();
        },
        n: function () {
          var step = it.next();
          normalCompletion = step.done;
          return step;
        },
        e: function (e) {
          didErr = true;
          err = e;
        },
        f: function () {
          try {
            if (!normalCompletion && it.return != null) it.return();
          } finally {
            if (didErr) throw err;
          }
        }
      };
    }

    var Char = {
      ANCHOR: '&',
      COMMENT: '#',
      TAG: '!',
      DIRECTIVES_END: '-',
      DOCUMENT_END: '.'
    };
    var Type = {
      ALIAS: 'ALIAS',
      BLANK_LINE: 'BLANK_LINE',
      BLOCK_FOLDED: 'BLOCK_FOLDED',
      BLOCK_LITERAL: 'BLOCK_LITERAL',
      COMMENT: 'COMMENT',
      DIRECTIVE: 'DIRECTIVE',
      DOCUMENT: 'DOCUMENT',
      FLOW_MAP: 'FLOW_MAP',
      FLOW_SEQ: 'FLOW_SEQ',
      MAP: 'MAP',
      MAP_KEY: 'MAP_KEY',
      MAP_VALUE: 'MAP_VALUE',
      PLAIN: 'PLAIN',
      QUOTE_DOUBLE: 'QUOTE_DOUBLE',
      QUOTE_SINGLE: 'QUOTE_SINGLE',
      SEQ: 'SEQ',
      SEQ_ITEM: 'SEQ_ITEM'
    };
    var defaultTagPrefix = 'tag:yaml.org,2002:';
    var defaultTags = {
      MAP: 'tag:yaml.org,2002:map',
      SEQ: 'tag:yaml.org,2002:seq',
      STR: 'tag:yaml.org,2002:str'
    };

    function findLineStarts(src) {
      var ls = [0];
      var offset = src.indexOf('\n');

      while (offset !== -1) {
        offset += 1;
        ls.push(offset);
        offset = src.indexOf('\n', offset);
      }

      return ls;
    }

    function getSrcInfo(cst) {
      var lineStarts, src;

      if (typeof cst === 'string') {
        lineStarts = findLineStarts(cst);
        src = cst;
      } else {
        if (Array.isArray(cst)) cst = cst[0];

        if (cst && cst.context) {
          if (!cst.lineStarts) cst.lineStarts = findLineStarts(cst.context.src);
          lineStarts = cst.lineStarts;
          src = cst.context.src;
        }
      }

      return {
        lineStarts: lineStarts,
        src: src
      };
    }
    /**
     * @typedef {Object} LinePos - One-indexed position in the source
     * @property {number} line
     * @property {number} col
     */

    /**
     * Determine the line/col position matching a character offset.
     *
     * Accepts a source string or a CST document as the second parameter. With
     * the latter, starting indices for lines are cached in the document as
     * `lineStarts: number[]`.
     *
     * Returns a one-indexed `{ line, col }` location if found, or
     * `undefined` otherwise.
     *
     * @param {number} offset
     * @param {string|Document|Document[]} cst
     * @returns {?LinePos}
     */


    function getLinePos(offset, cst) {
      if (typeof offset !== 'number' || offset < 0) return null;

      var _getSrcInfo = getSrcInfo(cst),
          lineStarts = _getSrcInfo.lineStarts,
          src = _getSrcInfo.src;

      if (!lineStarts || !src || offset > src.length) return null;

      for (var i = 0; i < lineStarts.length; ++i) {
        var start = lineStarts[i];

        if (offset < start) {
          return {
            line: i,
            col: offset - lineStarts[i - 1] + 1
          };
        }

        if (offset === start) return {
          line: i + 1,
          col: 1
        };
      }

      var line = lineStarts.length;
      return {
        line: line,
        col: offset - lineStarts[line - 1] + 1
      };
    }
    /**
     * Get a specified line from the source.
     *
     * Accepts a source string or a CST document as the second parameter. With
     * the latter, starting indices for lines are cached in the document as
     * `lineStarts: number[]`.
     *
     * Returns the line as a string if found, or `null` otherwise.
     *
     * @param {number} line One-indexed line number
     * @param {string|Document|Document[]} cst
     * @returns {?string}
     */

    function getLine(line, cst) {
      var _getSrcInfo2 = getSrcInfo(cst),
          lineStarts = _getSrcInfo2.lineStarts,
          src = _getSrcInfo2.src;

      if (!lineStarts || !(line >= 1) || line > lineStarts.length) return null;
      var start = lineStarts[line - 1];
      var end = lineStarts[line]; // undefined for last line; that's ok for slice()

      while (end && end > start && src[end - 1] === '\n') {
        --end;
      }

      return src.slice(start, end);
    }
    /**
     * Pretty-print the starting line from the source indicated by the range `pos`
     *
     * Trims output to `maxWidth` chars while keeping the starting column visible,
     * using `…` at either end to indicate dropped characters.
     *
     * Returns a two-line string (or `null`) with `\n` as separator; the second line
     * will hold appropriately indented `^` marks indicating the column range.
     *
     * @param {Object} pos
     * @param {LinePos} pos.start
     * @param {LinePos} [pos.end]
     * @param {string|Document|Document[]*} cst
     * @param {number} [maxWidth=80]
     * @returns {?string}
     */

    function getPrettyContext(_ref, cst) {
      var start = _ref.start,
          end = _ref.end;
      var maxWidth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 80;
      var src = getLine(start.line, cst);
      if (!src) return null;
      var col = start.col;

      if (src.length > maxWidth) {
        if (col <= maxWidth - 10) {
          src = src.substr(0, maxWidth - 1) + '…';
        } else {
          var halfWidth = Math.round(maxWidth / 2);
          if (src.length > col + halfWidth) src = src.substr(0, col + halfWidth - 1) + '…';
          col -= src.length - maxWidth;
          src = '…' + src.substr(1 - maxWidth);
        }
      }

      var errLen = 1;
      var errEnd = '';

      if (end) {
        if (end.line === start.line && col + (end.col - start.col) <= maxWidth + 1) {
          errLen = end.col - start.col;
        } else {
          errLen = Math.min(src.length + 1, maxWidth) - col;
          errEnd = '…';
        }
      }

      var offset = col > 1 ? ' '.repeat(col - 1) : '';
      var err = '^'.repeat(errLen);
      return "".concat(src, "\n").concat(offset).concat(err).concat(errEnd);
    }

    var Range = /*#__PURE__*/function () {
      function Range(start, end) {
        _classCallCheck(this, Range);

        this.start = start;
        this.end = end || start;
      }

      _createClass(Range, [{
        key: "isEmpty",
        value: function isEmpty() {
          return typeof this.start !== 'number' || !this.end || this.end <= this.start;
        }
        /**
         * Set `origStart` and `origEnd` to point to the original source range for
         * this node, which may differ due to dropped CR characters.
         *
         * @param {number[]} cr - Positions of dropped CR characters
         * @param {number} offset - Starting index of `cr` from the last call
         * @returns {number} - The next offset, matching the one found for `origStart`
         */

      }, {
        key: "setOrigRange",
        value: function setOrigRange(cr, offset) {
          var start = this.start,
              end = this.end;

          if (cr.length === 0 || end <= cr[0]) {
            this.origStart = start;
            this.origEnd = end;
            return offset;
          }

          var i = offset;

          while (i < cr.length) {
            if (cr[i] > start) break;else ++i;
          }

          this.origStart = start + i;
          var nextOffset = i;

          while (i < cr.length) {
            // if end was at \n, it should now be at \r
            if (cr[i] >= end) break;else ++i;
          }

          this.origEnd = end + i;
          return nextOffset;
        }
      }], [{
        key: "copy",
        value: function copy(orig) {
          return new Range(orig.start, orig.end);
        }
      }]);

      return Range;
    }();

    /** Root class of all nodes */

    var Node$1 = /*#__PURE__*/function () {
      function Node(type, props, context) {
        _classCallCheck(this, Node);

        Object.defineProperty(this, 'context', {
          value: context || null,
          writable: true
        });
        this.error = null;
        this.range = null;
        this.valueRange = null;
        this.props = props || [];
        this.type = type;
        this.value = null;
      }

      _createClass(Node, [{
        key: "getPropValue",
        value: function getPropValue(idx, key, skipKey) {
          if (!this.context) return null;
          var src = this.context.src;
          var prop = this.props[idx];
          return prop && src[prop.start] === key ? src.slice(prop.start + (skipKey ? 1 : 0), prop.end) : null;
        }
      }, {
        key: "anchor",
        get: function get() {
          for (var i = 0; i < this.props.length; ++i) {
            var anchor = this.getPropValue(i, Char.ANCHOR, true);
            if (anchor != null) return anchor;
          }

          return null;
        }
      }, {
        key: "comment",
        get: function get() {
          var comments = [];

          for (var i = 0; i < this.props.length; ++i) {
            var comment = this.getPropValue(i, Char.COMMENT, true);
            if (comment != null) comments.push(comment);
          }

          return comments.length > 0 ? comments.join('\n') : null;
        }
      }, {
        key: "commentHasRequiredWhitespace",
        value: function commentHasRequiredWhitespace(start) {
          var src = this.context.src;
          if (this.header && start === this.header.end) return false;
          if (!this.valueRange) return false;
          var end = this.valueRange.end;
          return start !== end || Node.atBlank(src, end - 1);
        }
      }, {
        key: "hasComment",
        get: function get() {
          if (this.context) {
            var src = this.context.src;

            for (var i = 0; i < this.props.length; ++i) {
              if (src[this.props[i].start] === Char.COMMENT) return true;
            }
          }

          return false;
        }
      }, {
        key: "hasProps",
        get: function get() {
          if (this.context) {
            var src = this.context.src;

            for (var i = 0; i < this.props.length; ++i) {
              if (src[this.props[i].start] !== Char.COMMENT) return true;
            }
          }

          return false;
        }
      }, {
        key: "includesTrailingLines",
        get: function get() {
          return false;
        }
      }, {
        key: "jsonLike",
        get: function get() {
          var jsonLikeTypes = [Type.FLOW_MAP, Type.FLOW_SEQ, Type.QUOTE_DOUBLE, Type.QUOTE_SINGLE];
          return jsonLikeTypes.indexOf(this.type) !== -1;
        }
      }, {
        key: "rangeAsLinePos",
        get: function get() {
          if (!this.range || !this.context) return undefined;
          var start = getLinePos(this.range.start, this.context.root);
          if (!start) return undefined;
          var end = getLinePos(this.range.end, this.context.root);
          return {
            start: start,
            end: end
          };
        }
      }, {
        key: "rawValue",
        get: function get() {
          if (!this.valueRange || !this.context) return null;
          var _this$valueRange = this.valueRange,
              start = _this$valueRange.start,
              end = _this$valueRange.end;
          return this.context.src.slice(start, end);
        }
      }, {
        key: "tag",
        get: function get() {
          for (var i = 0; i < this.props.length; ++i) {
            var tag = this.getPropValue(i, Char.TAG, false);

            if (tag != null) {
              if (tag[1] === '<') {
                return {
                  verbatim: tag.slice(2, -1)
                };
              } else {
                // eslint-disable-next-line no-unused-vars
                var _tag$match = tag.match(/^(.*!)([^!]*)$/),
                    _tag$match2 = _slicedToArray(_tag$match, 3);
                    _tag$match2[0];
                    var handle = _tag$match2[1],
                    suffix = _tag$match2[2];

                return {
                  handle: handle,
                  suffix: suffix
                };
              }
            }
          }

          return null;
        }
      }, {
        key: "valueRangeContainsNewline",
        get: function get() {
          if (!this.valueRange || !this.context) return false;
          var _this$valueRange2 = this.valueRange,
              start = _this$valueRange2.start,
              end = _this$valueRange2.end;
          var src = this.context.src;

          for (var i = start; i < end; ++i) {
            if (src[i] === '\n') return true;
          }

          return false;
        }
      }, {
        key: "parseComment",
        value: function parseComment(start) {
          var src = this.context.src;

          if (src[start] === Char.COMMENT) {
            var end = Node.endOfLine(src, start + 1);
            var commentRange = new Range(start, end);
            this.props.push(commentRange);
            return end;
          }

          return start;
        }
        /**
         * Populates the `origStart` and `origEnd` values of all ranges for this
         * node. Extended by child classes to handle descendant nodes.
         *
         * @param {number[]} cr - Positions of dropped CR characters
         * @param {number} offset - Starting index of `cr` from the last call
         * @returns {number} - The next offset, matching the one found for `origStart`
         */

      }, {
        key: "setOrigRanges",
        value: function setOrigRanges(cr, offset) {
          if (this.range) offset = this.range.setOrigRange(cr, offset);
          if (this.valueRange) this.valueRange.setOrigRange(cr, offset);
          this.props.forEach(function (prop) {
            return prop.setOrigRange(cr, offset);
          });
          return offset;
        }
      }, {
        key: "toString",
        value: function toString() {
          var src = this.context.src,
              range = this.range,
              value = this.value;
          if (value != null) return value;
          var str = src.slice(range.start, range.end);
          return Node.addStringTerminator(src, range.end, str);
        }
      }], [{
        key: "addStringTerminator",
        value: function addStringTerminator(src, offset, str) {
          if (str[str.length - 1] === '\n') return str;
          var next = Node.endOfWhiteSpace(src, offset);
          return next >= src.length || src[next] === '\n' ? str + '\n' : str;
        } // ^(---|...)

      }, {
        key: "atDocumentBoundary",
        value: function atDocumentBoundary(src, offset, sep) {
          var ch0 = src[offset];
          if (!ch0) return true;
          var prev = src[offset - 1];
          if (prev && prev !== '\n') return false;

          if (sep) {
            if (ch0 !== sep) return false;
          } else {
            if (ch0 !== Char.DIRECTIVES_END && ch0 !== Char.DOCUMENT_END) return false;
          }

          var ch1 = src[offset + 1];
          var ch2 = src[offset + 2];
          if (ch1 !== ch0 || ch2 !== ch0) return false;
          var ch3 = src[offset + 3];
          return !ch3 || ch3 === '\n' || ch3 === '\t' || ch3 === ' ';
        }
      }, {
        key: "endOfIdentifier",
        value: function endOfIdentifier(src, offset) {
          var ch = src[offset];
          var isVerbatim = ch === '<';
          var notOk = isVerbatim ? ['\n', '\t', ' ', '>'] : ['\n', '\t', ' ', '[', ']', '{', '}', ','];

          while (ch && notOk.indexOf(ch) === -1) {
            ch = src[offset += 1];
          }

          if (isVerbatim && ch === '>') offset += 1;
          return offset;
        }
      }, {
        key: "endOfIndent",
        value: function endOfIndent(src, offset) {
          var ch = src[offset];

          while (ch === ' ') {
            ch = src[offset += 1];
          }

          return offset;
        }
      }, {
        key: "endOfLine",
        value: function endOfLine(src, offset) {
          var ch = src[offset];

          while (ch && ch !== '\n') {
            ch = src[offset += 1];
          }

          return offset;
        }
      }, {
        key: "endOfWhiteSpace",
        value: function endOfWhiteSpace(src, offset) {
          var ch = src[offset];

          while (ch === '\t' || ch === ' ') {
            ch = src[offset += 1];
          }

          return offset;
        }
      }, {
        key: "startOfLine",
        value: function startOfLine(src, offset) {
          var ch = src[offset - 1];
          if (ch === '\n') return offset;

          while (ch && ch !== '\n') {
            ch = src[offset -= 1];
          }

          return offset + 1;
        }
        /**
         * End of indentation, or null if the line's indent level is not more
         * than `indent`
         *
         * @param {string} src
         * @param {number} indent
         * @param {number} lineStart
         * @returns {?number}
         */

      }, {
        key: "endOfBlockIndent",
        value: function endOfBlockIndent(src, indent, lineStart) {
          var inEnd = Node.endOfIndent(src, lineStart);

          if (inEnd > lineStart + indent) {
            return inEnd;
          } else {
            var wsEnd = Node.endOfWhiteSpace(src, inEnd);
            var ch = src[wsEnd];
            if (!ch || ch === '\n') return wsEnd;
          }

          return null;
        }
      }, {
        key: "atBlank",
        value: function atBlank(src, offset, endAsBlank) {
          var ch = src[offset];
          return ch === '\n' || ch === '\t' || ch === ' ' || endAsBlank && !ch;
        }
      }, {
        key: "nextNodeIsIndented",
        value: function nextNodeIsIndented(ch, indentDiff, indicatorAsIndent) {
          if (!ch || indentDiff < 0) return false;
          if (indentDiff > 0) return true;
          return indicatorAsIndent && ch === '-';
        } // should be at line or string end, or at next non-whitespace char

      }, {
        key: "normalizeOffset",
        value: function normalizeOffset(src, offset) {
          var ch = src[offset];
          return !ch ? offset : ch !== '\n' && src[offset - 1] === '\n' ? offset - 1 : Node.endOfWhiteSpace(src, offset);
        } // fold single newline into space, multiple newlines to N - 1 newlines
        // presumes src[offset] === '\n'

      }, {
        key: "foldNewline",
        value: function foldNewline(src, offset, indent) {
          var inCount = 0;
          var error = false;
          var fold = '';
          var ch = src[offset + 1];

          while (ch === ' ' || ch === '\t' || ch === '\n') {
            switch (ch) {
              case '\n':
                inCount = 0;
                offset += 1;
                fold += '\n';
                break;

              case '\t':
                if (inCount <= indent) error = true;
                offset = Node.endOfWhiteSpace(src, offset + 2) - 1;
                break;

              case ' ':
                inCount += 1;
                offset += 1;
                break;
            }

            ch = src[offset + 1];
          }

          if (!fold) fold = ' ';
          if (ch && inCount <= indent) error = true;
          return {
            fold: fold,
            offset: offset,
            error: error
          };
        }
      }]);

      return Node;
    }();

    var YAMLError = /*#__PURE__*/function (_Error) {
      _inherits(YAMLError, _Error);

      var _super = _createSuper(YAMLError);

      function YAMLError(name, source, message) {
        var _this;

        _classCallCheck(this, YAMLError);

        if (!message || !(source instanceof Node$1)) throw new Error("Invalid arguments for new ".concat(name));
        _this = _super.call(this);
        _this.name = name;
        _this.message = message;
        _this.source = source;
        return _this;
      }

      _createClass(YAMLError, [{
        key: "makePretty",
        value: function makePretty() {
          if (!this.source) return;
          this.nodeType = this.source.type;
          var cst = this.source.context && this.source.context.root;

          if (typeof this.offset === 'number') {
            this.range = new Range(this.offset, this.offset + 1);
            var start = cst && getLinePos(this.offset, cst);

            if (start) {
              var end = {
                line: start.line,
                col: start.col + 1
              };
              this.linePos = {
                start: start,
                end: end
              };
            }

            delete this.offset;
          } else {
            this.range = this.source.range;
            this.linePos = this.source.rangeAsLinePos;
          }

          if (this.linePos) {
            var _this$linePos$start = this.linePos.start,
                line = _this$linePos$start.line,
                col = _this$linePos$start.col;
            this.message += " at line ".concat(line, ", column ").concat(col);
            var ctx = cst && getPrettyContext(this.linePos, cst);
            if (ctx) this.message += ":\n\n".concat(ctx, "\n");
          }

          delete this.source;
        }
      }]);

      return YAMLError;
    }( /*#__PURE__*/_wrapNativeSuper(Error));
    var YAMLReferenceError = /*#__PURE__*/function (_YAMLError) {
      _inherits(YAMLReferenceError, _YAMLError);

      var _super2 = _createSuper(YAMLReferenceError);

      function YAMLReferenceError(source, message) {
        _classCallCheck(this, YAMLReferenceError);

        return _super2.call(this, 'YAMLReferenceError', source, message);
      }

      return YAMLReferenceError;
    }(YAMLError);
    var YAMLSemanticError = /*#__PURE__*/function (_YAMLError2) {
      _inherits(YAMLSemanticError, _YAMLError2);

      var _super3 = _createSuper(YAMLSemanticError);

      function YAMLSemanticError(source, message) {
        _classCallCheck(this, YAMLSemanticError);

        return _super3.call(this, 'YAMLSemanticError', source, message);
      }

      return YAMLSemanticError;
    }(YAMLError);
    var YAMLSyntaxError = /*#__PURE__*/function (_YAMLError3) {
      _inherits(YAMLSyntaxError, _YAMLError3);

      var _super4 = _createSuper(YAMLSyntaxError);

      function YAMLSyntaxError(source, message) {
        _classCallCheck(this, YAMLSyntaxError);

        return _super4.call(this, 'YAMLSyntaxError', source, message);
      }

      return YAMLSyntaxError;
    }(YAMLError);
    var YAMLWarning = /*#__PURE__*/function (_YAMLError4) {
      _inherits(YAMLWarning, _YAMLError4);

      var _super5 = _createSuper(YAMLWarning);

      function YAMLWarning(source, message) {
        _classCallCheck(this, YAMLWarning);

        return _super5.call(this, 'YAMLWarning', source, message);
      }

      return YAMLWarning;
    }(YAMLError);

    var PlainValue = /*#__PURE__*/function (_Node) {
      _inherits(PlainValue, _Node);

      var _super = _createSuper(PlainValue);

      function PlainValue() {
        _classCallCheck(this, PlainValue);

        return _super.apply(this, arguments);
      }

      _createClass(PlainValue, [{
        key: "strValue",
        get: function get() {
          if (!this.valueRange || !this.context) return null;
          var _this$valueRange = this.valueRange,
              start = _this$valueRange.start,
              end = _this$valueRange.end;
          var src = this.context.src;
          var ch = src[end - 1];

          while (start < end && (ch === '\n' || ch === '\t' || ch === ' ')) {
            ch = src[--end - 1];
          }

          var str = '';

          for (var i = start; i < end; ++i) {
            var _ch = src[i];

            if (_ch === '\n') {
              var _Node$foldNewline = Node$1.foldNewline(src, i, -1),
                  fold = _Node$foldNewline.fold,
                  offset = _Node$foldNewline.offset;

              str += fold;
              i = offset;
            } else if (_ch === ' ' || _ch === '\t') {
              // trim trailing whitespace
              var wsStart = i;
              var next = src[i + 1];

              while (i < end && (next === ' ' || next === '\t')) {
                i += 1;
                next = src[i + 1];
              }

              if (next !== '\n') str += i > wsStart ? src.slice(wsStart, i + 1) : _ch;
            } else {
              str += _ch;
            }
          }

          var ch0 = src[start];

          switch (ch0) {
            case '\t':
              {
                var msg = 'Plain value cannot start with a tab character';
                var errors = [new YAMLSemanticError(this, msg)];
                return {
                  errors: errors,
                  str: str
                };
              }

            case '@':
            case '`':
              {
                var _msg = "Plain value cannot start with reserved character ".concat(ch0);

                var _errors = [new YAMLSemanticError(this, _msg)];
                return {
                  errors: _errors,
                  str: str
                };
              }

            default:
              return str;
          }
        }
      }, {
        key: "parseBlockValue",
        value: function parseBlockValue(start) {
          var _this$context = this.context,
              indent = _this$context.indent,
              inFlow = _this$context.inFlow,
              src = _this$context.src;
          var offset = start;
          var valueEnd = start;

          for (var ch = src[offset]; ch === '\n'; ch = src[offset]) {
            if (Node$1.atDocumentBoundary(src, offset + 1)) break;
            var end = Node$1.endOfBlockIndent(src, indent, offset + 1);
            if (end === null || src[end] === '#') break;

            if (src[end] === '\n') {
              offset = end;
            } else {
              valueEnd = PlainValue.endOfLine(src, end, inFlow);
              offset = valueEnd;
            }
          }

          if (this.valueRange.isEmpty()) this.valueRange.start = start;
          this.valueRange.end = valueEnd;
          return valueEnd;
        }
        /**
         * Parses a plain value from the source
         *
         * Accepted forms are:
         * ```
         * #comment
         *
         * first line
         *
         * first line #comment
         *
         * first line
         * block
         * lines
         *
         * #comment
         * block
         * lines
         * ```
         * where block lines are empty or have an indent level greater than `indent`.
         *
         * @param {ParseContext} context
         * @param {number} start - Index of first character
         * @returns {number} - Index of the character after this scalar, may be `\n`
         */

      }, {
        key: "parse",
        value: function parse(context, start) {
          this.context = context;
          var inFlow = context.inFlow,
              src = context.src;
          var offset = start;
          var ch = src[offset];

          if (ch && ch !== '#' && ch !== '\n') {
            offset = PlainValue.endOfLine(src, start, inFlow);
          }

          this.valueRange = new Range(start, offset);
          offset = Node$1.endOfWhiteSpace(src, offset);
          offset = this.parseComment(offset);

          if (!this.hasComment || this.valueRange.isEmpty()) {
            offset = this.parseBlockValue(offset);
          }

          return offset;
        }
      }], [{
        key: "endOfLine",
        value: function endOfLine(src, start, inFlow) {
          var ch = src[start];
          var offset = start;

          while (ch && ch !== '\n') {
            if (inFlow && (ch === '[' || ch === ']' || ch === '{' || ch === '}' || ch === ',')) break;
            var next = src[offset + 1];
            if (ch === ':' && (!next || next === '\n' || next === '\t' || next === ' ' || inFlow && next === ',')) break;
            if ((ch === ' ' || ch === '\t') && next === '#') break;
            offset += 1;
            ch = next;
          }

          return offset;
        }
      }]);

      return PlainValue;
    }(Node$1);

    var BlankLine = /*#__PURE__*/function (_Node) {
      _inherits(BlankLine, _Node);

      var _super = _createSuper(BlankLine);

      function BlankLine() {
        _classCallCheck(this, BlankLine);

        return _super.call(this, Type.BLANK_LINE);
      }
      /* istanbul ignore next */


      _createClass(BlankLine, [{
        key: "includesTrailingLines",
        get: function get() {
          // This is never called from anywhere, but if it were,
          // this is the value it should return.
          return true;
        }
        /**
         * Parses a blank line from the source
         *
         * @param {ParseContext} context
         * @param {number} start - Index of first \n character
         * @returns {number} - Index of the character after this
         */

      }, {
        key: "parse",
        value: function parse(context, start) {
          this.context = context;
          this.range = new Range(start, start + 1);
          return start + 1;
        }
      }]);

      return BlankLine;
    }(Node$1);

    var CollectionItem = /*#__PURE__*/function (_Node) {
      _inherits(CollectionItem, _Node);

      var _super = _createSuper(CollectionItem);

      function CollectionItem(type, props) {
        var _this;

        _classCallCheck(this, CollectionItem);

        _this = _super.call(this, type, props);
        _this.node = null;
        return _this;
      }

      _createClass(CollectionItem, [{
        key: "includesTrailingLines",
        get: function get() {
          return !!this.node && this.node.includesTrailingLines;
        }
        /**
         * @param {ParseContext} context
         * @param {number} start - Index of first character
         * @returns {number} - Index of the character after this
         */

      }, {
        key: "parse",
        value: function parse(context, start) {
          this.context = context;
          var parseNode = context.parseNode,
              src = context.src;
          var atLineStart = context.atLineStart,
              lineStart = context.lineStart;
          if (!atLineStart && this.type === Type.SEQ_ITEM) this.error = new YAMLSemanticError(this, 'Sequence items must not have preceding content on the same line');
          var indent = atLineStart ? start - lineStart : context.indent;
          var offset = Node$1.endOfWhiteSpace(src, start + 1);
          var ch = src[offset];
          var inlineComment = ch === '#';
          var comments = [];
          var blankLine = null;

          while (ch === '\n' || ch === '#') {
            if (ch === '#') {
              var _end = Node$1.endOfLine(src, offset + 1);

              comments.push(new Range(offset, _end));
              offset = _end;
            } else {
              atLineStart = true;
              lineStart = offset + 1;
              var wsEnd = Node$1.endOfWhiteSpace(src, lineStart);

              if (src[wsEnd] === '\n' && comments.length === 0) {
                blankLine = new BlankLine();
                lineStart = blankLine.parse({
                  src: src
                }, lineStart);
              }

              offset = Node$1.endOfIndent(src, lineStart);
            }

            ch = src[offset];
          }

          if (Node$1.nextNodeIsIndented(ch, offset - (lineStart + indent), this.type !== Type.SEQ_ITEM)) {
            this.node = parseNode({
              atLineStart: atLineStart,
              inCollection: false,
              indent: indent,
              lineStart: lineStart,
              parent: this
            }, offset);
          } else if (ch && lineStart > start + 1) {
            offset = lineStart - 1;
          }

          if (this.node) {
            if (blankLine) {
              // Only blank lines preceding non-empty nodes are captured. Note that
              // this means that collection item range start indices do not always
              // increase monotonically. -- eemeli/yaml#126
              var items = context.parent.items || context.parent.contents;
              if (items) items.push(blankLine);
            }

            if (comments.length) Array.prototype.push.apply(this.props, comments);
            offset = this.node.range.end;
          } else {
            if (inlineComment) {
              var c = comments[0];
              this.props.push(c);
              offset = c.end;
            } else {
              offset = Node$1.endOfLine(src, start + 1);
            }
          }

          var end = this.node ? this.node.valueRange.end : offset;
          this.valueRange = new Range(start, end);
          return offset;
        }
      }, {
        key: "setOrigRanges",
        value: function setOrigRanges(cr, offset) {
          offset = _get(_getPrototypeOf(CollectionItem.prototype), "setOrigRanges", this).call(this, cr, offset);
          return this.node ? this.node.setOrigRanges(cr, offset) : offset;
        }
      }, {
        key: "toString",
        value: function toString() {
          var src = this.context.src,
              node = this.node,
              range = this.range,
              value = this.value;
          if (value != null) return value;
          var str = node ? src.slice(range.start, node.range.start) + String(node) : src.slice(range.start, range.end);
          return Node$1.addStringTerminator(src, range.end, str);
        }
      }]);

      return CollectionItem;
    }(Node$1);

    var Comment = /*#__PURE__*/function (_Node) {
      _inherits(Comment, _Node);

      var _super = _createSuper(Comment);

      function Comment() {
        _classCallCheck(this, Comment);

        return _super.call(this, Type.COMMENT);
      }
      /**
       * Parses a comment line from the source
       *
       * @param {ParseContext} context
       * @param {number} start - Index of first character
       * @returns {number} - Index of the character after this scalar
       */


      _createClass(Comment, [{
        key: "parse",
        value: function parse(context, start) {
          this.context = context;
          var offset = this.parseComment(start);
          this.range = new Range(start, offset);
          return offset;
        }
      }]);

      return Comment;
    }(Node$1);

    function grabCollectionEndComments(node) {
      var cnode = node;

      while (cnode instanceof CollectionItem) {
        cnode = cnode.node;
      }

      if (!(cnode instanceof Collection$1)) return null;
      var len = cnode.items.length;
      var ci = -1;

      for (var i = len - 1; i >= 0; --i) {
        var n = cnode.items[i];

        if (n.type === Type.COMMENT) {
          // Keep sufficiently indented comments with preceding node
          var _n$context = n.context,
              indent = _n$context.indent,
              lineStart = _n$context.lineStart;
          if (indent > 0 && n.range.start >= lineStart + indent) break;
          ci = i;
        } else if (n.type === Type.BLANK_LINE) ci = i;else break;
      }

      if (ci === -1) return null;
      var ca = cnode.items.splice(ci, len - ci);
      var prevEnd = ca[0].range.start;

      while (true) {
        cnode.range.end = prevEnd;
        if (cnode.valueRange && cnode.valueRange.end > prevEnd) cnode.valueRange.end = prevEnd;
        if (cnode === node) break;
        cnode = cnode.context.parent;
      }

      return ca;
    }
    var Collection$1 = /*#__PURE__*/function (_Node) {
      _inherits(Collection, _Node);

      var _super = _createSuper(Collection);

      function Collection(firstItem) {
        var _this;

        _classCallCheck(this, Collection);

        _this = _super.call(this, firstItem.type === Type.SEQ_ITEM ? Type.SEQ : Type.MAP);

        for (var i = firstItem.props.length - 1; i >= 0; --i) {
          if (firstItem.props[i].start < firstItem.context.lineStart) {
            // props on previous line are assumed by the collection
            _this.props = firstItem.props.slice(0, i + 1);
            firstItem.props = firstItem.props.slice(i + 1);
            var itemRange = firstItem.props[0] || firstItem.valueRange;
            firstItem.range.start = itemRange.start;
            break;
          }
        }

        _this.items = [firstItem];
        var ec = grabCollectionEndComments(firstItem);
        if (ec) Array.prototype.push.apply(_this.items, ec);
        return _this;
      }

      _createClass(Collection, [{
        key: "includesTrailingLines",
        get: function get() {
          return this.items.length > 0;
        }
        /**
         * @param {ParseContext} context
         * @param {number} start - Index of first character
         * @returns {number} - Index of the character after this
         */

      }, {
        key: "parse",
        value: function parse(context, start) {
          this.context = context;
          var parseNode = context.parseNode,
              src = context.src; // It's easier to recalculate lineStart here rather than tracking down the
          // last context from which to read it -- eemeli/yaml#2

          var lineStart = Node$1.startOfLine(src, start);
          var firstItem = this.items[0]; // First-item context needs to be correct for later comment handling
          // -- eemeli/yaml#17

          firstItem.context.parent = this;
          this.valueRange = Range.copy(firstItem.valueRange);
          var indent = firstItem.range.start - firstItem.context.lineStart;
          var offset = start;
          offset = Node$1.normalizeOffset(src, offset);
          var ch = src[offset];
          var atLineStart = Node$1.endOfWhiteSpace(src, lineStart) === offset;
          var prevIncludesTrailingLines = false;

          while (ch) {
            while (ch === '\n' || ch === '#') {
              if (atLineStart && ch === '\n' && !prevIncludesTrailingLines) {
                var blankLine = new BlankLine();
                offset = blankLine.parse({
                  src: src
                }, offset);
                this.valueRange.end = offset;

                if (offset >= src.length) {
                  ch = null;
                  break;
                }

                this.items.push(blankLine);
                offset -= 1; // blankLine.parse() consumes terminal newline
              } else if (ch === '#') {
                if (offset < lineStart + indent && !Collection.nextContentHasIndent(src, offset, indent)) {
                  return offset;
                }

                var comment = new Comment();
                offset = comment.parse({
                  indent: indent,
                  lineStart: lineStart,
                  src: src
                }, offset);
                this.items.push(comment);
                this.valueRange.end = offset;

                if (offset >= src.length) {
                  ch = null;
                  break;
                }
              }

              lineStart = offset + 1;
              offset = Node$1.endOfIndent(src, lineStart);

              if (Node$1.atBlank(src, offset)) {
                var wsEnd = Node$1.endOfWhiteSpace(src, offset);
                var next = src[wsEnd];

                if (!next || next === '\n' || next === '#') {
                  offset = wsEnd;
                }
              }

              ch = src[offset];
              atLineStart = true;
            }

            if (!ch) {
              break;
            }

            if (offset !== lineStart + indent && (atLineStart || ch !== ':')) {
              if (offset < lineStart + indent) {
                if (lineStart > start) offset = lineStart;
                break;
              } else if (!this.error) {
                var msg = 'All collection items must start at the same column';
                this.error = new YAMLSyntaxError(this, msg);
              }
            }

            if (firstItem.type === Type.SEQ_ITEM) {
              if (ch !== '-') {
                if (lineStart > start) offset = lineStart;
                break;
              }
            } else if (ch === '-' && !this.error) {
              // map key may start with -, as long as it's followed by a non-whitespace char
              var _next = src[offset + 1];

              if (!_next || _next === '\n' || _next === '\t' || _next === ' ') {
                var _msg = 'A collection cannot be both a mapping and a sequence';
                this.error = new YAMLSyntaxError(this, _msg);
              }
            }

            var node = parseNode({
              atLineStart: atLineStart,
              inCollection: true,
              indent: indent,
              lineStart: lineStart,
              parent: this
            }, offset);
            if (!node) return offset; // at next document start

            this.items.push(node);
            this.valueRange.end = node.valueRange.end;
            offset = Node$1.normalizeOffset(src, node.range.end);
            ch = src[offset];
            atLineStart = false;
            prevIncludesTrailingLines = node.includesTrailingLines; // Need to reset lineStart and atLineStart here if preceding node's range
            // has advanced to check the current line's indentation level
            // -- eemeli/yaml#10 & eemeli/yaml#38

            if (ch) {
              var ls = offset - 1;
              var prev = src[ls];

              while (prev === ' ' || prev === '\t') {
                prev = src[--ls];
              }

              if (prev === '\n') {
                lineStart = ls + 1;
                atLineStart = true;
              }
            }

            var ec = grabCollectionEndComments(node);
            if (ec) Array.prototype.push.apply(this.items, ec);
          }

          return offset;
        }
      }, {
        key: "setOrigRanges",
        value: function setOrigRanges(cr, offset) {
          offset = _get(_getPrototypeOf(Collection.prototype), "setOrigRanges", this).call(this, cr, offset);
          this.items.forEach(function (node) {
            offset = node.setOrigRanges(cr, offset);
          });
          return offset;
        }
      }, {
        key: "toString",
        value: function toString() {
          var src = this.context.src,
              items = this.items,
              range = this.range,
              value = this.value;
          if (value != null) return value;
          var str = src.slice(range.start, items[0].range.start) + String(items[0]);

          for (var i = 1; i < items.length; ++i) {
            var item = items[i];
            var _item$context = item.context,
                atLineStart = _item$context.atLineStart,
                indent = _item$context.indent;
            if (atLineStart) for (var _i = 0; _i < indent; ++_i) {
              str += ' ';
            }
            str += String(item);
          }

          return Node$1.addStringTerminator(src, range.end, str);
        }
      }], [{
        key: "nextContentHasIndent",
        value: function nextContentHasIndent(src, offset, indent) {
          var lineStart = Node$1.endOfLine(src, offset) + 1;
          offset = Node$1.endOfWhiteSpace(src, lineStart);
          var ch = src[offset];
          if (!ch) return false;
          if (offset >= lineStart + indent) return true;
          if (ch !== '#' && ch !== '\n') return false;
          return Collection.nextContentHasIndent(src, offset, indent);
        }
      }]);

      return Collection;
    }(Node$1);

    var Directive = /*#__PURE__*/function (_Node) {
      _inherits(Directive, _Node);

      var _super = _createSuper(Directive);

      function Directive() {
        var _this;

        _classCallCheck(this, Directive);

        _this = _super.call(this, Type.DIRECTIVE);
        _this.name = null;
        return _this;
      }

      _createClass(Directive, [{
        key: "parameters",
        get: function get() {
          var raw = this.rawValue;
          return raw ? raw.trim().split(/[ \t]+/) : [];
        }
      }, {
        key: "parseName",
        value: function parseName(start) {
          var src = this.context.src;
          var offset = start;
          var ch = src[offset];

          while (ch && ch !== '\n' && ch !== '\t' && ch !== ' ') {
            ch = src[offset += 1];
          }

          this.name = src.slice(start, offset);
          return offset;
        }
      }, {
        key: "parseParameters",
        value: function parseParameters(start) {
          var src = this.context.src;
          var offset = start;
          var ch = src[offset];

          while (ch && ch !== '\n' && ch !== '#') {
            ch = src[offset += 1];
          }

          this.valueRange = new Range(start, offset);
          return offset;
        }
      }, {
        key: "parse",
        value: function parse(context, start) {
          this.context = context;
          var offset = this.parseName(start + 1);
          offset = this.parseParameters(offset);
          offset = this.parseComment(offset);
          this.range = new Range(start, offset);
          return offset;
        }
      }]);

      return Directive;
    }(Node$1);

    var Document$2 = /*#__PURE__*/function (_Node) {
      _inherits(Document, _Node);

      var _super = _createSuper(Document);

      function Document() {
        var _this;

        _classCallCheck(this, Document);

        _this = _super.call(this, Type.DOCUMENT);
        _this.directives = null;
        _this.contents = null;
        _this.directivesEndMarker = null;
        _this.documentEndMarker = null;
        return _this;
      }

      _createClass(Document, [{
        key: "parseDirectives",
        value: function parseDirectives(start) {
          var src = this.context.src;
          this.directives = [];
          var atLineStart = true;
          var hasDirectives = false;
          var offset = start;

          while (!Node$1.atDocumentBoundary(src, offset, Char.DIRECTIVES_END)) {
            offset = Document.startCommentOrEndBlankLine(src, offset);

            switch (src[offset]) {
              case '\n':
                if (atLineStart) {
                  var blankLine = new BlankLine();
                  offset = blankLine.parse({
                    src: src
                  }, offset);

                  if (offset < src.length) {
                    this.directives.push(blankLine);
                  }
                } else {
                  offset += 1;
                  atLineStart = true;
                }

                break;

              case '#':
                {
                  var comment = new Comment();
                  offset = comment.parse({
                    src: src
                  }, offset);
                  this.directives.push(comment);
                  atLineStart = false;
                }
                break;

              case '%':
                {
                  var directive = new Directive();
                  offset = directive.parse({
                    parent: this,
                    src: src
                  }, offset);
                  this.directives.push(directive);
                  hasDirectives = true;
                  atLineStart = false;
                }
                break;

              default:
                if (hasDirectives) {
                  this.error = new YAMLSemanticError(this, 'Missing directives-end indicator line');
                } else if (this.directives.length > 0) {
                  this.contents = this.directives;
                  this.directives = [];
                }

                return offset;
            }
          }

          if (src[offset]) {
            this.directivesEndMarker = new Range(offset, offset + 3);
            return offset + 3;
          }

          if (hasDirectives) {
            this.error = new YAMLSemanticError(this, 'Missing directives-end indicator line');
          } else if (this.directives.length > 0) {
            this.contents = this.directives;
            this.directives = [];
          }

          return offset;
        }
      }, {
        key: "parseContents",
        value: function parseContents(start) {
          var _this$context = this.context,
              parseNode = _this$context.parseNode,
              src = _this$context.src;
          if (!this.contents) this.contents = [];
          var lineStart = start;

          while (src[lineStart - 1] === '-') {
            lineStart -= 1;
          }

          var offset = Node$1.endOfWhiteSpace(src, start);
          var atLineStart = lineStart === start;
          this.valueRange = new Range(offset);

          while (!Node$1.atDocumentBoundary(src, offset, Char.DOCUMENT_END)) {
            switch (src[offset]) {
              case '\n':
                if (atLineStart) {
                  var blankLine = new BlankLine();
                  offset = blankLine.parse({
                    src: src
                  }, offset);

                  if (offset < src.length) {
                    this.contents.push(blankLine);
                  }
                } else {
                  offset += 1;
                  atLineStart = true;
                }

                lineStart = offset;
                break;

              case '#':
                {
                  var comment = new Comment();
                  offset = comment.parse({
                    src: src
                  }, offset);
                  this.contents.push(comment);
                  atLineStart = false;
                }
                break;

              default:
                {
                  var iEnd = Node$1.endOfIndent(src, offset);
                  var context = {
                    atLineStart: atLineStart,
                    indent: -1,
                    inFlow: false,
                    inCollection: false,
                    lineStart: lineStart,
                    parent: this
                  };
                  var node = parseNode(context, iEnd);
                  if (!node) return this.valueRange.end = iEnd; // at next document start

                  this.contents.push(node);
                  offset = node.range.end;
                  atLineStart = false;
                  var ec = grabCollectionEndComments(node);
                  if (ec) Array.prototype.push.apply(this.contents, ec);
                }
            }

            offset = Document.startCommentOrEndBlankLine(src, offset);
          }

          this.valueRange.end = offset;

          if (src[offset]) {
            this.documentEndMarker = new Range(offset, offset + 3);
            offset += 3;

            if (src[offset]) {
              offset = Node$1.endOfWhiteSpace(src, offset);

              if (src[offset] === '#') {
                var _comment = new Comment();

                offset = _comment.parse({
                  src: src
                }, offset);
                this.contents.push(_comment);
              }

              switch (src[offset]) {
                case '\n':
                  offset += 1;
                  break;

                case undefined:
                  break;

                default:
                  this.error = new YAMLSyntaxError(this, 'Document end marker line cannot have a non-comment suffix');
              }
            }
          }

          return offset;
        }
        /**
         * @param {ParseContext} context
         * @param {number} start - Index of first character
         * @returns {number} - Index of the character after this
         */

      }, {
        key: "parse",
        value: function parse(context, start) {
          context.root = this;
          this.context = context;
          var src = context.src;
          var offset = src.charCodeAt(start) === 0xfeff ? start + 1 : start; // skip BOM

          offset = this.parseDirectives(offset);
          offset = this.parseContents(offset);
          return offset;
        }
      }, {
        key: "setOrigRanges",
        value: function setOrigRanges(cr, offset) {
          offset = _get(_getPrototypeOf(Document.prototype), "setOrigRanges", this).call(this, cr, offset);
          this.directives.forEach(function (node) {
            offset = node.setOrigRanges(cr, offset);
          });
          if (this.directivesEndMarker) offset = this.directivesEndMarker.setOrigRange(cr, offset);
          this.contents.forEach(function (node) {
            offset = node.setOrigRanges(cr, offset);
          });
          if (this.documentEndMarker) offset = this.documentEndMarker.setOrigRange(cr, offset);
          return offset;
        }
      }, {
        key: "toString",
        value: function toString() {
          var contents = this.contents,
              directives = this.directives,
              value = this.value;
          if (value != null) return value;
          var str = directives.join('');

          if (contents.length > 0) {
            if (directives.length > 0 || contents[0].type === Type.COMMENT) str += '---\n';
            str += contents.join('');
          }

          if (str[str.length - 1] !== '\n') str += '\n';
          return str;
        }
      }], [{
        key: "startCommentOrEndBlankLine",
        value: function startCommentOrEndBlankLine(src, start) {
          var offset = Node$1.endOfWhiteSpace(src, start);
          var ch = src[offset];
          return ch === '#' || ch === '\n' ? offset : start;
        }
      }]);

      return Document;
    }(Node$1);

    var Alias$1 = /*#__PURE__*/function (_Node) {
      _inherits(Alias, _Node);

      var _super = _createSuper(Alias);

      function Alias() {
        _classCallCheck(this, Alias);

        return _super.apply(this, arguments);
      }

      _createClass(Alias, [{
        key: "parse",
        value:
        /**
         * Parses an *alias from the source
         *
         * @param {ParseContext} context
         * @param {number} start - Index of first character
         * @returns {number} - Index of the character after this scalar
         */
        function parse(context, start) {
          this.context = context;
          var src = context.src;
          var offset = Node$1.endOfIdentifier(src, start + 1);
          this.valueRange = new Range(start + 1, offset);
          offset = Node$1.endOfWhiteSpace(src, offset);
          offset = this.parseComment(offset);
          return offset;
        }
      }]);

      return Alias;
    }(Node$1);

    var Chomp = {
      CLIP: 'CLIP',
      KEEP: 'KEEP',
      STRIP: 'STRIP'
    };
    var BlockValue = /*#__PURE__*/function (_Node) {
      _inherits(BlockValue, _Node);

      var _super = _createSuper(BlockValue);

      function BlockValue(type, props) {
        var _this;

        _classCallCheck(this, BlockValue);

        _this = _super.call(this, type, props);
        _this.blockIndent = null;
        _this.chomping = Chomp.CLIP;
        _this.header = null;
        return _this;
      }

      _createClass(BlockValue, [{
        key: "includesTrailingLines",
        get: function get() {
          return this.chomping === Chomp.KEEP;
        }
      }, {
        key: "strValue",
        get: function get() {
          if (!this.valueRange || !this.context) return null;
          var _this$valueRange = this.valueRange,
              start = _this$valueRange.start,
              end = _this$valueRange.end;
          var _this$context = this.context,
              indent = _this$context.indent,
              src = _this$context.src;
          if (this.valueRange.isEmpty()) return '';
          var lastNewLine = null;
          var ch = src[end - 1];

          while (ch === '\n' || ch === '\t' || ch === ' ') {
            end -= 1;

            if (end <= start) {
              if (this.chomping === Chomp.KEEP) break;else return ''; // probably never happens
            }

            if (ch === '\n') lastNewLine = end;
            ch = src[end - 1];
          }

          var keepStart = end + 1;

          if (lastNewLine) {
            if (this.chomping === Chomp.KEEP) {
              keepStart = lastNewLine;
              end = this.valueRange.end;
            } else {
              end = lastNewLine;
            }
          }

          var bi = indent + this.blockIndent;
          var folded = this.type === Type.BLOCK_FOLDED;
          var atStart = true;
          var str = '';
          var sep = '';
          var prevMoreIndented = false;

          for (var i = start; i < end; ++i) {
            for (var j = 0; j < bi; ++j) {
              if (src[i] !== ' ') break;
              i += 1;
            }

            var _ch = src[i];

            if (_ch === '\n') {
              if (sep === '\n') str += '\n';else sep = '\n';
            } else {
              var lineEnd = Node$1.endOfLine(src, i);
              var line = src.slice(i, lineEnd);
              i = lineEnd;

              if (folded && (_ch === ' ' || _ch === '\t') && i < keepStart) {
                if (sep === ' ') sep = '\n';else if (!prevMoreIndented && !atStart && sep === '\n') sep = '\n\n';
                str += sep + line; //+ ((lineEnd < end && src[lineEnd]) || '')

                sep = lineEnd < end && src[lineEnd] || '';
                prevMoreIndented = true;
              } else {
                str += sep + line;
                sep = folded && i < keepStart ? ' ' : '\n';
                prevMoreIndented = false;
              }

              if (atStart && line !== '') atStart = false;
            }
          }

          return this.chomping === Chomp.STRIP ? str : str + '\n';
        }
      }, {
        key: "parseBlockHeader",
        value: function parseBlockHeader(start) {
          var src = this.context.src;
          var offset = start + 1;
          var bi = '';

          while (true) {
            var ch = src[offset];

            switch (ch) {
              case '-':
                this.chomping = Chomp.STRIP;
                break;

              case '+':
                this.chomping = Chomp.KEEP;
                break;

              case '0':
              case '1':
              case '2':
              case '3':
              case '4':
              case '5':
              case '6':
              case '7':
              case '8':
              case '9':
                bi += ch;
                break;

              default:
                this.blockIndent = Number(bi) || null;
                this.header = new Range(start, offset);
                return offset;
            }

            offset += 1;
          }
        }
      }, {
        key: "parseBlockValue",
        value: function parseBlockValue(start) {
          var _this$context2 = this.context,
              indent = _this$context2.indent,
              src = _this$context2.src;
          var explicit = !!this.blockIndent;
          var offset = start;
          var valueEnd = start;
          var minBlockIndent = 1;

          for (var ch = src[offset]; ch === '\n'; ch = src[offset]) {
            offset += 1;
            if (Node$1.atDocumentBoundary(src, offset)) break;
            var end = Node$1.endOfBlockIndent(src, indent, offset); // should not include tab?

            if (end === null) break;
            var _ch2 = src[end];
            var lineIndent = end - (offset + indent);

            if (!this.blockIndent) {
              // no explicit block indent, none yet detected
              if (src[end] !== '\n') {
                // first line with non-whitespace content
                if (lineIndent < minBlockIndent) {
                  var msg = 'Block scalars with more-indented leading empty lines must use an explicit indentation indicator';
                  this.error = new YAMLSemanticError(this, msg);
                }

                this.blockIndent = lineIndent;
              } else if (lineIndent > minBlockIndent) {
                // empty line with more whitespace
                minBlockIndent = lineIndent;
              }
            } else if (_ch2 && _ch2 !== '\n' && lineIndent < this.blockIndent) {
              if (src[end] === '#') break;

              if (!this.error) {
                var _src = explicit ? 'explicit indentation indicator' : 'first line';

                var _msg = "Block scalars must not be less indented than their ".concat(_src);

                this.error = new YAMLSemanticError(this, _msg);
              }
            }

            if (src[end] === '\n') {
              offset = end;
            } else {
              offset = valueEnd = Node$1.endOfLine(src, end);
            }
          }

          if (this.chomping !== Chomp.KEEP) {
            offset = src[valueEnd] ? valueEnd + 1 : valueEnd;
          }

          this.valueRange = new Range(start + 1, offset);
          return offset;
        }
        /**
         * Parses a block value from the source
         *
         * Accepted forms are:
         * ```
         * BS
         * block
         * lines
         *
         * BS #comment
         * block
         * lines
         * ```
         * where the block style BS matches the regexp `[|>][-+1-9]*` and block lines
         * are empty or have an indent level greater than `indent`.
         *
         * @param {ParseContext} context
         * @param {number} start - Index of first character
         * @returns {number} - Index of the character after this block
         */

      }, {
        key: "parse",
        value: function parse(context, start) {
          this.context = context;
          var src = context.src;
          var offset = this.parseBlockHeader(start);
          offset = Node$1.endOfWhiteSpace(src, offset);
          offset = this.parseComment(offset);
          offset = this.parseBlockValue(offset);
          return offset;
        }
      }, {
        key: "setOrigRanges",
        value: function setOrigRanges(cr, offset) {
          offset = _get(_getPrototypeOf(BlockValue.prototype), "setOrigRanges", this).call(this, cr, offset);
          return this.header ? this.header.setOrigRange(cr, offset) : offset;
        }
      }]);

      return BlockValue;
    }(Node$1);

    var FlowCollection = /*#__PURE__*/function (_Node) {
      _inherits(FlowCollection, _Node);

      var _super = _createSuper(FlowCollection);

      function FlowCollection(type, props) {
        var _this;

        _classCallCheck(this, FlowCollection);

        _this = _super.call(this, type, props);
        _this.items = null;
        return _this;
      }

      _createClass(FlowCollection, [{
        key: "prevNodeIsJsonLike",
        value: function prevNodeIsJsonLike() {
          var idx = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.items.length;
          var node = this.items[idx - 1];
          return !!node && (node.jsonLike || node.type === Type.COMMENT && this.prevNodeIsJsonLike(idx - 1));
        }
        /**
         * @param {ParseContext} context
         * @param {number} start - Index of first character
         * @returns {number} - Index of the character after this
         */

      }, {
        key: "parse",
        value: function parse(context, start) {
          this.context = context;
          var parseNode = context.parseNode,
              src = context.src;
          var indent = context.indent,
              lineStart = context.lineStart;
          var char = src[start]; // { or [

          this.items = [{
            char: char,
            offset: start
          }];
          var offset = Node$1.endOfWhiteSpace(src, start + 1);
          char = src[offset];

          while (char && char !== ']' && char !== '}') {
            switch (char) {
              case '\n':
                {
                  lineStart = offset + 1;
                  var wsEnd = Node$1.endOfWhiteSpace(src, lineStart);

                  if (src[wsEnd] === '\n') {
                    var blankLine = new BlankLine();
                    lineStart = blankLine.parse({
                      src: src
                    }, lineStart);
                    this.items.push(blankLine);
                  }

                  offset = Node$1.endOfIndent(src, lineStart);

                  if (offset <= lineStart + indent) {
                    char = src[offset];

                    if (offset < lineStart + indent || char !== ']' && char !== '}') {
                      var msg = 'Insufficient indentation in flow collection';
                      this.error = new YAMLSemanticError(this, msg);
                    }
                  }
                }
                break;

              case ',':
                {
                  this.items.push({
                    char: char,
                    offset: offset
                  });
                  offset += 1;
                }
                break;

              case '#':
                {
                  var comment = new Comment();
                  offset = comment.parse({
                    src: src
                  }, offset);
                  this.items.push(comment);
                }
                break;

              case '?':
              case ':':
                {
                  var next = src[offset + 1];

                  if (next === '\n' || next === '\t' || next === ' ' || next === ',' || // in-flow : after JSON-like key does not need to be followed by whitespace
                  char === ':' && this.prevNodeIsJsonLike()) {
                    this.items.push({
                      char: char,
                      offset: offset
                    });
                    offset += 1;
                    break;
                  }
                }
              // fallthrough

              default:
                {
                  var node = parseNode({
                    atLineStart: false,
                    inCollection: false,
                    inFlow: true,
                    indent: -1,
                    lineStart: lineStart,
                    parent: this
                  }, offset);

                  if (!node) {
                    // at next document start
                    this.valueRange = new Range(start, offset);
                    return offset;
                  }

                  this.items.push(node);
                  offset = Node$1.normalizeOffset(src, node.range.end);
                }
            }

            offset = Node$1.endOfWhiteSpace(src, offset);
            char = src[offset];
          }

          this.valueRange = new Range(start, offset + 1);

          if (char) {
            this.items.push({
              char: char,
              offset: offset
            });
            offset = Node$1.endOfWhiteSpace(src, offset + 1);
            offset = this.parseComment(offset);
          }

          return offset;
        }
      }, {
        key: "setOrigRanges",
        value: function setOrigRanges(cr, offset) {
          offset = _get(_getPrototypeOf(FlowCollection.prototype), "setOrigRanges", this).call(this, cr, offset);
          this.items.forEach(function (node) {
            if (node instanceof Node$1) {
              offset = node.setOrigRanges(cr, offset);
            } else if (cr.length === 0) {
              node.origOffset = node.offset;
            } else {
              var i = offset;

              while (i < cr.length) {
                if (cr[i] > node.offset) break;else ++i;
              }

              node.origOffset = node.offset + i;
              offset = i;
            }
          });
          return offset;
        }
      }, {
        key: "toString",
        value: function toString() {
          var src = this.context.src,
              items = this.items,
              range = this.range,
              value = this.value;
          if (value != null) return value;
          var nodes = items.filter(function (item) {
            return item instanceof Node$1;
          });
          var str = '';
          var prevEnd = range.start;
          nodes.forEach(function (node) {
            var prefix = src.slice(prevEnd, node.range.start);
            prevEnd = node.range.end;
            str += prefix + String(node);

            if (str[str.length - 1] === '\n' && src[prevEnd - 1] !== '\n' && src[prevEnd] === '\n') {
              // Comment range does not include the terminal newline, but its
              // stringified value does. Without this fix, newlines at comment ends
              // get duplicated.
              prevEnd += 1;
            }
          });
          str += src.slice(prevEnd, range.end);
          return Node$1.addStringTerminator(src, range.end, str);
        }
      }]);

      return FlowCollection;
    }(Node$1);

    var QuoteDouble = /*#__PURE__*/function (_Node) {
      _inherits(QuoteDouble, _Node);

      var _super = _createSuper(QuoteDouble);

      function QuoteDouble() {
        _classCallCheck(this, QuoteDouble);

        return _super.apply(this, arguments);
      }

      _createClass(QuoteDouble, [{
        key: "strValue",
        get:
        /**
         * @returns {string | { str: string, errors: YAMLSyntaxError[] }}
         */
        function get() {
          if (!this.valueRange || !this.context) return null;
          var errors = [];
          var _this$valueRange = this.valueRange,
              start = _this$valueRange.start,
              end = _this$valueRange.end;
          var _this$context = this.context,
              indent = _this$context.indent,
              src = _this$context.src;
          if (src[end - 1] !== '"') errors.push(new YAMLSyntaxError(this, 'Missing closing "quote')); // Using String#replace is too painful with escaped newlines preceded by
          // escaped backslashes; also, this should be faster.

          var str = '';

          for (var i = start + 1; i < end - 1; ++i) {
            var ch = src[i];

            if (ch === '\n') {
              if (Node$1.atDocumentBoundary(src, i + 1)) errors.push(new YAMLSemanticError(this, 'Document boundary indicators are not allowed within string values'));

              var _Node$foldNewline = Node$1.foldNewline(src, i, indent),
                  fold = _Node$foldNewline.fold,
                  offset = _Node$foldNewline.offset,
                  error = _Node$foldNewline.error;

              str += fold;
              i = offset;
              if (error) errors.push(new YAMLSemanticError(this, 'Multi-line double-quoted string needs to be sufficiently indented'));
            } else if (ch === '\\') {
              i += 1;

              switch (src[i]) {
                case '0':
                  str += '\0';
                  break;
                // null character

                case 'a':
                  str += '\x07';
                  break;
                // bell character

                case 'b':
                  str += '\b';
                  break;
                // backspace

                case 'e':
                  str += '\x1b';
                  break;
                // escape character

                case 'f':
                  str += '\f';
                  break;
                // form feed

                case 'n':
                  str += '\n';
                  break;
                // line feed

                case 'r':
                  str += '\r';
                  break;
                // carriage return

                case 't':
                  str += '\t';
                  break;
                // horizontal tab

                case 'v':
                  str += '\v';
                  break;
                // vertical tab

                case 'N':
                  str += "\x85";
                  break;
                // Unicode next line

                case '_':
                  str += "\xA0";
                  break;
                // Unicode non-breaking space

                case 'L':
                  str += "\u2028";
                  break;
                // Unicode line separator

                case 'P':
                  str += "\u2029";
                  break;
                // Unicode paragraph separator

                case ' ':
                  str += ' ';
                  break;

                case '"':
                  str += '"';
                  break;

                case '/':
                  str += '/';
                  break;

                case '\\':
                  str += '\\';
                  break;

                case '\t':
                  str += '\t';
                  break;

                case 'x':
                  str += this.parseCharCode(i + 1, 2, errors);
                  i += 2;
                  break;

                case 'u':
                  str += this.parseCharCode(i + 1, 4, errors);
                  i += 4;
                  break;

                case 'U':
                  str += this.parseCharCode(i + 1, 8, errors);
                  i += 8;
                  break;

                case '\n':
                  // skip escaped newlines, but still trim the following line
                  while (src[i + 1] === ' ' || src[i + 1] === '\t') {
                    i += 1;
                  }

                  break;

                default:
                  errors.push(new YAMLSyntaxError(this, "Invalid escape sequence ".concat(src.substr(i - 1, 2))));
                  str += '\\' + src[i];
              }
            } else if (ch === ' ' || ch === '\t') {
              // trim trailing whitespace
              var wsStart = i;
              var next = src[i + 1];

              while (next === ' ' || next === '\t') {
                i += 1;
                next = src[i + 1];
              }

              if (next !== '\n') str += i > wsStart ? src.slice(wsStart, i + 1) : ch;
            } else {
              str += ch;
            }
          }

          return errors.length > 0 ? {
            errors: errors,
            str: str
          } : str;
        }
      }, {
        key: "parseCharCode",
        value: function parseCharCode(offset, length, errors) {
          var src = this.context.src;
          var cc = src.substr(offset, length);
          var ok = cc.length === length && /^[0-9a-fA-F]+$/.test(cc);
          var code = ok ? parseInt(cc, 16) : NaN;

          if (isNaN(code)) {
            errors.push(new YAMLSyntaxError(this, "Invalid escape sequence ".concat(src.substr(offset - 2, length + 2))));
            return src.substr(offset - 2, length + 2);
          }

          return String.fromCodePoint(code);
        }
        /**
         * Parses a "double quoted" value from the source
         *
         * @param {ParseContext} context
         * @param {number} start - Index of first character
         * @returns {number} - Index of the character after this scalar
         */

      }, {
        key: "parse",
        value: function parse(context, start) {
          this.context = context;
          var src = context.src;
          var offset = QuoteDouble.endOfQuote(src, start + 1);
          this.valueRange = new Range(start, offset);
          offset = Node$1.endOfWhiteSpace(src, offset);
          offset = this.parseComment(offset);
          return offset;
        }
      }], [{
        key: "endOfQuote",
        value: function endOfQuote(src, offset) {
          var ch = src[offset];

          while (ch && ch !== '"') {
            offset += ch === '\\' ? 2 : 1;
            ch = src[offset];
          }

          return offset + 1;
        }
      }]);

      return QuoteDouble;
    }(Node$1);

    var QuoteSingle = /*#__PURE__*/function (_Node) {
      _inherits(QuoteSingle, _Node);

      var _super = _createSuper(QuoteSingle);

      function QuoteSingle() {
        _classCallCheck(this, QuoteSingle);

        return _super.apply(this, arguments);
      }

      _createClass(QuoteSingle, [{
        key: "strValue",
        get:
        /**
         * @returns {string | { str: string, errors: YAMLSyntaxError[] }}
         */
        function get() {
          if (!this.valueRange || !this.context) return null;
          var errors = [];
          var _this$valueRange = this.valueRange,
              start = _this$valueRange.start,
              end = _this$valueRange.end;
          var _this$context = this.context,
              indent = _this$context.indent,
              src = _this$context.src;
          if (src[end - 1] !== "'") errors.push(new YAMLSyntaxError(this, "Missing closing 'quote"));
          var str = '';

          for (var i = start + 1; i < end - 1; ++i) {
            var ch = src[i];

            if (ch === '\n') {
              if (Node$1.atDocumentBoundary(src, i + 1)) errors.push(new YAMLSemanticError(this, 'Document boundary indicators are not allowed within string values'));

              var _Node$foldNewline = Node$1.foldNewline(src, i, indent),
                  fold = _Node$foldNewline.fold,
                  offset = _Node$foldNewline.offset,
                  error = _Node$foldNewline.error;

              str += fold;
              i = offset;
              if (error) errors.push(new YAMLSemanticError(this, 'Multi-line single-quoted string needs to be sufficiently indented'));
            } else if (ch === "'") {
              str += ch;
              i += 1;
              if (src[i] !== "'") errors.push(new YAMLSyntaxError(this, 'Unescaped single quote? This should not happen.'));
            } else if (ch === ' ' || ch === '\t') {
              // trim trailing whitespace
              var wsStart = i;
              var next = src[i + 1];

              while (next === ' ' || next === '\t') {
                i += 1;
                next = src[i + 1];
              }

              if (next !== '\n') str += i > wsStart ? src.slice(wsStart, i + 1) : ch;
            } else {
              str += ch;
            }
          }

          return errors.length > 0 ? {
            errors: errors,
            str: str
          } : str;
        }
        /**
         * Parses a 'single quoted' value from the source
         *
         * @param {ParseContext} context
         * @param {number} start - Index of first character
         * @returns {number} - Index of the character after this scalar
         */

      }, {
        key: "parse",
        value: function parse(context, start) {
          this.context = context;
          var src = context.src;
          var offset = QuoteSingle.endOfQuote(src, start + 1);
          this.valueRange = new Range(start, offset);
          offset = Node$1.endOfWhiteSpace(src, offset);
          offset = this.parseComment(offset);
          return offset;
        }
      }], [{
        key: "endOfQuote",
        value: function endOfQuote(src, offset) {
          var ch = src[offset];

          while (ch) {
            if (ch === "'") {
              if (src[offset + 1] !== "'") break;
              ch = src[offset += 2];
            } else {
              ch = src[offset += 1];
            }
          }

          return offset + 1;
        }
      }]);

      return QuoteSingle;
    }(Node$1);

    function createNewNode(type, props) {
      switch (type) {
        case Type.ALIAS:
          return new Alias$1(type, props);

        case Type.BLOCK_FOLDED:
        case Type.BLOCK_LITERAL:
          return new BlockValue(type, props);

        case Type.FLOW_MAP:
        case Type.FLOW_SEQ:
          return new FlowCollection(type, props);

        case Type.MAP_KEY:
        case Type.MAP_VALUE:
        case Type.SEQ_ITEM:
          return new CollectionItem(type, props);

        case Type.COMMENT:
        case Type.PLAIN:
          return new PlainValue(type, props);

        case Type.QUOTE_DOUBLE:
          return new QuoteDouble(type, props);

        case Type.QUOTE_SINGLE:
          return new QuoteSingle(type, props);

        /* istanbul ignore next */

        default:
          return null;
        // should never happen
      }
    }
    /**
     * @param {boolean} atLineStart - Node starts at beginning of line
     * @param {boolean} inFlow - true if currently in a flow context
     * @param {boolean} inCollection - true if currently in a collection context
     * @param {number} indent - Current level of indentation
     * @param {number} lineStart - Start of the current line
     * @param {Node} parent - The parent of the node
     * @param {string} src - Source of the YAML document
     */


    var ParseContext = /*#__PURE__*/function () {
      function ParseContext() {
        var _this = this;

        var orig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            atLineStart = _ref.atLineStart,
            inCollection = _ref.inCollection,
            inFlow = _ref.inFlow,
            indent = _ref.indent,
            lineStart = _ref.lineStart,
            parent = _ref.parent;

        _classCallCheck(this, ParseContext);

        _defineProperty(this, "parseNode", function (overlay, start) {
          if (Node$1.atDocumentBoundary(_this.src, start)) return null;
          var context = new ParseContext(_this, overlay);

          var _context$parseProps = context.parseProps(start),
              props = _context$parseProps.props,
              type = _context$parseProps.type,
              valueStart = _context$parseProps.valueStart;

          var node = createNewNode(type, props);
          var offset = node.parse(context, valueStart);
          node.range = new Range(start, offset);
          /* istanbul ignore if */

          if (offset <= start) {
            // This should never happen, but if it does, let's make sure to at least
            // step one character forward to avoid a busy loop.
            node.error = new Error("Node#parse consumed no characters");
            node.error.parseEnd = offset;
            node.error.source = node;
            node.range.end = start + 1;
          }

          if (context.nodeStartsCollection(node)) {
            if (!node.error && !context.atLineStart && context.parent.type === Type.DOCUMENT) {
              node.error = new YAMLSyntaxError(node, 'Block collection must not have preceding content here (e.g. directives-end indicator)');
            }

            var collection = new Collection$1(node);
            offset = collection.parse(new ParseContext(context), offset);
            collection.range = new Range(start, offset);
            return collection;
          }

          return node;
        });

        this.atLineStart = atLineStart != null ? atLineStart : orig.atLineStart || false;
        this.inCollection = inCollection != null ? inCollection : orig.inCollection || false;
        this.inFlow = inFlow != null ? inFlow : orig.inFlow || false;
        this.indent = indent != null ? indent : orig.indent;
        this.lineStart = lineStart != null ? lineStart : orig.lineStart;
        this.parent = parent != null ? parent : orig.parent || {};
        this.root = orig.root;
        this.src = orig.src;
      }

      _createClass(ParseContext, [{
        key: "nodeStartsCollection",
        value: function nodeStartsCollection(node) {
          var inCollection = this.inCollection,
              inFlow = this.inFlow,
              src = this.src;
          if (inCollection || inFlow) return false;
          if (node instanceof CollectionItem) return true; // check for implicit key

          var offset = node.range.end;
          if (src[offset] === '\n' || src[offset - 1] === '\n') return false;
          offset = Node$1.endOfWhiteSpace(src, offset);
          return src[offset] === ':';
        } // Anchor and tag are before type, which determines the node implementation
        // class; hence this intermediate step.

      }, {
        key: "parseProps",
        value: function parseProps(offset) {
          var inFlow = this.inFlow,
              parent = this.parent,
              src = this.src;
          var props = [];
          var lineHasProps = false;
          offset = this.atLineStart ? Node$1.endOfIndent(src, offset) : Node$1.endOfWhiteSpace(src, offset);
          var ch = src[offset];

          while (ch === Char.ANCHOR || ch === Char.COMMENT || ch === Char.TAG || ch === '\n') {
            if (ch === '\n') {
              var inEnd = offset;
              var lineStart = void 0;

              do {
                lineStart = inEnd + 1;
                inEnd = Node$1.endOfIndent(src, lineStart);
              } while (src[inEnd] === '\n');

              var indentDiff = inEnd - (lineStart + this.indent);
              var noIndicatorAsIndent = parent.type === Type.SEQ_ITEM && parent.context.atLineStart;
              if (src[inEnd] !== '#' && !Node$1.nextNodeIsIndented(src[inEnd], indentDiff, !noIndicatorAsIndent)) break;
              this.atLineStart = true;
              this.lineStart = lineStart;
              lineHasProps = false;
              offset = inEnd;
            } else if (ch === Char.COMMENT) {
              var end = Node$1.endOfLine(src, offset + 1);
              props.push(new Range(offset, end));
              offset = end;
            } else {
              var _end = Node$1.endOfIdentifier(src, offset + 1);

              if (ch === Char.TAG && src[_end] === ',' && /^[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+,\d\d\d\d(-\d\d){0,2}\/\S/.test(src.slice(offset + 1, _end + 13))) {
                // Let's presume we're dealing with a YAML 1.0 domain tag here, rather
                // than an empty but 'foo.bar' private-tagged node in a flow collection
                // followed without whitespace by a plain string starting with a year
                // or date divided by something.
                _end = Node$1.endOfIdentifier(src, _end + 5);
              }

              props.push(new Range(offset, _end));
              lineHasProps = true;
              offset = Node$1.endOfWhiteSpace(src, _end);
            }

            ch = src[offset];
          } // '- &a : b' has an anchor on an empty node


          if (lineHasProps && ch === ':' && Node$1.atBlank(src, offset + 1, true)) offset -= 1;
          var type = ParseContext.parseType(src, offset, inFlow);
          return {
            props: props,
            type: type,
            valueStart: offset
          };
        }
        /**
         * Parses a node from the source
         * @param {ParseContext} overlay
         * @param {number} start - Index of first non-whitespace character for the node
         * @returns {?Node} - null if at a document boundary
         */

      }], [{
        key: "parseType",
        value: function parseType(src, offset, inFlow) {
          switch (src[offset]) {
            case '*':
              return Type.ALIAS;

            case '>':
              return Type.BLOCK_FOLDED;

            case '|':
              return Type.BLOCK_LITERAL;

            case '{':
              return Type.FLOW_MAP;

            case '[':
              return Type.FLOW_SEQ;

            case '?':
              return !inFlow && Node$1.atBlank(src, offset + 1, true) ? Type.MAP_KEY : Type.PLAIN;

            case ':':
              return !inFlow && Node$1.atBlank(src, offset + 1, true) ? Type.MAP_VALUE : Type.PLAIN;

            case '-':
              return !inFlow && Node$1.atBlank(src, offset + 1, true) ? Type.SEQ_ITEM : Type.PLAIN;

            case '"':
              return Type.QUOTE_DOUBLE;

            case "'":
              return Type.QUOTE_SINGLE;

            default:
              return Type.PLAIN;
          }
        }
      }]);

      return ParseContext;
    }();

    // Published as 'yaml/parse-cst'
    function parse$1(src) {
      var cr = [];

      if (src.indexOf('\r') !== -1) {
        src = src.replace(/\r\n?/g, function (match, offset) {
          if (match.length > 1) cr.push(offset);
          return '\n';
        });
      }

      var documents = [];
      var offset = 0;

      do {
        var doc = new Document$2();
        var context = new ParseContext({
          src: src
        });
        offset = doc.parse(context, offset);
        documents.push(doc);
      } while (offset < src.length);

      documents.setOrigRanges = function () {
        if (cr.length === 0) return false;

        for (var i = 1; i < cr.length; ++i) {
          cr[i] -= i;
        }

        var crOffset = 0;

        for (var _i = 0; _i < documents.length; ++_i) {
          crOffset = documents[_i].setOrigRanges(cr, crOffset);
        }

        cr.splice(0, cr.length);
        return true;
      };

      documents.toString = function () {
        return documents.join('...\n');
      };

      return documents;
    }

    function addCommentBefore(str, indent, comment) {
      if (!comment) return str;
      var cc = comment.replace(/[\s\S]^/gm, "$&".concat(indent, "#"));
      return "#".concat(cc, "\n").concat(indent).concat(str);
    }
    function addComment(str, indent, comment) {
      return !comment ? str : comment.indexOf('\n') === -1 ? "".concat(str, " #").concat(comment) : "".concat(str, "\n") + comment.replace(/^/gm, "".concat(indent || '', "#"));
    }

    var Node = function Node() {
      _classCallCheck(this, Node);
    };

    function toJSON(value, arg, ctx) {
      if (Array.isArray(value)) return value.map(function (v, i) {
        return toJSON(v, String(i), ctx);
      });

      if (value && typeof value.toJSON === 'function') {
        var anchor = ctx && ctx.anchors && ctx.anchors.get(value);
        if (anchor) ctx.onCreate = function (res) {
          anchor.res = res;
          delete ctx.onCreate;
        };
        var res = value.toJSON(arg, ctx);
        if (anchor && ctx.onCreate) ctx.onCreate(res);
        return res;
      }

      if ((!ctx || !ctx.keep) && typeof value === 'bigint') return Number(value);
      return value;
    }

    var Scalar = /*#__PURE__*/function (_Node) {
      _inherits(Scalar, _Node);

      var _super = _createSuper(Scalar);

      function Scalar(value) {
        var _this;

        _classCallCheck(this, Scalar);

        _this = _super.call(this);
        _this.value = value;
        return _this;
      }

      _createClass(Scalar, [{
        key: "toJSON",
        value: function toJSON$1(arg, ctx) {
          return ctx && ctx.keep ? this.value : toJSON(this.value, arg, ctx);
        }
      }, {
        key: "toString",
        value: function toString() {
          return String(this.value);
        }
      }]);

      return Scalar;
    }(Node);

    function collectionFromPath(schema, path, value) {
      var v = value;

      for (var i = path.length - 1; i >= 0; --i) {
        var k = path[i];

        if (Number.isInteger(k) && k >= 0) {
          var a = [];
          a[k] = v;
          v = a;
        } else {
          var o = {};
          Object.defineProperty(o, k, {
            value: v,
            writable: true,
            enumerable: true,
            configurable: true
          });
          v = o;
        }
      }

      return schema.createNode(v, false);
    } // null, undefined, or an empty non-string iterable (e.g. [])


    var isEmptyPath = function isEmptyPath(path) {
      return path == null || _typeof(path) === 'object' && path[Symbol.iterator]().next().done;
    };
    var Collection = /*#__PURE__*/function (_Node) {
      _inherits(Collection, _Node);

      var _super = _createSuper(Collection);

      function Collection(schema) {
        var _this;

        _classCallCheck(this, Collection);

        _this = _super.call(this);

        _defineProperty(_assertThisInitialized(_this), "items", []);

        _this.schema = schema;
        return _this;
      }

      _createClass(Collection, [{
        key: "addIn",
        value: function addIn(path, value) {
          if (isEmptyPath(path)) this.add(value);else {
            var _path = _toArray(path),
                key = _path[0],
                rest = _path.slice(1);

            var node = this.get(key, true);
            if (node instanceof Collection) node.addIn(rest, value);else if (node === undefined && this.schema) this.set(key, collectionFromPath(this.schema, rest, value));else throw new Error("Expected YAML collection at ".concat(key, ". Remaining path: ").concat(rest));
          }
        }
      }, {
        key: "deleteIn",
        value: function deleteIn(_ref) {
          var _ref2 = _toArray(_ref),
              key = _ref2[0],
              rest = _ref2.slice(1);

          if (rest.length === 0) return this.delete(key);
          var node = this.get(key, true);
          if (node instanceof Collection) return node.deleteIn(rest);else throw new Error("Expected YAML collection at ".concat(key, ". Remaining path: ").concat(rest));
        }
      }, {
        key: "getIn",
        value: function getIn(_ref3, keepScalar) {
          var _ref4 = _toArray(_ref3),
              key = _ref4[0],
              rest = _ref4.slice(1);

          var node = this.get(key, true);
          if (rest.length === 0) return !keepScalar && node instanceof Scalar ? node.value : node;else return node instanceof Collection ? node.getIn(rest, keepScalar) : undefined;
        }
      }, {
        key: "hasAllNullValues",
        value: function hasAllNullValues() {
          return this.items.every(function (node) {
            if (!node || node.type !== 'PAIR') return false;
            var n = node.value;
            return n == null || n instanceof Scalar && n.value == null && !n.commentBefore && !n.comment && !n.tag;
          });
        }
      }, {
        key: "hasIn",
        value: function hasIn(_ref5) {
          var _ref6 = _toArray(_ref5),
              key = _ref6[0],
              rest = _ref6.slice(1);

          if (rest.length === 0) return this.has(key);
          var node = this.get(key, true);
          return node instanceof Collection ? node.hasIn(rest) : false;
        }
      }, {
        key: "setIn",
        value: function setIn(_ref7, value) {
          var _ref8 = _toArray(_ref7),
              key = _ref8[0],
              rest = _ref8.slice(1);

          if (rest.length === 0) {
            this.set(key, value);
          } else {
            var node = this.get(key, true);
            if (node instanceof Collection) node.setIn(rest, value);else if (node === undefined && this.schema) this.set(key, collectionFromPath(this.schema, rest, value));else throw new Error("Expected YAML collection at ".concat(key, ". Remaining path: ").concat(rest));
          }
        } // overridden in implementations

        /* istanbul ignore next */

      }, {
        key: "toJSON",
        value: function toJSON() {
          return null;
        }
      }, {
        key: "toString",
        value: function toString(ctx, _ref9, onComment, onChompKeep) {
          var _this2 = this;

          var blockItem = _ref9.blockItem,
              flowChars = _ref9.flowChars,
              isMap = _ref9.isMap,
              itemIndent = _ref9.itemIndent;
          var _ctx = ctx,
              indent = _ctx.indent,
              indentStep = _ctx.indentStep,
              stringify = _ctx.stringify;
          var inFlow = this.type === Type.FLOW_MAP || this.type === Type.FLOW_SEQ || ctx.inFlow;
          if (inFlow) itemIndent += indentStep;
          var allNullValues = isMap && this.hasAllNullValues();
          ctx = Object.assign({}, ctx, {
            allNullValues: allNullValues,
            indent: itemIndent,
            inFlow: inFlow,
            type: null
          });
          var chompKeep = false;
          var hasItemWithNewLine = false;
          var nodes = this.items.reduce(function (nodes, item, i) {
            var comment;

            if (item) {
              if (!chompKeep && item.spaceBefore) nodes.push({
                type: 'comment',
                str: ''
              });
              if (item.commentBefore) item.commentBefore.match(/^.*$/gm).forEach(function (line) {
                nodes.push({
                  type: 'comment',
                  str: "#".concat(line)
                });
              });
              if (item.comment) comment = item.comment;
              if (inFlow && (!chompKeep && item.spaceBefore || item.commentBefore || item.comment || item.key && (item.key.commentBefore || item.key.comment) || item.value && (item.value.commentBefore || item.value.comment))) hasItemWithNewLine = true;
            }

            chompKeep = false;
            var str = stringify(item, ctx, function () {
              return comment = null;
            }, function () {
              return chompKeep = true;
            });
            if (inFlow && !hasItemWithNewLine && str.includes('\n')) hasItemWithNewLine = true;
            if (inFlow && i < _this2.items.length - 1) str += ',';
            str = addComment(str, itemIndent, comment);
            if (chompKeep && (comment || inFlow)) chompKeep = false;
            nodes.push({
              type: 'item',
              str: str
            });
            return nodes;
          }, []);
          var str;

          if (nodes.length === 0) {
            str = flowChars.start + flowChars.end;
          } else if (inFlow) {
            var start = flowChars.start,
                end = flowChars.end;
            var strings = nodes.map(function (n) {
              return n.str;
            });

            if (hasItemWithNewLine || strings.reduce(function (sum, str) {
              return sum + str.length + 2;
            }, 2) > Collection.maxFlowStringSingleLineLength) {
              str = start;

              var _iterator = _createForOfIteratorHelper(strings),
                  _step;

              try {
                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                  var s = _step.value;
                  str += s ? "\n".concat(indentStep).concat(indent).concat(s) : '\n';
                }
              } catch (err) {
                _iterator.e(err);
              } finally {
                _iterator.f();
              }

              str += "\n".concat(indent).concat(end);
            } else {
              str = "".concat(start, " ").concat(strings.join(' '), " ").concat(end);
            }
          } else {
            var _strings = nodes.map(blockItem);

            str = _strings.shift();

            var _iterator2 = _createForOfIteratorHelper(_strings),
                _step2;

            try {
              for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                var _s = _step2.value;
                str += _s ? "\n".concat(indent).concat(_s) : '\n';
              }
            } catch (err) {
              _iterator2.e(err);
            } finally {
              _iterator2.f();
            }
          }

          if (this.comment) {
            str += '\n' + this.comment.replace(/^/gm, "".concat(indent, "#"));
            if (onComment) onComment();
          } else if (chompKeep && onChompKeep) onChompKeep();

          return str;
        }
      }]);

      return Collection;
    }(Node);

    _defineProperty(Collection, "maxFlowStringSingleLineLength", 60);

    function asItemIndex(key) {
      var idx = key instanceof Scalar ? key.value : key;
      if (idx && typeof idx === 'string') idx = Number(idx);
      return Number.isInteger(idx) && idx >= 0 ? idx : null;
    }

    var YAMLSeq = /*#__PURE__*/function (_Collection) {
      _inherits(YAMLSeq, _Collection);

      var _super = _createSuper(YAMLSeq);

      function YAMLSeq() {
        _classCallCheck(this, YAMLSeq);

        return _super.apply(this, arguments);
      }

      _createClass(YAMLSeq, [{
        key: "add",
        value: function add(value) {
          this.items.push(value);
        }
      }, {
        key: "delete",
        value: function _delete(key) {
          var idx = asItemIndex(key);
          if (typeof idx !== 'number') return false;
          var del = this.items.splice(idx, 1);
          return del.length > 0;
        }
      }, {
        key: "get",
        value: function get(key, keepScalar) {
          var idx = asItemIndex(key);
          if (typeof idx !== 'number') return undefined;
          var it = this.items[idx];
          return !keepScalar && it instanceof Scalar ? it.value : it;
        }
      }, {
        key: "has",
        value: function has(key) {
          var idx = asItemIndex(key);
          return typeof idx === 'number' && idx < this.items.length;
        }
      }, {
        key: "set",
        value: function set(key, value) {
          var idx = asItemIndex(key);
          if (typeof idx !== 'number') throw new Error("Expected a valid index, not ".concat(key, "."));
          this.items[idx] = value;
        }
      }, {
        key: "toJSON",
        value: function toJSON$1(_, ctx) {
          var seq = [];
          if (ctx && ctx.onCreate) ctx.onCreate(seq);
          var i = 0;

          var _iterator = _createForOfIteratorHelper(this.items),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var item = _step.value;
              seq.push(toJSON(item, String(i++), ctx));
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }

          return seq;
        }
      }, {
        key: "toString",
        value: function toString(ctx, onComment, onChompKeep) {
          if (!ctx) return JSON.stringify(this);
          return _get(_getPrototypeOf(YAMLSeq.prototype), "toString", this).call(this, ctx, {
            blockItem: function blockItem(n) {
              return n.type === 'comment' ? n.str : "- ".concat(n.str);
            },
            flowChars: {
              start: '[',
              end: ']'
            },
            isMap: false,
            itemIndent: (ctx.indent || '') + '  '
          }, onComment, onChompKeep);
        }
      }]);

      return YAMLSeq;
    }(Collection);

    var stringifyKey = function stringifyKey(key, jsKey, ctx) {
      if (jsKey === null) return '';
      if (_typeof(jsKey) !== 'object') return String(jsKey);
      if (key instanceof Node && ctx && ctx.doc) return key.toString({
        anchors: Object.create(null),
        doc: ctx.doc,
        indent: '',
        indentStep: ctx.indentStep,
        inFlow: true,
        inStringifyKey: true,
        stringify: ctx.stringify
      });
      return JSON.stringify(jsKey);
    };

    var Pair = /*#__PURE__*/function (_Node) {
      _inherits(Pair, _Node);

      var _super = _createSuper(Pair);

      function Pair(key) {
        var _this;

        var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        _classCallCheck(this, Pair);

        _this = _super.call(this);
        _this.key = key;
        _this.value = value;
        _this.type = Pair.Type.PAIR;
        return _this;
      }

      _createClass(Pair, [{
        key: "commentBefore",
        get: function get() {
          return this.key instanceof Node ? this.key.commentBefore : undefined;
        },
        set: function set(cb) {
          if (this.key == null) this.key = new Scalar(null);
          if (this.key instanceof Node) this.key.commentBefore = cb;else {
            var msg = 'Pair.commentBefore is an alias for Pair.key.commentBefore. To set it, the key must be a Node.';
            throw new Error(msg);
          }
        }
      }, {
        key: "addToJSMap",
        value: function addToJSMap(ctx, map) {
          var key = toJSON(this.key, '', ctx);

          if (map instanceof Map) {
            var value = toJSON(this.value, key, ctx);
            map.set(key, value);
          } else if (map instanceof Set) {
            map.add(key);
          } else {
            var stringKey = stringifyKey(this.key, key, ctx);

            var _value = toJSON(this.value, stringKey, ctx);

            if (stringKey in map) Object.defineProperty(map, stringKey, {
              value: _value,
              writable: true,
              enumerable: true,
              configurable: true
            });else map[stringKey] = _value;
          }

          return map;
        }
      }, {
        key: "toJSON",
        value: function toJSON(_, ctx) {
          var pair = ctx && ctx.mapAsMap ? new Map() : {};
          return this.addToJSMap(ctx, pair);
        }
      }, {
        key: "toString",
        value: function toString(ctx, onComment, onChompKeep) {
          if (!ctx || !ctx.doc) return JSON.stringify(this);
          var _ctx$doc$options = ctx.doc.options,
              indentSize = _ctx$doc$options.indent,
              indentSeq = _ctx$doc$options.indentSeq,
              simpleKeys = _ctx$doc$options.simpleKeys;
          var key = this.key,
              value = this.value;
          var keyComment = key instanceof Node && key.comment;

          if (simpleKeys) {
            if (keyComment) {
              throw new Error('With simple keys, key nodes cannot have comments');
            }

            if (key instanceof Collection) {
              var msg = 'With simple keys, collection cannot be used as a key value';
              throw new Error(msg);
            }
          }

          var explicitKey = !simpleKeys && (!key || keyComment || (key instanceof Node ? key instanceof Collection || key.type === Type.BLOCK_FOLDED || key.type === Type.BLOCK_LITERAL : _typeof(key) === 'object'));
          var _ctx = ctx,
              doc = _ctx.doc,
              indent = _ctx.indent,
              indentStep = _ctx.indentStep,
              stringify = _ctx.stringify;
          ctx = Object.assign({}, ctx, {
            implicitKey: !explicitKey,
            indent: indent + indentStep
          });
          var chompKeep = false;
          var str = stringify(key, ctx, function () {
            return keyComment = null;
          }, function () {
            return chompKeep = true;
          });
          str = addComment(str, ctx.indent, keyComment);

          if (!explicitKey && str.length > 1024) {
            if (simpleKeys) throw new Error('With simple keys, single line scalar must not span more than 1024 characters');
            explicitKey = true;
          }

          if (ctx.allNullValues && !simpleKeys) {
            if (this.comment) {
              str = addComment(str, ctx.indent, this.comment);
              if (onComment) onComment();
            } else if (chompKeep && !keyComment && onChompKeep) onChompKeep();

            return ctx.inFlow && !explicitKey ? str : "? ".concat(str);
          }

          str = explicitKey ? "? ".concat(str, "\n").concat(indent, ":") : "".concat(str, ":");

          if (this.comment) {
            // expected (but not strictly required) to be a single-line comment
            str = addComment(str, ctx.indent, this.comment);
            if (onComment) onComment();
          }

          var vcb = '';
          var valueComment = null;

          if (value instanceof Node) {
            if (value.spaceBefore) vcb = '\n';

            if (value.commentBefore) {
              var cs = value.commentBefore.replace(/^/gm, "".concat(ctx.indent, "#"));
              vcb += "\n".concat(cs);
            }

            valueComment = value.comment;
          } else if (value && _typeof(value) === 'object') {
            value = doc.schema.createNode(value, true);
          }

          ctx.implicitKey = false;
          if (!explicitKey && !this.comment && value instanceof Scalar) ctx.indentAtStart = str.length + 1;
          chompKeep = false;

          if (!indentSeq && indentSize >= 2 && !ctx.inFlow && !explicitKey && value instanceof YAMLSeq && value.type !== Type.FLOW_SEQ && !value.tag && !doc.anchors.getName(value)) {
            // If indentSeq === false, consider '- ' as part of indentation where possible
            ctx.indent = ctx.indent.substr(2);
          }

          var valueStr = stringify(value, ctx, function () {
            return valueComment = null;
          }, function () {
            return chompKeep = true;
          });
          var ws = ' ';

          if (vcb || this.comment) {
            ws = "".concat(vcb, "\n").concat(ctx.indent);
          } else if (!explicitKey && value instanceof Collection) {
            var flow = valueStr[0] === '[' || valueStr[0] === '{';
            if (!flow || valueStr.includes('\n')) ws = "\n".concat(ctx.indent);
          } else if (valueStr[0] === '\n') ws = '';

          if (chompKeep && !valueComment && onChompKeep) onChompKeep();
          return addComment(str + ws + valueStr, ctx.indent, valueComment);
        }
      }]);

      return Pair;
    }(Node);

    _defineProperty(Pair, "Type", {
      PAIR: 'PAIR',
      MERGE_PAIR: 'MERGE_PAIR'
    });

    var getAliasCount = function getAliasCount(node, anchors) {
      if (node instanceof Alias) {
        var anchor = anchors.get(node.source);
        return anchor.count * anchor.aliasCount;
      } else if (node instanceof Collection) {
        var count = 0;

        var _iterator = _createForOfIteratorHelper(node.items),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var item = _step.value;
            var c = getAliasCount(item, anchors);
            if (c > count) count = c;
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        return count;
      } else if (node instanceof Pair) {
        var kc = getAliasCount(node.key, anchors);
        var vc = getAliasCount(node.value, anchors);
        return Math.max(kc, vc);
      }

      return 1;
    };

    var Alias = /*#__PURE__*/function (_Node) {
      _inherits(Alias, _Node);

      var _super = _createSuper(Alias);

      function Alias(source) {
        var _this;

        _classCallCheck(this, Alias);

        _this = _super.call(this);
        _this.source = source;
        _this.type = Type.ALIAS;
        return _this;
      }

      _createClass(Alias, [{
        key: "tag",
        set: function set(t) {
          throw new Error('Alias nodes cannot have tags');
        }
      }, {
        key: "toJSON",
        value: function toJSON$1(arg, ctx) {
          if (!ctx) return toJSON(this.source, arg, ctx);
          var anchors = ctx.anchors,
              maxAliasCount = ctx.maxAliasCount;
          var anchor = anchors.get(this.source);
          /* istanbul ignore if */

          if (!anchor || anchor.res === undefined) {
            var msg = 'This should not happen: Alias anchor was not resolved?';
            if (this.cstNode) throw new YAMLReferenceError(this.cstNode, msg);else throw new ReferenceError(msg);
          }

          if (maxAliasCount >= 0) {
            anchor.count += 1;
            if (anchor.aliasCount === 0) anchor.aliasCount = getAliasCount(this.source, anchors);

            if (anchor.count * anchor.aliasCount > maxAliasCount) {
              var _msg = 'Excessive alias count indicates a resource exhaustion attack';
              if (this.cstNode) throw new YAMLReferenceError(this.cstNode, _msg);else throw new ReferenceError(_msg);
            }
          }

          return anchor.res;
        } // Only called when stringifying an alias mapping key while constructing
        // Object output.

      }, {
        key: "toString",
        value: function toString(ctx) {
          return Alias.stringify(this, ctx);
        }
      }], [{
        key: "stringify",
        value: function stringify(_ref, _ref2) {
          var range = _ref.range,
              source = _ref.source;
          var anchors = _ref2.anchors,
              doc = _ref2.doc,
              implicitKey = _ref2.implicitKey,
              inStringifyKey = _ref2.inStringifyKey;
          var anchor = Object.keys(anchors).find(function (a) {
            return anchors[a] === source;
          });
          if (!anchor && inStringifyKey) anchor = doc.anchors.getName(source) || doc.anchors.newName();
          if (anchor) return "*".concat(anchor).concat(implicitKey ? ' ' : '');
          var msg = doc.anchors.getName(source) ? 'Alias node must be after source node' : 'Source node not found for alias node';
          throw new Error("".concat(msg, " [").concat(range, "]"));
        }
      }]);

      return Alias;
    }(Node);

    _defineProperty(Alias, "default", true);

    function findPair(items, key) {
      var k = key instanceof Scalar ? key.value : key;

      var _iterator = _createForOfIteratorHelper(items),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var it = _step.value;

          if (it instanceof Pair) {
            if (it.key === key || it.key === k) return it;
            if (it.key && it.key.value === k) return it;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return undefined;
    }
    var YAMLMap = /*#__PURE__*/function (_Collection) {
      _inherits(YAMLMap, _Collection);

      var _super = _createSuper(YAMLMap);

      function YAMLMap() {
        _classCallCheck(this, YAMLMap);

        return _super.apply(this, arguments);
      }

      _createClass(YAMLMap, [{
        key: "add",
        value: function add(pair, overwrite) {
          if (!pair) pair = new Pair(pair);else if (!(pair instanceof Pair)) pair = new Pair(pair.key || pair, pair.value);
          var prev = findPair(this.items, pair.key);
          var sortEntries = this.schema && this.schema.sortMapEntries;

          if (prev) {
            if (overwrite) prev.value = pair.value;else throw new Error("Key ".concat(pair.key, " already set"));
          } else if (sortEntries) {
            var i = this.items.findIndex(function (item) {
              return sortEntries(pair, item) < 0;
            });
            if (i === -1) this.items.push(pair);else this.items.splice(i, 0, pair);
          } else {
            this.items.push(pair);
          }
        }
      }, {
        key: "delete",
        value: function _delete(key) {
          var it = findPair(this.items, key);
          if (!it) return false;
          var del = this.items.splice(this.items.indexOf(it), 1);
          return del.length > 0;
        }
      }, {
        key: "get",
        value: function get(key, keepScalar) {
          var it = findPair(this.items, key);
          var node = it && it.value;
          return !keepScalar && node instanceof Scalar ? node.value : node;
        }
      }, {
        key: "has",
        value: function has(key) {
          return !!findPair(this.items, key);
        }
      }, {
        key: "set",
        value: function set(key, value) {
          this.add(new Pair(key, value), true);
        }
        /**
         * @param {*} arg ignored
         * @param {*} ctx Conversion context, originally set in Document#toJSON()
         * @param {Class} Type If set, forces the returned collection type
         * @returns {*} Instance of Type, Map, or Object
         */

      }, {
        key: "toJSON",
        value: function toJSON(_, ctx, Type) {
          var map = Type ? new Type() : ctx && ctx.mapAsMap ? new Map() : {};
          if (ctx && ctx.onCreate) ctx.onCreate(map);

          var _iterator2 = _createForOfIteratorHelper(this.items),
              _step2;

          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var item = _step2.value;
              item.addToJSMap(ctx, map);
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }

          return map;
        }
      }, {
        key: "toString",
        value: function toString(ctx, onComment, onChompKeep) {
          if (!ctx) return JSON.stringify(this);

          var _iterator3 = _createForOfIteratorHelper(this.items),
              _step3;

          try {
            for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
              var item = _step3.value;
              if (!(item instanceof Pair)) throw new Error("Map items must all be pairs; found ".concat(JSON.stringify(item), " instead"));
            }
          } catch (err) {
            _iterator3.e(err);
          } finally {
            _iterator3.f();
          }

          return _get(_getPrototypeOf(YAMLMap.prototype), "toString", this).call(this, ctx, {
            blockItem: function blockItem(n) {
              return n.str;
            },
            flowChars: {
              start: '{',
              end: '}'
            },
            isMap: true,
            itemIndent: ctx.indent || ''
          }, onComment, onChompKeep);
        }
      }]);

      return YAMLMap;
    }(Collection);

    var MERGE_KEY = '<<';
    var Merge = /*#__PURE__*/function (_Pair) {
      _inherits(Merge, _Pair);

      var _super = _createSuper(Merge);

      function Merge(pair) {
        var _this;

        _classCallCheck(this, Merge);

        if (pair instanceof Pair) {
          var seq = pair.value;

          if (!(seq instanceof YAMLSeq)) {
            seq = new YAMLSeq();
            seq.items.push(pair.value);
            seq.range = pair.value.range;
          }

          _this = _super.call(this, pair.key, seq);
          _this.range = pair.range;
        } else {
          _this = _super.call(this, new Scalar(MERGE_KEY), new YAMLSeq());
        }

        _this.type = Pair.Type.MERGE_PAIR;
        return _possibleConstructorReturn(_this);
      } // If the value associated with a merge key is a single mapping node, each of
      // its key/value pairs is inserted into the current mapping, unless the key
      // already exists in it. If the value associated with the merge key is a
      // sequence, then this sequence is expected to contain mapping nodes and each
      // of these nodes is merged in turn according to its order in the sequence.
      // Keys in mapping nodes earlier in the sequence override keys specified in
      // later mapping nodes. -- http://yaml.org/type/merge.html


      _createClass(Merge, [{
        key: "addToJSMap",
        value: function addToJSMap(ctx, map) {
          var _iterator = _createForOfIteratorHelper(this.value.items),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var source = _step.value.source;
              if (!(source instanceof YAMLMap)) throw new Error('Merge sources must be maps');
              var srcMap = source.toJSON(null, ctx, Map);

              var _iterator2 = _createForOfIteratorHelper(srcMap),
                  _step2;

              try {
                for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                  var _step2$value = _slicedToArray(_step2.value, 2),
                      key = _step2$value[0],
                      value = _step2$value[1];

                  if (map instanceof Map) {
                    if (!map.has(key)) map.set(key, value);
                  } else if (map instanceof Set) {
                    map.add(key);
                  } else if (!Object.prototype.hasOwnProperty.call(map, key)) {
                    Object.defineProperty(map, key, {
                      value: value,
                      writable: true,
                      enumerable: true,
                      configurable: true
                    });
                  }
                }
              } catch (err) {
                _iterator2.e(err);
              } finally {
                _iterator2.f();
              }
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }

          return map;
        }
      }, {
        key: "toString",
        value: function toString(ctx, onComment) {
          var seq = this.value;
          if (seq.items.length > 1) return _get(_getPrototypeOf(Merge.prototype), "toString", this).call(this, ctx, onComment);
          this.value = seq.items[0];

          var str = _get(_getPrototypeOf(Merge.prototype), "toString", this).call(this, ctx, onComment);

          this.value = seq;
          return str;
        }
      }]);

      return Merge;
    }(Pair);

    var binaryOptions = {
      defaultType: Type.BLOCK_LITERAL,
      lineWidth: 76
    };
    var boolOptions = {
      trueStr: 'true',
      falseStr: 'false'
    };
    var intOptions = {
      asBigInt: false
    };
    var nullOptions = {
      nullStr: 'null'
    };
    var strOptions = {
      defaultType: Type.PLAIN,
      doubleQuoted: {
        jsonEncoding: false,
        minMultiLineLength: 40
      },
      fold: {
        lineWidth: 80,
        minContentWidth: 20
      }
    };

    function resolveScalar(str, tags, scalarFallback) {
      var _iterator = _createForOfIteratorHelper(tags),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _step$value = _step.value,
              format = _step$value.format,
              test = _step$value.test,
              resolve = _step$value.resolve;

          if (test) {
            var match = str.match(test);

            if (match) {
              var res = resolve.apply(null, match);
              if (!(res instanceof Scalar)) res = new Scalar(res);
              if (format) res.format = format;
              return res;
            }
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      if (scalarFallback) str = scalarFallback(str);
      return new Scalar(str);
    }

    var FOLD_FLOW = 'flow';
    var FOLD_BLOCK = 'block';
    var FOLD_QUOTED = 'quoted'; // presumes i+1 is at the start of a line
    // returns index of last newline in more-indented block

    var consumeMoreIndentedLines = function consumeMoreIndentedLines(text, i) {
      var ch = text[i + 1];

      while (ch === ' ' || ch === '\t') {
        do {
          ch = text[i += 1];
        } while (ch && ch !== '\n');

        ch = text[i + 1];
      }

      return i;
    };
    /**
     * Tries to keep input at up to `lineWidth` characters, splitting only on spaces
     * not followed by newlines or spaces unless `mode` is `'quoted'`. Lines are
     * terminated with `\n` and started with `indent`.
     *
     * @param {string} text
     * @param {string} indent
     * @param {string} [mode='flow'] `'block'` prevents more-indented lines
     *   from being folded; `'quoted'` allows for `\` escapes, including escaped
     *   newlines
     * @param {Object} options
     * @param {number} [options.indentAtStart] Accounts for leading contents on
     *   the first line, defaulting to `indent.length`
     * @param {number} [options.lineWidth=80]
     * @param {number} [options.minContentWidth=20] Allow highly indented lines to
     *   stretch the line width or indent content from the start
     * @param {function} options.onFold Called once if the text is folded
     * @param {function} options.onFold Called once if any line of text exceeds
     *   lineWidth characters
     */


    function foldFlowLines(text, indent, mode, _ref) {
      var indentAtStart = _ref.indentAtStart,
          _ref$lineWidth = _ref.lineWidth,
          lineWidth = _ref$lineWidth === void 0 ? 80 : _ref$lineWidth,
          _ref$minContentWidth = _ref.minContentWidth,
          minContentWidth = _ref$minContentWidth === void 0 ? 20 : _ref$minContentWidth,
          onFold = _ref.onFold,
          onOverflow = _ref.onOverflow;
      if (!lineWidth || lineWidth < 0) return text;
      var endStep = Math.max(1 + minContentWidth, 1 + lineWidth - indent.length);
      if (text.length <= endStep) return text;
      var folds = [];
      var escapedFolds = {};
      var end = lineWidth - indent.length;

      if (typeof indentAtStart === 'number') {
        if (indentAtStart > lineWidth - Math.max(2, minContentWidth)) folds.push(0);else end = lineWidth - indentAtStart;
      }

      var split = undefined;
      var prev = undefined;
      var overflow = false;
      var i = -1;
      var escStart = -1;
      var escEnd = -1;

      if (mode === FOLD_BLOCK) {
        i = consumeMoreIndentedLines(text, i);
        if (i !== -1) end = i + endStep;
      }

      for (var ch; ch = text[i += 1];) {
        if (mode === FOLD_QUOTED && ch === '\\') {
          escStart = i;

          switch (text[i + 1]) {
            case 'x':
              i += 3;
              break;

            case 'u':
              i += 5;
              break;

            case 'U':
              i += 9;
              break;

            default:
              i += 1;
          }

          escEnd = i;
        }

        if (ch === '\n') {
          if (mode === FOLD_BLOCK) i = consumeMoreIndentedLines(text, i);
          end = i + endStep;
          split = undefined;
        } else {
          if (ch === ' ' && prev && prev !== ' ' && prev !== '\n' && prev !== '\t') {
            // space surrounded by non-space can be replaced with newline + indent
            var next = text[i + 1];
            if (next && next !== ' ' && next !== '\n' && next !== '\t') split = i;
          }

          if (i >= end) {
            if (split) {
              folds.push(split);
              end = split + endStep;
              split = undefined;
            } else if (mode === FOLD_QUOTED) {
              // white-space collected at end may stretch past lineWidth
              while (prev === ' ' || prev === '\t') {
                prev = ch;
                ch = text[i += 1];
                overflow = true;
              } // Account for newline escape, but don't break preceding escape


              var j = i > escEnd + 1 ? i - 2 : escStart - 1; // Bail out if lineWidth & minContentWidth are shorter than an escape string

              if (escapedFolds[j]) return text;
              folds.push(j);
              escapedFolds[j] = true;
              end = j + endStep;
              split = undefined;
            } else {
              overflow = true;
            }
          }
        }

        prev = ch;
      }

      if (overflow && onOverflow) onOverflow();
      if (folds.length === 0) return text;
      if (onFold) onFold();
      var res = text.slice(0, folds[0]);

      for (var _i = 0; _i < folds.length; ++_i) {
        var fold = folds[_i];

        var _end = folds[_i + 1] || text.length;

        if (fold === 0) res = "\n".concat(indent).concat(text.slice(0, _end));else {
          if (mode === FOLD_QUOTED && escapedFolds[fold]) res += "".concat(text[fold], "\\");
          res += "\n".concat(indent).concat(text.slice(fold + 1, _end));
        }
      }

      return res;
    }

    var getFoldOptions = function getFoldOptions(_ref) {
      var indentAtStart = _ref.indentAtStart;
      return indentAtStart ? Object.assign({
        indentAtStart: indentAtStart
      }, strOptions.fold) : strOptions.fold;
    }; // Also checks for lines starting with %, as parsing the output as YAML 1.1 will
    // presume that's starting a new document.


    var containsDocumentMarker = function containsDocumentMarker(str) {
      return /^(%|---|\.\.\.)/m.test(str);
    };

    function lineLengthOverLimit(str, lineWidth, indentLength) {
      if (!lineWidth || lineWidth < 0) return false;
      var limit = lineWidth - indentLength;
      var strLen = str.length;
      if (strLen <= limit) return false;

      for (var i = 0, start = 0; i < strLen; ++i) {
        if (str[i] === '\n') {
          if (i - start > limit) return true;
          start = i + 1;
          if (strLen - start <= limit) return false;
        }
      }

      return true;
    }

    function doubleQuotedString(value, ctx) {
      var implicitKey = ctx.implicitKey;
      var _strOptions$doubleQuo = strOptions.doubleQuoted,
          jsonEncoding = _strOptions$doubleQuo.jsonEncoding,
          minMultiLineLength = _strOptions$doubleQuo.minMultiLineLength;
      var json = JSON.stringify(value);
      if (jsonEncoding) return json;
      var indent = ctx.indent || (containsDocumentMarker(value) ? '  ' : '');
      var str = '';
      var start = 0;

      for (var i = 0, ch = json[i]; ch; ch = json[++i]) {
        if (ch === ' ' && json[i + 1] === '\\' && json[i + 2] === 'n') {
          // space before newline needs to be escaped to not be folded
          str += json.slice(start, i) + '\\ ';
          i += 1;
          start = i;
          ch = '\\';
        }

        if (ch === '\\') switch (json[i + 1]) {
          case 'u':
            {
              str += json.slice(start, i);
              var code = json.substr(i + 2, 4);

              switch (code) {
                case '0000':
                  str += '\\0';
                  break;

                case '0007':
                  str += '\\a';
                  break;

                case '000b':
                  str += '\\v';
                  break;

                case '001b':
                  str += '\\e';
                  break;

                case '0085':
                  str += '\\N';
                  break;

                case '00a0':
                  str += '\\_';
                  break;

                case '2028':
                  str += '\\L';
                  break;

                case '2029':
                  str += '\\P';
                  break;

                default:
                  if (code.substr(0, 2) === '00') str += '\\x' + code.substr(2);else str += json.substr(i, 6);
              }

              i += 5;
              start = i + 1;
            }
            break;

          case 'n':
            if (implicitKey || json[i + 2] === '"' || json.length < minMultiLineLength) {
              i += 1;
            } else {
              // folding will eat first newline
              str += json.slice(start, i) + '\n\n';

              while (json[i + 2] === '\\' && json[i + 3] === 'n' && json[i + 4] !== '"') {
                str += '\n';
                i += 2;
              }

              str += indent; // space after newline needs to be escaped to not be folded

              if (json[i + 2] === ' ') str += '\\';
              i += 1;
              start = i + 1;
            }

            break;

          default:
            i += 1;
        }
      }

      str = start ? str + json.slice(start) : json;
      return implicitKey ? str : foldFlowLines(str, indent, FOLD_QUOTED, getFoldOptions(ctx));
    }

    function singleQuotedString(value, ctx) {
      if (ctx.implicitKey) {
        if (/\n/.test(value)) return doubleQuotedString(value, ctx);
      } else {
        // single quoted string can't have leading or trailing whitespace around newline
        if (/[ \t]\n|\n[ \t]/.test(value)) return doubleQuotedString(value, ctx);
      }

      var indent = ctx.indent || (containsDocumentMarker(value) ? '  ' : '');
      var res = "'" + value.replace(/'/g, "''").replace(/\n+/g, "$&\n".concat(indent)) + "'";
      return ctx.implicitKey ? res : foldFlowLines(res, indent, FOLD_FLOW, getFoldOptions(ctx));
    }

    function blockString(_ref2, ctx, onComment, onChompKeep) {
      var comment = _ref2.comment,
          type = _ref2.type,
          value = _ref2.value;

      // 1. Block can't end in whitespace unless the last line is non-empty.
      // 2. Strings consisting of only whitespace are best rendered explicitly.
      if (/\n[\t ]+$/.test(value) || /^\s*$/.test(value)) {
        return doubleQuotedString(value, ctx);
      }

      var indent = ctx.indent || (ctx.forceBlockIndent || containsDocumentMarker(value) ? '  ' : '');
      var indentSize = indent ? '2' : '1'; // root is at -1

      var literal = type === Type.BLOCK_FOLDED ? false : type === Type.BLOCK_LITERAL ? true : !lineLengthOverLimit(value, strOptions.fold.lineWidth, indent.length);
      var header = literal ? '|' : '>';
      if (!value) return header + '\n';
      var wsStart = '';
      var wsEnd = '';
      value = value.replace(/[\n\t ]*$/, function (ws) {
        var n = ws.indexOf('\n');

        if (n === -1) {
          header += '-'; // strip
        } else if (value === ws || n !== ws.length - 1) {
          header += '+'; // keep

          if (onChompKeep) onChompKeep();
        }

        wsEnd = ws.replace(/\n$/, '');
        return '';
      }).replace(/^[\n ]*/, function (ws) {
        if (ws.indexOf(' ') !== -1) header += indentSize;
        var m = ws.match(/ +$/);

        if (m) {
          wsStart = ws.slice(0, -m[0].length);
          return m[0];
        } else {
          wsStart = ws;
          return '';
        }
      });
      if (wsEnd) wsEnd = wsEnd.replace(/\n+(?!\n|$)/g, "$&".concat(indent));
      if (wsStart) wsStart = wsStart.replace(/\n+/g, "$&".concat(indent));

      if (comment) {
        header += ' #' + comment.replace(/ ?[\r\n]+/g, ' ');
        if (onComment) onComment();
      }

      if (!value) return "".concat(header).concat(indentSize, "\n").concat(indent).concat(wsEnd);

      if (literal) {
        value = value.replace(/\n+/g, "$&".concat(indent));
        return "".concat(header, "\n").concat(indent).concat(wsStart).concat(value).concat(wsEnd);
      }

      value = value.replace(/\n+/g, '\n$&').replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, '$1$2') // more-indented lines aren't folded
      //         ^ ind.line  ^ empty     ^ capture next empty lines only at end of indent
      .replace(/\n+/g, "$&".concat(indent));
      var body = foldFlowLines("".concat(wsStart).concat(value).concat(wsEnd), indent, FOLD_BLOCK, strOptions.fold);
      return "".concat(header, "\n").concat(indent).concat(body);
    }

    function plainString(item, ctx, onComment, onChompKeep) {
      var comment = item.comment,
          type = item.type,
          value = item.value;
      var actualString = ctx.actualString,
          implicitKey = ctx.implicitKey,
          indent = ctx.indent,
          inFlow = ctx.inFlow;

      if (implicitKey && /[\n[\]{},]/.test(value) || inFlow && /[[\]{},]/.test(value)) {
        return doubleQuotedString(value, ctx);
      }

      if (!value || /^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(value)) {
        // not allowed:
        // - empty string, '-' or '?'
        // - start with an indicator character (except [?:-]) or /[?-] /
        // - '\n ', ': ' or ' \n' anywhere
        // - '#' not preceded by a non-space char
        // - end with ' ' or ':'
        return implicitKey || inFlow || value.indexOf('\n') === -1 ? value.indexOf('"') !== -1 && value.indexOf("'") === -1 ? singleQuotedString(value, ctx) : doubleQuotedString(value, ctx) : blockString(item, ctx, onComment, onChompKeep);
      }

      if (!implicitKey && !inFlow && type !== Type.PLAIN && value.indexOf('\n') !== -1) {
        // Where allowed & type not set explicitly, prefer block style for multiline strings
        return blockString(item, ctx, onComment, onChompKeep);
      }

      if (indent === '' && containsDocumentMarker(value)) {
        ctx.forceBlockIndent = true;
        return blockString(item, ctx, onComment, onChompKeep);
      }

      var str = value.replace(/\n+/g, "$&\n".concat(indent)); // Verify that output will be parsed as a string, as e.g. plain numbers and
      // booleans get parsed with those types in v1.2 (e.g. '42', 'true' & '0.9e-3'),
      // and others in v1.1.

      if (actualString) {
        var tags = ctx.doc.schema.tags;
        var resolved = resolveScalar(str, tags, tags.scalarFallback).value;
        if (typeof resolved !== 'string') return doubleQuotedString(value, ctx);
      }

      var body = implicitKey ? str : foldFlowLines(str, indent, FOLD_FLOW, getFoldOptions(ctx));

      if (comment && !inFlow && (body.indexOf('\n') !== -1 || comment.indexOf('\n') !== -1)) {
        if (onComment) onComment();
        return addCommentBefore(body, indent, comment);
      }

      return body;
    }

    function stringifyString(item, ctx, onComment, onChompKeep) {
      var defaultType = strOptions.defaultType;
      var implicitKey = ctx.implicitKey,
          inFlow = ctx.inFlow;
      var _item = item,
          type = _item.type,
          value = _item.value;

      if (typeof value !== 'string') {
        value = String(value);
        item = Object.assign({}, item, {
          value: value
        });
      }

      var _stringify = function _stringify(_type) {
        switch (_type) {
          case Type.BLOCK_FOLDED:
          case Type.BLOCK_LITERAL:
            return blockString(item, ctx, onComment, onChompKeep);

          case Type.QUOTE_DOUBLE:
            return doubleQuotedString(value, ctx);

          case Type.QUOTE_SINGLE:
            return singleQuotedString(value, ctx);

          case Type.PLAIN:
            return plainString(item, ctx, onComment, onChompKeep);

          default:
            return null;
        }
      };

      if (type !== Type.QUOTE_DOUBLE && /[\x00-\x08\x0b-\x1f\x7f-\x9f]/.test(value)) {
        // force double quotes on control characters
        type = Type.QUOTE_DOUBLE;
      } else if ((implicitKey || inFlow) && (type === Type.BLOCK_FOLDED || type === Type.BLOCK_LITERAL)) {
        // should not happen; blocks are not valid inside flow containers
        type = Type.QUOTE_DOUBLE;
      }

      var res = _stringify(type);

      if (res === null) {
        res = _stringify(defaultType);
        if (res === null) throw new Error("Unsupported default string type ".concat(defaultType));
      }

      return res;
    }

    function stringifyNumber(_ref) {
      var format = _ref.format,
          minFractionDigits = _ref.minFractionDigits,
          tag = _ref.tag,
          value = _ref.value;
      if (typeof value === 'bigint') return String(value);
      if (!isFinite(value)) return isNaN(value) ? '.nan' : value < 0 ? '-.inf' : '.inf';
      var n = JSON.stringify(value);

      if (!format && minFractionDigits && (!tag || tag === 'tag:yaml.org,2002:float') && /^\d/.test(n)) {
        var i = n.indexOf('.');

        if (i < 0) {
          i = n.length;
          n += '.';
        }

        var d = minFractionDigits - (n.length - i - 1);

        while (d-- > 0) {
          n += '0';
        }
      }

      return n;
    }

    function checkFlowCollectionEnd(errors, cst) {
      var char, name;

      switch (cst.type) {
        case Type.FLOW_MAP:
          char = '}';
          name = 'flow map';
          break;

        case Type.FLOW_SEQ:
          char = ']';
          name = 'flow sequence';
          break;

        default:
          errors.push(new YAMLSemanticError(cst, 'Not a flow collection!?'));
          return;
      }

      var lastItem;

      for (var i = cst.items.length - 1; i >= 0; --i) {
        var item = cst.items[i];

        if (!item || item.type !== Type.COMMENT) {
          lastItem = item;
          break;
        }
      }

      if (lastItem && lastItem.char !== char) {
        var msg = "Expected ".concat(name, " to end with ").concat(char);
        var err;

        if (typeof lastItem.offset === 'number') {
          err = new YAMLSemanticError(cst, msg);
          err.offset = lastItem.offset + 1;
        } else {
          err = new YAMLSemanticError(lastItem, msg);
          if (lastItem.range && lastItem.range.end) err.offset = lastItem.range.end - lastItem.range.start;
        }

        errors.push(err);
      }
    }
    function checkFlowCommentSpace(errors, comment) {
      var prev = comment.context.src[comment.range.start - 1];

      if (prev !== '\n' && prev !== '\t' && prev !== ' ') {
        var msg = 'Comments must be separated from other tokens by white space characters';
        errors.push(new YAMLSemanticError(comment, msg));
      }
    }
    function getLongKeyError(source, key) {
      var sk = String(key);
      var k = sk.substr(0, 8) + '...' + sk.substr(-8);
      return new YAMLSemanticError(source, "The \"".concat(k, "\" key is too long"));
    }
    function resolveComments(collection, comments) {
      var _iterator = _createForOfIteratorHelper(comments),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _step$value = _step.value,
              afterKey = _step$value.afterKey,
              before = _step$value.before,
              comment = _step$value.comment;
          var item = collection.items[before];

          if (!item) {
            if (comment !== undefined) {
              if (collection.comment) collection.comment += '\n' + comment;else collection.comment = comment;
            }
          } else {
            if (afterKey && item.value) item = item.value;

            if (comment === undefined) {
              if (afterKey || !item.commentBefore) item.spaceBefore = true;
            } else {
              if (item.commentBefore) item.commentBefore += '\n' + comment;else item.commentBefore = comment;
            }
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }

    // on error, will return { str: string, errors: Error[] }
    function resolveString(doc, node) {
      var res = node.strValue;
      if (!res) return '';
      if (typeof res === 'string') return res;
      res.errors.forEach(function (error) {
        if (!error.source) error.source = node;
        doc.errors.push(error);
      });
      return res.str;
    }

    function resolveTagHandle(doc, node) {
      var _node$tag = node.tag,
          handle = _node$tag.handle,
          suffix = _node$tag.suffix;
      var prefix = doc.tagPrefixes.find(function (p) {
        return p.handle === handle;
      });

      if (!prefix) {
        var dtp = doc.getDefaults().tagPrefixes;
        if (dtp) prefix = dtp.find(function (p) {
          return p.handle === handle;
        });
        if (!prefix) throw new YAMLSemanticError(node, "The ".concat(handle, " tag handle is non-default and was not declared."));
      }

      if (!suffix) throw new YAMLSemanticError(node, "The ".concat(handle, " tag has no suffix."));

      if (handle === '!' && (doc.version || doc.options.version) === '1.0') {
        if (suffix[0] === '^') {
          doc.warnings.push(new YAMLWarning(node, 'YAML 1.0 ^ tag expansion is not supported'));
          return suffix;
        }

        if (/[:/]/.test(suffix)) {
          // word/foo -> tag:word.yaml.org,2002:foo
          var vocab = suffix.match(/^([a-z0-9-]+)\/(.*)/i);
          return vocab ? "tag:".concat(vocab[1], ".yaml.org,2002:").concat(vocab[2]) : "tag:".concat(suffix);
        }
      }

      return prefix.prefix + decodeURIComponent(suffix);
    }

    function resolveTagName(doc, node) {
      var tag = node.tag,
          type = node.type;
      var nonSpecific = false;

      if (tag) {
        var handle = tag.handle,
            suffix = tag.suffix,
            verbatim = tag.verbatim;

        if (verbatim) {
          if (verbatim !== '!' && verbatim !== '!!') return verbatim;
          var msg = "Verbatim tags aren't resolved, so ".concat(verbatim, " is invalid.");
          doc.errors.push(new YAMLSemanticError(node, msg));
        } else if (handle === '!' && !suffix) {
          nonSpecific = true;
        } else {
          try {
            return resolveTagHandle(doc, node);
          } catch (error) {
            doc.errors.push(error);
          }
        }
      }

      switch (type) {
        case Type.BLOCK_FOLDED:
        case Type.BLOCK_LITERAL:
        case Type.QUOTE_DOUBLE:
        case Type.QUOTE_SINGLE:
          return defaultTags.STR;

        case Type.FLOW_MAP:
        case Type.MAP:
          return defaultTags.MAP;

        case Type.FLOW_SEQ:
        case Type.SEQ:
          return defaultTags.SEQ;

        case Type.PLAIN:
          return nonSpecific ? defaultTags.STR : null;

        default:
          return null;
      }
    }

    function resolveByTagName(doc, node, tagName) {
      var tags = doc.schema.tags;
      var matchWithTest = [];

      var _iterator = _createForOfIteratorHelper(tags),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var tag = _step.value;

          if (tag.tag === tagName) {
            if (tag.test) matchWithTest.push(tag);else {
              var res = tag.resolve(doc, node);
              return res instanceof Collection ? res : new Scalar(res);
            }
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      var str = resolveString(doc, node);
      if (typeof str === 'string' && matchWithTest.length > 0) return resolveScalar(str, matchWithTest, tags.scalarFallback);
      return null;
    }

    function getFallbackTagName(_ref) {
      var type = _ref.type;

      switch (type) {
        case Type.FLOW_MAP:
        case Type.MAP:
          return defaultTags.MAP;

        case Type.FLOW_SEQ:
        case Type.SEQ:
          return defaultTags.SEQ;

        default:
          return defaultTags.STR;
      }
    }

    function resolveTag(doc, node, tagName) {
      try {
        var res = resolveByTagName(doc, node, tagName);

        if (res) {
          if (tagName && node.tag) res.tag = tagName;
          return res;
        }
      } catch (error) {
        /* istanbul ignore if */
        if (!error.source) error.source = node;
        doc.errors.push(error);
        return null;
      }

      try {
        var fallback = getFallbackTagName(node);
        if (!fallback) throw new Error("The tag ".concat(tagName, " is unavailable"));
        var msg = "The tag ".concat(tagName, " is unavailable, falling back to ").concat(fallback);
        doc.warnings.push(new YAMLWarning(node, msg));

        var _res = resolveByTagName(doc, node, fallback);

        _res.tag = tagName;
        return _res;
      } catch (error) {
        var refError = new YAMLReferenceError(node, error.message);
        refError.stack = error.stack;
        doc.errors.push(refError);
        return null;
      }
    }

    var isCollectionItem = function isCollectionItem(node) {
      if (!node) return false;
      var type = node.type;
      return type === Type.MAP_KEY || type === Type.MAP_VALUE || type === Type.SEQ_ITEM;
    };

    function resolveNodeProps(errors, node) {
      var comments = {
        before: [],
        after: []
      };
      var hasAnchor = false;
      var hasTag = false;
      var props = isCollectionItem(node.context.parent) ? node.context.parent.props.concat(node.props) : node.props;

      var _iterator = _createForOfIteratorHelper(props),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _step$value = _step.value,
              start = _step$value.start,
              end = _step$value.end;

          switch (node.context.src[start]) {
            case Char.COMMENT:
              {
                if (!node.commentHasRequiredWhitespace(start)) {
                  var msg = 'Comments must be separated from other tokens by white space characters';
                  errors.push(new YAMLSemanticError(node, msg));
                }

                var header = node.header,
                    valueRange = node.valueRange;
                var cc = valueRange && (start > valueRange.start || header && start > header.start) ? comments.after : comments.before;
                cc.push(node.context.src.slice(start + 1, end));
                break;
              }
            // Actual anchor & tag resolution is handled by schema, here we just complain

            case Char.ANCHOR:
              if (hasAnchor) {
                var _msg = 'A node can have at most one anchor';
                errors.push(new YAMLSemanticError(node, _msg));
              }

              hasAnchor = true;
              break;

            case Char.TAG:
              if (hasTag) {
                var _msg2 = 'A node can have at most one tag';
                errors.push(new YAMLSemanticError(node, _msg2));
              }

              hasTag = true;
              break;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return {
        comments: comments,
        hasAnchor: hasAnchor,
        hasTag: hasTag
      };
    }

    function resolveNodeValue(doc, node) {
      var anchors = doc.anchors,
          errors = doc.errors,
          schema = doc.schema;

      if (node.type === Type.ALIAS) {
        var name = node.rawValue;
        var src = anchors.getNode(name);

        if (!src) {
          var msg = "Aliased anchor not found: ".concat(name);
          errors.push(new YAMLReferenceError(node, msg));
          return null;
        } // Lazy resolution for circular references


        var res = new Alias(src);

        anchors._cstAliases.push(res);

        return res;
      }

      var tagName = resolveTagName(doc, node);
      if (tagName) return resolveTag(doc, node, tagName);

      if (node.type !== Type.PLAIN) {
        var _msg3 = "Failed to resolve ".concat(node.type, " node here");

        errors.push(new YAMLSyntaxError(node, _msg3));
        return null;
      }

      try {
        var str = resolveString(doc, node);
        return resolveScalar(str, schema.tags, schema.tags.scalarFallback);
      } catch (error) {
        if (!error.source) error.source = node;
        errors.push(error);
        return null;
      }
    } // sets node.resolved on success


    function resolveNode(doc, node) {
      if (!node) return null;
      if (node.error) doc.errors.push(node.error);

      var _resolveNodeProps = resolveNodeProps(doc.errors, node),
          comments = _resolveNodeProps.comments,
          hasAnchor = _resolveNodeProps.hasAnchor,
          hasTag = _resolveNodeProps.hasTag;

      if (hasAnchor) {
        var anchors = doc.anchors;
        var name = node.anchor;
        var prev = anchors.getNode(name); // At this point, aliases for any preceding node with the same anchor
        // name have already been resolved, so it may safely be renamed.

        if (prev) anchors.map[anchors.newName(name)] = prev; // During parsing, we need to store the CST node in anchors.map as
        // anchors need to be available during resolution to allow for
        // circular references.

        anchors.map[name] = node;
      }

      if (node.type === Type.ALIAS && (hasAnchor || hasTag)) {
        var msg = 'An alias node must not specify any properties';
        doc.errors.push(new YAMLSemanticError(node, msg));
      }

      var res = resolveNodeValue(doc, node);

      if (res) {
        res.range = [node.range.start, node.range.end];
        if (doc.options.keepCstNodes) res.cstNode = node;
        if (doc.options.keepNodeTypes) res.type = node.type;
        var cb = comments.before.join('\n');

        if (cb) {
          res.commentBefore = res.commentBefore ? "".concat(res.commentBefore, "\n").concat(cb) : cb;
        }

        var ca = comments.after.join('\n');
        if (ca) res.comment = res.comment ? "".concat(res.comment, "\n").concat(ca) : ca;
      }

      return node.resolved = res;
    }

    function resolveMap(doc, cst) {
      if (cst.type !== Type.MAP && cst.type !== Type.FLOW_MAP) {
        var msg = "A ".concat(cst.type, " node cannot be resolved as a mapping");
        doc.errors.push(new YAMLSyntaxError(cst, msg));
        return null;
      }

      var _ref = cst.type === Type.FLOW_MAP ? resolveFlowMapItems(doc, cst) : resolveBlockMapItems(doc, cst),
          comments = _ref.comments,
          items = _ref.items;

      var map = new YAMLMap();
      map.items = items;
      resolveComments(map, comments);
      var hasCollectionKey = false;

      for (var i = 0; i < items.length; ++i) {
        var iKey = items[i].key;
        if (iKey instanceof Collection) hasCollectionKey = true;

        if (doc.schema.merge && iKey && iKey.value === MERGE_KEY) {
          items[i] = new Merge(items[i]);
          var sources = items[i].value.items;
          var error = null;
          sources.some(function (node) {
            if (node instanceof Alias) {
              // During parsing, alias sources are CST nodes; to account for
              // circular references their resolved values can't be used here.
              var type = node.source.type;
              if (type === Type.MAP || type === Type.FLOW_MAP) return false;
              return error = 'Merge nodes aliases can only point to maps';
            }

            return error = 'Merge nodes can only have Alias nodes as values';
          });
          if (error) doc.errors.push(new YAMLSemanticError(cst, error));
        } else {
          for (var j = i + 1; j < items.length; ++j) {
            var jKey = items[j].key;

            if (iKey === jKey || iKey && jKey && Object.prototype.hasOwnProperty.call(iKey, 'value') && iKey.value === jKey.value) {
              var _msg = "Map keys must be unique; \"".concat(iKey, "\" is repeated");

              doc.errors.push(new YAMLSemanticError(cst, _msg));
              break;
            }
          }
        }
      }

      if (hasCollectionKey && !doc.options.mapAsMap) {
        var warn = 'Keys with collection values will be stringified as YAML due to JS Object restrictions. Use mapAsMap: true to avoid this.';
        doc.warnings.push(new YAMLWarning(cst, warn));
      }

      cst.resolved = map;
      return map;
    }

    var valueHasPairComment = function valueHasPairComment(_ref2) {
      var _ref2$context = _ref2.context,
          lineStart = _ref2$context.lineStart,
          node = _ref2$context.node,
          src = _ref2$context.src,
          props = _ref2.props;
      if (props.length === 0) return false;
      var start = props[0].start;
      if (node && start > node.valueRange.start) return false;
      if (src[start] !== Char.COMMENT) return false;

      for (var i = lineStart; i < start; ++i) {
        if (src[i] === '\n') return false;
      }

      return true;
    };

    function resolvePairComment(item, pair) {
      if (!valueHasPairComment(item)) return;
      var comment = item.getPropValue(0, Char.COMMENT, true);
      var found = false;
      var cb = pair.value.commentBefore;

      if (cb && cb.startsWith(comment)) {
        pair.value.commentBefore = cb.substr(comment.length + 1);
        found = true;
      } else {
        var cc = pair.value.comment;

        if (!item.node && cc && cc.startsWith(comment)) {
          pair.value.comment = cc.substr(comment.length + 1);
          found = true;
        }
      }

      if (found) pair.comment = comment;
    }

    function resolveBlockMapItems(doc, cst) {
      var comments = [];
      var items = [];
      var key = undefined;
      var keyStart = null;

      for (var i = 0; i < cst.items.length; ++i) {
        var item = cst.items[i];

        switch (item.type) {
          case Type.BLANK_LINE:
            comments.push({
              afterKey: !!key,
              before: items.length
            });
            break;

          case Type.COMMENT:
            comments.push({
              afterKey: !!key,
              before: items.length,
              comment: item.comment
            });
            break;

          case Type.MAP_KEY:
            if (key !== undefined) items.push(new Pair(key));
            if (item.error) doc.errors.push(item.error);
            key = resolveNode(doc, item.node);
            keyStart = null;
            break;

          case Type.MAP_VALUE:
            {
              if (key === undefined) key = null;
              if (item.error) doc.errors.push(item.error);

              if (!item.context.atLineStart && item.node && item.node.type === Type.MAP && !item.node.context.atLineStart) {
                var msg = 'Nested mappings are not allowed in compact mappings';
                doc.errors.push(new YAMLSemanticError(item.node, msg));
              }

              var valueNode = item.node;

              if (!valueNode && item.props.length > 0) {
                // Comments on an empty mapping value need to be preserved, so we
                // need to construct a minimal empty node here to use instead of the
                // missing `item.node`. -- eemeli/yaml#19
                valueNode = new PlainValue(Type.PLAIN, []);
                valueNode.context = {
                  parent: item,
                  src: item.context.src
                };
                var pos = item.range.start + 1;
                valueNode.range = {
                  start: pos,
                  end: pos
                };
                valueNode.valueRange = {
                  start: pos,
                  end: pos
                };

                if (typeof item.range.origStart === 'number') {
                  var origPos = item.range.origStart + 1;
                  valueNode.range.origStart = valueNode.range.origEnd = origPos;
                  valueNode.valueRange.origStart = valueNode.valueRange.origEnd = origPos;
                }
              }

              var pair = new Pair(key, resolveNode(doc, valueNode));
              resolvePairComment(item, pair);
              items.push(pair);

              if (key && typeof keyStart === 'number') {
                if (item.range.start > keyStart + 1024) doc.errors.push(getLongKeyError(cst, key));
              }

              key = undefined;
              keyStart = null;
            }
            break;

          default:
            if (key !== undefined) items.push(new Pair(key));
            key = resolveNode(doc, item);
            keyStart = item.range.start;
            if (item.error) doc.errors.push(item.error);

            next: for (var j = i + 1;; ++j) {
              var nextItem = cst.items[j];

              switch (nextItem && nextItem.type) {
                case Type.BLANK_LINE:
                case Type.COMMENT:
                  continue next;

                case Type.MAP_VALUE:
                  break next;

                default:
                  {
                    var _msg2 = 'Implicit map keys need to be followed by map values';
                    doc.errors.push(new YAMLSemanticError(item, _msg2));
                    break next;
                  }
              }
            }

            if (item.valueRangeContainsNewline) {
              var _msg3 = 'Implicit map keys need to be on a single line';
              doc.errors.push(new YAMLSemanticError(item, _msg3));
            }

        }
      }

      if (key !== undefined) items.push(new Pair(key));
      return {
        comments: comments,
        items: items
      };
    }

    function resolveFlowMapItems(doc, cst) {
      var comments = [];
      var items = [];
      var key = undefined;
      var explicitKey = false;
      var next = '{';

      for (var i = 0; i < cst.items.length; ++i) {
        var item = cst.items[i];

        if (typeof item.char === 'string') {
          var char = item.char,
              offset = item.offset;

          if (char === '?' && key === undefined && !explicitKey) {
            explicitKey = true;
            next = ':';
            continue;
          }

          if (char === ':') {
            if (key === undefined) key = null;

            if (next === ':') {
              next = ',';
              continue;
            }
          } else {
            if (explicitKey) {
              if (key === undefined && char !== ',') key = null;
              explicitKey = false;
            }

            if (key !== undefined) {
              items.push(new Pair(key));
              key = undefined;

              if (char === ',') {
                next = ':';
                continue;
              }
            }
          }

          if (char === '}') {
            if (i === cst.items.length - 1) continue;
          } else if (char === next) {
            next = ':';
            continue;
          }

          var msg = "Flow map contains an unexpected ".concat(char);
          var err = new YAMLSyntaxError(cst, msg);
          err.offset = offset;
          doc.errors.push(err);
        } else if (item.type === Type.BLANK_LINE) {
          comments.push({
            afterKey: !!key,
            before: items.length
          });
        } else if (item.type === Type.COMMENT) {
          checkFlowCommentSpace(doc.errors, item);
          comments.push({
            afterKey: !!key,
            before: items.length,
            comment: item.comment
          });
        } else if (key === undefined) {
          if (next === ',') doc.errors.push(new YAMLSemanticError(item, 'Separator , missing in flow map'));
          key = resolveNode(doc, item);
        } else {
          if (next !== ',') doc.errors.push(new YAMLSemanticError(item, 'Indicator : missing in flow map entry'));
          items.push(new Pair(key, resolveNode(doc, item)));
          key = undefined;
          explicitKey = false;
        }
      }

      checkFlowCollectionEnd(doc.errors, cst);
      if (key !== undefined) items.push(new Pair(key));
      return {
        comments: comments,
        items: items
      };
    }

    function resolveSeq(doc, cst) {
      if (cst.type !== Type.SEQ && cst.type !== Type.FLOW_SEQ) {
        var msg = "A ".concat(cst.type, " node cannot be resolved as a sequence");
        doc.errors.push(new YAMLSyntaxError(cst, msg));
        return null;
      }

      var _ref = cst.type === Type.FLOW_SEQ ? resolveFlowSeqItems(doc, cst) : resolveBlockSeqItems(doc, cst),
          comments = _ref.comments,
          items = _ref.items;

      var seq = new YAMLSeq();
      seq.items = items;
      resolveComments(seq, comments);

      if (!doc.options.mapAsMap && items.some(function (it) {
        return it instanceof Pair && it.key instanceof Collection;
      })) {
        var warn = 'Keys with collection values will be stringified as YAML due to JS Object restrictions. Use mapAsMap: true to avoid this.';
        doc.warnings.push(new YAMLWarning(cst, warn));
      }

      cst.resolved = seq;
      return seq;
    }

    function resolveBlockSeqItems(doc, cst) {
      var comments = [];
      var items = [];

      for (var i = 0; i < cst.items.length; ++i) {
        var item = cst.items[i];

        switch (item.type) {
          case Type.BLANK_LINE:
            comments.push({
              before: items.length
            });
            break;

          case Type.COMMENT:
            comments.push({
              comment: item.comment,
              before: items.length
            });
            break;

          case Type.SEQ_ITEM:
            if (item.error) doc.errors.push(item.error);
            items.push(resolveNode(doc, item.node));

            if (item.hasProps) {
              var msg = 'Sequence items cannot have tags or anchors before the - indicator';
              doc.errors.push(new YAMLSemanticError(item, msg));
            }

            break;

          default:
            if (item.error) doc.errors.push(item.error);
            doc.errors.push(new YAMLSyntaxError(item, "Unexpected ".concat(item.type, " node in sequence")));
        }
      }

      return {
        comments: comments,
        items: items
      };
    }

    function resolveFlowSeqItems(doc, cst) {
      var comments = [];
      var items = [];
      var explicitKey = false;
      var key = undefined;
      var keyStart = null;
      var next = '[';
      var prevItem = null;

      for (var i = 0; i < cst.items.length; ++i) {
        var item = cst.items[i];

        if (typeof item.char === 'string') {
          var char = item.char,
              offset = item.offset;

          if (char !== ':' && (explicitKey || key !== undefined)) {
            if (explicitKey && key === undefined) key = next ? items.pop() : null;
            items.push(new Pair(key));
            explicitKey = false;
            key = undefined;
            keyStart = null;
          }

          if (char === next) {
            next = null;
          } else if (!next && char === '?') {
            explicitKey = true;
          } else if (next !== '[' && char === ':' && key === undefined) {
            if (next === ',') {
              key = items.pop();

              if (key instanceof Pair) {
                var msg = 'Chaining flow sequence pairs is invalid';
                var err = new YAMLSemanticError(cst, msg);
                err.offset = offset;
                doc.errors.push(err);
              }

              if (!explicitKey && typeof keyStart === 'number') {
                var keyEnd = item.range ? item.range.start : item.offset;
                if (keyEnd > keyStart + 1024) doc.errors.push(getLongKeyError(cst, key));
                var src = prevItem.context.src;

                for (var _i = keyStart; _i < keyEnd; ++_i) {
                  if (src[_i] === '\n') {
                    var _msg = 'Implicit keys of flow sequence pairs need to be on a single line';
                    doc.errors.push(new YAMLSemanticError(prevItem, _msg));
                    break;
                  }
                }
              }
            } else {
              key = null;
            }

            keyStart = null;
            explicitKey = false;
            next = null;
          } else if (next === '[' || char !== ']' || i < cst.items.length - 1) {
            var _msg2 = "Flow sequence contains an unexpected ".concat(char);

            var _err = new YAMLSyntaxError(cst, _msg2);

            _err.offset = offset;
            doc.errors.push(_err);
          }
        } else if (item.type === Type.BLANK_LINE) {
          comments.push({
            before: items.length
          });
        } else if (item.type === Type.COMMENT) {
          checkFlowCommentSpace(doc.errors, item);
          comments.push({
            comment: item.comment,
            before: items.length
          });
        } else {
          if (next) {
            var _msg3 = "Expected a ".concat(next, " in flow sequence");

            doc.errors.push(new YAMLSemanticError(item, _msg3));
          }

          var value = resolveNode(doc, item);

          if (key === undefined) {
            items.push(value);
            prevItem = item;
          } else {
            items.push(new Pair(key, value));
            key = undefined;
          }

          keyStart = item.range.start;
          next = ',';
        }
      }

      checkFlowCollectionEnd(doc.errors, cst);
      if (key !== undefined) items.push(new Pair(key));
      return {
        comments: comments,
        items: items
      };
    }

    /* global atob, btoa, Buffer */
    var binary = {
      identify: function identify(value) {
        return value instanceof Uint8Array;
      },
      // Buffer inherits from Uint8Array
      default: false,
      tag: 'tag:yaml.org,2002:binary',

      /**
       * Returns a Buffer in node and an Uint8Array in browsers
       *
       * To use the resulting buffer as an image, you'll want to do something like:
       *
       *   const blob = new Blob([buffer], { type: 'image/jpeg' })
       *   document.querySelector('#photo').src = URL.createObjectURL(blob)
       */
      resolve: function resolve(doc, node) {
        var src = resolveString(doc, node);

        if (typeof Buffer === 'function') {
          return Buffer.from(src, 'base64');
        } else if (typeof atob === 'function') {
          // On IE 11, atob() can't handle newlines
          var str = atob(src.replace(/[\n\r]/g, ''));
          var buffer = new Uint8Array(str.length);

          for (var i = 0; i < str.length; ++i) {
            buffer[i] = str.charCodeAt(i);
          }

          return buffer;
        } else {
          var msg = 'This environment does not support reading binary tags; either Buffer or atob is required';
          doc.errors.push(new YAMLReferenceError(node, msg));
          return null;
        }
      },
      options: binaryOptions,
      stringify: function stringify(_ref, ctx, onComment, onChompKeep) {
        var comment = _ref.comment,
            type = _ref.type,
            value = _ref.value;
        var src;

        if (typeof Buffer === 'function') {
          src = value instanceof Buffer ? value.toString('base64') : Buffer.from(value.buffer).toString('base64');
        } else if (typeof btoa === 'function') {
          var s = '';

          for (var i = 0; i < value.length; ++i) {
            s += String.fromCharCode(value[i]);
          }

          src = btoa(s);
        } else {
          throw new Error('This environment does not support writing binary tags; either Buffer or btoa is required');
        }

        if (!type) type = binaryOptions.defaultType;

        if (type === Type.QUOTE_DOUBLE) {
          value = src;
        } else {
          var lineWidth = binaryOptions.lineWidth;
          var n = Math.ceil(src.length / lineWidth);
          var lines = new Array(n);

          for (var _i = 0, o = 0; _i < n; ++_i, o += lineWidth) {
            lines[_i] = src.substr(o, lineWidth);
          }

          value = lines.join(type === Type.BLOCK_LITERAL ? '\n' : ' ');
        }

        return stringifyString({
          comment: comment,
          type: type,
          value: value
        }, ctx, onComment, onChompKeep);
      }
    };

    function parsePairs(doc, cst) {
      var seq = resolveSeq(doc, cst);

      for (var i = 0; i < seq.items.length; ++i) {
        var item = seq.items[i];
        if (item instanceof Pair) continue;else if (item instanceof YAMLMap) {
          if (item.items.length > 1) {
            var msg = 'Each pair must have its own sequence indicator';
            throw new YAMLSemanticError(cst, msg);
          }

          var pair = item.items[0] || new Pair();
          if (item.commentBefore) pair.commentBefore = pair.commentBefore ? "".concat(item.commentBefore, "\n").concat(pair.commentBefore) : item.commentBefore;
          if (item.comment) pair.comment = pair.comment ? "".concat(item.comment, "\n").concat(pair.comment) : item.comment;
          item = pair;
        }
        seq.items[i] = item instanceof Pair ? item : new Pair(item);
      }

      return seq;
    }
    function createPairs(schema, iterable, ctx) {
      var pairs = new YAMLSeq(schema);
      pairs.tag = 'tag:yaml.org,2002:pairs';

      var _iterator = _createForOfIteratorHelper(iterable),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var it = _step.value;
          var key = void 0,
              value = void 0;

          if (Array.isArray(it)) {
            if (it.length === 2) {
              key = it[0];
              value = it[1];
            } else throw new TypeError("Expected [key, value] tuple: ".concat(it));
          } else if (it && it instanceof Object) {
            var keys = Object.keys(it);

            if (keys.length === 1) {
              key = keys[0];
              value = it[key];
            } else throw new TypeError("Expected { key: value } tuple: ".concat(it));
          } else {
            key = it;
          }

          var pair = schema.createPair(key, value, ctx);
          pairs.items.push(pair);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return pairs;
    }
    var pairs = {
      default: false,
      tag: 'tag:yaml.org,2002:pairs',
      resolve: parsePairs,
      createNode: createPairs
    };

    var YAMLOMap = /*#__PURE__*/function (_YAMLSeq) {
      _inherits(YAMLOMap, _YAMLSeq);

      var _super = _createSuper(YAMLOMap);

      function YAMLOMap() {
        var _this;

        _classCallCheck(this, YAMLOMap);

        _this = _super.call(this);

        _defineProperty(_assertThisInitialized(_this), "add", YAMLMap.prototype.add.bind(_assertThisInitialized(_this)));

        _defineProperty(_assertThisInitialized(_this), "delete", YAMLMap.prototype.delete.bind(_assertThisInitialized(_this)));

        _defineProperty(_assertThisInitialized(_this), "get", YAMLMap.prototype.get.bind(_assertThisInitialized(_this)));

        _defineProperty(_assertThisInitialized(_this), "has", YAMLMap.prototype.has.bind(_assertThisInitialized(_this)));

        _defineProperty(_assertThisInitialized(_this), "set", YAMLMap.prototype.set.bind(_assertThisInitialized(_this)));

        _this.tag = YAMLOMap.tag;
        return _this;
      }

      _createClass(YAMLOMap, [{
        key: "toJSON",
        value: function toJSON$1(_, ctx) {
          var map = new Map();
          if (ctx && ctx.onCreate) ctx.onCreate(map);

          var _iterator = _createForOfIteratorHelper(this.items),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var pair = _step.value;
              var key = void 0,
                  value = void 0;

              if (pair instanceof Pair) {
                key = toJSON(pair.key, '', ctx);
                value = toJSON(pair.value, key, ctx);
              } else {
                key = toJSON(pair, '', ctx);
              }

              if (map.has(key)) throw new Error('Ordered maps must not include duplicate keys');
              map.set(key, value);
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }

          return map;
        }
      }]);

      return YAMLOMap;
    }(YAMLSeq);

    _defineProperty(YAMLOMap, "tag", 'tag:yaml.org,2002:omap');

    function parseOMap(doc, cst) {
      var pairs = parsePairs(doc, cst);
      var seenKeys = [];

      var _iterator2 = _createForOfIteratorHelper(pairs.items),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var key = _step2.value.key;

          if (key instanceof Scalar) {
            if (seenKeys.includes(key.value)) {
              var msg = 'Ordered maps must not include duplicate keys';
              throw new YAMLSemanticError(cst, msg);
            } else {
              seenKeys.push(key.value);
            }
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      return Object.assign(new YAMLOMap(), pairs);
    }

    function createOMap(schema, iterable, ctx) {
      var pairs = createPairs(schema, iterable, ctx);
      var omap = new YAMLOMap();
      omap.items = pairs.items;
      return omap;
    }

    var omap = {
      identify: function identify(value) {
        return value instanceof Map;
      },
      nodeClass: YAMLOMap,
      default: false,
      tag: 'tag:yaml.org,2002:omap',
      resolve: parseOMap,
      createNode: createOMap
    };

    var YAMLSet = /*#__PURE__*/function (_YAMLMap) {
      _inherits(YAMLSet, _YAMLMap);

      var _super = _createSuper(YAMLSet);

      function YAMLSet() {
        var _this;

        _classCallCheck(this, YAMLSet);

        _this = _super.call(this);
        _this.tag = YAMLSet.tag;
        return _this;
      }

      _createClass(YAMLSet, [{
        key: "add",
        value: function add(key) {
          var pair = key instanceof Pair ? key : new Pair(key);
          var prev = findPair(this.items, pair.key);
          if (!prev) this.items.push(pair);
        }
      }, {
        key: "get",
        value: function get(key, keepPair) {
          var pair = findPair(this.items, key);
          return !keepPair && pair instanceof Pair ? pair.key instanceof Scalar ? pair.key.value : pair.key : pair;
        }
      }, {
        key: "set",
        value: function set(key, value) {
          if (typeof value !== 'boolean') throw new Error("Expected boolean value for set(key, value) in a YAML set, not ".concat(_typeof(value)));
          var prev = findPair(this.items, key);

          if (prev && !value) {
            this.items.splice(this.items.indexOf(prev), 1);
          } else if (!prev && value) {
            this.items.push(new Pair(key));
          }
        }
      }, {
        key: "toJSON",
        value: function toJSON(_, ctx) {
          return _get(_getPrototypeOf(YAMLSet.prototype), "toJSON", this).call(this, _, ctx, Set);
        }
      }, {
        key: "toString",
        value: function toString(ctx, onComment, onChompKeep) {
          if (!ctx) return JSON.stringify(this);
          if (this.hasAllNullValues()) return _get(_getPrototypeOf(YAMLSet.prototype), "toString", this).call(this, ctx, onComment, onChompKeep);else throw new Error('Set items must all have null values');
        }
      }]);

      return YAMLSet;
    }(YAMLMap);

    _defineProperty(YAMLSet, "tag", 'tag:yaml.org,2002:set');

    function parseSet(doc, cst) {
      var map = resolveMap(doc, cst);
      if (!map.hasAllNullValues()) throw new YAMLSemanticError(cst, 'Set items must all have null values');
      return Object.assign(new YAMLSet(), map);
    }

    function createSet(schema, iterable, ctx) {
      var set = new YAMLSet();

      var _iterator = _createForOfIteratorHelper(iterable),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var value = _step.value;
          set.items.push(schema.createPair(value, null, ctx));
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return set;
    }

    var set = {
      identify: function identify(value) {
        return value instanceof Set;
      },
      nodeClass: YAMLSet,
      default: false,
      tag: 'tag:yaml.org,2002:set',
      resolve: parseSet,
      createNode: createSet
    };

    var parseSexagesimal = function parseSexagesimal(sign, parts) {
      var n = parts.split(':').reduce(function (n, p) {
        return n * 60 + Number(p);
      }, 0);
      return sign === '-' ? -n : n;
    }; // hhhh:mm:ss.sss


    var stringifySexagesimal = function stringifySexagesimal(_ref) {
      var value = _ref.value;
      if (isNaN(value) || !isFinite(value)) return stringifyNumber(value);
      var sign = '';

      if (value < 0) {
        sign = '-';
        value = Math.abs(value);
      }

      var parts = [value % 60]; // seconds, including ms

      if (value < 60) {
        parts.unshift(0); // at least one : is required
      } else {
        value = Math.round((value - parts[0]) / 60);
        parts.unshift(value % 60); // minutes

        if (value >= 60) {
          value = Math.round((value - parts[0]) / 60);
          parts.unshift(value); // hours
        }
      }

      return sign + parts.map(function (n) {
        return n < 10 ? '0' + String(n) : String(n);
      }).join(':').replace(/000000\d*$/, '') // % 60 may introduce error
      ;
    };

    var intTime = {
      identify: function identify(value) {
        return typeof value === 'number';
      },
      default: true,
      tag: 'tag:yaml.org,2002:int',
      format: 'TIME',
      test: /^([-+]?)([0-9][0-9_]*(?::[0-5]?[0-9])+)$/,
      resolve: function resolve(str, sign, parts) {
        return parseSexagesimal(sign, parts.replace(/_/g, ''));
      },
      stringify: stringifySexagesimal
    };
    var floatTime = {
      identify: function identify(value) {
        return typeof value === 'number';
      },
      default: true,
      tag: 'tag:yaml.org,2002:float',
      format: 'TIME',
      test: /^([-+]?)([0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*)$/,
      resolve: function resolve(str, sign, parts) {
        return parseSexagesimal(sign, parts.replace(/_/g, ''));
      },
      stringify: stringifySexagesimal
    };
    var timestamp = {
      identify: function identify(value) {
        return value instanceof Date;
      },
      default: true,
      tag: 'tag:yaml.org,2002:timestamp',
      // If the time zone is omitted, the timestamp is assumed to be specified in UTC. The time part
      // may be omitted altogether, resulting in a date format. In such a case, the time part is
      // assumed to be 00:00:00Z (start of day, UTC).
      test: RegExp('^(?:' + '([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})' + // YYYY-Mm-Dd
      '(?:(?:t|T|[ \\t]+)' + // t | T | whitespace
      '([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)' + // Hh:Mm:Ss(.ss)?
      '(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?' + // Z | +5 | -03:30
      ')?' + ')$'),
      resolve: function resolve(str, year, month, day, hour, minute, second, millisec, tz) {
        if (millisec) millisec = (millisec + '00').substr(1, 3);
        var date = Date.UTC(year, month - 1, day, hour || 0, minute || 0, second || 0, millisec || 0);

        if (tz && tz !== 'Z') {
          var d = parseSexagesimal(tz[0], tz.slice(1));
          if (Math.abs(d) < 30) d *= 60;
          date -= 60000 * d;
        }

        return new Date(date);
      },
      stringify: function stringify(_ref2) {
        var value = _ref2.value;
        return value.toISOString().replace(/((T00:00)?:00)?\.000Z$/, '');
      }
    };

    /* global console, process, YAML_SILENCE_DEPRECATION_WARNINGS, YAML_SILENCE_WARNINGS */
    function shouldWarn(deprecation) {
      var env = typeof process !== 'undefined' && process.env || {};

      if (deprecation) {
        if (typeof YAML_SILENCE_DEPRECATION_WARNINGS !== 'undefined') return !YAML_SILENCE_DEPRECATION_WARNINGS;
        return !env.YAML_SILENCE_DEPRECATION_WARNINGS;
      }

      if (typeof YAML_SILENCE_WARNINGS !== 'undefined') return !YAML_SILENCE_WARNINGS;
      return !env.YAML_SILENCE_WARNINGS;
    }

    function warn(warning, type) {
      if (shouldWarn(false)) {
        var emit = typeof process !== 'undefined' && process.emitWarning; // This will throw in Jest if `warning` is an Error instance due to
        // https://github.com/facebook/jest/issues/2549

        if (emit) emit(warning, type);else {
          // eslint-disable-next-line no-console
          console.warn(type ? "".concat(type, ": ").concat(warning) : warning);
        }
      }
    }
    var warned = {};
    function warnOptionDeprecation(name, alternative) {
      if (!warned[name] && shouldWarn(true)) {
        warned[name] = true;
        var msg = "The option '".concat(name, "' will be removed in a future release");
        msg += alternative ? ", use '".concat(alternative, "' instead.") : '.';
        warn(msg, 'DeprecationWarning');
      }
    }

    function createMap(schema, obj, ctx) {
      var map = new YAMLMap(schema);

      if (obj instanceof Map) {
        var _iterator = _createForOfIteratorHelper(obj),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var _step$value = _slicedToArray(_step.value, 2),
                key = _step$value[0],
                value = _step$value[1];

            map.items.push(schema.createPair(key, value, ctx));
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      } else if (obj && _typeof(obj) === 'object') {
        for (var _i = 0, _Object$keys = Object.keys(obj); _i < _Object$keys.length; _i++) {
          var _key = _Object$keys[_i];
          map.items.push(schema.createPair(_key, obj[_key], ctx));
        }
      }

      if (typeof schema.sortMapEntries === 'function') {
        map.items.sort(schema.sortMapEntries);
      }

      return map;
    }

    var map = {
      createNode: createMap,
      default: true,
      nodeClass: YAMLMap,
      tag: 'tag:yaml.org,2002:map',
      resolve: resolveMap
    };

    function createSeq(schema, obj, ctx) {
      var seq = new YAMLSeq(schema);

      if (obj && obj[Symbol.iterator]) {
        var _iterator = _createForOfIteratorHelper(obj),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var it = _step.value;
            var v = schema.createNode(it, ctx.wrapScalars, null, ctx);
            seq.items.push(v);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }

      return seq;
    }

    var seq = {
      createNode: createSeq,
      default: true,
      nodeClass: YAMLSeq,
      tag: 'tag:yaml.org,2002:seq',
      resolve: resolveSeq
    };

    var string = {
      identify: function identify(value) {
        return typeof value === 'string';
      },
      default: true,
      tag: 'tag:yaml.org,2002:str',
      resolve: resolveString,
      stringify: function stringify(item, ctx, onComment, onChompKeep) {
        ctx = Object.assign({
          actualString: true
        }, ctx);
        return stringifyString(item, ctx, onComment, onChompKeep);
      },
      options: strOptions
    };

    var failsafe = [map, seq, string];

    /* global BigInt */

    var intIdentify$2 = function intIdentify(value) {
      return typeof value === 'bigint' || Number.isInteger(value);
    };

    var intResolve$1 = function intResolve(src, part, radix) {
      return intOptions.asBigInt ? BigInt(src) : parseInt(part, radix);
    };

    function intStringify$1(node, radix, prefix) {
      var value = node.value;
      if (intIdentify$2(value) && value >= 0) return prefix + value.toString(radix);
      return stringifyNumber(node);
    }

    var nullObj = {
      identify: function identify(value) {
        return value == null;
      },
      createNode: function createNode(schema, value, ctx) {
        return ctx.wrapScalars ? new Scalar(null) : null;
      },
      default: true,
      tag: 'tag:yaml.org,2002:null',
      test: /^(?:~|[Nn]ull|NULL)?$/,
      resolve: function resolve() {
        return null;
      },
      options: nullOptions,
      stringify: function stringify() {
        return nullOptions.nullStr;
      }
    };
    var boolObj = {
      identify: function identify(value) {
        return typeof value === 'boolean';
      },
      default: true,
      tag: 'tag:yaml.org,2002:bool',
      test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
      resolve: function resolve(str) {
        return str[0] === 't' || str[0] === 'T';
      },
      options: boolOptions,
      stringify: function stringify(_ref) {
        var value = _ref.value;
        return value ? boolOptions.trueStr : boolOptions.falseStr;
      }
    };
    var octObj = {
      identify: function identify(value) {
        return intIdentify$2(value) && value >= 0;
      },
      default: true,
      tag: 'tag:yaml.org,2002:int',
      format: 'OCT',
      test: /^0o([0-7]+)$/,
      resolve: function resolve(str, oct) {
        return intResolve$1(str, oct, 8);
      },
      options: intOptions,
      stringify: function stringify(node) {
        return intStringify$1(node, 8, '0o');
      }
    };
    var intObj = {
      identify: intIdentify$2,
      default: true,
      tag: 'tag:yaml.org,2002:int',
      test: /^[-+]?[0-9]+$/,
      resolve: function resolve(str) {
        return intResolve$1(str, str, 10);
      },
      options: intOptions,
      stringify: stringifyNumber
    };
    var hexObj = {
      identify: function identify(value) {
        return intIdentify$2(value) && value >= 0;
      },
      default: true,
      tag: 'tag:yaml.org,2002:int',
      format: 'HEX',
      test: /^0x([0-9a-fA-F]+)$/,
      resolve: function resolve(str, hex) {
        return intResolve$1(str, hex, 16);
      },
      options: intOptions,
      stringify: function stringify(node) {
        return intStringify$1(node, 16, '0x');
      }
    };
    var nanObj = {
      identify: function identify(value) {
        return typeof value === 'number';
      },
      default: true,
      tag: 'tag:yaml.org,2002:float',
      test: /^(?:[-+]?\.inf|(\.nan))$/i,
      resolve: function resolve(str, nan) {
        return nan ? NaN : str[0] === '-' ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
      },
      stringify: stringifyNumber
    };
    var expObj = {
      identify: function identify(value) {
        return typeof value === 'number';
      },
      default: true,
      tag: 'tag:yaml.org,2002:float',
      format: 'EXP',
      test: /^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,
      resolve: function resolve(str) {
        return parseFloat(str);
      },
      stringify: function stringify(_ref2) {
        var value = _ref2.value;
        return Number(value).toExponential();
      }
    };
    var floatObj = {
      identify: function identify(value) {
        return typeof value === 'number';
      },
      default: true,
      tag: 'tag:yaml.org,2002:float',
      test: /^[-+]?(?:\.([0-9]+)|[0-9]+\.([0-9]*))$/,
      resolve: function resolve(str, frac1, frac2) {
        var frac = frac1 || frac2;
        var node = new Scalar(parseFloat(str));
        if (frac && frac[frac.length - 1] === '0') node.minFractionDigits = frac.length;
        return node;
      },
      stringify: stringifyNumber
    };
    var core = failsafe.concat([nullObj, boolObj, octObj, intObj, hexObj, nanObj, expObj, floatObj]);

    /* global BigInt */

    var intIdentify$1 = function intIdentify(value) {
      return typeof value === 'bigint' || Number.isInteger(value);
    };

    var stringifyJSON = function stringifyJSON(_ref) {
      var value = _ref.value;
      return JSON.stringify(value);
    };

    var json = [map, seq, {
      identify: function identify(value) {
        return typeof value === 'string';
      },
      default: true,
      tag: 'tag:yaml.org,2002:str',
      resolve: resolveString,
      stringify: stringifyJSON
    }, {
      identify: function identify(value) {
        return value == null;
      },
      createNode: function createNode(schema, value, ctx) {
        return ctx.wrapScalars ? new Scalar(null) : null;
      },
      default: true,
      tag: 'tag:yaml.org,2002:null',
      test: /^null$/,
      resolve: function resolve() {
        return null;
      },
      stringify: stringifyJSON
    }, {
      identify: function identify(value) {
        return typeof value === 'boolean';
      },
      default: true,
      tag: 'tag:yaml.org,2002:bool',
      test: /^true|false$/,
      resolve: function resolve(str) {
        return str === 'true';
      },
      stringify: stringifyJSON
    }, {
      identify: intIdentify$1,
      default: true,
      tag: 'tag:yaml.org,2002:int',
      test: /^-?(?:0|[1-9][0-9]*)$/,
      resolve: function resolve(str) {
        return intOptions.asBigInt ? BigInt(str) : parseInt(str, 10);
      },
      stringify: function stringify(_ref2) {
        var value = _ref2.value;
        return intIdentify$1(value) ? value.toString() : JSON.stringify(value);
      }
    }, {
      identify: function identify(value) {
        return typeof value === 'number';
      },
      default: true,
      tag: 'tag:yaml.org,2002:float',
      test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
      resolve: function resolve(str) {
        return parseFloat(str);
      },
      stringify: stringifyJSON
    }];

    json.scalarFallback = function (str) {
      throw new SyntaxError("Unresolved plain scalar ".concat(JSON.stringify(str)));
    };

    /* global BigInt */

    var boolStringify = function boolStringify(_ref) {
      var value = _ref.value;
      return value ? boolOptions.trueStr : boolOptions.falseStr;
    };

    var intIdentify = function intIdentify(value) {
      return typeof value === 'bigint' || Number.isInteger(value);
    };

    function intResolve(sign, src, radix) {
      var str = src.replace(/_/g, '');

      if (intOptions.asBigInt) {
        switch (radix) {
          case 2:
            str = "0b".concat(str);
            break;

          case 8:
            str = "0o".concat(str);
            break;

          case 16:
            str = "0x".concat(str);
            break;
        }

        var _n = BigInt(str);

        return sign === '-' ? BigInt(-1) * _n : _n;
      }

      var n = parseInt(str, radix);
      return sign === '-' ? -1 * n : n;
    }

    function intStringify(node, radix, prefix) {
      var value = node.value;

      if (intIdentify(value)) {
        var str = value.toString(radix);
        return value < 0 ? '-' + prefix + str.substr(1) : prefix + str;
      }

      return stringifyNumber(node);
    }

    var yaml11 = failsafe.concat([{
      identify: function identify(value) {
        return value == null;
      },
      createNode: function createNode(schema, value, ctx) {
        return ctx.wrapScalars ? new Scalar(null) : null;
      },
      default: true,
      tag: 'tag:yaml.org,2002:null',
      test: /^(?:~|[Nn]ull|NULL)?$/,
      resolve: function resolve() {
        return null;
      },
      options: nullOptions,
      stringify: function stringify() {
        return nullOptions.nullStr;
      }
    }, {
      identify: function identify(value) {
        return typeof value === 'boolean';
      },
      default: true,
      tag: 'tag:yaml.org,2002:bool',
      test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
      resolve: function resolve() {
        return true;
      },
      options: boolOptions,
      stringify: boolStringify
    }, {
      identify: function identify(value) {
        return typeof value === 'boolean';
      },
      default: true,
      tag: 'tag:yaml.org,2002:bool',
      test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/i,
      resolve: function resolve() {
        return false;
      },
      options: boolOptions,
      stringify: boolStringify
    }, {
      identify: intIdentify,
      default: true,
      tag: 'tag:yaml.org,2002:int',
      format: 'BIN',
      test: /^([-+]?)0b([0-1_]+)$/,
      resolve: function resolve(str, sign, bin) {
        return intResolve(sign, bin, 2);
      },
      stringify: function stringify(node) {
        return intStringify(node, 2, '0b');
      }
    }, {
      identify: intIdentify,
      default: true,
      tag: 'tag:yaml.org,2002:int',
      format: 'OCT',
      test: /^([-+]?)0([0-7_]+)$/,
      resolve: function resolve(str, sign, oct) {
        return intResolve(sign, oct, 8);
      },
      stringify: function stringify(node) {
        return intStringify(node, 8, '0');
      }
    }, {
      identify: intIdentify,
      default: true,
      tag: 'tag:yaml.org,2002:int',
      test: /^([-+]?)([0-9][0-9_]*)$/,
      resolve: function resolve(str, sign, abs) {
        return intResolve(sign, abs, 10);
      },
      stringify: stringifyNumber
    }, {
      identify: intIdentify,
      default: true,
      tag: 'tag:yaml.org,2002:int',
      format: 'HEX',
      test: /^([-+]?)0x([0-9a-fA-F_]+)$/,
      resolve: function resolve(str, sign, hex) {
        return intResolve(sign, hex, 16);
      },
      stringify: function stringify(node) {
        return intStringify(node, 16, '0x');
      }
    }, {
      identify: function identify(value) {
        return typeof value === 'number';
      },
      default: true,
      tag: 'tag:yaml.org,2002:float',
      test: /^(?:[-+]?\.inf|(\.nan))$/i,
      resolve: function resolve(str, nan) {
        return nan ? NaN : str[0] === '-' ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
      },
      stringify: stringifyNumber
    }, {
      identify: function identify(value) {
        return typeof value === 'number';
      },
      default: true,
      tag: 'tag:yaml.org,2002:float',
      format: 'EXP',
      test: /^[-+]?([0-9][0-9_]*)?(\.[0-9_]*)?[eE][-+]?[0-9]+$/,
      resolve: function resolve(str) {
        return parseFloat(str.replace(/_/g, ''));
      },
      stringify: function stringify(_ref2) {
        var value = _ref2.value;
        return Number(value).toExponential();
      }
    }, {
      identify: function identify(value) {
        return typeof value === 'number';
      },
      default: true,
      tag: 'tag:yaml.org,2002:float',
      test: /^[-+]?(?:[0-9][0-9_]*)?\.([0-9_]*)$/,
      resolve: function resolve(str, frac) {
        var node = new Scalar(parseFloat(str.replace(/_/g, '')));

        if (frac) {
          var f = frac.replace(/_/g, '');
          if (f[f.length - 1] === '0') node.minFractionDigits = f.length;
        }

        return node;
      },
      stringify: stringifyNumber
    }], binary, omap, pairs, set, intTime, floatTime, timestamp);

    var schemas = {
      core: core,
      failsafe: failsafe,
      json: json,
      yaml11: yaml11
    };
    var tags = {
      binary: binary,
      bool: boolObj,
      float: floatObj,
      floatExp: expObj,
      floatNaN: nanObj,
      floatTime: floatTime,
      int: intObj,
      intHex: hexObj,
      intOct: octObj,
      intTime: intTime,
      map: map,
      null: nullObj,
      omap: omap,
      pairs: pairs,
      seq: seq,
      set: set,
      timestamp: timestamp
    };

    function findTagObject(value, tagName, tags) {
      if (tagName) {
        var match = tags.filter(function (t) {
          return t.tag === tagName;
        });
        var tagObj = match.find(function (t) {
          return !t.format;
        }) || match[0];
        if (!tagObj) throw new Error("Tag ".concat(tagName, " not found"));
        return tagObj;
      } // TODO: deprecate/remove class check


      return tags.find(function (t) {
        return (t.identify && t.identify(value) || t.class && value instanceof t.class) && !t.format;
      });
    }

    function createNode$1(value, tagName, ctx) {
      if (value instanceof Node) return value;
      var defaultPrefix = ctx.defaultPrefix,
          onTagObj = ctx.onTagObj,
          prevObjects = ctx.prevObjects,
          schema = ctx.schema,
          wrapScalars = ctx.wrapScalars;
      if (tagName && tagName.startsWith('!!')) tagName = defaultPrefix + tagName.slice(2);
      var tagObj = findTagObject(value, tagName, schema.tags);

      if (!tagObj) {
        if (typeof value.toJSON === 'function') value = value.toJSON();
        if (!value || _typeof(value) !== 'object') return wrapScalars ? new Scalar(value) : value;
        tagObj = value instanceof Map ? map : value[Symbol.iterator] ? seq : map;
      }

      if (onTagObj) {
        onTagObj(tagObj);
        delete ctx.onTagObj;
      } // Detect duplicate references to the same object & use Alias nodes for all
      // after first. The `obj` wrapper allows for circular references to resolve.


      var obj = {
        value: undefined,
        node: undefined
      };

      if (value && _typeof(value) === 'object' && prevObjects) {
        var prev = prevObjects.get(value);

        if (prev) {
          var alias = new Alias(prev); // leaves source dirty; must be cleaned by caller

          ctx.aliasNodes.push(alias); // defined along with prevObjects

          return alias;
        }

        obj.value = value;
        prevObjects.set(value, obj);
      }

      obj.node = tagObj.createNode ? tagObj.createNode(ctx.schema, value, ctx) : wrapScalars ? new Scalar(value) : value;
      if (tagName && obj.node instanceof Node) obj.node.tag = tagName;
      return obj.node;
    }

    function getSchemaTags(schemas, knownTags, customTags, schemaId) {
      var tags = schemas[schemaId.replace(/\W/g, '')]; // 'yaml-1.1' -> 'yaml11'

      if (!tags) {
        var keys = Object.keys(schemas).map(function (key) {
          return JSON.stringify(key);
        }).join(', ');
        throw new Error("Unknown schema \"".concat(schemaId, "\"; use one of ").concat(keys));
      }

      if (Array.isArray(customTags)) {
        var _iterator = _createForOfIteratorHelper(customTags),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var tag = _step.value;
            tags = tags.concat(tag);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      } else if (typeof customTags === 'function') {
        tags = customTags(tags.slice());
      }

      for (var i = 0; i < tags.length; ++i) {
        var _tag = tags[i];

        if (typeof _tag === 'string') {
          var tagObj = knownTags[_tag];

          if (!tagObj) {
            var _keys = Object.keys(knownTags).map(function (key) {
              return JSON.stringify(key);
            }).join(', ');

            throw new Error("Unknown custom tag \"".concat(_tag, "\"; use one of ").concat(_keys));
          }

          tags[i] = tagObj;
        }
      }

      return tags;
    }

    var sortMapEntriesByKey = function sortMapEntriesByKey(a, b) {
      return a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
    };

    var Schema = /*#__PURE__*/function () {
      // TODO: remove in v2
      // TODO: remove in v2
      function Schema(_ref) {
        var customTags = _ref.customTags,
            merge = _ref.merge,
            schema = _ref.schema,
            sortMapEntries = _ref.sortMapEntries,
            deprecatedCustomTags = _ref.tags;

        _classCallCheck(this, Schema);

        this.merge = !!merge;
        this.name = schema;
        this.sortMapEntries = sortMapEntries === true ? sortMapEntriesByKey : sortMapEntries || null;
        if (!customTags && deprecatedCustomTags) warnOptionDeprecation('tags', 'customTags');
        this.tags = getSchemaTags(schemas, tags, customTags || deprecatedCustomTags, schema);
      }

      _createClass(Schema, [{
        key: "createNode",
        value: function createNode$1$1(value, wrapScalars, tagName, ctx) {
          var baseCtx = {
            defaultPrefix: Schema.defaultPrefix,
            schema: this,
            wrapScalars: wrapScalars
          };
          var createCtx = ctx ? Object.assign(ctx, baseCtx) : baseCtx;
          return createNode$1(value, tagName, createCtx);
        }
      }, {
        key: "createPair",
        value: function createPair(key, value, ctx) {
          if (!ctx) ctx = {
            wrapScalars: true
          };
          var k = this.createNode(key, ctx.wrapScalars, null, ctx);
          var v = this.createNode(value, ctx.wrapScalars, null, ctx);
          return new Pair(k, v);
        }
      }]);

      return Schema;
    }();

    _defineProperty(Schema, "defaultPrefix", defaultTagPrefix);

    _defineProperty(Schema, "defaultTags", defaultTags);

    var defaultOptions = {
      anchorPrefix: 'a',
      customTags: null,
      indent: 2,
      indentSeq: true,
      keepCstNodes: false,
      keepNodeTypes: true,
      keepBlobsInJSON: true,
      mapAsMap: false,
      maxAliasCount: 100,
      prettyErrors: false,
      // TODO Set true in v2
      simpleKeys: false,
      version: '1.2'
    };
    var scalarOptions = {
      get binary() {
        return binaryOptions;
      },

      set binary(opt) {
        Object.assign(binaryOptions, opt);
      },

      get bool() {
        return boolOptions;
      },

      set bool(opt) {
        Object.assign(boolOptions, opt);
      },

      get int() {
        return intOptions;
      },

      set int(opt) {
        Object.assign(intOptions, opt);
      },

      get null() {
        return nullOptions;
      },

      set null(opt) {
        Object.assign(nullOptions, opt);
      },

      get str() {
        return strOptions;
      },

      set str(opt) {
        Object.assign(strOptions, opt);
      }

    };
    var documentOptions = {
      '1.0': {
        schema: 'yaml-1.1',
        merge: true,
        tagPrefixes: [{
          handle: '!',
          prefix: defaultTagPrefix
        }, {
          handle: '!!',
          prefix: 'tag:private.yaml.org,2002:'
        }]
      },
      1.1: {
        schema: 'yaml-1.1',
        merge: true,
        tagPrefixes: [{
          handle: '!',
          prefix: '!'
        }, {
          handle: '!!',
          prefix: defaultTagPrefix
        }]
      },
      1.2: {
        schema: 'core',
        merge: false,
        tagPrefixes: [{
          handle: '!',
          prefix: '!'
        }, {
          handle: '!!',
          prefix: defaultTagPrefix
        }]
      }
    };

    function stringifyTag(doc, tag) {
      if ((doc.version || doc.options.version) === '1.0') {
        var priv = tag.match(/^tag:private\.yaml\.org,2002:([^:/]+)$/);
        if (priv) return '!' + priv[1];
        var vocab = tag.match(/^tag:([a-zA-Z0-9-]+)\.yaml\.org,2002:(.*)/);
        return vocab ? "!".concat(vocab[1], "/").concat(vocab[2]) : "!".concat(tag.replace(/^tag:/, ''));
      }

      var p = doc.tagPrefixes.find(function (p) {
        return tag.indexOf(p.prefix) === 0;
      });

      if (!p) {
        var dtp = doc.getDefaults().tagPrefixes;
        p = dtp && dtp.find(function (p) {
          return tag.indexOf(p.prefix) === 0;
        });
      }

      if (!p) return tag[0] === '!' ? tag : "!<".concat(tag, ">");
      var suffix = tag.substr(p.prefix.length).replace(/[!,[\]{}]/g, function (ch) {
        return {
          '!': '%21',
          ',': '%2C',
          '[': '%5B',
          ']': '%5D',
          '{': '%7B',
          '}': '%7D'
        }[ch];
      });
      return p.handle + suffix;
    }

    function getTagObject(tags, item) {
      if (item instanceof Alias) return Alias;

      if (item.tag) {
        var match = tags.filter(function (t) {
          return t.tag === item.tag;
        });
        if (match.length > 0) return match.find(function (t) {
          return t.format === item.format;
        }) || match[0];
      }

      var tagObj, obj;

      if (item instanceof Scalar) {
        obj = item.value; // TODO: deprecate/remove class check

        var _match = tags.filter(function (t) {
          return t.identify && t.identify(obj) || t.class && obj instanceof t.class;
        });

        tagObj = _match.find(function (t) {
          return t.format === item.format;
        }) || _match.find(function (t) {
          return !t.format;
        });
      } else {
        obj = item;
        tagObj = tags.find(function (t) {
          return t.nodeClass && obj instanceof t.nodeClass;
        });
      }

      if (!tagObj) {
        var name = obj && obj.constructor ? obj.constructor.name : _typeof(obj);
        throw new Error("Tag not resolved for ".concat(name, " value"));
      }

      return tagObj;
    } // needs to be called before value stringifier to allow for circular anchor refs


    function stringifyProps(node, tagObj, _ref) {
      var anchors = _ref.anchors,
          doc = _ref.doc;
      var props = [];
      var anchor = doc.anchors.getName(node);

      if (anchor) {
        anchors[anchor] = node;
        props.push("&".concat(anchor));
      }

      if (node.tag) {
        props.push(stringifyTag(doc, node.tag));
      } else if (!tagObj.default) {
        props.push(stringifyTag(doc, tagObj.tag));
      }

      return props.join(' ');
    }

    function stringify$1(item, ctx, onComment, onChompKeep) {
      var _ctx$doc = ctx.doc,
          anchors = _ctx$doc.anchors,
          schema = _ctx$doc.schema;
      var tagObj;

      if (!(item instanceof Node)) {
        var createCtx = {
          aliasNodes: [],
          onTagObj: function onTagObj(o) {
            return tagObj = o;
          },
          prevObjects: new Map()
        };
        item = schema.createNode(item, true, null, createCtx);

        var _iterator = _createForOfIteratorHelper(createCtx.aliasNodes),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var alias = _step.value;
            alias.source = alias.source.node;
            var name = anchors.getName(alias.source);

            if (!name) {
              name = anchors.newName();
              anchors.map[name] = alias.source;
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }

      if (item instanceof Pair) return item.toString(ctx, onComment, onChompKeep);
      if (!tagObj) tagObj = getTagObject(schema.tags, item);
      var props = stringifyProps(item, tagObj, ctx);
      if (props.length > 0) ctx.indentAtStart = (ctx.indentAtStart || 0) + props.length + 1;
      var str = typeof tagObj.stringify === 'function' ? tagObj.stringify(item, ctx, onComment, onChompKeep) : item instanceof Scalar ? stringifyString(item, ctx, onComment, onChompKeep) : item.toString(ctx, onComment, onChompKeep);
      if (!props) return str;
      return item instanceof Scalar || str[0] === '{' || str[0] === '[' ? "".concat(props, " ").concat(str) : "".concat(props, "\n").concat(ctx.indent).concat(str);
    }

    var Anchors = /*#__PURE__*/function () {
      function Anchors(prefix) {
        _classCallCheck(this, Anchors);

        _defineProperty(this, "map", Object.create(null));

        this.prefix = prefix;
      }

      _createClass(Anchors, [{
        key: "createAlias",
        value: function createAlias(node, name) {
          this.setAnchor(node, name);
          return new Alias(node);
        }
      }, {
        key: "createMergePair",
        value: function createMergePair() {
          var _this = this;

          var merge = new Merge();

          for (var _len = arguments.length, sources = new Array(_len), _key = 0; _key < _len; _key++) {
            sources[_key] = arguments[_key];
          }

          merge.value.items = sources.map(function (s) {
            if (s instanceof Alias) {
              if (s.source instanceof YAMLMap) return s;
            } else if (s instanceof YAMLMap) {
              return _this.createAlias(s);
            }

            throw new Error('Merge sources must be Map nodes or their Aliases');
          });
          return merge;
        }
      }, {
        key: "getName",
        value: function getName(node) {
          var map = this.map;
          return Object.keys(map).find(function (a) {
            return map[a] === node;
          });
        }
      }, {
        key: "getNames",
        value: function getNames() {
          return Object.keys(this.map);
        }
      }, {
        key: "getNode",
        value: function getNode(name) {
          return this.map[name];
        }
      }, {
        key: "newName",
        value: function newName(prefix) {
          if (!prefix) prefix = this.prefix;
          var names = Object.keys(this.map);

          for (var i = 1; true; ++i) {
            var name = "".concat(prefix).concat(i);
            if (!names.includes(name)) return name;
          }
        } // During parsing, map & aliases contain CST nodes

      }, {
        key: "resolveNodes",
        value: function resolveNodes() {
          var map = this.map,
              _cstAliases = this._cstAliases;
          Object.keys(map).forEach(function (a) {
            map[a] = map[a].resolved;
          });

          _cstAliases.forEach(function (a) {
            a.source = a.source.resolved;
          });

          delete this._cstAliases;
        }
      }, {
        key: "setAnchor",
        value: function setAnchor(node, name) {
          if (node != null && !Anchors.validAnchorNode(node)) {
            throw new Error('Anchors may only be set for Scalar, Seq and Map nodes');
          }

          if (name && /[\x00-\x19\s,[\]{}]/.test(name)) {
            throw new Error('Anchor names must not contain whitespace or control characters');
          }

          var map = this.map;
          var prev = node && Object.keys(map).find(function (a) {
            return map[a] === node;
          });

          if (prev) {
            if (!name) {
              return prev;
            } else if (prev !== name) {
              delete map[prev];
              map[name] = node;
            }
          } else {
            if (!name) {
              if (!node) return null;
              name = this.newName();
            }

            map[name] = node;
          }

          return name;
        }
      }], [{
        key: "validAnchorNode",
        value: function validAnchorNode(node) {
          return node instanceof Scalar || node instanceof YAMLSeq || node instanceof YAMLMap;
        }
      }]);

      return Anchors;
    }();

    var visit = function visit(node, tags) {
      if (node && _typeof(node) === 'object') {
        var tag = node.tag;

        if (node instanceof Collection) {
          if (tag) tags[tag] = true;
          node.items.forEach(function (n) {
            return visit(n, tags);
          });
        } else if (node instanceof Pair) {
          visit(node.key, tags);
          visit(node.value, tags);
        } else if (node instanceof Scalar) {
          if (tag) tags[tag] = true;
        }
      }

      return tags;
    };

    var listTagNames = function listTagNames(node) {
      return Object.keys(visit(node, {}));
    };

    function parseContents(doc, contents) {
      var comments = {
        before: [],
        after: []
      };
      var body = undefined;
      var spaceBefore = false;

      var _iterator = _createForOfIteratorHelper(contents),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var node = _step.value;

          if (node.valueRange) {
            if (body !== undefined) {
              var msg = 'Document contains trailing content not separated by a ... or --- line';
              doc.errors.push(new YAMLSyntaxError(node, msg));
              break;
            }

            var res = resolveNode(doc, node);

            if (spaceBefore) {
              res.spaceBefore = true;
              spaceBefore = false;
            }

            body = res;
          } else if (node.comment !== null) {
            var cc = body === undefined ? comments.before : comments.after;
            cc.push(node.comment);
          } else if (node.type === Type.BLANK_LINE) {
            spaceBefore = true;

            if (body === undefined && comments.before.length > 0 && !doc.commentBefore) {
              // space-separated comments at start are parsed as document comments
              doc.commentBefore = comments.before.join('\n');
              comments.before = [];
            }
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      doc.contents = body || null;

      if (!body) {
        doc.comment = comments.before.concat(comments.after).join('\n') || null;
      } else {
        var cb = comments.before.join('\n');

        if (cb) {
          var cbNode = body instanceof Collection && body.items[0] ? body.items[0] : body;
          cbNode.commentBefore = cbNode.commentBefore ? "".concat(cb, "\n").concat(cbNode.commentBefore) : cb;
        }

        doc.comment = comments.after.join('\n') || null;
      }
    }

    function resolveTagDirective(_ref, directive) {
      var tagPrefixes = _ref.tagPrefixes;

      var _directive$parameters = _slicedToArray(directive.parameters, 2),
          handle = _directive$parameters[0],
          prefix = _directive$parameters[1];

      if (!handle || !prefix) {
        var msg = 'Insufficient parameters given for %TAG directive';
        throw new YAMLSemanticError(directive, msg);
      }

      if (tagPrefixes.some(function (p) {
        return p.handle === handle;
      })) {
        var _msg = 'The %TAG directive must only be given at most once per handle in the same document.';
        throw new YAMLSemanticError(directive, _msg);
      }

      return {
        handle: handle,
        prefix: prefix
      };
    }

    function resolveYamlDirective(doc, directive) {
      var _directive$parameters2 = _slicedToArray(directive.parameters, 1),
          version = _directive$parameters2[0];

      if (directive.name === 'YAML:1.0') version = '1.0';

      if (!version) {
        var msg = 'Insufficient parameters given for %YAML directive';
        throw new YAMLSemanticError(directive, msg);
      }

      if (!documentOptions[version]) {
        var v0 = doc.version || doc.options.version;

        var _msg2 = "Document will be parsed as YAML ".concat(v0, " rather than YAML ").concat(version);

        doc.warnings.push(new YAMLWarning(directive, _msg2));
      }

      return version;
    }

    function parseDirectives(doc, directives, prevDoc) {
      var directiveComments = [];
      var hasDirectives = false;

      var _iterator = _createForOfIteratorHelper(directives),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var directive = _step.value;
          var comment = directive.comment,
              name = directive.name;

          switch (name) {
            case 'TAG':
              try {
                doc.tagPrefixes.push(resolveTagDirective(doc, directive));
              } catch (error) {
                doc.errors.push(error);
              }

              hasDirectives = true;
              break;

            case 'YAML':
            case 'YAML:1.0':
              if (doc.version) {
                var msg = 'The %YAML directive must only be given at most once per document.';
                doc.errors.push(new YAMLSemanticError(directive, msg));
              }

              try {
                doc.version = resolveYamlDirective(doc, directive);
              } catch (error) {
                doc.errors.push(error);
              }

              hasDirectives = true;
              break;

            default:
              if (name) {
                var _msg3 = "YAML only supports %TAG and %YAML directives, and not %".concat(name);

                doc.warnings.push(new YAMLWarning(directive, _msg3));
              }

          }

          if (comment) directiveComments.push(comment);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      if (prevDoc && !hasDirectives && '1.1' === (doc.version || prevDoc.version || doc.options.version)) {
        var copyTagPrefix = function copyTagPrefix(_ref2) {
          var handle = _ref2.handle,
              prefix = _ref2.prefix;
          return {
            handle: handle,
            prefix: prefix
          };
        };

        doc.tagPrefixes = prevDoc.tagPrefixes.map(copyTagPrefix);
        doc.version = prevDoc.version;
      }

      doc.commentBefore = directiveComments.join('\n') || null;
    }

    function assertCollection(contents) {
      if (contents instanceof Collection) return true;
      throw new Error('Expected a YAML collection as document contents');
    }

    var Document$1 = /*#__PURE__*/function () {
      function Document(options) {
        _classCallCheck(this, Document);

        this.anchors = new Anchors(options.anchorPrefix);
        this.commentBefore = null;
        this.comment = null;
        this.contents = null;
        this.directivesEndMarker = null;
        this.errors = [];
        this.options = options;
        this.schema = null;
        this.tagPrefixes = [];
        this.version = null;
        this.warnings = [];
      }

      _createClass(Document, [{
        key: "add",
        value: function add(value) {
          assertCollection(this.contents);
          return this.contents.add(value);
        }
      }, {
        key: "addIn",
        value: function addIn(path, value) {
          assertCollection(this.contents);
          this.contents.addIn(path, value);
        }
      }, {
        key: "delete",
        value: function _delete(key) {
          assertCollection(this.contents);
          return this.contents.delete(key);
        }
      }, {
        key: "deleteIn",
        value: function deleteIn(path) {
          if (isEmptyPath(path)) {
            if (this.contents == null) return false;
            this.contents = null;
            return true;
          }

          assertCollection(this.contents);
          return this.contents.deleteIn(path);
        }
      }, {
        key: "getDefaults",
        value: function getDefaults() {
          return Document.defaults[this.version] || Document.defaults[this.options.version] || {};
        }
      }, {
        key: "get",
        value: function get(key, keepScalar) {
          return this.contents instanceof Collection ? this.contents.get(key, keepScalar) : undefined;
        }
      }, {
        key: "getIn",
        value: function getIn(path, keepScalar) {
          if (isEmptyPath(path)) return !keepScalar && this.contents instanceof Scalar ? this.contents.value : this.contents;
          return this.contents instanceof Collection ? this.contents.getIn(path, keepScalar) : undefined;
        }
      }, {
        key: "has",
        value: function has(key) {
          return this.contents instanceof Collection ? this.contents.has(key) : false;
        }
      }, {
        key: "hasIn",
        value: function hasIn(path) {
          if (isEmptyPath(path)) return this.contents !== undefined;
          return this.contents instanceof Collection ? this.contents.hasIn(path) : false;
        }
      }, {
        key: "set",
        value: function set(key, value) {
          assertCollection(this.contents);
          this.contents.set(key, value);
        }
      }, {
        key: "setIn",
        value: function setIn(path, value) {
          if (isEmptyPath(path)) this.contents = value;else {
            assertCollection(this.contents);
            this.contents.setIn(path, value);
          }
        }
      }, {
        key: "setSchema",
        value: function setSchema(id, customTags) {
          if (!id && !customTags && this.schema) return;
          if (typeof id === 'number') id = id.toFixed(1);

          if (id === '1.0' || id === '1.1' || id === '1.2') {
            if (this.version) this.version = id;else this.options.version = id;
            delete this.options.schema;
          } else if (id && typeof id === 'string') {
            this.options.schema = id;
          }

          if (Array.isArray(customTags)) this.options.customTags = customTags;
          var opt = Object.assign({}, this.getDefaults(), this.options);
          this.schema = new Schema(opt);
        }
      }, {
        key: "parse",
        value: function parse(node, prevDoc) {
          if (this.options.keepCstNodes) this.cstNode = node;
          if (this.options.keepNodeTypes) this.type = 'DOCUMENT';
          var _node$directives = node.directives,
              directives = _node$directives === void 0 ? [] : _node$directives,
              _node$contents = node.contents,
              contents = _node$contents === void 0 ? [] : _node$contents,
              directivesEndMarker = node.directivesEndMarker,
              error = node.error,
              valueRange = node.valueRange;

          if (error) {
            if (!error.source) error.source = this;
            this.errors.push(error);
          }

          parseDirectives(this, directives, prevDoc);
          if (directivesEndMarker) this.directivesEndMarker = true;
          this.range = valueRange ? [valueRange.start, valueRange.end] : null;
          this.setSchema();
          this.anchors._cstAliases = [];
          parseContents(this, contents);
          this.anchors.resolveNodes();

          if (this.options.prettyErrors) {
            var _iterator = _createForOfIteratorHelper(this.errors),
                _step;

            try {
              for (_iterator.s(); !(_step = _iterator.n()).done;) {
                var _error = _step.value;
                if (_error instanceof YAMLError) _error.makePretty();
              }
            } catch (err) {
              _iterator.e(err);
            } finally {
              _iterator.f();
            }

            var _iterator2 = _createForOfIteratorHelper(this.warnings),
                _step2;

            try {
              for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                var warn = _step2.value;
                if (warn instanceof YAMLError) warn.makePretty();
              }
            } catch (err) {
              _iterator2.e(err);
            } finally {
              _iterator2.f();
            }
          }

          return this;
        }
      }, {
        key: "listNonDefaultTags",
        value: function listNonDefaultTags() {
          return listTagNames(this.contents).filter(function (t) {
            return t.indexOf(Schema.defaultPrefix) !== 0;
          });
        }
      }, {
        key: "setTagPrefix",
        value: function setTagPrefix(handle, prefix) {
          if (handle[0] !== '!' || handle[handle.length - 1] !== '!') throw new Error('Handle must start and end with !');

          if (prefix) {
            var prev = this.tagPrefixes.find(function (p) {
              return p.handle === handle;
            });
            if (prev) prev.prefix = prefix;else this.tagPrefixes.push({
              handle: handle,
              prefix: prefix
            });
          } else {
            this.tagPrefixes = this.tagPrefixes.filter(function (p) {
              return p.handle !== handle;
            });
          }
        }
      }, {
        key: "toJSON",
        value: function toJSON$1(arg, onAnchor) {
          var _this = this;

          var _this$options = this.options,
              keepBlobsInJSON = _this$options.keepBlobsInJSON,
              mapAsMap = _this$options.mapAsMap,
              maxAliasCount = _this$options.maxAliasCount;
          var keep = keepBlobsInJSON && (typeof arg !== 'string' || !(this.contents instanceof Scalar));
          var ctx = {
            doc: this,
            indentStep: '  ',
            keep: keep,
            mapAsMap: keep && !!mapAsMap,
            maxAliasCount: maxAliasCount,
            stringify: stringify$1 // Requiring directly in Pair would create circular dependencies

          };
          var anchorNames = Object.keys(this.anchors.map);
          if (anchorNames.length > 0) ctx.anchors = new Map(anchorNames.map(function (name) {
            return [_this.anchors.map[name], {
              alias: [],
              aliasCount: 0,
              count: 1
            }];
          }));

          var res = toJSON(this.contents, arg, ctx);

          if (typeof onAnchor === 'function' && ctx.anchors) {
            var _iterator3 = _createForOfIteratorHelper(ctx.anchors.values()),
                _step3;

            try {
              for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                var _step3$value = _step3.value,
                    count = _step3$value.count,
                    _res = _step3$value.res;
                onAnchor(_res, count);
              }
            } catch (err) {
              _iterator3.e(err);
            } finally {
              _iterator3.f();
            }
          }

          return res;
        }
      }, {
        key: "toString",
        value: function toString() {
          if (this.errors.length > 0) throw new Error('Document with errors cannot be stringified');
          var indentSize = this.options.indent;

          if (!Number.isInteger(indentSize) || indentSize <= 0) {
            var s = JSON.stringify(indentSize);
            throw new Error("\"indent\" option must be a positive integer, not ".concat(s));
          }

          this.setSchema();
          var lines = [];
          var hasDirectives = false;

          if (this.version) {
            var vd = '%YAML 1.2';

            if (this.schema.name === 'yaml-1.1') {
              if (this.version === '1.0') vd = '%YAML:1.0';else if (this.version === '1.1') vd = '%YAML 1.1';
            }

            lines.push(vd);
            hasDirectives = true;
          }

          var tagNames = this.listNonDefaultTags();
          this.tagPrefixes.forEach(function (_ref) {
            var handle = _ref.handle,
                prefix = _ref.prefix;

            if (tagNames.some(function (t) {
              return t.indexOf(prefix) === 0;
            })) {
              lines.push("%TAG ".concat(handle, " ").concat(prefix));
              hasDirectives = true;
            }
          });
          if (hasDirectives || this.directivesEndMarker) lines.push('---');

          if (this.commentBefore) {
            if (hasDirectives || !this.directivesEndMarker) lines.unshift('');
            lines.unshift(this.commentBefore.replace(/^/gm, '#'));
          }

          var ctx = {
            anchors: Object.create(null),
            doc: this,
            indent: '',
            indentStep: ' '.repeat(indentSize),
            stringify: stringify$1 // Requiring directly in nodes would create circular dependencies

          };
          var chompKeep = false;
          var contentComment = null;

          if (this.contents) {
            if (this.contents instanceof Node) {
              if (this.contents.spaceBefore && (hasDirectives || this.directivesEndMarker)) lines.push('');
              if (this.contents.commentBefore) lines.push(this.contents.commentBefore.replace(/^/gm, '#')); // top-level block scalars need to be indented if followed by a comment

              ctx.forceBlockIndent = !!this.comment;
              contentComment = this.contents.comment;
            }

            var onChompKeep = contentComment ? null : function () {
              return chompKeep = true;
            };
            var body = stringify$1(this.contents, ctx, function () {
              return contentComment = null;
            }, onChompKeep);
            lines.push(addComment(body, '', contentComment));
          } else if (this.contents !== undefined) {
            lines.push(stringify$1(this.contents, ctx));
          }

          if (this.comment) {
            if ((!chompKeep || contentComment) && lines[lines.length - 1] !== '') lines.push('');
            lines.push(this.comment.replace(/^/gm, '#'));
          }

          return lines.join('\n') + '\n';
        }
      }]);

      return Document;
    }();

    _defineProperty(Document$1, "defaults", documentOptions);

    function createNode(value) {
      var wrapScalars = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var tag = arguments.length > 2 ? arguments[2] : undefined;

      if (tag === undefined && typeof wrapScalars === 'string') {
        tag = wrapScalars;
        wrapScalars = true;
      }

      var options = Object.assign({}, Document$1.defaults[defaultOptions.version], defaultOptions);
      var schema = new Schema(options);
      return schema.createNode(value, wrapScalars, tag);
    }

    var Document = /*#__PURE__*/function (_YAMLDocument) {
      _inherits(Document, _YAMLDocument);

      var _super = _createSuper(Document);

      function Document(options) {
        _classCallCheck(this, Document);

        return _super.call(this, Object.assign({}, defaultOptions, options));
      }

      return Document;
    }(Document$1);

    function parseAllDocuments(src, options) {
      var stream = [];
      var prev;

      var _iterator = _createForOfIteratorHelper(parse$1(src)),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var cstDoc = _step.value;
          var doc = new Document(options);
          doc.parse(cstDoc, prev);
          stream.push(doc);
          prev = doc;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return stream;
    }

    function parseDocument(src, options) {
      var cst = parse$1(src);
      var doc = new Document(options).parse(cst[0]);

      if (cst.length > 1) {
        var errMsg = 'Source contains multiple documents; please use YAML.parseAllDocuments()';
        doc.errors.unshift(new YAMLSemanticError(cst[1], errMsg));
      }

      return doc;
    }

    function parse(src, options) {
      var doc = parseDocument(src, options);
      doc.warnings.forEach(function (warning) {
        return warn(warning);
      });
      if (doc.errors.length > 0) throw doc.errors[0];
      return doc.toJSON();
    }

    function stringify(value, options) {
      var doc = new Document(options);
      doc.contents = value;
      return String(doc);
    }

    var YAML = {
      createNode: createNode,
      defaultOptions: defaultOptions,
      Document: Document,
      parse: parse,
      parseAllDocuments: parseAllDocuments,
      parseCST: parse$1,
      parseDocument: parseDocument,
      scalarOptions: scalarOptions,
      stringify: stringify
    };

    var dist = /*#__PURE__*/Object.freeze({
        __proto__: null,
        YAML: YAML
    });

    var require$$0 = /*@__PURE__*/getAugmentedNamespace(dist);

    var browser = require$$0.YAML;

    // Gets all non-builtin properties up the prototype chain
    const getAllProperties = object => {
    	const properties = new Set();

    	do {
    		for (const key of Reflect.ownKeys(object)) {
    			properties.add([object, key]);
    		}
    	} while ((object = Reflect.getPrototypeOf(object)) && object !== Object.prototype);

    	return properties;
    };

    var autoBind = (self, {include, exclude} = {}) => {
    	const filter = key => {
    		const match = pattern => typeof pattern === 'string' ? key === pattern : pattern.test(key);

    		if (include) {
    			return include.some(match);
    		}

    		if (exclude) {
    			return !exclude.some(match);
    		}

    		return true;
    	};

    	for (const [object, key] of getAllProperties(self.constructor.prototype)) {
    		if (key === 'constructor' || !filter(key)) {
    			continue;
    		}

    		const descriptor = Reflect.getOwnPropertyDescriptor(object, key);
    		if (descriptor && typeof descriptor.value === 'function') {
    			self[key] = self[key].bind(self);
    		}
    	}

    	return self;
    };

    class BaseQuestion {
        constructor(text, explanation, hint, answers, type, options) {
            if (answers.length === 0) {
                throw 'no answers for question provided';
            }
            this.text = text;
            this.explanation = explanation;
            this.hint = hint;
            this.solved = false;
            this.options = options;
            this.answers = answers;
            if (options['shuffle_answers']) {
                this.answers = BaseQuestion.shuffle(answers);
            }
            this.type = type;
            autoBind(this);
        }
        static is_equal(a1, a2) {
            return JSON.stringify(a1) === JSON.stringify(a2);
        }
        static shuffle(array) {
            // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
            let currentIndex = array.length, temporaryValue, randomIndex;
            // While there remain elements to shuffle...
            while (0 !== currentIndex) {
                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;
                // And swap it with the current element.
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }
            return array;
        }
        reset() {
            this.selected = [];
            this.solved = false;
            BaseQuestion.shuffle(this.answers);
        }
    }
    class Sequence extends BaseQuestion {
        constructor(text, explanation, hint, answers, options) {
            // always enable shuffling for sequence questions
            options['shuffle_answers'] = true;
            super(text, explanation, hint, answers, 'Sequence', options);
        }
        check() {
            // extract answer ids from answers
            let true_answer_ids = this.answers.map((answer) => answer.id);
            this.solved = BaseQuestion.is_equal(true_answer_ids.sort(), this.selected);
        }
    }
    class MultipleChoice extends BaseQuestion {
        constructor(text, explanation, hint, answers, options) {
            super(text, explanation, hint, answers, 'MultipleChoice', options);
            this.selected = [];
        }
        check() {
            let true_answer_ids = this.answers
                .map((answer, i) => i)
                .filter((i) => this.answers[i].correct);
            this.solved = BaseQuestion.is_equal(true_answer_ids.sort(), this.selected.sort());
        }
    }
    class SingleChoice extends BaseQuestion {
        constructor(text, explanation, hint, answers, options) {
            super(text, explanation, hint, answers, 'SingleChoice', options);
            let self = this;
            answers.forEach(function (answer, i) {
                if (answer.correct) {
                    if (typeof self.correct !== 'undefined') {
                        throw 'Single choice question can only have one answer';
                    }
                    self.correct = i;
                }
            });
        }
        check() {
            this.solved = this.selected === this.correct;
        }
    }
    class Answer {
        constructor(id, html, correct, comment) {
            this.html = html;
            this.correct = correct;
            this.id = id;
            this.comment = comment;
            autoBind(this);
        }
    }
    class Counter {
        constructor(max) {
            this.val = writable(0);
            this.max = max;
            this.subscribe = this.val.subscribe;
            autoBind(this);
        }
        jump(i) {
            this.val.set(i);
        }
        next() {
            this.val.update((val) => (val < this.max - 1 ? val + 1 : val));
        }
        previous() {
            this.val.update((val) => (val > 0 ? val - 1 : val));
        }
        reset() {
            // trigger a change
            if (get_store_value(this.val) == 0)
                this.val.set(1);
            this.val.set(0);
        }
    }
    class Quiz {
        constructor(questions, config) {
            if (questions.length == 0) {
                throw 'No questions for quiz provided';
            }
            this.questions = questions;
            this.counter = new Counter(this.questions.length);
            this.finished = writable(false);
            this.points = 0;
            this.config = config;
            if (config['shuffle_questions']) {
                this.questions = BaseQuestion.shuffle(questions);
            }
            autoBind(this);
        }
        current() {
            let n = get_store_value(this.counter);
            return this.questions[n];
        }
        next() {
            this.counter.next();
        }
        previous() {
            this.counter.previous();
        }
        reset() {
            this.counter.reset();
            this.questions.forEach((q) => q.reset());
            this.finished.set(false);
        }
        calc_points() {
            this.finished.set(true);
            var points = 0;
            for (var q of this.questions) {
                q.check();
                if (q.solved)
                    points++;
            }
            this.points = points;
        }
    }

    function get(attr, def) {
        return typeof attr != 'undefined' ? attr : def;
    }
    class Config {
        constructor(options) {
            this.start_on_load = get(options.start_on_load, true);
            this.shuffle_answers = get(options.shuffle_answers, true);
            this.shuffle_questions = get(options.shuffle_questions, false);
            this.primary_color = get(options.primary_color, '#FF851B');
            this.secondary_color = get(options.secondary_color, '#DDDDDD');
            this.title_color = get(options.title_color, 'black');
        }
    }
    function merge_attributes(base_config, new_config) {
        //new_config overwrites entries in config1
        let config = new Config(base_config);
        for (let attrname in new_config) {
            if (Object.prototype.hasOwnProperty.call(new_config, attrname)) {
                config[attrname] = new_config[attrname];
            }
        }
        return config;
    }

    core$1.registerLanguage('python', python_1);
    core$1.registerLanguage('plaintext', plaintext_1);
    // this does not work....
    // ['javascript', 'python', 'bash'].forEach(async (langName) => {
    //     const langModule = await import(`highlight.js/lib/languages/${langName}`);
    //     hljs.registerLanguage(langName, langModule);
    // });
    marked.setOptions({
        highlight: function (code, language) {
            const validLanguage = core$1.getLanguage(language)
                ? language
                : 'plaintext';
            return core$1.highlight(code, { language: validLanguage }).value;
        },
    });
    // customize tokenizer to include yaml like header blocks
    const tokenizer = {
        hr(src) {
            //adapted from https://github.com/markedjs/marked/blob/master/src/rules.js
            const regex = RegExp(/^ {0,3}(-{3,}(?=[^-\n]*\n)|~{3,})([^\n]*)\n(?:|([\s\S]*?)\n)(?: {0,3}\1[~-]* *(?:\n+|$)|$)/);
            const cap = regex.exec(src);
            if (cap) {
                return {
                    type: 'options',
                    raw: cap[0],
                    data: browser.parse(cap[3], {}),
                };
            }
        },
    };
    // customize renderer
    const renderer = {
        // disable paragraph
        paragraph(text) {
            return text;
        },
        //disable blockquote
        blockquote(text) {
            return text;
        },
        //disable heading
        heading(text) {
            return text;
        },
    };
    // @ts-ignore
    marked.use({ renderer, tokenizer });
    function parse_tokens(tokens) {
        return purify.sanitize(marked.parser(tokens));
    }
    function html_decode(input) {
        // https://stackoverflow.com/questions/1912501/unescape-html-entities-in-javascript
        var doc = new DOMParser().parseFromString(input, 'text/html');
        return doc.documentElement.textContent;
    }
    function parse_quizdown(raw_quizdown, global_config) {
        let tokens = marked.lexer(html_decode(stripIndent(raw_quizdown)));
        let questions = [];
        let text = '';
        let explanation = '';
        let hint = '';
        let before_first = true;
        // global_config < quiz_config < question_config
        let quiz_config = new Config(global_config);
        let question_config;
        tokens.forEach(function (el, i) {
            if (el['type'] == 'heading') {
                // start a new question
                explanation = '';
                hint = '';
                text = parse_tokens([el]);
                question_config = new Config(quiz_config);
                before_first = false;
            }
            if (el['type'] == 'options') {
                if (before_first) {
                    // comes before the first heading: quiz config
                    quiz_config = merge_attributes(quiz_config, el['data']);
                }
                else {
                    // comes after a heading: question config
                    question_config = merge_attributes(quiz_config, el['data']);
                }
            }
            if (el['type'] == 'paragraph' || el['type'] == 'code') {
                explanation += parse_tokens([el]);
            }
            if (el['type'] == 'blockquote') {
                hint += parse_tokens([el]);
            }
            if (el['type'] == 'list') {
                let answers = [];
                el['items'].forEach(function (item, i) {
                    let textWithComment = parse_tokens(item['tokens']).split("&gt;\n");
                    let text = textWithComment[0].trim();
                    let comment = textWithComment.length > 1 ? textWithComment[1].trim() : null;
                    answers.push(new Answer(i, text, item['checked'], comment));
                });
                if (el['ordered']) {
                    if (el['items'][0]['task']) {
                        // single choice list
                        questions.push(new SingleChoice(text, explanation, hint, answers, question_config));
                    }
                    else {
                        // sequence list
                        questions.push(new Sequence(text, explanation, hint, answers, question_config));
                    }
                }
                else {
                    // multiple choice list
                    questions.push(new MultipleChoice(text, explanation, hint, answers, question_config));
                }
            }
        });
        return new Quiz(questions, quiz_config);
    }

    function create_app(raw_quizdown, node, config) {
        node.innerHTML = '';
        try {
            let quiz = parse_quizdown(raw_quizdown, config);
            new App({
                target: node,
                intro: false,
                props: {
                    quiz: quiz,
                },
            });
        }
        catch (e) {
            node.innerHTML = `${e}. App could not render. Please check your quizdown syntax.`;
        }
    }
    function init(config = {}) {
        let global_config = new Config(config);
        if (global_config.start_on_load) {
            if (typeof document !== 'undefined') {
                window.addEventListener('load', function () {
                    let nodes = document.querySelectorAll('.quizdown');
                    for (let node of nodes) {
                        create_app(node.innerHTML, node, global_config);
                    }
                }, false);
            }
        }
    }

    exports.create_app = create_app;
    exports.init = init;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=quizdown.js.map
