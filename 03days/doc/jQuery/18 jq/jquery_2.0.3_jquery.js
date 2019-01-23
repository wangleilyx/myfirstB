/*!
 * jQuery JavaScript Library v2.0.3
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03T13:30Z
 */
(function( window, undefined ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
var
	// A central reference to the root jQuery(document)
	rootjQuery,

	// The deferred used on DOM ready
	readyList,

	// Support: IE9
	// For `typeof xmlNode.method` instead of `xmlNode.method !== undefined`
	core_strundefined = typeof undefined,

	// Use the correct document accordingly with window argument (sandbox)
	location = window.location,
	document = window.document,
	docElem = document.documentElement,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// [[Class]] -> type pairs
	class2type = {},

	// List of deleted data cache ids, so we can reuse them
	core_deletedIds = [],

	core_version = "2.0.3",

	// Save a reference to some core methods
	core_concat = core_deletedIds.concat,
	core_push = core_deletedIds.push,
	core_slice = core_deletedIds.slice,
	core_indexOf = core_deletedIds.indexOf,
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
	core_trim = core_version.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

	// Used for splitting on whitespace
	core_rnotwhite = /\S+/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},

	// The ready event handler and self cleanup method
	completed = function() {
		document.removeEventListener( "DOMContentLoaded", completed, false );
		window.removeEventListener( "load", completed, false );
		jQuery.ready();
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: core_version,

	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray,

	isWindow: function( obj ) {
		return obj != null && obj === obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		// Support: Safari <= 5.1 (functionish RegExp)
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	},

	isPlainObject: function( obj ) {
		// Not plain objects:
		// - Any object or value whose internal [[Class]] property is not "[object Object]"
		// - DOM nodes
		// - window
		if ( jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		// Support: Firefox <20
		// The try/catch suppresses exceptions thrown when attempting to access
		// the "constructor" property of certain host objects, ie. |window.location|
		// https://bugzilla.mozilla.org/show_bug.cgi?id=814622
		try {
			if ( obj.constructor &&
					!core_hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
				return false;
			}
		} catch ( e ) {
			return false;
		}

		// If the function hasn't returned already, we're confident that
		// |obj| is a plain object, created by {} or constructed with new Object
		return true;
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;

		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts );

		if ( scripts ) {
			jQuery( scripts ).remove();
		}

		return jQuery.merge( [], parsed.childNodes );
	},

	parseJSON: JSON.parse,

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}

		// Support: IE9
		try {
			tmp = new DOMParser();
			xml = tmp.parseFromString( data , "text/xml" );
		} catch ( e ) {
			xml = undefined;
		}

		if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	globalEval: function( code ) {
		var script,
				indirect = eval;

		code = jQuery.trim( code );

		if ( code ) {
			// If the code includes a valid, prologue position
			// strict mode pragma, execute code by injecting a
			// script tag into the document.
			if ( code.indexOf("use strict") === 1 ) {
				script = document.createElement("script");
				script.text = code;
				document.head.appendChild( script ).parentNode.removeChild( script );
			} else {
			// Otherwise, avoid the DOM node creation, insertion
			// and removal by using an indirect global eval
				indirect( code );
			}
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	trim: function( text ) {
		return text == null ? "" : core_trim.call( text );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				core_push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : core_indexOf.call( arr, elem, i );
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return core_concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var tmp, args, proxy;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: Date.now,

	// A method for quickly swapping in/out CSS properties to get correct calculations.
	// Note: this method belongs to the css module but it's needed here for the support module.
	// If support gets modularized, this method should be moved back to the css module.
	swap: function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		} else {

			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || type !== "function" &&
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
/*!
 * Sizzle CSS Selector Engine v1.9.4-pre
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-06-03
 */
(function( window, undefined ) {

var i,
	support,
	cachedruns,
	Expr,
	getText,
	isXML,
	compile,
	outermostContext,
	sortInput,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	hasDuplicate = false,
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}
		return 0;
	},

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments quoted,
	//   then not containing pseudos/brackets,
	//   then attribute selectors/non-parenthetical expressions,
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rsibling = new RegExp( whitespace + "*[+~]" ),
	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			// BMP codepoint
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( documentIsHTML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			nid = old = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && context.parentNode || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key += " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = attrs.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var doc = node ? node.ownerDocument || node : preferredDoc,
		parent = doc.defaultView;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsHTML = !isXML( doc );

	// Support: IE>8
	// If iframe document is assigned to "document" variable and if iframe has been reloaded,
	// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
	// IE6-8 do not support the defaultView property so parent will be undefined
	if ( parent && parent.attachEvent && parent !== parent.top ) {
		parent.attachEvent( "onbeforeunload", function() {
			setDocument();
		});
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if getElementsByClassName can be trusted
	support.getElementsByClassName = assert(function( div ) {
		div.innerHTML = "<div class='a'></div><div class='a i'></div>";

		// Support: Safari<4
		// Catch class over-caching
		div.firstChild.className = "i";
		// Support: Opera<10
		// Catch gEBCN failure to find non-leading classes
		return div.getElementsByClassName("i").length === 2;
	});

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Support: Opera 10-12/IE8
			// ^= $= *= and empty values
			// Should not select anything
			// Support: Windows 8 Native Apps
			// The type attribute is restricted during .innerHTML assignment
			var input = doc.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "t", "" );

			if ( div.querySelectorAll("[t^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = rnative.test( docElem.contains ) || docElem.compareDocumentPosition ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b );

		if ( compare ) {
			// Disconnected nodes
			if ( compare & 1 ||
				(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

				// Choose the first element that is related to our preferred document
				if ( a === doc || contains(preferredDoc, a) ) {
					return -1;
				}
				if ( b === doc || contains(preferredDoc, b) ) {
					return 1;
				}

				// Maintain original order
				return sortInput ?
					( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
					0;
			}

			return compare & 4 ? -1 : 1;
		}

		// Not directly comparable, sort on existence of method
		return a.compareDocumentPosition ? -1 : 1;
	} :
	function( a, b ) {
		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Parentless nodes are either documents or disconnected
		} else if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return doc;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val === undefined ?
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null :
		val;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (see #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[5] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] && match[4] !== undefined ) {
				match[2] = match[4];

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( tokens = [] );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var data, cache, outerCache,
				dirkey = dirruns + " " + doneName;

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
							if ( (data = cache[1]) === true || data === cachedruns ) {
								return data === true;
							}
						} else {
							cache = outerCache[ dir ] = [ dirkey ];
							cache[1] = matcher( elem, context, xml ) || cachedruns;
							if ( cache[1] === true ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

			             1 9   j q   mp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ �k             1 9   j q \ 1 0   $ ( ) N�v8^(u�e�l  4 . d o c x   ive[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xPK
     �N�@            	   docProps/PK    �N�@���j  x     docProps/app.xml���N�0��H�C�{��[GA^���	��vDQ�m%���ch�+7�v��X|}��+��q�fq�Z�V��<~n�*�|���8�������3]P�#��~w!�Ƽ�p>����θA�n��n�$��|PVdٌ�g@�b�سa|r���5m�<����`	�C���E@�x���ք�9k�G�`� �Ƶ�WS`��N8!�O��HÃ�t�Ξ2sb��<��#�	�oԀ|R�28k�H�cM�|'z��~����m����O�or�U��X!����/�Kk{%E����z=}��5�S�����x���&��m���:�N�6Y�e�de]N�*ˊz	ll���w�ScI�8o�PK    �N�@k&V  �     docProps/core.xml}�]O� ��M��-�9����Gv�k4�!�m�B�}�{i�����/�y��v��6`�jL�hBPF4R�U���y���yn$�ڃC���,-��G۴`��qL�Z{�2��X��.	�ec5���+�r��W�SB.��%�w���h@J1"�O[� )0Ԡ�x�iB�׃����r����۰���-�A�;�F�v�M��>F�O����_5V��+�̥��1a�{�Q �ø��2�����,&�1��b)a������w������(�-����=K͝_�\*���R���n��`�7!�B����X:e��$�Pv�-lT����j:�玝���g�/PK    �N�@
��o�        docProps/custom.xml��AO� ��&�BY�ֆv��v�s��FR�Z]��]��{��~y�/�~���yeM	ӄ@ �B�S	�{����Έn�F��"=�V�w���Q���a|	�!�ƞ���|c��:݅x��}��l-��4SB0�|��7��9�),_���p�n�~���D	?۬iیd����$�Q��׈l�5m�����qy��N��O��+&�I�(]Dϡ�w\EIFQ�&q�d��(�ÿ
Ë�u��PK
     �N�@               word/PK    �N�@�F��^  b_     word/styles.xml�\Ks�J�S�P�
�=?W&�'�)lc�8�u���Q"��~dܺK6w�eł�ł���`n��O�4=Z�G	E��3}��>���5�~��]87<I}MG�G;#�G����z:zsu��x��<��OG�<}���yz{�f�O0�G�;-�,>��N�%Y�H�<�/"	Y���%��x�a�2�~v����s0�f�t�'ё6��n"R��$�H,�����l«�/���<ʐq;��AD�ҏ��ZH�]\FnL��	���M�nE�ŉpy�BL�@5>d~T��5��{��V�ߖ� >���U�1�1�X�]��4h0�D[E�̟',Qa���ݣ�בH�<���A>y�}�,�T~L.�Q�?'"�R������_A����[�ϣ��7K���o8K��Ϧ���O����~����ĸiV1���������؈�o��\k*$��L�Xy�MG�PLp/_��k`:*.����ǿX��M�=�;}㌇���y\֢����e�*e:z�D_<�;��2 �V�k��{u��X�4����D;y���+�x!��ㅈI�^���#CY��,KΤ�8�M�*-G�������&&�M�7�?���p��M<n�I��j��P��G���%3�=y̘�l1c��Ìi�3�=̘���1�!6c�c:��w&�"ZG�ǳ��f��:�?�uD��(��1�#�#X�J5�8��8�̪�Bd�ȸ��;;$� �3�nlm���.}COZ�A�(��a�\Iz�l�d_�'�b�����39�s��Y��yK��9B�G7<�i��<�Dp�3X1X����O`�í������;Q�-#�k�G���ں���`y��X�2AB�?��d�9�J�J�3?�	p^�A�	���#_�HV�Z��eȞ�Ǒ�0k�(�9�.i$�gI�F��bM�F����~jd{?kCZߊrlZR^�Y`��ǁ�@��s�_G��~&\$�qP��K����KG>s��}!�{��v�R�(�#��ch����m�c��$j�%�j�%$k�mO�.�?���HO�yC� l��=�5f�<�N�r5g�ʻ��8�
�J�?��01o7a�Grf/b[�+v��d��K�N�ʲ��%{ ���������bN�c�����U꜈ ��3�kM�3vw�z����Dt �4���U/Y�V�(~Zp�Yl���xwH�D��<I������U������[5�����y���>$ 	�<d<�-eM��g'����ߏ`�"얔��!����ج�y	K3�� �􌅱�l
Y���oa]�1
v�b�_.�[�Z+ǆ���NëN3]�,��|���v�3$�ґN��yb�r֠v#��N��8`��&O@�-.��&�!m������@$�< �� �z\�I]AF)�Ո%6�C�L��M�U����Q�x	�!������пY�������@�����m�4\% )qD %�����8"�GR�@J'/�X�xJ��
��
�Y�8��1�*I�[g%�T|�kf��G%�e"rw��:6I����DDA)Ά�?Iy%�����&�/,7acK�S����闼�xDH�lԎ�k��"Ա�=󯗙3[���7=�R��ZoZ�+�r,"��s����5]��뜽�):r��`툯��u���kvNv>0�ڧ����>�7���}�G�����^��kSﶹCӓ����ա�ס�v�� y84UpI1��".�	����[���,�X�tt(�)+A�b
J]Y�r�H�P����LT���I���E���D�H��ƛ��+f��P��U(���?�h�q`(�I�J5��P.��\��Ô�ФF%��È6�j���9Laj�TS��c�������e����Y��NY�7��Z��D��M%�o"��xSIL�P�\M��\&m(���M%2�CITo"��xt�05ś�b
PS��,���u\*��"�T.k�Y�7��Z��D��M%�o"��xSIL�P�\M��\&m(���M%2�CITo"��xw�@׷�o*�)@M񦲘��%�T.�xS��śJd-�T"k�Y�7��Z��Dv�M%��7�ˤ��VśJd����*�D"{���$�ś�b
PS��,��t�7��"�T.k�Y�7��Z��D��M%�o"��xSI(�M�2iC��U���$��7��^�;6�}d񦲘�o*�):]�M墈7��Z��D��M%�o*��xS��śHd'�T�xS�L�PjjU��D&y(���DpjX��0y��۟2xg:�����(84L��O�_�9a'_��{n��V=�Ko\���V{N�;w���2�6��6O���Cx��vO��J`4��1s�]�_�kCp�����'Z������<�~����u����1n��[��Ɏ��m�����[�݁�	���cyf:��0�^��֛�d_��_n_�Ks8z�l͞Kc�3�0*=q,#��g�U#�ϩ(v$���#yr6I溜�%��%��fyIw�y}F��;��0���� x��S޹|"8Q!�ўL� OG��(�2��Ѿ=y&/��EC1i0G���bǓ��{z������*��ZH�%Ԗ+�s��t��A#@�� V;:��[kԥ��RhlG�d�\w7�|���Y=��S%��P�?g��	�R2���w��c�k:1�gZb����;�*0�i��`�Ծ��,a7>��Н���ƨ����^�۲L''77��W�ZY��+�r��^U���@�����_P�m��N��X�Ī<�u��`6�L�
(<$�BҠb�흪�c�NG{�}��=�FR��8x�U�ڃ���S�ҕ��T�#B�.���c�PW�/<�߲ћ�x�\�ʷ!�X��ӑ���`#D�j��O�ۣ�n-�*p�"^k�E)��xՎ>��LO/���S%t���wr"�����lN�]?�!/��1T�"���F�q]��Z�.qs=îY&u�|��.�!$r:廋�Hy��p�j9߬�[��b��TW�3y>ocF�ϭ*ڇo��ﯿr$�jc�ź�2ӏg�]��&�˖s`�|!��)�F��)���7VN���qJs
��/?������-6SvJ��1a�˓jS�5�T_���/x�������?Z��}j���d�0���PK    �N�@�K
!x7  -    word/settings.xml��ݒ�Fr��7b�A�sY � �P�ޘ�:V���Ȗ�1d7��9�|���d��3Oz;'Cu~�'++��7�������o�t��t�p����o�W��޿yx{w������_�o�W�<=�ܿ�y�p���_o�^�������O��n�����7<�����7߿�������{z�������y�p{����7�����߽�y���߾yx�����ǻwwϿ~7C}��1߿��x���#�}��������뇟~�{s���^Z<�W���ex�������7~�x��><�?�r����i����'���?�g���^~�i��_~��O�o���ҽ���Ǉ7�OOL��w_>������3�zП��o�ﾼ���Q4������O�������Y��ݏ�7�_��p�����������͏�XT����w��xx�ͧ�n�0I,�ax��%x��O����û�_�������#+�������醾�_~�#�e1���?|||�~��7���������~�����G�o��n�Y�on������>��t���������Ç���Ӌ�������wo�������o�����|��8���˧����[����K����|����}|�{s�����7��<޼�S���їǇw/��<؍������/�����O�����_>>��/����p�	��ׯ��oo_!��x�Wk&\sW�/�������>���>]���񿘴��COc/_��&�q����+I+_�/%ih���':���e��A�yh�f>��8���������В>m��mwIj�z��<m�g��5�:5�q>OoÇ��f��k�t��i���4���`s�Y�ƭ�:��_ I��#:�s�S���<�4N�� �m�/MeO�T�X\RS�Nu�Q���YHs	�-)h��%ڷ�f��Ӕ|�4�$Ok���S;IWќϼz�k=}~r��v��?m�{�fy9��B��a�|�X ��u�ӵK��Wbk�\�����˾�q�-ef��5�l���>�e�Sз�Ͼz����Y�CfIڌs�a��7��:ͫ�\ekmR�-k^��M>�9�%+�������6�y�N�{ٵ�<���<��~����
���}�̥��M��97�Z}U����e,���e<�?m���{��!XUK)���R�<����LK��H˜��Q,�!���u��u�?me�̭�t��_��O+Sp:�%5�ҵ��t��z,�KV�i�m(��m\N������m�����&F�{0�����8�I�����,l���V���m���A=�}��kFtޫ�m�A::�4#��j>��T��s�tV�s{*��P�޷�b{�{�l��,K�=���}��Ն5Ж��ub�Rp+hiX]#�������/me4_+=а�λ�V[�qk�8�6��}~����6��e����>��ǭ-�a�t�ރ��@����?=��f�SMA��V|�z��=������1��g�@���c�#�`�e������Qj�ߎrl~�u	n�0w�s������Kϴv/���υ�l�g�7�^�qUM��:�H�UW��$���8���;�wF�#�V�H�	�~}+��)}�s��M���q���q��m�S�&���q��^��k��{�	�6M�{�F;�72;��)Ʃg�%�;�8�ɭ���$>�Ӽ�j��E�#����Ǐ�������iۃ�%�\:�	���Oʻ�eF�S�Hc��鉁��-gLs��q���zn��A�5��K�0W�Hc�)xZ]ܳ0f���yf�h��I���8�gDh$$�細}���w�_�G��,
�4s ɣߦƂ�N�z$��Ƃ�"����]��o9��++aיCT��0�MZ��uM���M�ttI�=�[-������k�9f�����Q�q���=���-H�i�3��3{�߳cU[l\r��|�7���K��:X� ׽>o��\���u���u��X�)���1�o�M=�1����I�`�u�Ջ�#��m=�0nc
��ml~�����q��G��-�����|���[9��1n������{n�Sp�����ڈ��=���5Ҏ�����{�W,��6��\h�R�im*����Ơ���O1�t.����і��L�C`y7"6��ڼ�o}l���౏��Y#�
�����ٿ��5�-{&��s�+�g��A��Ֆ��>/�v���1����{u���)|B>G��ƃ`��^$�yz��,y�~�e�|D�������O;����h�c�t�N"���3�@�eu�x���D`��j�v�ٛu�!���A��Ӑ1��M�g撚N���Ǣ�d��0!�'"�=v��T��⓴�\����Gut-F<`vo8��7�i$����]h�<�����6$uI_t/\��3ǐ�=k�<<:�܏�B��=Y�C�`N'���ߓ0.]RѤ.��O�|��	��<�սEH��"Y�]�6u��9���G=nư~r�h���p�ɔ
8Q���Ҧ��m�I�$����p�	�D�S�7ՠ׹���B.���O��V$�M��!i���S��L�GR�2l~kC��:�p�%�ྀd���T� S�$��N%-������*e�h)�u����=u+��<z��#������:D��[v�ױ8H������u
��S͋{'�4�!qvװ��`�ֲ:�d�D�|/��i}�%��ٞ1�4����0nu�gT���e �Ie ��l�����Ђ�+�A^<"0�C{�O��x1��Ŧ5�����;�6�64�{A� ��q�2k1��~_�6�k�%[9=B8m5;k��=��6��ns���z�K�()��q��>����>��im`�uD/ς�[���F�f��I`��iw_��R�B�����}O�պ{���59~
�zLm02S������Gh:���u~:10�>G�9�#�._��c\ݣ9SoE���A|�-��v�g��N�[O'��]{p��Z���XN��>���������;m�� 4�sw�a�٭$�t��p��6Ҁ)�3���4x�	��D��#�i !����n���̮)�L%�` 	bFH�5�RB)A���q3��#$��v��/�����+ҩ�����4�[WMN"��{ �!�����iD��Iwb��7=$y	�6W�Ѧ���9�t�?%��4��
��Ѥb��5�-�4��O3$�}�	C�q�H�Gc���&T�ke$�C�
����,�
I�ş6f�]��`%����ӄ�#����v�������Ɣ��m*i��
��%��Q�� { I�X&��߃sұ�)�D]#e0f�-s�n1
,���;>n��ݏ�r=�L�e�{0IX��������u���_��ı`*t-��~K(��k�4�N�:VMQ�GW��4�+�B�ۄ��-.|��o��&�S���{����שV *�= �ߛ�\�}I��d��)� ����4�d�h��_vO������n���̥���̤��
8˲�r.��B�l~'�vv�2��-�m�~�]u���6��"ɹ�d�`ϭL�� �T������^�yN�������rݯ��6�k�9�&���2.��d�����;V
���"$g�ŶJ>�� �µ2�~��ˎY@r�=�Gq���i�(y�5^�`N�z�g.�!ȾId]x����,n��?���^���8�-I��I�����VR��������;�m���z"���1�z�\�]�b�9� �q	N�>���~v� G� ��Ъ�Aϧ��R/k�{�������3�����8Sr����%��� !�{����Z?��񖀞��\8��Ѿ�������<>e�8Y$�Gϲ��Y�@��"n9�x#�̻għ����<��� ir�$���N*��6:Hv�, 	�&��sK����ԙ�M�<0$�3m3��M�1�݋��IK9��������ϟL.��� j��!0䱏LF����P�#�Dޅ�$��Zڷi��WV+�_9��H��4���Z'?W{���p9����/'J�4f;���L��-U$X}�kt����<��/�Cзyt+�<��AR���$��l���9-n+���H����\�L57pn������m��2n+�����]\WUQ����וԊC{]��'m&��v|��hX"��Y��2���3I�6��פ:��i�K d�X�I���bzj�&�3�	)�$�����	�H��0�,أ���J�O�q��ZgVȒF�P�ݮB�5w��ie��e -9Q�1;	���0n��^)���B_k����b	N�5m��M���G��咸�Is�; �q���Be�d�g�{ʠ3���#ߴ9r��=�O�7vw���v��g;Ð�ѤL�H���b�s�1�O��F�୮��V���!�d�6d�t?����z7�M�} ���K����w֞��f�~�Xkq,5��}�0�@�Yh��|t@�x�4ÿXB-���	��� 4����a�o����$|���:�A����I�^�qs-�����Hj`�u�h?�ɗ��O&+&Xo=����{�	�����6��@r��1�z8K(�Ņ5�V��A����(� �o�`?͎y��6��̸��=pɝ��s�z��Q�}]���>�x�k�ȇG�����}#��pB�!;xv�渚|�]8z8�u�/�����l�H��x$������*B�o�%�sI^uDW&_�Hf��B�2��09���ήŐ^$��iI�G����o�/@�]W��]א�5g,($�;B	�[�7h���A4���{f*^��sԐpc������l��T�}��O�2%y��3Y�u�I�^�=G��%h��ߐVt���O3$W���咸-��(@�^P?���9�������A��:?���^�&�C2�� 	�<�$�n_�8��o�����3ܱ�Ԙ�w�h.γ��*"ك]_X!���zx����,HV�� ق�Vj�;F)u�XV�枅�����3��XǜȖ�r �/��L����CQ����<�$A&' ���4n`�7�@<�
���x|\n�ra*����8mY�c��]����� ����1��ՙ+����G���6��B���m��ۣe����^
�[�֎��䡁��6��<�ĺx�:�=xϚS`=��r�K�|B���8:�����Q@x����Ѳq.��n��}D��	�N�K~s�=^����콞��o��m^%J�k�}6��} K�v���p?_�O�X]$�]jp/��
��D֒g�A~�z���&@�!����5Ȇ�o0[!��Ч5��@r8Ji�����J`9����&���sm�X׾FaW�{=�5��;xU	"I��W� ���ە�#�'�#C��������}V�T<+I�i[:��w:���Ίw�G�g�,���^���G������c}�{��C���d��4�`?玉�g�f��%�脑�MZ=#�6�am�`]�F=Ȼ��ˁO�u/HjgN*~_��5�P�&XU�:&��5�˜Xi>��D��	����sܜ9	|���f�$���9`�/g��Gf#i���{~I9�d];���I�C��XC0��gU<��$8��$��}������1�X s���P��A��݋���Rqx����g���9���|��-���D�}P�D��پ8
lU!YS�$��Y�	�er��Ő�>ȋ�������Q$�o�D�)�_J����Q�n�d��"����d����+�JI��!����s��~)ien__u���1���8P�A���9��6�Sr���LzT 	j�aD��U��Ǎ1�;C=�� ���iS�Ä�J�Ӻ{# C��m�\s�{�ё#���x$8K�Q�0D)A��3t`A�(��7ϸ&z���+C�{�A :��~]�R�|/��}o3�IuɊ�s�����A$��BҪ�K.D��������|S��#�ԥ�s����� -������=�	Wa��s��"���t�$�y�!�q]�Sp2���dB=ا �=C]��}�HZ��^�l��%G�U�H��,�}�,u,!$��
?��h��b���[�/4���i���5���D�5Z	�
p�ǀlZ��s������n챩
�,���o���`t?l��%����yT�;��yF����zg#X�_
Àg��=k?��I`%�R28 �ձF;�,9�W�_���$�>���S�t�WUj 9ʀ."�#8��6|�"	l�Fj��Q<��&I�od�y��
wT���=v��
;Q�O���\�y<���LWH'��wI��(6yA��V8�1�	�;���
�d��R��c�H����w%�Ԡu|b=�,2鸝 X]_���O�<'Is�>����۶3���O�
G1�H���$�}�Ep�������ga&��W<�e��ż���#��6ѧ���[��7y�p�%��z.��#"�m���e<�#T�Є�Ӹ뮧M�5��t��LF�{1Gq�{J��C\5�� i~:#9]�\��5D�x.� {�j�G"۝Qo���$A�4��=�WZ���H�ǳ�n�sǁ�Mg���5�u�ݙD��o0�4�; q<K���o��W�H_��^�DG��C.k
F(���sɻ�j���{.�k
���\(�����d@AϪ����#)3fb�q뺏�6�<�{z�ހ���^�40�#�����=@'{	b�(�6���2<HކZ.���j��`]/������?��y�+��X<�B�o�����6���{�4��Y���{�DL�i+�9���IM��?�~����'Eڒ�2�R�ݽ_�b��{*�	�K�30������$_�p��}�H��Y����7.��[�T��=��F-�Hf�!��J-����D8�0os�ā�9������9��`%��L���2�¢Mp��s�
�ã"���kg�=�gn�m��g�/ͭ ���A�F-�mX���3�+:�؜~���q�y�ɑ#�E��\�r�k��M��Wɚ�H�~O�b	����������/����t�;���{ِ��} ��P�������u��v]ut���~���H����:R�����cP,��F���S8{	3c���=�Ń�t5QW��Yw��¿ԸF�ܪYȵrvp$d"[(�8�w�0T�ކe���6 ��6��l!,�V�H�#����|���m�*��ڐM�m���4>cc�G���N��dy� ����� �A^�2E�T�o`��7�w\�І�ao��$��C0�:)H��P��X<nFz�2�oW=d��	�	A���DVIz2�fv	Մ���@@��|i��\��W��^��-�� ��Oǀz��wV��?mN�A�y��i�8�|�f|���)�.���/�����x�Ab���`���ot]uqm�7z�I�ud6P:
nh(�Q߅�>��B�2y$��J��{ z������.I��(u��1z(�����~-�.�E��΋cJ�y �V���ܽ��C�ަ�tgz�Ry��$�D�9�e�)���x�c�!1������r�w��Em"�/Q>����M�h
$A�1�-fY��Q$T��پj �FZH}�����0��Z�)��XVX�܂�2Q�{Wjm��,��,[�R����͹Zxq<`���9H6��#i��Br�7b�!��^�X�)z�/�'z�І���N��u����b�A*o��������� t�ځ'x�E�x���<�br��6_#��c f!�%}ࢣ#���b�rІ
*ݟF*��~�������G��R\��X������+�$~Gr�9��}i�A⽏���`v��r���>H�����B��5|,��s�(�V�Q{��ɤ	��Fp��K����|G/'�D_U'�7>:����{��:�m�u�8��x$A%���OI���
'��i��C�=}0��
����V��A2�W
	��ރz���6��U�z��BB�B�Cin�'��q�i~:���\+��߬�I`m�����$�!	�A�d�P��_�L�mN�yj��wa˓����⺊6X�A��7�)V�T!���O+"j�O�q�K�Y �d����q+^n�!9�V�b`Vȅ����qn����!�XC�|hI�sx!	p�P�L~kC��\!o
V"�~gZ��{����� �GE��͊$�2@T�!�Nq]��WsoъC3�5��I�%ЏN�ӵ^Y� @8�y��U�>@�9��
���|@�I5�1�>q��{������ݵ!�@�c��t�X\\W]!d?�g�9.����W8�k���7؀��_�n����Dq�$��M��P<FyIܮBB��)�@ǣ.�sd���)~ϧ��{��W2�}����/���"�{0�C�c�֕����jB?E��=�"��
��$֍��ɟ����!��q$�^�F�#��3���$`[w�}7�[�^��X�496	QJ�J~�*?;���5*l�Ӡ�w�
v����L!Z}Z 4u	�<�ԑ���:q��Ӱ�|���~����茕�?�ǲ�k�^C$��վ���|��CY;	��k������+�S%k�ЈEX ��;1��_��P�-��P�k�+S#�P0�A���x�������(��]�	�V�I��w���V�9�x���=�	k�띓�H�Y81�|~���ѡL������@�n�q�)��j�A"��ݮД�$�C�/��!�@�����ی�Su	��O7�D�?������z).�+��'�6��6\�}�C�6���6,_�*%���(�m\�S 鎕"�rt�
J�xߨ��s��3G���BMd�a����Y~#�iN{M��1���q�������B#㚜 %pw�[t�$��]�Z��d�ʐ�A1�=�}�d�4��g�k���gXb�h:$�ټo�bG�dvc����A��{������reރ��^ 	0��`���;�t+���א?���#��侸}p8{���k�P�ߪ7�-=
�1s�6Ag��uD+lT�%��}��T`%��}ͅ%��E2{���1�NA��xh�e=r��6@�`t�^yM4
���#J�?8��'?����>��6$Q`Wq-b�9��\��߃o#8p�{������pf�{����C�G�6r�Qb���Q$�]E=����V���Oxf��y�l#'��nĀ˾�6\vnSl�ރ��5��`�po��F�|�K��~����m`#�b�F��G6�M����3�����ig����y�Q3(��;�t�i���i��m��� ����%���{u��H�cF��ވ��`D�	�Pā�kW���A���	8�����L��%ܣ�Q��91/���#	bSZb�{� U�����:oC�������5�o�]x�J�H�����ۑ�5�m��n��=I�Ოct.P��}\��t&�����Q����=s|��[�u��q;	�5w�	މj:��Ŵc	.�{~�ή��u>��YH�=�upI�Jr!�o�T$	��{
ރGf�R�ɱlH��F$��I�xI<&�Sٽ�HV���f�q����ۄ��c�ﾮ�T��&���#�a�ds�&��A��e�a�lV$��M�A(�t�P!�WdK�r#�4�B���I`����8���'����K�=�Y0������	G��U?iis�9Gh
�ן�^�sn'{��� l�O�e-�u��I�q���=�;.H�)���zi�78G��TĄ2hu�.�.x��=y�SO����{W��!	0?{�x�������x���(��=�?��r�\M����y~�Xj9��ܧ
�\p�1�'I��#HT$H���	�uX �n$�$��3��z{ߑ8;�~���E�W���;���	���s9����ڃ��Vp�����o� Y�K�$�w}`��ӂ�m�{u!�!ϟF�	k�X^r�e�D��Cvң�&�x���[�k$�R��p�$�4*s��6�{#.I��V����Z1�O���k���p	81)��Dmp����9;7Z��<��D�4A0�s�P���� \�l��q���ƹ����q��w���<2;�G��0�;�<��Wy��α��DH6�Q�M�FBz����W�N9qP���������E-'���yw�̾�G⻑�I�{M֒�jv|i�,�\��=0�x4i�'�QT{#�<-b��;�`?:E~|�Su?O����3W인�[T�,$��u䱜F��\@أ�@rޢ�W@κȎ������@��gGH")^9I��6\-�1���D�OM��#s@��+��gO� �6yv�~��(���='����>��������y���lC���_�JnWAd�*��QJA{<�������^������P��w�r� �=����M,o��� g'jt zO8������`^_EP$��6B�~�"�*��&T�K t�32m.�ކkhԆ�r�fq�;���m���k�ёq$�b�Ө���F�+3���� ]	@��������0U��S��������-{nC�>.$�12�N�݋dso�C���s
��-��e�S��Y�
Ӂ�����5J�4���*�$�t~�:{)�G�=����o����S���2���#�冤{��8�36�_�V�#׭ ���{�\��d�[Ҝ���Y�F�\Eڜ���h��ĚZ��� jރi��B���oYS�ȟ�e�gI�y��	�I;���Oj�5`یW��3���:�Y���T����c~�*~_ Q��:n�8r����v|E�h�y�s���G� !�C���$�E���D��gMyD�QEƣ�,��$�28��M�H<ά����<s�Q�&�ʀݝ��QX\�/�@o�� y%MN燚4_h,�-!8aܧ�6�l| q_ mz0n�(��ʥ_�N��\��A��}Om��{v�v���`�u�e��sn$��oHfy���'J�c ����c����H0R�i\�<K�r���mR��+�k��XЃq	�,j��������Ջ��ʘgjH��d�z]��l��G�vG�40�MN,6�Hpr:���!�����j뺪�|N���M>�t6~g�Tj�3� >�}�[��Qq�I�z�'��`��`�8��vxzME%N�ʷ� �[���k��(Ϻ �����<��B6z��J��?L��s���G�lH�v���]B�jף'���|���ڐ��������-��o缺%Db]{��ds����>EB,ş�Q���9� F|��M���$����d��Ips%�7{,��k��
�8� ���>�/��
f��c�:�}�q C����A��}٣g#�ﻣz���{Wݍ��r�Dm��H���%�զ ��5�f�Ꝟp������w�N�d� "ك�@��`��8���q���	>۔�q�> � 7�#�h��e�됫.���N��摸������p����H��-;'�����kq-F��b��ݟ���1���'p��\%:����A�x�.��P$D��=�t��/�����U��TG�!�H�`A�iF���Ν��{��;���
$�3[!9ܶD�:/��<�T r�6� #ӱ�NK�T
4�:�n��+�޵?�l�q�������c�9���ʕ��md�>��%$�g#ɾ���2�QރT�"U�t�J�
{pn�e�������s���>�܋��F�-ƳU:�Hn��F�	TǮtB�A�R'm�p��@��"A�b�q���$5��#���:�3��D�7���������ޞ/�{C��ױ���`�����>Gg����� ���a�r�#����ڟȡg��M���$`6��Y�]�R_�4�xu]����U~<�ӏ�^$��G��{J�3���[�p�����)Y`�A�1��9����A���=�&��^bzB�D���K.B������)��ND e�tY�{Ё=T���~��q��|��V�.����(�z��!a��i\u��J�-Ip?%�2��\����_��EB.�����$��nHv�0�Ԁ�Fz�����H����6�!�/%�}�~qeѧ��U|Nƾ�(��0�O"��%9��J��r��Ym)�dO#9�Y@��r�x��d-eգH� �/��y�Y9��$�/AT5Di�\�
{�j��I<���f>��~������>���γ �ţ�d"�7�6�Q�G���ρ:@�;��1S�:|��u�>E�B<��q��Q� �IP��� ��%��|\T �.6`�;u��� F��i��q�Oϑ>��w�T�����`�̔��^���\�� �55����垬��؎�A�@��"��%8�|�,ʿy�ױ�7�7��bX~E����V���M��	I�{��Z-�*�8��XǠ~�%�.�#�S��C{� �>�K��$��(�5bN:���赂����y|�d�i)�88
	�r}l>��E������ ң����XOP�y�˱�i�k�1��'0u:2��ߌ�=�	!!IZ������Z��|�WQ Ql�������Ap0���PD_ɏ�X7n,>�B��F��:��hev���#�G��X��vw�;�{M�ȣ�G�仄�ˎ�8:�,?e@g{�J��}��T�8W$�%��8_�v�Y��́��u*��U��p�f���ǳ<2]>��8��ˎc��D
wj��'�'�=g
��$�W�$��d��I-�g	r�	)��~m�3�t����$d��n</��8������O#eH�Ɠ�k��#��ȟ6smR	\1�d>�$�G�p��Q~.h�}.���ކ����� �g!�=7		�V�53�b+4�G�����4p���@�
na��R���RP���8HR���]��l����H���/e+xt�";w���p�
^'���$�1;��𤨮krH[��cH�"��)�\������3S�Ao�H���H���8q���������(Oh�]���Q�Zܯ|�w폄����	�YO<��� �Z���c�g��G�/���)�^�{��u<J����<��	x}<2���6���֊��?-�2H6G�󴠒��B��Y���9Hf����5u=�Jp�B�ܺu{.�2����t�p��۔ձ��%8e�:�;)�u
6����|'���$�U#!�\�/A�z�f��J�����g{�0�zl
#����ػ��+�,����.���J&��[tn�w6ZZ<�BacN oS�K��q��[8��6P�����^j����KwR�\���������K/*_�d��O����i#�3����#J�`tZ
2`O����n!���MA֡��NrEM�$`[:�:� L��7Ҧ97��ɛ�P��8���@���j��C�7�gn�ܤ?E`�v*���
�@=�M������H`[�_�y瑷�&��(�I~2q�r�ʉ����3�ϓ��n�^���/\0n'<��{��£i9]�Խ�W�w�^?>ݽ}��߾�����~|���p������y���v���ǻ�o��/�޽���������?=<��G�|~������w��Ǜ7/������ۻ����Ϗ}���ǟ{��_<�_����?���7��Ϸ�����×�}z�����o����H �������߽����xiu���}��?��x=�߆����_n��^���������e�n���^�_�7O����������o�?]�?�~���7W�?�|�p��Տ?�߿zw��/�����z{���������W��Y�]���q���X~������_}��oK/K��-��-��������������_~�p������߿��?�������ç۷������y?�~�}~��~� PK
     �N�@               word/theme/PK    �N�@3L�  ;     word/theme/theme1.xml�YMoE�#�F{oc'vGu�رh�F�[��xw�;���jf��7����@%ą*�H�_�RT�Կ�;3��xM�6�
�C�}��~����Kwb�����'m�~��!��<�I��n��V<$N�xB�ބH�����]ī*"1A0?����EJ��҇a,��$�n�E�<�p!� ��la�V[^�1M<���^��Oг�y��o-��c�"QR�L�j�ęb��^]#�Dv�@���=P����<İT�����[X���W�IL͙[��7�l^6!�[4:E8,����օ�B�05���z�^��g ���SkKYf��R��2K �uVv�֬5\|I�ҌͭN��le�X�d�6f�+������7 �o����nw����/���Z�o@���Z'��Ϥ�g������2��PT�V1≚Wk1��E Ȱ�	R����e���PP��U�Ko�/g��.$}AS��>L1��Tޫ�߿z��}rx���{���h9�6q�g����?~��x����_T�e���<���j ��Ԝ�_>��ɣ�>}���
����2|@c"�5r�vx�������8݌A�iy�zJ�`��B~OE���,;��F� ��^�vލ�X�
�W��nq�:\TF��U
�`����Ÿ���x�Jw'N~{�x3/K��nD3�NIB���!�ݢԉ���|��-�:�V�d@�N5M'm��2�����f�&�pV���w���U? �	�e<V8�9�1+�*VQ����q=� �!a�"e՜��-%�
ƪL���.R(�W%�*漌��{��iv�&Q��܃�h��*�w;D?Cp27�7)q�}<ܠ�cҴ@���й�v8����1��ǶΎ�� ������V"^�5��6���<�Q��rз�s7�8�&P��;�}G���r���I�vʭ@�z�`7�f���!�(c�j��Ui6�։��z�9��ĔF�5�u
l� ��GTE�Na�]���Pf�C�R.�`g�+ek<lҕ=6�����j�vxI��B�YmBs��-i'U�t!
n����6�����4Cu���e��k0XD6 �-�e8�k�p0��:�v���b�p�)�H�#��l��&Iy��� ����C�1Q+iki�o��$I*�k�Q�g�M��W�4K�o��#K���t��Z�Ŧ�|����i�k�B֥��a�͐��-�c��t�4���1�	�pMa�>����j�Ȗ�y�� K�&k�b�zV�J+�V��5+ �nj�hD|UNviD��>fT�Ǌ��(8@C6;үK�	���	����t��+����+�^��,�pF��E�N�p�ǅ�d�Vi�q�����?#W�e�?sE�'pS���p�+0�����PJ#��lw@��],�����d�_�}�����a�|j��HPX�T$�Z2�w��z�vY�,d*�d�L��C�O�@s�^�=A�6�h���֟��u�0ԛ�r�9R����靏mfp��a����_�X����fz����/�۬F�������MN��Zƚ�x��Y���Q
�=H����
�S�zA��V?4haP6P����i���C�8�A[LZ�m�u�Q��3��z�[[v�|�2����U���Y;��k;67Ԑ٣-
C�� cc~�*��ć�!�p�?fJZ���PK    �N�@���u  �L     word/document.xml�ko�V�����ț� ��>VH��Rԍ��g�:Nb���i(ӤR��PhA<Ja &^��Aha����_�9v��΃�ܸ	
�����=�{�ݳ�DFL�*)�D�a&�KIR*�9<�s�	�+%X�H|���Ufo��/����fxI@�:�����4y(R�4�a�`F�����H&D�I��C9�$B��H�8���
�����2��2������$Q2����
eX�XV�	�ˬ&L
��MC��~�c��4Th�~2dT���P*��ү��h�F�!�"�iA.���� Ŵ�T=$�2��^N�D+��Qn��
�V��h�
1�GѤ��Uo��4�n�j7�
���u�*�GԒd  �.�*`�K�^C�]ʠR�� ���mpd��Z���m�f7Y��5��*t"�ʼ���dU�dFY�����r���9�4�8�/�+��1�74����N��[.�"}T&c�$IL�l)���,�����C���,��jxV՘���qD$
�5Ŋ1f���G��>�1B��7�c���Vԓ���֝վ׏�B���W�N�
�".����ςĆ�a� Tq(v $�����L��8:Sƈ�!����Sߩk�B�B����oz>�v�q������\�u��%����S.B�T\����P�Kk��{7�|�Խo�g�����01O{�&��p��x��Aq�r!�8�h��|���
�]���y�^�)������h��p��hw[��S�ިe`?f��*os�U9���5��!��$�s���~��ԇ�ς�6������2lђ�O���5��i^I� "�"4ӍH/z��#�}-��b������'����U��O-����F�Xែ���T��̉�v+��8̀4d�� �bQu�����kc��
r]�Y��I�|���'����pP݅�->��H��J�؞����y_�x5Mr�{����=�|���D�n^�7I�1����X�f!c����f �;x`���?�1�f�4�J��k@��	�>)a�f�	-���Nٚ>�.����[������~c���.�i�����Ӆէ������ū/��B�O}a�x�Ň7�ť��⍗7�y?3������~!���s&ȟ��N�=}ZX����֝����o�o�;c�D(��/�[���a��w�K�j��f$���j��~Ծ������(�(�R�����D�����P�IW�X�e%�k�0ăLe������e�Ϭ=��q��+���?{��Ɠ%<�,�.�+��y�\��9�����'}�пw��1i�
9^�������K�,8��[���~j|��{�6�.���^���BR4�a�Qc��G��a�;f��A�S����� 2+���v�@����3��fY8[�s�*q�8w�<\�ʗ�n���ěﶀ=�{�+I��
@q^�*� xsnc�.Z�wO�g���f�%@m�;Y��n��G1F=�j���~<�h��ޅ}k�E��GT���fKLM�u�׹�$���%�}�����I`o)jSN�23�"�I� V,7	Re��Ʉ�.eyx���e��}-����y�ǳ+�#cE��׮B�yI��z�Sf$e�Q�t�sr l6|�q������o��j*���[^�H��(YmYj��[c�h��n�s��R�B�%���f������Ј+�J"m�{�i���倚��󺐛,���{��_�_\�f(�Id�p�}Uø����\����	���k/�e`�zS�g(0dG#����&�[bA�k�+���Pֲ�p��7$ZŜ�g����avȷRL#m���;:��[��|U��FI�L�WGdO&�	��.5j�8��&n�����CF��2,���;S�����G�&�������E\����~����� *�Jjw���n�9���T@��.�VC�������y�zp@�x{Ι��v�<��� rj����F\��@�����	�JKD�ԏ�ohD�w��b�d�%.��g�D��sʏE>�x��a�6�����r��q��j�ei�(�7T��q`�J�)��3���`���h�2������䐠qi��� �K�ʄِ�:���8��������X�PK
     �N�@            
   customXml/PK    �N�@�>ϕ        customXml/item1.xml���
�0D���n�Ջ�$=�x�i��vS��ѿ�PśיyÓţ��ݍ�zR�%)G��-]\·�C��<9O�P��Jrn'��L0b>!Vpa�c�I8���iZ�*o��Q�m��p��7
��Ik�X��������3�Ou�PK    �N�@cC{E�   G     customXml/itemProps1.xmle�Qk�0���r�5F��b,�N���`�!^ۀI���1��7t}��{��9��]�\p��h4�!@-L'����kX�u����Z�ՏUg�w�:3�ѡ
�B�yl|�i��mބI���M\а��!L�fC��,k����=�28;7n	�⌊�Ȍ��ٛIq��t"���ƈY�v$��'"f��� �����{{+�j�$�R�e���FB�SiJ�u�7�? uE��W}�{�PK    �N�@W%�R�   �      customXml/item2.xml��A
� E�" ��B�@��Rn��F���hn_)�'��ޠ�L{1X�Ā��)�8�Ǽ��]^9����6��+��
=rG�@5��]ʸ�Ϧ�YVH�z��d�����Ϡ�>�Eew|eQM�b�7PK    �N�@�f�y�   �      customXml/itemProps2.xml]N]k�0}�?���k��Tf����kHo��$����/�۞��G��v���5,z�џ5?;��Q4�7S��	6��K�S՛h(�K���[vjU�mγV�|]d/ՖJ-�
�����X����4\b�VB���3�W����LLt>�0��]�7�>�L�\�[�w'7A���L�@������PK    �N�@��ϡL  �     word/fontTable.xmlՖ�n�0��'�P���!��J+����]l�vm�kq��P��jW�.��L��l��;�����j��D8���_���]��I�J�D�s�)r4�Ř�Ӟ��::	���H:&�Hi�YQ�\�?v��ND���OU��=g�e��xF9Q�bNSx8���ʩˉ|���Ă�I�F,a���j;yyL1���^�x�i�����	d����*�-�ɶr<�"�J��yb�q��u��%�,�B�Iv
�q�\�
�cd~��i��b�
IF	�[b�9��5�ݔp^3NU�%]6^	NR3`NR�(�17$�9ȃ�����|�x��w\�)��h��lxB8KVET��f��e������Ŧ�`�F���+AA?�='���������j�#fLl�!8���@�|�Y�k%�G����w�+@` �  .�Ra�Yd��w8��,�lC��������a ���$\�[����*%����UJy�D���i��D1�T�2:^}�iRJ�CЃo�M�U�QPK��}p� ���׷z� �!D��/$���9$���.ԫ�����O�}�O���������Q0��}���/�b!��dVh"���1j��ү�	.�T���(^��H���� ������]��DTu�?U���O\#�$a#�*��i�h��J���GU	�mW	���p�T	��B��Rwa�;u����_w_�|�rQAc 44��Y�CkӰ�b�,�(j[�c��I����S�A�{��$��js���;���{G�9x{�j��c[(�B�P���X$��,a�����G=����b� Q�A��'�]�\F������:�PK
     �N�@               _rels/PK    �N�@""�   �     _rels/.rels���J1���!�}7�*"�loD�H}�!�����L�}{������r2g�|s�zst�x��m�
�U����N���aq"3z�C��D6������2�{�(.>+�㝔Y��0W!�/�6$�\��Ɉz��U]��������ik�A�N�l��;���t����r�(Θ:b�!i>��r�fu>��JG���1��ے�7Pay,��]1�<h|�T<td��<�8Gt��D��9�y���}��PK
     �N�@               customXml/_rels/PK    �N�@t?9z�   (     customXml/_rels/item1.xml.rels����1��;�ܝ�x��xY����t23�iS�(��O+,�1	����?¬��S4�T5(��zG?�������)��'2��=�l�,����D60�����&�+J�d���2�:Yw�#�u]ot�m@�a�Co ����J��6�w�E�0���X(\�|̔��6�(�`x�����k���PK    �N�@\�'"�   (     customXml/_rels/item2.xml.rels���j�0�{��`t_��0J��K�6F�GILc�XJi�~��;JB�/5�{��3{�6U
�����������bcog�h���v�j~p�R�x�UQ"�D�^kv�%�e2PVJ�G�������?u~5�}3U��]�uz����M���-�����B���L��l�b��gk[�{A��~���PK
     �N�@               word/_rels/PK    �N�@�c��  �     word/_rels/document.xml.rels��OK�0���!�ݦ��Ȳ�^DثT���l����������K�x�ޏ��n�m{�:�dI
��U�o���b�*�{�
F$��7�W�5�G�v���HA�<l�$ӢՔ�]��}��������<M72�{@q�)��p�6 �q��{���>{s���J����R�Muh�̥$����&�9{��f�$�sUv�6_�y�o�l��~M��s֜I��\d��d d��O��9U��![��>.�<4�S��ؽ�PK    �N�@p���t       [Content_Types].xml��=o�0��J��׊��"0�cl���u.`�_�
��(Ҩ]"%������M�Fg+Q9[�A�gX�Je�{�=��XQ�Rhg�`�l2���6bFj�@���G� #b�<XZ�\0�5̹�Ś��[.�E���ڃ�G�P����iM��$$g����:�`�{��@��*?���	�ʖt�YN�d�Ǜ]�+�&����"qp���̻�\!�ip>�ӼGb]U)	��KC����*h�0�obO��ԙ��P�����/��-]�������։���3�6���/J��J�Y�ݨ�b�cnt�8���O�ʙ�п��A~�4�g!" |�܇{����� ��l<�]<=�_?�f���>�PK     �N�@p���t                Rd  [Content_Types].xmlPK 
     �N�@                        �_  _rels/PK     �N�@""�   �              �_  _rels/.relsPK 
     �N�@            
            PX  customXml/PK 
     �N�@                        �`  customXml/_rels/PK     �N�@t?9z�   (              �`  customXml/_rels/item1.xml.relsPK     �N�@\�'"�   (              �a  customXml/_rels/item2.xml.relsPK     �N�@�>ϕ                 xX  customXml/item1.xmlPK     �N�@W%�R�   �               YZ  customXml/item2.xmlPK     �N�@cC{E�   G              >Y  customXml/itemProps1.xmlPK     �N�@�f�y�   �               [  customXml/itemProps2.xmlPK 
     �N�@            	                docProps/PK     �N�@���j  x              '   docProps/app.xmlPK     �N�@k&V  �              �  docProps/core.xmlPK     �N�@
��o�                 D  docProps/custom.xmlPK 
     �N�@                        s  word/PK 
     �N�@                        �b  word/_rels/PK     �N�@�c��  �              c  word/_rels/document.xml.relsPK     �N�@���u  �L              �O  word/document.xmlPK     �N�@��ϡL  �              \  word/fontTable.xmlPK     �N�@�K
!x7  -             !  word/settings.xmlPK     �N�@�F��^  b_              �  word/styles.xmlPK 
     �N�@                        �H  word/theme/PK     �N�@3L�  ;              �H  word/theme/theme1.xmlPK      �  �e    lv             1 9   j q \ 1 1   $ ( ) N�v8^(u�e�l  5 . d o c x   o tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = key.concat( key.map( jQuery.camelCase ) );
			} else {
				camel = jQuery.camelCase( key );
				// Try the string as a key before any manipulation
				if ( key in cache ) {
					name = [ key, camel ];
				} else {
					// If a key with the spaces exists, use it.
					// Otherwise, create an array by matching non-whPK
     �N�@            	   docProps/PK    �N�@��9k  |     docProps/app.xml�R�n� �W�?X��`;N��*�nO�m��ͱB�%F����ߗM�x�{{3#����5�'���Y�E�����6�U��>e�4	Q�N��*=bH��l�u�Ɛ��	�����3T��9Ɇ���������^+|��cDY����WD�a���azv����k�Yu�^ۣ��Z� #�ߧ8C��8�����v`g}D�`��^z�"mJ���	������y"?/^�>"'Z���E��H�b�*9`C��^�]����ŵ���o�_rq�c�uRQ���i؉k��d���n�M����V�>BN��oO�Ϫ\�h�r~�d���uQ���zƗ�������-���Qp`SH���,� PK    �N�@Uja"V  �     docProps/core.xml}�_O� ��M��-�E�5m�dO.1qF���F,� �۷�v]�ј����-�{UG;�N]"���FH�)��jg(r�i�j��Dph^]^�ɹ��hM�KpQ i��D[�cǷ��K�Cqm�b>l�7�����k��3�<�0nF"�������=@p5(��a�P���`���B��9��&�i�{��(���mۤ��1B~�_�O�Sc���‪B�\�-0"
��XL��WTF�YL�N�䄼���w�#���F(���yc;�tm�������q{��*���1���&�!�U�f+2�â�Y���[��n��4�M���I��93�PK    �N�@�Ŧ��        docProps/custom.xml�нn�0�R���nl��D��C+%͎l�X�6�-���5J��W��ӹ7߽�L�:it�@ 43\�K_O����V�7Zp�����ŚAX/��Ю�W�cǮB�.
�Ig�j}����L4��Jh�)!k�F�B�/o^6���ܰ��;��!�-�o|���I�IH��>�QL�
��t�ȖZ���>�?!�e
�nU8���X>2_���ga=��ޜ�%%	T~mV��e9��P�x�v�\�PK
     �N�@               word/PK    �N�@+��e  _     word/styles.xml�\�s�H�S����{l�N\�l%NLR8����#�x�H�A��#g`k�\(
��r�@���@Q��`6��_�4}��=%[E.�h�ޯ�}��kM�}vGޕL�P%�����ȓ���0����\�l=yY.�@D*��ѭ�F�=���]e�m$3$�Q�OF�<_mog�\�"��2�/g*�E���X�-_����0
���ݝ���U�&�e�Y[q�*S�\���,���SH����g�_�2�q;��A%�<\d�����8/�\�&qG�}כ�]�4X�ʗY>�#3�X�I�f��PT�n�L[�����2��k���Z��̢b���O�i*R�f =��?zy��TL#�����1�S��gr&�Q���Yj?�O��D%y�]���4P���œ$G��\���)��I���?��˷�������?�e�,��z�h��mD�\�	����hS�$��v ��^9��	��dT\x���@~1�ɛL�w��s�/� �:�7/��P��)��Ç������<`�U�&ʂ�7�\�؟��gYā,Õf��U��B"�}_��G�"CQp�(s)4�x�M�*#G�f�����*�������p�UW�`����*�1l�ÄB��#��2���i��L{x�e���-� n�v��e�]����^%�s�o�ѺD�?��ެK���.��ɺD���^�K���.���jV�J⽄�LrR>ϔ��K/�74I��vzYG��i��k�Z�\eOO�C�;wl�#�e�� G���V]ع��<5�f��2��@[W�%,�+A��  Y�p*sX#����I�L����$�J�Da"�dO��^�K��LL�hir���!��\��!1@b�=�kr%<W&t��i��hDxO�Q$r��G���UeW�/^�}����|5P��<Ɣ�$cfV�1A+ɘ��5g�V�1O+ɘ��l�g����!ǮE�E�G4�=��~�A
���2P��pYl�]�{g"��X�=�����T���5)�8��14L���m�c!�	�R���,#XK��p���W�j�B��0t`j�c�t���iN�s-M�J��g� �$�
��0���h��U����C��B�U��-hWr�T�y6ĉ�<��&�Z�n��xq��)���H�s��H]��-]R_����둮L�S�Q �0���<^�Ef$k?&x�Ă$x�3�n�v���-xvy��*��u��������թ����6f2�y�xi�H��F�(�?L`��hKJ�����*��PV�(yK3�Q ��s/���^@�_ú��
v���L��^���j�,XYrg��[���1�d�f���a5W�Di5fM�F�F�8�3�&O9�#.d9C.d��������H��e�r�q!̚q!̚���q�qG���A��13݄���۸�Gi���+� �D(ȱ
����`�����|�C��1S����v� (��#
r���?� Ǐ(��#
r���?�=��l��G_q�O+��� 2^�Α��ԇ�P|�KA|�c$�R5�;pTұ�� �1�cC��b^-��k�jm��X���pO,0a�J�s����}�/m�z��P�.�7(��c�{^�s�|�xҫ��0���l��k}n��Z�T��X���A���tr�q�7���^�I�ÿvH�ճW?��|DR���a�~�7��-�}�G�������sS�ָC׳�g����ס+w�� z8tep	1`
�$.� 	����T����M._�xt(��+B��rJ�Y�bQ(v(��\��5$}��"r{��!�n���y�����d?hc�
�1�ڬq�Pɦ� �rQQ���=�Y]lTa��y�]���s��Ԭ\��������NW��b�����;�G�Z�����@d���ɛD&o&��� .V(y�F�\,7�XU������7�N��݁�MM�梸�$o.��;5B����7�L�\ 2ys����"�7�L�L ysA\�P�\���X.n(����r�C	T%o&��;~��[�ɛ��rP���(.�t�7�C�\,2ys����"�7�L�\ 2y3�h���7��%�Vɛ䢇�J�L :ywl�����Eq9�I�\�w�ț��!o.���@d���ɛD&o.���@4��pț��→S���r�C	T%o&��;6�}d�梸�$o.��;]����7�L�\ 2ys����"�7�L�L ysA8���rqCɩU������7��`գ��yYxHl��͛�hQ�a�wD��`��3{�����rzG$�s%व��[v��o��sZܹcv,�R�Co�Y���a�.�����P8c�����9\ ?����܁�ϰ���ϗ��68�Ol��[X8�M��kG�MFb�b�'�'�U/Pf��/�/�1����\84Xq-8�&��7�}�~�u�Z_�o0�t���VV9������s�x[�s�d�bG�T�io?ѧ���~�^�]��f���ݞ���X��r�Ԣe�Sp^f�T�w��@��Zo�����")jׯ{��H-s}��**����)�N��;���߷�Օ/WWV�4��]��!�|�f��#�r����щSX�Zc.���Ka�q��{p�|�`�:ΰ�up>�Lr�N�-��b�i�o"�2�^	��\-�&8������0�3���`�Ծ��<Wq�|�۟;�%��1��M�F�ej�5��lޞ�k�h����'Y׳���홴ʓ�}��y���jsg����Rm`�e-IB2$�	!h�%��N���MF�����{0�t��-��@Y�w.���^�>�)�7BMW���Li�p�)��Hl;��� s�L;��>E������G[��c�~22}<�{j>�7����5�g}
����>�jPs�m#[\�Ytۖ�_L}���h��ٳ�U©��G3,�����X)��1gl�kWk�i�%���b�b�9�ǋ�RvKGy�J5d��++�怜5��Ҫ�\�����A�U�������W�F4c�ͯXT�-��=�".�����F7�F���#�z�����l�����?���LAi�9V�b�|��+�����W���۟����o�����$�u�P�N��ϰ�����PK    �N�@I��ݑ9  �'    word/settings.xml��]��Ƒ��7b������Y �'�0�{ֱ���ْ:L��Ms�_�H�5k=gֱs32�o�P��y�d�o��?޾��/��w��}���y���W�������������W�O7�^߼�w�틟o_�������Ǘ��OO���W<���˷��}�������|���۷7������oo���?~������������������=��M�4�ŗ�����û�_��ۻW���?<]C^����ݫ�/��y��?�G���>��}����y�}���=�t����io���+������W/�o���c��W��u?�?��ۈdz׀���n�@o�|~ݷ7w����v�Ճ��Կa������\�bx�|��_f���W��k���������gf\�x����������7l�����w쨿�߿��������HlǦy��%x}���O����77?�������;�����?��si?���L�ͼ_�݇����~{ÿ�x��?��_�2z@���.<��{����}�<��n>�y����{���sS�,~�����燻׿��������7߽�y�?>�q�>���W���_F�֟�Gt_������ۇ��W7o��꧛��W�ꗟ�������3?-v�>�>?��q��ć���������>}�ϒ�>�����-��~9��}�ч��_홸��?�W����_怲z�xM�����G{�ۦ��v�,�%�E�4m��%��l���E%��%�{I�l���:�d8�s����V�#�z���c���M?���]S{}Z�ͫ�O�7%�N���i}�;�<M.�!HJW}u��<}/����9�]g�d�/׵��_�k��נk�ݿB׮��A��%�ІY���k�gfP�Vgjư�ӹ��o��gݷs�������֏M{���Ǿ]R�޿\_�!�Y�0�i_ah�0fh��й-�
C����n
g���6t��o:t���]|����R�0���C����ӦaKc������4��([��06��Zll��w�ؖ���؞Ϧ��ϭo7_ѱ�Z_�q�{��؄�3���{g��ɿ�8�]x�i��,��ӭ_�45|9${�NA��v_}J7-��K?�aL�4y�&���ʸo�]
��Wgj��*�>n:fj�ο�ԵA'N]W}L���ɚ�qc�=ܴS)���4ۨ�3����`n��O����Y�}��<����<�%<���߀s�?�X.M��)骥Iv���A�/|l�>K���w��;}_/ݰ����V�2����R�#̭�/u,���,,h�1k3.~��v>}n+���ĵk�W�v��ϠۃU��m~���>��o�P7�r��g5�wJ��Z��º�3��uZJ�
�V|�[�y���i��uM�>h��;d���7�֝a��~<|�U�����r�u��y�3�A_o������׺�~��]���7�k���"9�M�[�=h�Z��Oc-u�u���N��ߧb����l�:�p/�Ͳ���MV�ޝ��`��~8�k��<��/}�[������6�C���w/c������������`W}�c�v��؏��X��;�#x�G��/s6m��f:�ğs�tvkX��߂}�϶��p�k@W�i�Y�����$�еF2-�w��g���ߚ-�ݠ���:���p���,�C��j1$�f=�G3��%L�[�m۶�m��X}�ҸO۶��8 `;������:,E�[�N�v�n��.m7�{��8��v�s������n�6�6 4��+�7kUMʷ���w��3�uO��0�������ka���p9�~k�q
��/C՛��Ku���~
k\�t������gh����ڣO+��!� ��o:L�8]Qp��-���0��#Y-��ߐ�#g��zl���z�����$C��a;O�M�dql��!��q��㚝O�)��N��ˡB��������~��+������.�=̠�᜖R�k��%�N\g~3�#y,�����ܦnu�1��ڐ���O����i�ډ�ܟө+:��Y�<���:���c	�j�U�π(�k�y*A_/M���^�>��2�A'�{��]��!�=��RJ��|'|�i=.Ӯ�@����V��s:�ڮ]���v�`[���tG��u<�3j������3�N}���]<�ق�8��n���6�[�K��8}�[�����M��,�Ocm��S�q��]�6���ѕ����kP�!X\u8��Yu,A�����k}ݦ�#m���;�냽�ol��xT�݉��> Y��f��%X��Є�p]�}
O�n?�>ا9�}Z=���q��P{�~�}���}���s��_�'���G���o���mvL�p����g�l��;g{4��O���>g?�v��G+ڳ�n��<�¥6l�I>������f���F:�ҟ��1ՏY׺k@�}m�Sh(G�څ� ׹᤻�Bܺ#Z29�dwo�������:�1գ�Hv��:B��I �g��d��Ò�?�}Z]Q|w�j�9��g�h9Բ�N��钂�t�t���u����ӹRD
�#YHf�{�,��]�/t=+��2�S<��$��\1��w�~�uCŻ�˘�=�hݱ'$����;�3�Ps�e�}=��Z��p��
�VX�Hj�;�bܸ�q�hk76�{mHvG[;��G���Q7v�=�$D�������%�3�SЉ��k=BD	�S����8���b��w��®*M�b`(n�u�Eg!����p��.x�]fGA�TG#�7�k�2��G˸8��+D�,L��� 3$	��?�0y� 0�~�	���dn`T$��& '��k$��`���Ǿ{g��0�0�a��D�4�����`m4��uK�-N��eڂ��6�-�n%^�����{gؿ�}@��+�Vle?Y�x:�׭��q-C�r�Ԅ�N�=�nk?��p�F���ǃ���u�)�����i��;�Z_h��h�>�vH���S�$�o����j_Ù�C|�aq$��XWG���q����n>f
�noVg�v;��`O�E�h|~��NLϿ�>��9�#XJ��hGN��WG���m�
��ģ���1���(>��N�����>��D$��s�����;	�
LS�܉���R�9�΄!�;����͠'��xH��y{�=<J��i��c�}OUw���]�dr�k�;��$D��LKxS�9anS�h���"��ۊ��]��I���Y��4�˵=�ǟ������m��-���4\	��IU	Fߖ�Q�O�HHvG4�v��?E2��iR_�)�q�C�.���޾�'G̐l���0G߉�mn��ݸ�}�dw���1qKI�tR��v�F�{	�/���=�Ę9��b
�������H�ciHv��{���}uoV��m�Ѿ�c
I6����%������B��=�ātR��S����k�֞��a(n��
6_?�w|�|;���t���O�~=�x�#W����z\�7�q����y�Hv�T�6g2#����BX��{6��**��D�nAn�m"�Hg�C_ �����t<�O�9��tvS_
�]�َ_��N��_�8@�yI��Br:۱��2�{��{G� ����)	���i����vz	���Q�K�^5��1Һ�p��?
'x������:d"�>��I	c`�%ɹ�di�p�>��`i�wun`ya'.�B��p�e�F�5�I��l�07���0&��#=�A��]�~g�!YKCrm	�%胵���_)����-88���~#ԙљWH��ӹm).)\@Ar:

5#�g�<�O�O#��Y�m8��
��0�p���C���H.F*|�c������~�*q�������-�����+�9����n��ӑ`l�fs��Q�!��uE��tf\��K8�{Bdp q)�w��.�HW�A��wI�xՓ����mp�p�p[݂<�5xg7;SR�n��ZS}�����pc��yd��'��w�9܀��,K�H'��'�`ڼ�Z2�l�4!���"��c��t�1�w�mh
����y��1��) �4���3z�!���B��[>@��<Wt��?����'~S$��H���`$�ߚ��wF�UW�Сǳ2����y��Б��
�㰌!�P��u�c\C7��`B��uW��d<���3���|́�8�k_�Sx_;I�g4t�	V��]���@�G��-�:�>�ШC2:j�$�`85<��SU�t@'��7�w�bq(�i�]�z" �3�k��M5��q:�+
�ڿ\�r�W��p���v\Ǘ���~�i�� ����W��[i Yw����gM�Z�.8���P��c9��dW��Ӫ2L��Pv���.�g� a_�&��Ar:
�_�>������ٽ�Qv�ܷ�_��պe�$�58Ez��y�=��!��L��;d�8��:CK8?�Z�*���.$��Y���ʾ��v^���s�	�p�ձ�K�x���om�j!Z��g�&�e�;A+/Su�c�`���}`5n�c����@���d�3�$|S8��_��	z�gI8�kY<�����!7i�/Gn������n����=XԄ�԰�a����#hr${��_Oɺ�9�H�� قN���N�r�׭Bv��{r^� ����UJ�-��s"2�QG]�.5��D1�p/����7[�H{���l]�>���8N
�:�I	V'�f�����Y���
ga�g1�Q��	s�|�H2\����{9���P������
#n�U�v������)�!4�����ku��Q��T	��pe�o'v�Sb"�R%f�|
�'v�A-���oJ�ʽ�gk#~r.��l��$k��`�W��ܣDj%#)~�,�1#$�-zuW.���H�EWtD���E29�RK�[���s��ԃk>$�B�z���(8�r$w��$չ#I
��Ɩ�Mz(PX=�=R�9LHH#��Q�$����W��b{i�, �<�	��΍lt�6�z�4����O�J�:@�T��.��L~?��|��D�\��,�
FjB�݈$��C�-]��#����H����10�/��ߚ���/ 9�F�H�Q+�ĔZ��t�WȖD�9���
"�;�.A2L�}��<3h��z�Rv�ck�ub78.�>{,����d�ed��N�u�Ye^	�qq��v�X��f�XB}e$���W�j.+��?H�0k��β9���(��)w ��C
���(EO�׾���� ��n�y��vg;R ���z�p~�ݾƝÛ�G:���\����;���@����P����hl=*�LƟ�����R�[�#�ܾ�Q���<Rl�g��Q��P��:Уp��^��~g�`��At$k����ㅿ�����Ql��j�`�xty\��Q�q��񯽂��Z�s�h�<��ɉ<ֆdY��g{Q�|V�:��~&��ok����H�ە��:dk?d_r:�d�QE9�Y؜�s�zv�CB��q�}�[�H<3$�[W��Өu��J�S����ë��==V0R)�!T4�zBc���z���}�R��ȖKzz���)!�v���Z��y�N���/���=Gz���ǝ��!p��˛������Py��q���q/[�_���;��ӎ&T����@�}��ƙK�����r�z����}L�x}
�P�.�Y��=��f0l_�[�K��je�A��w���%t��l��Ȑ^�gtb����M�ʏ'5P�,���5�`��A�"	>�	�1藃g�ѱ񤸉����I�{v�x�����w�2�;𥝍
�z��6��*i�fB�`$�K[Ql���E���c�	��ؠc�!A������me$խ���96p�f��HN�)mR����[i�{��JZN�!�j�{�#�_��v�jX�����_����n�ji;�zd��%qK	Gj3�-SH�v���i$�+�!��j}�ɉ�Xu����s���$�y0�
u��i���{��3��>f"�/HB3���T���\�ru��%�ѽj
��H@g��}t�ǫ��-&<mw���E��'��������,$��1>��2��yO���ۇ��ɒ$�����h:@���s����X��Bds�5 O��c��1-��%��L%0��-H$�wKCR���W��fP��a�K�����+]<C�k��-�*��	�F���VW�hc�!����J�qP&J[�~��.�?�ݟ����)�D�0��eu�I��Mg�#���&�s(�gj�����L9�0*���}��U\�,p~~<�0�� �;K8{�� un�j������`���;& d?��F%T.��Y����:��]i������Tf�R{&H��MN�g뺊|M�ph[�둄�M�'��Br	�ѳo�FØ� �L�C�����ϙ��$h
��a��xb����6hC��"9­Yi �I��*�/��� Í�/X��؇�k*��H�s�'T*e4�4���(HM��|g�@Խ����q�B��<��sc�Ŝi��9w�l��}�څ�����,t$s.�)�'\���HAW�g�y�T�������W�r�w2�=��2�T�Arx|��m-�^y������Kso������M	b��s5jq�� ��
�P)e"'�Ol|��}�\f�=]=���!(�q�߁A�5i(��cF%\���:V'�rCiGg��v��Ǡ{���c�B��a�$T�Ar:?~"W�Z�u>�1d�����!��hc�[(HN׉W��a�̞/�$� ��d�-�Q6Bػ��L�8�`EB��W�
¾�l�(��n�qt$�G����RzR�vU��=�������07jQy�ulP�>�qu, ��b|̴x��*��89կǢ��ί�=�Q�� ��ߍ�8l�{BRÛ^�/�;0��H{M_�Bn=��G�j} t�gM�a��;�Θ�l-${؉W�KߣPN�]R4��pѹ?�@���ॖ�B�$��6���+ ��������K@0<nFo�=����S��3w�gAһ_O�z�5���K����_�+��6��c���}=�����G��6�=��C&�$��H��7�q�I�����h+���+�-�QR:�c{����	ՅU�R��O	��C�V��Z����)����:�\�s��2��;�͐L����>��;�s�A}�j�Lp���zI�M�QD�O#����ɻ�Bչ������	��D��3��7�68%�n=-��n�ʾG7�>�N����g1~�����ۓ���{��;�t����s����Y��s����V8^�a�f�x"5���D>�)�{�;dez��io�4��ٯ��A2{�޴��s��ރ����D�;g���;ڊ$d�N�
�;ԩw�l: &��9p]�P�ޣ�􇢡��(}�ecL�v��>}�z���#=��r94^�����> ��q��*b��"�R�'X\��Tʣ<
)���qrz,��GR�~��o��H�L`3��n��5�6����~���cr:�z�f@�ZK�F�b#������3Ɛ��c`&��"��+J����)5�C��1id��ܦ�]�) 0�c �;�Ԋ��6�V�ǂ$X\��Ui��a��床1T���J�н
''��BR��\M�`B���#Ť���-BΦ�ӣ�����G���mK����!�W�S�l�4���=ʙ��i��r�)����s�#H6�Tg�
:_	�Nu�n�
�=& �9=z���} �z�� �$��s�F�1�c��BY>�ʮG/rm�����O#*��3-�O�g�d�{n,	U$���@�s����܈��\��)��yL0�f�:�������I�o�ZJc`*��v��L�U�l@B���'qJ�V�����	�8�?OT�Q�	��5a�>�nq]Ir^�	���M1�ݾ
u�q#���iy����m̐�C����>�� !�G�v�\� 	���q�<��GԐ�M�g@��0�}���������҅��y����^��}��+&��4科_���B�5�J�A�m�W�85�{�y93�֝g7��6�գ<H�������g�}�;�h�>�P,=W&�����ptM�hy�\�0�Ӯ]`�8�1���ѱ�B��۹Bn�H������7�J���۲�5��N�����m��w��0�n\~~���'XO`5Ϊ��8�b�WF�U�wv�M���Y��?3G#�ad�9�9����q́�s����F�~���}�,!�@����t��S�A��Y K.�L��-q|t&�sf��;�5�@ĮwNR�|�ɞ^�I�H��#�E�44�ӓ�$dO/�x�e�dwoj�~�3�1�SB�w^�%4���zNis��������nu"	5����g]G#s��HRh�LL$ĺ�w:@;S��:�� �m��@q�cA��G��i�\�[�H։$t9��m�i�pi:	I��#9=��0mq�
�lE�
и\[2/#���}hq˛¾8���1���z\�&)g�[s�ٹ+�=���?�H��C.>������@
_k�8׃bѣ3���<	�	u�"	��J��B��Ju9��$�ƑT_�H<����x$��	�Я�4u�C�%�ٱ��8�w�S�C�ٟ˕��*��/,W���.H�p�З�-U�UHJ�5�vr��B�;�jK��nC�^��w�y�*A���nL��\B%�`Pg�1U
��A�Q�����癜@�GǐP�_��^�{�,���K��*n���
�*�sp�K��MV����v�B}߉:�I�!���>�Q��ea�MA<��/0���7Е`ݒ�����ٲ�Z�;d�`#�c@=�:9���Q�h�P%q�(��쨰{a�8��ltu�]��\��z#"f0��S%ɕ�Ӻw6�����M4v�1��ȳKhe�S���7`%
�$P�w��]B/9�*[���((����P7ܽ��đ����aBBq�<~�������VX�>�瑔�(�$߉�e��
>���5x�t�|eT	�^��z],�q�!W ߽�:>�	������Ӌ��g4���U�]Yȁ
��t��/'��r�|uhŵ�> ��t��JE?�e�C^�7
ήG�+p�{	-�l��0��V���1ԏ�1D_t��LrCa=�+�ǃ��UßFm�0��;���W�=���~��:}N���>b�;�b�dA#x�%ql���7R�[Gd�Ж��F�r�N�>��q��!cs'��^���w0�U�!&8�1�g#	�O�ܡ�#��kr��$k�ܒ�I@-p���|I�+�`(Ũt@�PaLu@<��\AJ<G�Ba�q�$�$&,�]3��t���4�]q}0  �i��+>r�\�Pg۽6Lu���i�ͽ�
�����[�߇�������Fg@�����q�������;���{�+���$�!T�%�O#]�B���%��~NK	=�)1�����H&ϱA�+UN=�AH<��^�"��)�6��r�Z��@�s1��H��ߡ+��%3�X���Hά�|+�4��>���R֙ܓS��$�f���
���$�@�;0{�6�����V2I���
��2�`��ͮ�5 ��wz"�x`�p.�z�oŴ|W� ���W� ?�+���q	Vu�5\9��{yI��Y�M糆9����w]�&��
?$�b����68�n�n�_Qί��V:�}���̟V1���V�!W=%d�z�Z�톧����k�s#���S*��u#)����M[�X}�Xc
��g�����_���r�}@�GWz�y��K��������S�YC`�����+����{���+5n<�B��C�� ֣g}�M��{4v��l$!j=�t/�ͱ��Y���oxty=�]����86�R[xv+�$4�g�� �e�=u^�%��؍���f�$�#!9�����qe$�3S�P��������)�$C�$	��6�9��1덱�$��Erp�I�fzI<*��]	�s]an\?]�����{	�������]���ƭ��P<��((����P��`�j$����lț�P��J�9����Σ�HB=;$��H�e����v$��LHB�i ����Y*NmT�r[	W��7�Y�is�=���	��".nld�x��%��|n���N��F������o �^�"�t�ԹQ��o@�ϡS2��G��$}@[��(��ʐw��vqOI�#mW�A�
�u��3��w�(��?8>��d��τd�[����V�*:���U��Q]$�o�-iCPC�~�p�Ȃ�F��G�:����z��7E�(����3��d.�k�=���x�/l���v�8��P%�tnsCI!��w�IaL���;FL�+�%�i�w���$���it$�?cl�������6h�>�ڑJ���lnZQ�'����3�tc����9ܚPe��*���N��K��9�B�u�η׈��ua�@��]�tu?�P�!t���:� ��r�pk�� ��>��Uv�1S������5]��Շ�B]�.����ș=���>�av��g�m\�^�����E�89RYtE7����2&ie��}�q=�*_}ǣʃ>ئ�yBUJ��O�#?Ȝ�a�J��5�<j�Q�ǹ_[%�����n;g��vڛ�9V�N��4���&�B��S�cS�Y@�SO��`���-能@���KV��O�}Z�uD�����H��7�8p�s�����3x9G7��!�X]#ѳ5�8s|���yv�F@3���U��n��7м0<�p~�G:�y�k�g�ng9�!'^��(��w�"bn�Q��h;I�l<��q����KgM�K���w��굹i2D�{�n����?4ѿ���d�+ =�J��E	}Z��iqV����VB�~�"�����:�K趡�5����������Q�	P�K��{4��+Uqܦ�ԧ�ӷ�����%>�����+	*H��o���9|��}�����p��>�	��+�S�dwfOe�n+#Y��$�݁2x�+$!�[ &_����~�t�@7!��W��$���/Gr�gX�^�f�1#���^�{�+�ޱ[<2TI�q���Y{Hv��PG����o��C-k�6�H���E�j� ��"�0&Ջ�5�
X��k2�;�f�1���jA��eR}]籏J�3�$(_Og8���B�������D2�?R��$����t��M'r�\���9����ᙜ����T�T�q��dZ?�Rǳ*�k�AV�_���W�0??��r���dq̡.9��$�.1_kR��M�>�a�O�G_*9j���V}��	��PI�7�����钞�P:&�9%�+~T�͂e�ҷ�g ��cF�I"��F/�k֋���k��֕ZG�C�8���=�ܯ��*�/�5J�MA�ɪ[{�Y@��:Ύ�֍
@�π�;~�>t���X`kU�9��Ƃ��z����H�3>i�2�иBߴ6}Љ�C�k@�`�?n3\�p�k��x��G17�}���1���9fH�4�1t��y#�.|E1C�#�x"�A�L�٠C�8~@�s�;u�]WQ9�QúSn��tG��ͷf
c����������J%�p��I���k�R���)�|��0k����p�8ˠ�v�R�rRؽd�m�ߨ���H�5X5d��xR��,P� Xg�~ђ�R������ٝ�[�'���մ=7�"	��I[ףH���&h�sZ���J�h[$�	�du%��9EB�Ɵ6�.������jۓھxLb���sБo�����H߉;ƭG����ϸ��iL��Q;Y��̆�C���5t?�{I�FZl�s���؃�����ZX�n���I����d!�:��4p}���U�]� ���PiȽ����'"���w�
�;^��9hK$�� zl�WpI<�������AiBm��깥�r���#�$o�^����:�p~ Z8ֹ_�]#M�2	�[-U綎AR�"�&B�C��� ��W����c�z�t�!b]�;d�9r�����;���Oqe\#�N��?s�����0_����Ȭ�{{�o����p�f��)fn�;�:��b;]��E����c,;��[G8?;��{�$�е^��ܯ�~�P�yތ9�ޡ���PO���:k���MA=ܛ�h��,��Lbu���wͣ�A贇�t�f_I����������#%����M�-���e�u����٩��Y>;5����A�;g'��F�5��5qA�J�!�ё��u�U�9l.���k�O�0���,$�vF�(��ì1���1�=z��Y�5��)��t�
#Z;���wq�d�t�cP��i������9R�I ��QBşvP5����������C^��=�R��V�j2��FM�:t�u����Ǧ�$M>�(�N�6�;#�|����y�^-f'�������X���D����|��OH����;�O)yEꉭ��*�.�ʁ�����I�#	>P��>t����~	��B�	ͅ�M&�J�k�hi�{�H�v�4�Z=���9E|gRV��Jf�\8(s�1���X�518�r(r<#$���H���!��3��$� ���f%:<�N�� �$Q����έ�L��7�����j��O�I�p��;�@ɸ���╊i�2Ց��+�e�Hʥ��9��>EB�&}SX:��y���5����$�c)��]����s������1�/��5���4�����~�u�i�̘�Y��H�67�!v��q<�����	�\:k$^��`��z�.�#	=B��i }�}h���qJ�}}�dvR&
��P�&<�_X���򃊋�F �����;~����z�J�:�:�a�'�O�{�Wy�� 3�M�t"C��p̰��&.�=���ܼ��l�k"�ѵ�{�G�2��:���=$��/�G}���\�[�}�u�Hց�c,HV��e9��Ӄu��=��dn�]*�=ڈ6��G���CE#�DcL]�� j�q�Hq�C',��p�`�Ph�1�c�~�b�Eּba��+_��tNw/���	)���j�jб����c��6�Ӡ񺮢~���<��:?I�a��&���PW��xU�r��׭�(�O04^g�PX=�p@ul� -rn:��W��>����~#���c����Ft�z;���#�4Rcԣ<�>Q0��t*�_=��4����^����4���☄/G4ˣp(����H^�頢����${o۱��$�����C����B�@!��~;���z�C�<��P� wN#�з�l(��'I�#!!��{^0�j��|�g>"���?��*��φ����H(9�O���*�83�����E�{�O�bSN��O����^>�N'Hg@F���ή�<�	t]Z�$��Wq�B��c�6��]IBC�߉Ԙvߌ@h�UB�d��%HfG0Hn��$~/�BZ�@Be}S��G��Gq[W�wI<*Rv�q�K��	���ISj�1(�:�!!*�k V㑮�t@Ǒ΁3~J��)˘#���@8G�\�Ϳ)�uأT�q��$���$|"]��ߔZ4\d������K9=V}"q4���0��w���ǥ���I|бA����sg]]�~�ՙz�]�1���!U��HHB�
�����=����yU�������t�_����s�.�[�q�tx���ZS�&��	����A��,�p��	����IsI�ёA�-���[#�^*���M���]h��ym'؆ǳ0B�hu��x��1d �ڔ��],�ǐ���6�!���I���O0�}���|�;�g0�k�%�^s�H��`�*�̑���2O��;NQ�%�,��5�j��rR�-��U���(96ᖩ-Yj�n�ťs	�7}���֭���/Gbu�
5U���c�ȯ<�ˑ��V����v��Z<��$�&Xt����N��K�V �i�Sp���Q v�W�oJ�9xmP=s�	��N���;T��=
f�5h���'<�`A�I�.�1���M;�%x��SΑ9�nqv��Qf���h�yҝܭ�KR��Q�/��Ia��@�4�0D���\?��L�||��x���w�}�����Ozx������Wo_���ͷ/�����n��#q�������ݽ{�������|���g��_<��y��|�y�,��u޾|}��~����c������_���/�__���?���W��n������Ͽ�������{�??��._�w���wo�������=�zw���}x�����z�7�,�ǗO?ݾ����7�~����5�}������u{���>��|��?}]�����7߽��������O������ś�zj�aO���7��?����"�>��_�����yu�,��?�?����՗�����������߆_�m|���+��V������o������������������"��?}Z/o��x����PK
     �N�@               word/theme/PK    �N�@3L�  ;     word/theme/theme1.xml�YMoE�#�F{oc'vGu�رh�F�[��xw�;���jf��7����@%ą*�H�_�RT�Կ�;3��xM�6�
�C�}��~����Kwb�����'m�~��!��<�I��n��V<$N�xB�ބH�����]ī*"1A0?����EJ��҇a,��$�n�E�<�p!� ��la�V[^�1M<���^��Oг�y��o-��c�"QR�L�j�ęb��^]#�Dv�@���=P����<İT�����[X���W�IL͙[��7�l^6!�[4:E8,����օ�B�05���z�^��g ���SkKYf��R��2K �uVv�֬5\|I�ҌͭN��le�X�d�6f�+������7 �o����nw����/���Z�o@���Z'��Ϥ�g������2��PT�V1≚Wk1��E Ȱ�	R����e���PP��U�Ko�/g��.$}AS��>L1��Tޫ�߿z��}rx���{���h9�6q�g����?~��x����_T�e���<���j ��Ԝ�_>��ɣ�>}���
����2|@c"�5r�vx�������8݌A�iy�zJ�`��B~OE���,;��F� ��^�vލ�X�
�W��nq�:\TF��U
�`����Ÿ���x�Jw'N~{�x3/K��nD3�NIB���!�ݢԉ���|��-�:�V�d@�N5M'm��2�����f�&�pV���w���U? �	�e<V8�9�1+�*VQ����q=� �!a�"e՜��-%�
ƪL���.R(�W%�*漌��{��iv�&Q��܃�h��*�w;D?Cp27�7)q�}<ܠ�cҴ@���й�v8����1��ǶΎ�� ������V"^�5��6���<�Q��rз�s7�8�&P��;�}G���r���I�vʭ@�z�`7�f���!�(c�j��Ui6�։��z�9��ĔF�5�u
l� ��GTE�Na�]���Pf�C�R.�`g�+ek<lҕ=6�����j�vxI��B�YmBs��-i'U�t!
n����6�����4Cu���e��k0XD6 �-�e8�k�p0��:�v���b�p�)�H�#��l��&Iy��� ����C�1Q+iki�o��$I*�k�Q�g�M��W�4K�o��#K���t��Z�Ŧ�|����i�k�B֥��a�͐��-�c��t�4���1�	�pMa�>����j�Ȗ�y�� K�&k�b�zV�J+�V��5+ �nj�hD|UNviD��>fT�Ǌ��(8@C6;үK�	���	����t��+����+�^��,�pF��E�N�p�ǅ�d�Vi�q�����?#W�e�?sE�'pS���p�+0�����PJ#��lw@��],�����d�_�}�����a�|j��HPX�T$�Z2�w��z�vY�,d*�d�L��C�O�@s�^�=A�6�h���֟��u�0ԛ�r�9R����靏mfp��a����_�X����fz����/�۬F�������MN��Zƚ�x��Y���Q
�=H����
�S�zA��V?4haP6P����i���C�8�A[LZ�m�u�Q��3��z�[[v�|�2����U���Y;��k;67Ԑ٣-
C�� cc~�*��ć�!�p�?fJZ���PK    �N�@� ��  �    word/document.xml�kS�V�����x;i��ۘGhM'@�d���i��;�XY�J2.���@	)i��6�M�&m���M�͏�ȩ��=G�e_?�1�BRo��-�W�s��s�[o�Cs��
���"�p��RrZ�f��ޟzc$R5NJs�,���<������*���T>�KZ����B.�g4-7�߯�2|�S#Y!�Ȫ<�ERr�_��R|AV���h,j��)r�WUx�'�qj�.�<���%x֌�d9M���l�S��so��9N�Q��a��Pu9�+Ҩ�6@��Q �O�J�,Z<��椅��
/��f�\m��S�TA��osY�z_!K4=Ϟr74�T���6`�p-��6��M< }kTm�����f9A��m�u��E�C��2��#�`��qc}�=2,u9����NN8�hg�s�X���,:�45�@4�����mpr�D^���$�q���B!Rȩ��d	�:���G�/�C���YIV�i�V�%B��`$<�kZN��ߜ��]��9.k?TDH<��|�^G�wxN���x�b~i�x��EY�{�81����?�.���Ձx�ʄj_�k��`�7gj�c=@��%��$-F N�g6������k��J�+���bq�ƃ�����fBi�6QvX���D�z��@l&����/�oL|��E�]��k�}X����ӼT\�}�c�Ȱ�p\H9N�A=�G<�1���"ѵ/��⺴s������'��k���u}媾ta��o���+��+������������p����5~��X�����E��2|�FUL!�����{�H�'�M�[y�������~������$��Ηo>}���|�T��}����R��n�ůp�$�u�Al�������0`�y�~F�|��ґ�!-&@)�X�����|�'?y��'o�D�����iEH:��|���oݨ95%��p����(Ɠ��p)�}�9���-�y���B�WH�?�hTf�aC�?��VE�</�r���K蘨�Iв�xrd���S�v��X]9�Wye������kS��OFc$�]���H"��0��kS�'F&F)L�ؿ��&,���ʵP����oeT1)n�S��?Z��-�n��uƸm]z|��
���)!#����	��I	�	��>�e�����$h)��c�5�� �Oҝ����!c�P珃��쟓����=�ݸ��x�|59><Ҽ�@��5ׄst(���]���Pb|�iO��Th���K)�	w/ZC�D}�&��|�}�(�yh��-�zb�d�F`7e��yb5Ҍ�Ң�XD�g��^sO�Q�!������$}{[6�Gn0��^��nl���:x���;�F-���頚�sMx��B��%ԍ�a�*H���������[�>ʲ$�m�깐\�Zu5C4%�*�j�2D�-�V�;�Ew º������\����l��GL~�ޥ{C�p��B�姘�zI|^���W��W��W.mV�~���ԗK{w_T��X�����
߮e�>�|���&d��W��/?�OZ:�	�0���J�&�:5/�/R��������	=�#�� 8����q�(����>wǵj��Gl���[^�T����Ҩ%�3�j�EJ�9�OTBi(T���A�
��)�1��?���=,�8#Y�.K_`$3+�a�M�T{�v'+�%�ɰ��Ji�1���b�L&�1b�N(�+i5������^#@fC4�H;��|M����l*��xGs{��P�oLUl#3<��q��������lؒG�U�L��wR`j�ң�����;�ƊD�On��?���7�}�x���Fc�i�y,#�m�}͓cj�h�у�ݫu���k��c�3��В�E���5��qЃ�;���Ę�9
��g��Z���L�0�����hn�8�9G�s|�w�#���s�s�,�9G�s��w_�?#�+����D�ʝL��Q���=4��j��f(W�,�j��G�!q�����>����[��.d���p����%6XF���o�1�����D0�`��/=��eG~jg&0�C�=*����8��!����.���U�`zJ
S"5�CP%�bΑE��Q2����F��WL�OQ�g� �B�Y:9{�<0}c�MlL���N�"�ZpΜ�20K�����U���շ��h����Z*^n�)�;0��O3���@s����1�@hIW: ;8(SѨ+m�pU�Y}F?�4�m!s�w(�w�a��.�|���L�$8v(��j��˛�G���Y搸&H�k(�Z�3���y��p�0�N����G���/�������׷���k�L�[��k���o���/񻆞��-�ᗰ\@�v.��W�VD�O� )v
#�R�o������z�"[s6�ĵ�i8W��!�E��ea/�ډ�8���X�m�摰l�'��h��:Z�؂�#4W���L �4 �g��g�I d�a�vn"�8���ocŎH80��D�s��^��V1�#��"U_B����	��,����x´O�D+)���1��/=r5XP�np�_k�_��$^��yɼ���U�@4Ǆ#�;*�-�ן��݄�����ݍ"����>)/Zz���ii"#��f�x�r�%�R�~�?����{���A�����鏮a��ك��d���<]����|n�HvʼN��1�c�����zP3�$ �g�(L�!\�#�c0�N!h��p$�G�P���v�x��QLz�*"��M�LDI�Pw�(0�ǒ�ß� #��ᎅq��#��fx5��؜�8đn��
m���b��\��Eث�F� �0d�d͌2�UWZ������f@��H�*+���we�t�P㥄��	�����%`�
�8A(�!C~V�~��+x@��=g.4y{h1��Ξ2w�0���{T�BLp]3��:������A�Y���6�Ⱥ�Gf:ģ�O�;�&�"��À�L+ߦQ��5&��B�E612�..�]x`�1 �~����]Z5k �����6�g��s�s3d��"�����TB�,,��V$5Z��)���J��i�uH�8,6����ʍ���.��������9Ĥ�`o�yúї����mS��^6��.����Kv.B^�]�<-��͍�W�+����&�ފ��V,�'X��;��X�D�͈�_sr���y^��JE�����������1���B���~�T������l�gn�%�K�Y�p�}t� Y��M�o�Ţ~m�|�*\'t^+fa%Z�D��xjU�$$M#�^v6��`�����t�of$�ϐ�l#ba��t�囂S+�$��+�d8���62+Y`%'Ƈ�h��Q��c%�u\7"�c�cC���+���3�)�aH4�8��e��"�uon���'�'�"[ҽ��"Z02���BB^g;�	y&�9�H�>-y�^����L��弙�vKPG0�Jx�4�z�XAI�&�}Zx ���?T�|�����5C��BR�:��X�D��b"2v<BР�Jrdwz`b�dt�y�z,���M��n�t��R�f9/�`Q�յ5EOݙ� ��x'P��j���>ݨ�X��ͬ�1UR��>B>�x��j'8@m}m}o��Y��+��ˁ%h���Y�d�6OQ*�\��y4�����g8�	�/�����`�{���OYca+, ˗��<P8j)y��T}�S��A�YW,2�hd�-94�P<�Ʋ���6����6.
�
Ic
9�E�ʄe2�B��[�!�D�)é�DAa7&�<��H0�~�9�D�Be�O��WO�hB&����O+B����Gp3�$�V�U�k7G�u]w����~L�5o�1S|�F ,:�|&����:����e�լ3V���X�p�Zw��a�?�F%c��F����!��D!ٖ3Ō���/81�85NaM�\�5�p/���B��8PR5v`u��K� ��'zu
��V$�"	���=os�wZ��e9��Y�S�����x!qYh^����8Ty��Z��SRھ�'��Oi根ٳؙ�����AC�A#�ht8f�����1�b
9��$�'*��ގD��Ӳ�����"?S�i��Ҹy4�	4#��^��v6��o-f1���ɺG���&<i9��S�|n�؇Q:�/��T�+`�2�r��ظT����%��6�0b>�K���PK
     �N�@            
   customXml/PK    �N�@�>ϕ        customXml/item1.xml���
�0D���n�Ջ�$=�x�i��vS��ѿ�PśיyÓţ��ݍ�zR�%)G��-]\·�C��<9O�P��Jrn'��L0b>!Vpa�c�I8���iZ�*o��Q�m��p��7
��Ik�X��������3�Ou�PK    �N�@cC{E�   G     customXml/itemProps1.xmle�Qk�0���r�5F��b,�N���`�!^ۀI���1��7t}��{��9��]�\p��h4�!@-L'����kX�u����Z�ՏUg�w�:3�ѡ
�B�yl|�i��mބI���M\а��!L�fC��,k����=�28;7n	�⌊�Ȍ��ٛIq��t"���ƈY�v$��'"f��� �����{{+�j�$�R�e���FB�SiJ�u�7�? uE��W}�{�PK    �N�@W%�R�   �      customXml/item2.xml��A
� E�" ��B�@��Rn��F���hn_)�'��ޠ�L{1X�Ā��)�8�Ǽ��]^9����6��+��
=rG�@5��]ʸ�Ϧ�YVH�z��d�����Ϡ�>�Eew|eQM�b�7PK    �N�@�(:G�   �      customXml/itemProps2.xml]NM��0�/�»Ǥj]��Ҵ[��5��Zh���7��=3�|���'�W��%0�6t�?+8~�|����G�H�/goEG��DC1Lx��X���F�϶^��#˹^U���Fs�W��&����{U��X����\b�� {Agh��هə��t���M�7�>���kaoiޝ����_�{e!�,�PK    �N�@�\ �C  �     word/fontTable.xmlՖ�n�0��'��ܷ�Ch*��6�nv�uڵ	��qd�2`W��v�w�`�f�ַرM(���j��D8���/��O���Թ�R1��\|�\�f��l�s�\�G�먂dc�����%U����g���Dd�r`~��<鹳�Ȼ����D��f�p"$'��S��n�%��`#��b�����4�,b2a	�ɜӬ0�=IS�(25c�*�-ɶr�K�P�`�<��8a�:vq�H�Ĥ8��xvE�N�12�x�:<龘fB�Q
�8p�V��E7#�W�S弤��$3r�	E1��&i�E>�'���(����ә����Ȇ'��tYF��k��Hfe��H�f�(6�s5B=^	
�Q���D�����({�<̬�:b�$&���X���Y�2����v�������s  ��]	":�A慰�-c:!��ŰZl��E���` ���$��[�����$�^-n㫒��"�rߛ/���^�JAl��pA�A�i%@�1�6�_g\EA-�R��a���~����	����=��>Ah5�-_�p�^M�/�}���x
_�����-�V4��a���|1sɨ�%�F!ԇ�Q�.�A#Mp1�2�D�z�G��m� `�0|��}=��%��k��Z���1$)IV��شMS@�U��}6���oV	���p9�J�.�p�i��~����ݗP.jh�����Q_3�{hc�Xl�%�ŭa�L��i\��~j9��a�U�D�CUc��
�r��U�8A��C�����o��
��@��;�p4)�>K�.j+��ь�#*f�A���'�m�\��n�X�Su�PK
     �N�@               _rels/PK    �N�@""�   �     _rels/.rels���J1���!�}7�*"�loD�H}�!�����L�}{������r2g�|s�zst�x��m�
�U����N���aq"3z�C��D6������2�{�(.>+�㝔Y��0W!�/�6$�\��Ɉz��U]��������ik�A�N�l��;���t����r�(Θ:b�!i>��r�fu>��JG���1��ے�7Pay,��]1�<h|�T<td��<�8Gt��D��9�y���}��PK
     �N�@               customXml/_rels/PK    �N�@t?9z�   (     customXml/_rels/item1.xml.rels����1��;�ܝ�x��xY����t23�iS�(��O+,�1	����?¬��S4�T5(��zG?�������)��'2��=�l�,����D60�����&�+J�d���2�:Yw�#�u]ot�m@�a�Co ����J��6�w�E�0���X(\�|̔��6�(�`x�����k���PK    �N�@\�'"�   (     customXml/_rels/item2.xml.rels���j�0�{��`t_��0J��K�6F�GILc�XJi�~��;JB�/5�{��3{�6U
�����������bcog�h���v�j~p�R�x�UQ"�D�^kv�%�e2PVJ�G�������?u~5�}3U��]�uz����M���-�����B���L��l�b��gk[�{A��~���PK
     �N�@               word/_rels/PK    �N�@�c��  �     word/_rels/document.xml.rels��OK�0���!�ݦ��Ȳ�^DثT���l����������K�x�ޏ��n�m{�:�dI
��U�o���b�*�{�
F$��7�W�5�G�v���HA�<l�$ӢՔ�]��}��������<M72�{@q�)��p�6 �q��{���>{s���J����R�Muh�̥$����&�9{��f�$�sUv�6_�y�o�l��~M��s֜I��\d��d d��O��9U��![��>.�<4�S��ؽ�PK    �N�@p���t       [Content_Types].xml��=o�0��J��׊��"0�cl���u.`�_�
��(Ҩ]"%������M�Fg+Q9[�A�gX�Je�{�=��XQ�Rhg�`�l2���6bFj�@���G� #b�<XZ�\0�5̹�Ś��[.�E���ڃ�G�P����iM��$$g����:�`�{��@��*?���	�ʖt�YN�d�Ǜ]�+�&����"qp���̻�\!�ip>�ӼGb]U)	��KC����*h�0�obO��ԙ��P�����/��-]�������։���3�6���/J��J�Y�ݨ�b�cnt�8���O�ʙ�п��A~�4�g!" |�܇{����� ��l<�]<=�_?�f���>�PK     �N�@p���t                �n  [Content_Types].xmlPK 
     �N�@                        �i  _rels/PK     �N�@""�   �              j  _rels/.relsPK 
     �N�@            
            �b  customXml/PK 
     �N�@                        ?k  customXml/_rels/PK     �N�@t?9z�   (              mk  customXml/_rels/item1.xml.relsPK     �N�@\�'"�   (              el  customXml/_rels/item2.xml.relsPK     �N�@�>ϕ                 �b  customXml/item1.xmlPK     �N�@W%�R�   �               �d  customXml/item2.xmlPK     �N�@cC{E�   G              �c  customXml/itemProps1.xmlPK     �N�@�(:G�   �               �e  customXml/itemProps2.xmlPK 
     �N�@            	                docProps/PK     �N�@��9k  |              '   docProps/app.xmlPK     �N�@Uja"V  �              �  docProps/core.xmlPK     �N�@�Ŧ��                 E  docProps/custom.xmlPK 
     �N�@                        u  word/PK 
     �N�@                        ^m  word/_rels/PK     �N�@�c��  �              �m  word/_rels/document.xml.relsPK     �N�@� ��  �             �Q  word/document.xmlPK     �N�@�\ �C  �              �f  word/fontTable.xmlPK     �N�@I��ݑ9  �'             *  word/settings.xmlPK     �N�@+��e  _              �  word/styles.xmlPK 
     �N�@                        �J  word/theme/PK     �N�@3L�  ;              K  word/theme/theme1.xmlPK      �  jp    }�             1 9   j q \ 8   $ ( ) N�v8^(u�e�l  2 . d o c x   hat's where global variables be (#6170)
				if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if (PK
     �N�@            	   docProps/PK    �N�@w�k  {     docProps/app.xml�RMO� �����[Z����V=�d�{4���[ ����R��z��f���?�.�@�V�8O�8B%t#�q?���2����V��O��kvy[�Z/�E�B�u�zo�q�Ş�4�*(m{��G�)�V���'4��?=��Č�������״�b��^�	��؛�{d�C�.m�,l�[9�׶ql�Z 9�P��r��K1�,��	R�� r����G�M��|0���=��,C��N���x��/1��M�o�K���I½���p2]M�N$��I�}����點�<O�?H�����w]�T	���dV�M��K�deUβe��jdj���w+��e@�0��X2�PK    �N�@���LV  �     docProps/core.xml}�_O� ��M��-�[�FZ�dO��X���n#� �۷�v]���x�9��@���*ځu�6"I�"0���l
�\��9���F�6P�8�d��h��-<ں��(����)����b��4wIp� �k�����������k�\r�q�����#���U�C�w�${=X��<�+gN���	;q��R�ѽwj4�m���>F�O����S�j�LwW˥��Qa�{�Q �㸓�2��+W��<N1!%��YJ��-�'�p�Y�e�R+����׶��J�,w�!��Z��90��s��=ԃ�߄d��$+��L锜%<X7��Nu�e��玝���g�PK    �N�@
��o�        docProps/custom.xml��AO� ��&�BY�ֆv��v�s��FR�Z]��]��{��~y�/�~���yeM	ӄ@ �B�S	�{����Έn�F��"=�V�w���Q���a|	�!�ƞ���|c��:݅x��}��l-��4SB0�|��7��9�),_���p�n�~���D	?۬iیd����$�Q��׈l�5m�����qy��N��O��+&�I�(]Dϡ�w\EIFQ�&q�d��(�ÿ
Ë�u��PK
     �N�@               word/PK    �N�@�N��{  w_     word/styles.xml�\O��J�#��9�a�;�7Ye�l�$b�,���c��8�݃����xzℐ�w�q���ǧ���[P]��xlw{��<!rٌ�U����_U{���8�y��"��vO|���h���t����r�,	ny6���w��py���<P�dǱ?��|~����3�잘����4f9|L��c��]̷|�YN�(�o�wwvZ�ir�Ulš��LLs)r,�����O!�n��$�
�$G��G0�d�p��b�60qV(��qG�}�M��"��y��O�H>faR��7�w&n[��-U��p�W�p�6b=�R��̢b�����I�R�f 9��?~q���M"��p��)�S>e�(����"��'�s*�<��,��p4�c�s��^�������q���Y�?�B6���_���_˻���d���m�/���˵QBAD�U*�:�H��`������b��Ņ��,��3���x )�o�8|�i���~q��"�$<�τ�����V9+Q<���\�3����D=� d�4ㅬ���s9�h 3��o@�q&	�nT9�T-T��W��_�~�U�Wq�_���*���ư�
a�C,�eڃ�.�-v���˴ǃ]�= �2��˴��.��ӽJz�����u�n�%��Y���e]�ۓu�n?�%��X���a]�ۃլT��{ə�N�<"ODν�߸I���3�֊e��t�,���A�(�4h�g�.}�c�;���bL�a�Ъ������So^-RX��&a�\�:F���S��b�	����Oy
+�$^	(��(L��,≣���$Ǔ S�6�B�9���`�|&��1@b?'��y�L0��Y�����,�����]�xݕ�ʵ(�]�"�N3�(�Ŭ����#��%	�iI��Z�`��5�N-I�SK�Ԓ�v�JZ׊rh[R^�y�ƺ'���>��s^%�C;R͞J��%���z��]��]�l>����Q<��w�ڶ�R�n	��&�v�mL����-e	�[�B��m^��/��e�9<}0��Z�t�=F��!�x1ɝC̢��`���)<rX��i�B}#���*��\���!���Bw�++9��]ɩ�r��!��C@3��¶Bo�"��휧С�u
�SEb��tmH]���+W'�q��Tʁ+��P=��3����l�1x/��I�"�G�f��H��<R�<{�3	�5��>��;����3�1���mL$,��$t�5%%72D)��a��D��ۉ`�s�˚%/`��?� =f�ܱ�B�KH�%��U�>(����Q@���tl�j�t^՘PY�g���ug�#'m���Յ̚�[�Yu�}%z1�-p�����!�}����i{E$��""��&Y\�L�"N2�Q�8h��3f��׭	W.�A��BA�,� e�P�2?(H��� �Ɏ�ݿ�h
���W\�� @A�Q��G��)~DA�Q��G��q�ǧS��4���S|Z�xV>�������]�=�E��9>�QA|���ܦ#Ö	;�|@@mD�(e���'1����{u�f�	��&ls1?U�Z[�~�[�#B�\�Ʒ�F�s��0dX�W���,�E��>�=�R�%[�ݩܶZW�e-"*߳<
xɃpSc
����oa��N����_mҵ�zv�-��&U���u��~�:~�g�5~�O�-�����vn���#ۓ����գ�ב-w�N/z8�ep	��[��{��m���[���L6_�x�/��+B�bsJ�Y�b�Pl_����TkH�(x�f"r{�K"�n��v�:��pc���1��ژ�{mV���H�dS]�b٨�����ǬG66*��F�ڼ�.���s��ԬT������b�VP�lDZ����#�ZA5ʙ��@��Mr&o*�3y��ț
bc���j�MŲqC�U%o*��J�*y��ɛ�����IA?T����ME�y�F�þQțj�3yS��ɛ
�L�T g�9�7ȍ�� �bٸ���*yS�l�PUɛ�Nކ躖��ME�9�I�T�wL�MŢ�7˙��@��Mr&o*�3yS��ɛ�F�T
yS�l�Prj���@6z(���Mr'o�&�L�T����ME�y�D�T,
yS��ɛ
�L�T g�9�7ș��@n�M��7��%�Vɛ
d���J�D w�6lT���ME�9�I�T�wL�MŢ�7˙��@��Mr&o*�3yS��ɛ�F�T
yS�l�Prj���@6z(���@p�X��0y���۟rxg4���Qp��<M�	�7��Sä�|}�fp[��.�q�>Z�9-��Q������7�,%w��{���/��a�p6g�<�����x��;p���a���j!�x�c �4�]���n=����fp��4�8ƭ�P9��_}��_�������+y���r��h��H��A�,�����8ٻyxNXq-bh^����T�{7�:9��&�,I�Ə���	q�?����۪�ӧV;�&΅��<�����%�y�|S����{^�أ]���9�ř���y���ҽ�>L�r����^�����IQ�~���c�����(�O#&�:9Q�oyZ���W�+_���|��u�ğAn��=7�!����щ&�o��Kv��{a����8�`�7�|����54$�D*i�?g�|�R�5o����E/�w.�pt��nn�R�T�w0�j�OD���,��h����`�Gi�y�ר�Lٽ�$77��g�Z����:�Lܞa���B�\���� -�Ώ:��Jiճ�6��q��SD��
H<9�B� {ʭ�*��N��h/T��0�����߃�h!�e��>��z���Sy�5Y��r7�J]��N��I��[� Φ<����囑������h�z}(P-
V+�|�,���5G+�}��������Ps�n5���mNa��;=�^�6;O8�w�0�Eq����(R�?h،�tmsk�p���b;h��h��؏N�$�5����2R^9�rY-{ϊ�����C�^��ɽ��Z�[e��_��?_|�ID5ƚ}��ғ�G5v�
s�q�>m<)Æ�aR����&E{��fR����>{���zC�iqi�)�2����l[�5{����~��?�}����|v�ş������_����G�PK    �N�@���&�;  �/    word/settings.xml��ے�q��'bށ�{�u> L9�j׶=�<
�_7�&�!���D?�|�)���8�7��]��ڇ�yX��o���o�|���ǧ���o^�Ӽ���������y�o�Z���������͛���o^�t����~�?���~x�t��̟=}�+�^�}�͋��߽���W?޾�y���w���x|{���|���7�|��7�޾�y�������O_wM3�����o^�����y{��������둗�����������w?=Y^�{{����~�}��~�{���mo���'���%��>�Oo�|��m�_����������'�;ûx������z���羽����5���<��T�鷿�^��m��~�ӛ_=/��iw�����ef\�x���?�p��x��6Շvx�[v�<<�����w���X$�cӼ���~���r�����O���vxώ|��}���t�X�O��e3���}��x��?���o_������������-�G����n��ӯn���͋/c������������w_~no>��x���������ͷ�n^�_��m���O���/O��֟~~���|���s��|������������������n��r�^��ǛǛW������͗���g��-����'���:�����w�?���3'��u��Ǜw�z����{���@~����y���=���7���on�>��?���w7?=��O����Y���߿����/�� _��<�������������^�I}�I��q�7oَ����r�������?��j��s=�i[v��|���w^Ӄ�}���?��-��o���m?o���~�4M;�ǧ���dj����������9f��⏓�׿35�$�F=�M�\O[������W#h���um�l�K�f
�ӷCx[ߗ(�>m�̳�`X� ���筝k�g��՟隳):$�W�k��קk���k���ӵ��{����dL�~�|��a^���c��9��܌>�}ۭ>��v��~lڪ�Џ};�d�{��~����z���s�ѡ��3C����m�h��]������Эſg�$}���CV�4U_�a*���03:�<������W�jl���r�\�MW]W����N������Ի>��Ű��Q���s=�g	��1H�&�q\�;�<ξr�\��=s	w��p�uM��k���g�9���-���e�ٙ�y�2q��3��k�iX���p��3�eoC����m�b�\F����;_ӹk������2���>s�?��pז�8��;c	��<M���y>�Q�mi��G����o[����Y�&��eO��eܦ�]�n\��t���ӄߙ�N\�d��h1����Y����_�ao�`�c�i\'4���:������9���W?Y[�T��v�]�um���Y�t%X5[�6�w�r��ކc�U؆��mj[��m�s����Ӹ��ft�'�ތ������]��v�j��4�}�wu�3����s���e[���}({��'��}\��=s4�>�`�8������7�����d!��=G���m�4�1��a�i��dS�e��<�3sS|}�߽Ǽ�򘏠�K������.]]}�o�F*}vU��OV��ൕ~�è�9h��o��u���N�`�iV����܉R�/=�#�Ug���dl>�s�k�s�G��s��=�ss�����O�9-�g�M�����fB���ma�j�k�p�;��[���y�Q�nW�bH�SWI�S Y��i۴�ߴH�A�f����4�jr$C�k�d?����όeћ��u�m'��m۝�i;5�!��{l��a;��K��5ţ����T�T��Y�ݣ8m7���x���-��:>��ݼ�jö=���o�Cu��=샾[����6��۾'nhV�ӣ�m?��g!	vb�U�$á���}��w�aF��3�됁0l�s04�Z����`����gn��0�z��af��؈Wm�$���m<b�"	���'x�t�*�m�}F"�>�#��n�䜃dhݣlG�j� Y=RҎ���8/��q/U-�vb�캦(��gg�1���~)�
S��ϐ�
#��������4�c���3��YĞ<���]��mnE��ٷ�=sW�>�����q��.>;K�Nj���0���d
���G��e�®Z�,L��y�H�<y�]�����}��uh��]�.��0x��]���HJ�,���׉���bOaWm�H}fk��Ŷ��C���������m�a6�6�a���~��)�=��Q�M� �����m�MA�ɳ�-�"�0��C��ݱ�}}��>�}����9�>�fG�L���7�G߆]q��=���c�ewur�vLM�>2w�C�y��G{�g��K;��ٖn
>�'�˴�gt}�z�~��~�u����)<�Ӗ	��`yZvh�C$q�%�2o�Ym�?yI��W{�y;�tן�6\S 	��9����9Ν�(_��y:�v���q
���t�r�l����c�U�/�k�:��/i�[��s�s
b�z�w;X�N����5�`juv̀yk��$�F���G��;��M}�{c��Fr.:�]C����mB�(�٨~#G���	:��|��M4�uK.i�L
��~}�N��|l����gω#)n�v���3BR�"�$�ה��D�2�O����/%~�,��=	
���[��#\3�L���	-���8E�ͧ߀H����������A�Y<��du���]�!���Z�.�2\��qi]?T��b�X ���;�R�Cr�owCӹUC�UǆIF=��wV7�uћ	 z�g� s~�g��w�{���纱�ܧER<��-�X4��!Y�o��.����A7���s}I|W��t�8�=�\�����L���`�[ϵ�c��w�=ܚ��a�MMҖD���8�A�j#!9��@��qO:C�I��O7�G����x<�v�4����&��~�fb�� �D���z7c���Ǒ�w�-��c�G�`�-�݉H=|u�\'�-	V�BDS�����٤nm�/��U	���z�נ��[l�gnk�Y��nk��G�5�{`� $騉�H�=����Y݆_�'x�緻m�éߦ��2�67a�l��~}�7��O��j{�t�X�ͷ�C���yo;VH������@�݆=��\S 	V灎u+��v��vG��x�K���@D�G'�c$�35��#9�
I��u��ݕ����m%�P�v)dp}}ʜ~�l�`	]�g�zd�,���^$G�����%��\�	�(K� �Z�5�`�� I�Y���U�>�DJ<�������(Az[@�u�]_E�~v[	�9���Q����H(��a8��t�sгn�Y��ʺw�L�ZHf�H���G����&�y_JR/�m><�gq$3��wb�:��w�;�8���$���Ի펳����D"2}K����%�S�3�m˾�{����C�L��Cr��@� �\A�TGs�XC=�Hv�[����;��n���%~7")nq�\��JF29b�'��~�%q��G���GB��^�<?�3K�;��󷵃[O=�1�")��:������6�7�>6J�|�-r�r�]	o�(��ߙ@�d^���s�BR��R�=	�k	�Ct�+B����m ��w&�a�Ck�Q}F�[�,�뇩��OF�u;����#2WY��d$��s@$�Q��ߐ��#FR<M�kw>�����NAW�=[Q�(&G%�W�Z��Ut��1�ޣ�D�����z|�%�<[�O@.6��xl'�V�W���mnv���L��CR��-�c:j)<	���K)��|}���o���M��_�đl��, �M�t�A��~A��>X���6��3 >��n.Y�-���E��`�|��m�l!������2+qK5�k���?��\xD�g�l�᫣���==�>��3 .�~ۀ�{
�o�������qO�G�{����Ų����(0���Cr�_��/O�=�T=>�M����r�1�6�F�)���!�1����1��XO,o�}}�}��H<:��}�17�O�U��5,�cW��.��*m��l��> ��P5��u���:����\I���:"*-���$wػ�ñvIO�*��sނ� �'�U�r�b�[�	�o	�Ȟ`=U�r�bl���<9�K_	��)��4E�xqk�C�����}%\��mh(hRb�s�0��m����.��dwT���C��Hf]���I�j�� ���8���d�;�@���/�ZOHf�e�T�h� {�	`]�7w�M���p ���CG��*$��j9ul95�.f�}��XM�g��A*E��`�y=�з����Px� I��1��s�	����⻊�W�����7Ǒ� ��F5�ѣyHZ���́Z+�����甔���9+�� !]�3
ƭB�!K��؂�m:�Y�#��q>�Z��q� �!h���k�	l��($�,;ŵ�DAթs0���{D�&���{<��P0|��-;$��=3����"ưڸ��lC����T���Ӫ�>���;@0㈁KR\�^f��6�Q�k����K,o�U8;�.K�����l®Z��Q�Xo�[�H�\/CIo;�s v5�������M��́�qKuX�#�N\��])w����GJ��Y������x&d_��la�$�BX 浭�e��g�g��@�{a��9�L�����# V�~D�/ �=�7�4�پa�p���	�|��DoU#!	g{����v�p��O#�Y!�c�ot��Wao7���`	�N���a'"�gn�OϽ��59?�<q�*$��K�<�A���j�y�����`C��G�tAS)~Mva:����. :\'�fz�4!��=�r뼕v�7��+�L����'x,T�y�m��-��2��3�����)|)�o�P^�o�G[�2����>�d����Gp����s�c�Ț�a�Q_�<~7�s�\�l�4h�d�D0�{`��+<Ҹ�:�ڔ��~J�~y��:���;�0Z���ϐirϨ��g��+����k�:��*u�a�X�>W���H�6����Ցd$�;�!Hvg'��w.���H�UWa�m���K�V2��og����2l���%�KC�y$ԥ��	�;���ñ#e�-�/ՖPX��2B��'$�}Ԑ҄ߙC��r�}�2^O�f��|#�_�Cxfs>�;����sг=�LX�K)���l0�QP$��a��I��D��.�ke�H̶�N?4������y�G�ў�"K9��� �{S�B%'���!H`x��!R$�ѻ�!ȵ��6
�}�PY��g��\߆�����3XH�����y��Z4�pz����WHV���la����>�8N�g�F*�<�������F���#xn�P�G�O�mbJ]�]TG~!�	�M���1ƫB�OA��]�Az]5Ц��E������N�A�����0; �<_?.xS�ɗ�x�;��0s�=�y;3ϸP��+V��S�)�F�c�ۉ#MnE#	�h����`�V�/e����q�T��$ַ�!E�30 ����`�'�H�xE�\_�nr����w�
�s���QZ�s�qg�������.��D�ܯ���l�!J�=>jb?���7R)�8��l��i<�4�5�:�����Fl�c�#�%G�#I���mA[��|3���Z �:1|)e��Z���)T��H0��m|���Gs:{�x\����z�a��*XBpQ9�`<�u��>8%��a��H	 �5})�|��L��w,DU:D =?7�_\W�2�,�c�F��Fj��B��k��F��u�Fw3��a�w�/���d�|������냳	]#`��I��l�c0F2�BB����m������_�o�g`�la��ÔF0�_O��~3��w���$��;�;��҅����v��NI��*v��um.`�t��SR�͹Z@�W��$���C�2�!��!�� ��L�H�Wa��HҠ���f�n��hk�Â��܂RXO��{;5`u�`<��L���z"j����P��{���6���k$��;d��;!��{���"��B�r�my��[v�{�ȥ,'�$�t�ƁzˠF��,~� 	�; ��9���z�q!=�y��x����݋��X � \���	���Ur����Y��aM�b_��/�g���e�>j�~�(R�:d�;���`4
_
��z�d�)���VD���S�WQP�̭�獚H��!B�Մ���x&i1��1�:��))��	P�?C�6HB�ߙ[���M�����|ȖBm���mHC/F��l�e �@��Q�@�Q�Eu�#�<b����-=��3Ԟ�3t�}�sUH��m}�J�9��̴�a���D���6�Q=�K���i��{/�z�h"n��Hp�uvh���z>g{����M3tX����rc��t�!
�'h�����pNA;:���@��{���z{���u�q�1)�/���	�2mA�#�Zl�f,ӡs�b���[�$�3���<���uDTiL�#�c���j�`��,�ǽ� 4�� �y��M 
×^�S��X��#��ƙ�����s:���j�j#-�_
��W��?��B<ѫ|����#�u��aAP����	l��/I8��J=��3�Q�] �Aӱ���7�A���Q$��:(�q�L�0h�~�<�}��1.�*8�`�E,�����'�o�-g{ ��R(�SR`^��!�O��⵱,b���>��B׊�k	�À���%�X$�g+�Ԡ)���ҩ����h��:�&�I����)�^Á�������`H���+v��0f�QBJ&�v)���F:����#t�A�Hf�(�� ����ђ�G�U��D-}hX���}��ό0�SU����*=�B��`��Qz�y&0� ��4�y#���P}'b*��g�PUF�8t6A�.H��T�b�G4�,^�$Ԋ 9���9r��I:��BR��s&��$�} I�x�U���Y8$��xfPB�j_|O���=�=SN�ԡ����`��ﹺgtQ{�^�~� �O�7 }�I���d��;�	���r�ށ$�{� �k�b5>���ה`�g�f�pN	9{��g&G^!)a������5��`�u�piy���z&U�Q�H3`&��Q�4l�g���z�&�-���t���,���[S����҇zM�(�*ɹ�/E��N\�X�����BUs�g�����H	�7G�#	�`tr�'$IÂ��h$��gpg�=C�����7�6^�l����GR�$a���_��~��6�����N3����A2{�+z!�@�f�\�3��V�1��$܀;�'~��m8��
v�@U�^��3!N1S��($�g�����m�?�k����棆��-�+�{p¼�;�W^wG&�OڣcÂu�p�[��!Զ������7�1�a����SOݡ�U�KKŌ~O������A�;~g.J��y�(1��v8v�p3�5ɣ��5X�{Lh>I��j�P������3��m�A����<��3���lrz�������ZJ�>6�!�í�8��?X(�dK��slwhulu�=�����p$�[B�e:�W��jy-z;���ʁl՟��P	�� 	q��B�4�	����Mh����WO/-=�~�TG��ۜ/�g�k�gȖ���߅U��ʳ/K��{PM@�"Ac�؈��Q�O����h$T����_�Zl���#��K�����d�3�dq-��:z5�$	�p>B�,$�#{�]Y<G���:���(�x�ւlvuˎ�'�:HY�3����N0]�ܟ[�7N����v�u�m�4��ɑ��\ �s��<�K�)?�Cr=<S=?�o�X�2�S�I`~Y�_�'N�u�}lT�/C���u�]��i�^��$��C(w�<P��c�HNϽ/��z4
�γV�h?�_
H��&-@1��$AW�(=z���(�O0�/�/���!		���fX�yq��27}��H=x�{�a��=Jm_��	�;��^��|��x�e�Ѹ�x�=^� �a,�$��L�c ��gZ�2�?���#��D��BܸvA����L�@!�_�� �Aז���@g����~�b__m:ez�v�㨽e�B�в�H�7}�½�ҏ%<����☒e�q�u�~s���+�<Y66���H6Ϥ 9g��z|g�!d�QSsl"?���Uz.Sx���w�NR��0nY 0x:7���Ҫ�:]�8�����;���>�H�H�|�>[�W��L%X�Gb�!8�/Ԩ�4��:;�M�w��Xx��V��F���bB�^��8��8fa�WF�H02{��B�sF��cH��;g�u�X<��?� [�t�#��4���
�����"���I�~;�Sp��J8Tn�/��(Y��.�g9n}�u}�U��|ި�
^N��x[@鸭L�iv����͜�$��wE�;o��~�
C��ޑ����6�����p��4_S��=v=�+@��!!Z�c���#f<sz�Iu;�B�Ʊ�H�4�:}>6L1禣��p+`%M{��_���Q$��Y!Qv�I��"	}<�m�+W��M!	i$�kH�N��BMP[��  �5���gGk�Y��w��64�J��Q��=JJHv��h�8
d���-H$�mrH5��C.��ﷁ ��m$����F���sD�љ���>�<�{�HB����]�q�p%�N�Ha�k
$��"��x�I`�@��Q Mݣt��X�J 8�G�S��A�u��U3�����׫�J�$�GNWʣ<�dq��2	
�tv���E��л}�	m����/H:�E�?��0��E�*��} ��G[!֪A'�O��ǊF�����ڐ�^��bnxF������k�8�^@�:3�z�
_SbE^'�?�aǯp�~��9�!My�/��`�G���֕�6��<���ߙ|�m)���̺Q����=XB0yda���#f�v�O�y� ��;k����U>a��w�hĺ�����N���}��ޤ��.��=;�.���g���3G�q����%4k��*s�v�kK �;��4���������qK$4o�����
��#��@��o�G��X(�R`�rK��8��;�=ϱ�'P��2I�����/�w�I"�u�U$4`#Bg����{���}�w�B+�&�j*P?�5ŸV��9�|�WSh��:�!JP��jW8_�|vhj����J<�U�π����(�%��gk0�ղ��T|�i��ەԝ��VT6״%	�$��`� �!���Ҁ�%�����x	�!�m��L�oͭ����x$��[G�ӟ���"ֲ�����mE)z�����%�K�1$�qv�!��AB�5�X{|������q���P{�Yا7���>@�y|���R$��i�԰C(�_
���%��)���OK�- ���{���h;�1HH9���]��\��K��x2�r�h"!:�3ж.H�p�z��T�	�!��Z &�%��`&�$���s<���m�壆&޳�Ӟ�Ơ>�m��N5�z�L��,���H��ǿ�O�[��-� ��u�'��[��3M�37d
���ȸ:
l�J$�s�4aZ�U0|z��4z�F����au,�#XO�)��^�4*��K��E��D��^��K��ۣ�4��|MAg8WضP��^�F�&�s�+�{�F��}@$�M:ots6z��<s��v~��(N��H�eG_�)��~�V�d�O�W���gqB,`Ä|�m� ��ڈ`�>��5�|p�xtr�p{�%	�j�E����57p(��s��ȳ"h�`��=T��>;�꾦;(����zg��\s����-}M���c����΁�>J�S �C���d���=�alC�(�x�k����6=h�㪛��#�Յ[i���(�����pv�w���x���\��{] 	�>��Qw�c���d�5H�Wģ�C�5$���J�!�x�F��ɻ9lg��u��]ވ���;ĺV&��U>7�5�j�n�
�����} �.X�x<��U�U��Ğ<r������S����N��-;O����ģlHN�����8�o��U$H��Eۑ��s	���$	��v��9�ɹ�ʹ�m���=-�;4n����%qd��v��֑�~7"����B��{����ҽ%���X��wp��l�-�jK$��L���0��5�H��OX\J5��>�H��\n:$�G[�;q��̱�H6���g�H�} �-0N�żF ��7�%�{c3Z���jvjb<+B��6x���a�q�{'���$���Ru����!�c�∁6��l�>�P{���6���������a>=�����~#����ǎ��h����P�6��$���q��Q-|$��n>�xR�C�
i����&nI��7$!���z�q��V�B���Bz����>l�p�1҂�'�� ������GpA�\Bx�w���8z�[��<�p�8$�K#�e�����gRh��8H��m"f��L�X4TX����V�3J��{��p;��ہeg����z$ �}l�ۮ�`7:Sݯ�-P��ƾ�����[cO�x�N��1;���]K#�%=C@�g^lg���[=´_���!#	,��7j8���z��=�k�T�5�u�1?;H%�>C�;�b'���D2�m
�J;�'��p�s���XvS���Z8$�sx!��;ܹ�<N�$0�"Y�~ۧ�G�Y�/�&��e�Q��[���;����F���jvbi����<��a�L�g�����@x[�m�Xj�K
���KaDvU�e'=sz�*�A:#�"	�`�Q��S�r��H�mIO4��e �u�x�vz�yfb���+�5�IO �ѳ�D�ԏ�{�]���b'����yM�N�Bzf���>A��~#b~�Bd��C�o�^�u���v�x�l} ��sы��=j��F�5P���GC7,5� ���ߡ/�3c� �N��♻�ܿ������3���|M�T����>0�!�q�ϼ:ƌtI�u���>E�à�ӡ\|M����@-�V����� ��y������ u��޶x	�9��g�N$�絊]��9�s�Ӥ���ʰtl},>������L=p\=�N+��3�H ���pv�{�&�_H��Iq���CݾF����ͣ�.���e�C���tz���N�١c��2�Q�u�#��?TB
��6(�?è����q�
'k�V���92��@$�9 ��RA�<����vk�)���C-\���9��24j�t�����O�԰あ���j�V�AO)��,��l�-�{���IͿ��� ��m���Q���w��\2S��# ���c&��t��˵��9 "�,���t��^eA�W�9�O��$bi� �Yz@d��7.�֣HV�`��~c��>��C���Q�,v�g�:^y���.�����8����n�za��������d��zl`�}�S?�č�>���3xLQ��7�dyV��@��� �������`BO���0o^���6���I� 9=bv�m��)�VO�ػdSp�:K����k��Z�8��A2'��ض[5�?�6C#z��A�ɑ��VՒHh���p4}Ж�K�:���5���1	���*�ŕ;�4,��#T̚`�c�xF�g !�Q�~I�TISE�j�3S�
��D��G-�n�;H<�}I��.k�o�����@���nA���_HM�g��Z��c#b������m
$aǟ�on���nt"Y���X��4��$�zng7>�8f	eߺ�`�
��J8�l 6[��m<���A8��Dq��m���
F�5�������R]�ծ�~�+g��(��Ε| 	��ٮ4��������~G���
n{�A�9&����#!;�oP�Ar8B#t�F`�K��͑�H�'N����b$���2�qHְ����Gj�
M��*XpLV���Q�@�(A�U lt`��n,�i][r] ��ߡo��6Jߒ�gp�Ԋ����.=}��� �`H �`&�+=�5�)�Fz�{|�N	=�����Q�S�2�����U��V \	u�\�d6u�&�Ϯ]�b�{�R�"�������&�{�R}"��~������;�A�mܦ~�0�n�㮬��Q0L��p�Z(O��;c��\��:�ѩ��6�R����#�y�����eiW���Z�����c@�gB�P)������.)�KCrz�@�L��B�83�ӭh$�{I��S�H1}�""�`�x,��;�"�
뼺�_.�?s�::�g�׊ q�nVG���G�9�h�3��|'�a
w�æ�Q�QÍ�]�`h�%D�!��Q��Q$�dß_����'��
?<
�dq��PCX.@��)��w-*�:yT����7\e�M�.a�$�UH��Q���+��N$��ݞ�]q��c2�߆�}@�?�!H�]�$�^:�{,��8R		�t�T��s
3v8?���!�FM����X0�3���sWϕ�{
g�*F}���ڱr��s�P���#���#��ʽЋ3ۭA8����-h�sH��H�Ǟ
1��.'�ϵ2�|���HL|v�ݙlx�t��B5��/�p~*�P��*W�k
j�]uU
�M��7��l*�A]ׄ�*�|�k>$�$�1n��@�{�$0��!
��'�+��#��GG�٧�C�WP ��˟���g�k�+u^z����w�ds���SpiWy�W
B�p�H�7�9���cu��]�gB�,$�#�(K�UR��c����q��P����8�J����(Q݋�L�����BQ�}�3=E�AB�*I�a�1$�g����i���԰>\2n���9*	�[��`���� �FfL�'t(n�"	�k�$-6L���V����q�s���x
O<�x҆�1�PHn	!�P[�F՟�p�#��3t�ջ#���)��ogZj���H��騑,j���Jy,휺P�d��8��F@H�W��u?/Z�aϋ��x$�N�Dټ	8>os�j���CA�Bз����s���{��<�5,��a��Y��%�f����|�@��BvA����&���^��`�k��Q�X���#!��3��?=����y50�Q���hT�Y=���+wU�U5lX�;�x�
����&���`��x-��0�9�|�ж�$��w`��D�	U1'���O#�/�ԟz$��Ue'4|�A�:�+��-�;<�~��	v��
��S���p����y����<S�m�T=�61JB>0EV�*��yfg��e��^`֎i����y���g��cޝ��R�>������w�6H�yV�,���d�$����k>�8�d�(�٤���#��������_J�����~�;������s�s��w�cO�H�����<Cx{r��	��Y�Nأ��$�;��<+U�!�>�8�8��]�vb%��z���ˀ�m`m8��;�6y�C^H�崛�^�,=�!�W�"����F)�޴�!��Q$Pu��f�0������zU֩u����F/z��jK{��)�@U���	4�Q�Z8�"ٽN	�h�ؖ<C�!9��Z6���ۆ�Z���LL8�*�aw�$m�,. �BW$�ch��>H��Q��x��]�ri�����R�/|�՘�5,��}+�9��$�MU"?�Vډ��Us螈�\��X#�X����$ ��@��.�|_t���zr1a��~T-a8�=�Y' ���E$~�T<Ͼ\T��������7��ҾĳH���/�Gh>
�O����-3ʹ�Ϝ�׬�H=n	�4�^����ws	�g�dyЉs�y�b���I� �3$��9��d��q�^,�>��]�bb���V���?��V�Q$n�ׅ��gI��J��c\�/Ь�G0���Ӻ�}���ֽ�J�-�J��mԱ]	Zy�5�u�����	;��qA�����f�o�>0�,��P����Jd��6lK���e��L�������%X��6�Jۺ��զ��sS���>��tJq	}}�Bl�ԫ��Y=�U�au{��9�v�~�A9.�¶��$iv.j��Tn��h����9Z\T����p�J��>T�WJ����"�d�P����Jݔ� ���xb5�� I��"��T��9r�j�k��̆�{��|(�&�B��CN>������-�<X��w��F 7��^0L����>�쐀����rA�hj������6������9֠GqP�TqY¨q?<�V+��n�\�Cgnɠ{+\�6����X���� ��}M!B�ōE��iKn,��=�Z�wDr�:㈂e�D����J=ʗv�* �z���Sbv<T�D%�CH�o��zh��:��U�:���h��M����>�Z��C�)W������"��^Q�� \+�i]O��1��|�#��葂B�:	�đY�y X��
�&v�6f����)������Ow��~��o_��y���_��>�?���n�|��y�����W��/�=���w����ȿ������/%߾���7��$xz{��M}�y�E�q�}����]����k�����_���/�__�~��~~׫����ǿ|x��ӯ}x�y������/?������w��˿?����/O��<����������~���|x������k~~ws��W>����o�����ۛ���������o������՛�o_]����ݻ��O}�C�͋7w?���^�=�^�<�������(�]�����������������W�����[�˿_�m����/�6��oӗ����w��o����͋������޼y�p��~���>NᇗO���|��o�/PK
     �N�@               word/theme/PK    �N�@3L�  ;     word/theme/theme1.xml�YMoE�#�F{oc'vGu�رh�F�[��xw�;���jf��7����@%ą*�H�_�RT�Կ�;3��xM�6�
�C�}��~����Kwb�����'m�~��!��<�I��n��V<$N�xB�ބH�����]ī*"1A0?����EJ��҇a,��$�n�E�<�p!� ��la�V[^�1M<���^��Oг�y��o-��c�"QR�L�j�ęb��^]#�Dv�@���=P����<İT�����[X���W�IL͙[��7�l^6!�[4:E8,����օ�B�05���z�^��g ���SkKYf��R��2K �uVv�֬5\|I�ҌͭN��le�X�d�6f�+������7 �o����nw����/���Z�o@���Z'��Ϥ�g������2��PT�V1≚Wk1��E Ȱ�	R����e���PP��U�Ko�/g��.$}AS��>L1��Tޫ�߿z��}rx���{���h9�6q�g����?~��x����_T�e���<���j ��Ԝ�_>��ɣ�>}���
����2|@c"�5r�vx�������8݌A�iy�zJ�`��B~OE���,;��F� ��^�vލ�X�
�W��nq�:\TF��U
�`����Ÿ���x�Jw'N~{�x3/K��nD3�NIB���!�ݢԉ���|��-�:�V�d@�N5M'm��2�����f�&�pV���w���U? �	�e<V8�9�1+�*VQ����q=� �!a�"e՜��-%�
ƪL���.R(�W%�*漌��{��iv�&Q��܃�h��*�w;D?Cp27�7)q�}<ܠ�cҴ@���й�v8����1��ǶΎ�� ������V"^�5��6���<�Q��rз�s7�8�&P��;�}G���r���I�vʭ@�z�`7�f���!�(c�j��Ui6�։��z�9��ĔF�5�u
l� ��GTE�Na�]���Pf�C�R.�`g�+ek<lҕ=6�����j�vxI��B�YmBs��-i'U�t!
n����6�����4Cu���e��k0XD6 �-�e8�k�p0��:�v���b�p�)�H�#��l��&Iy��� ����C�1Q+iki�o��$I*�k�Q�g�M��W�4K�o��#K���t��Z�Ŧ�|����i�k�B֥��a�͐��-�c��t�4���1�	�pMa�>����j�Ȗ�y�� K�&k�b�zV�J+�V��5+ �nj�hD|UNviD��>fT�Ǌ��(8@C6;үK�	���	����t��+����+�^��,�pF��E�N�p�ǅ�d�Vi�q�����?#W�e�?sE�'pS���p�+0�����PJ#��lw@��],�����d�_�}�����a�|j��HPX�T$�Z2�w��z�vY�,d*�d�L��C�O�@s�^�=A�6�h���֟��u�0ԛ�r�9R����靏mfp��a����_�X����fz����/�۬F�������MN��Zƚ�x��Y���Q
�=H����
�S�zA��V?4haP6P����i���C�8�A[LZ�m�u�Q��3��z�[[v�|�2����U���Y;��k;67Ԑ٣-
C�� cc~�*��ć�!�p�?fJZ���PK    �N�@�G��  �    word/document.xml�=�s�ؽ����<f��-y'@h��vvʥ���~�s���J�E�\IN:�	�aH��ky��*������_���|�_���H��ȶl=s�.�[:��~�_����e%���d_wo2�
i1�	3���N?x8��F�0�(��ɳ���U���s#1]ȱ���[��\>=��*J~��GNg�#w縴$��ҝs=��4�f{�D)����׫��Kb��ex�#�2rR�]n���<+���E)�(r�(����L!�gn��9�,ܻwظ�8�,H�����WF���_�7�=�px.���=��DA�r��6Z�l1k,i��&fs��|����[v��I��TTn��v���/�x��
V�wtsC����N0��F�@��[�:e��T9�g�uaۯ�w�#��R�0�ǒXț��s����y/��M��wx���n���Oe�<k.'/OdE�M2
c�wnn�{./w�]�Tq_�@���d"��dF%f�����&����A�)�]Sb�,�������~�y&����9��~��ͧtF9�2���A����"/J�Y�MG?�K
�?v�m4��_(}��Ӝ��&Ǐ������W&d��0�֣?~��C�o"k��6b�����?c%�:\��Z�((h7Ym�xc2���|:�;u����~e�Η�����祛�J�o X)��f��yp8/���<ނd�b���L��,wv%	�͉�����|dd:ib�U^beV�e��D"�ȡZ'���Ě&+�a|)���Q�:�,!&�I���K�>�����{�>l�)=xRZ�	DD��z����eu�����i��1E�ϰ'��nS.v��e�__Gc:΀�Rn 32�V�Յ��jJm�F��2�O�����u����[/����
�r��J�OB�P�y(*.�����jḱ颬�����������t�(v�:�@��	zMX]]�H��ѻ��/<�e���s��J�3ߊ�|S�.^}�f���.\���C [{�n<����^[޹v���ry�V�������K+��iVtvd�َ�n�M, oBH�KL��'�G��E������T]�Q|�ow7o����/�)Ջ���p��4_�|R��#tQ���f�)=)�Y)�� @�sH�dO��@�ʥ���&#���TO�&��!�C��cQ�l!�g�5m%J|Jhy �a
�X�2�s��Ү��T`!ǶG����P�3�	��A|�i������/Wյ����J�2.@n���X^����u��}��i��<!6fU)aB�i�&:;4�����]|M-" Ga�v����,de!I�L�>��#�~q�2�#7.���UWo������K��zi�����v�I=�����^(�x�K}z�b�"�E���p<*̩�"T�
>@T�h�k@( �R��_��*�H������%�<^"禒j�
�"�H��ZQP+QXcM^�u�6��-�K��H
�qql�U��I����ǝ���/(��NT5��_]��z�~pT<�"W�>ع��sIP5���;��Y�Z��P_�CH�<���p�j�qE����-� �s����ϰl�$x�F{oRk
E�O@�ي�_���87]���k�y�i&��,�`���Vr6c\I�,#��i���Ͼc�?�^�>8T����qK���6�@g�4-ҰXY�~��� �.=����������)�: ,����G�H��w��R�ѫ]
Ӻ_\ɀ;�x���-��qs�������k�:�]��g��k���~v
m���sك'ѥ).�қ��D�0l^~v	2z��*rt|	7[C61䄡�#�Z#��H�9a��֤��z�'�pCӹr0a,!0���hòZ�E�XGCO��@�cc�P
7�S(���z�6[g�a%1�	����ё�����3:RS+�=<���k�N[�S����4��Ɓ+����J���Aĩ�0`���m�hc�xt�n��<R�Bb��mU��]r��m%�.,�oK�0�����y�v�����f��f�
���4=�G���Q疖0T�7�uǢ$cxV�r���@M0r���r��6%P�F��nPCc=&�&5(x�ڍ�D�qZr���[2x��2K�95D�!Ҳ!�N��ͯJ���mƙl�X!��������̵�'�T��v`F����R�G�zX�Ck)ȹ�4�A��y�T��W�j
���S�:��RZL1�xuo�q�̃�]��f0��)Ej8a�!"��f�{�5��Vr����%uo��~���{�����i#<AC*E�l#�ڥN��R��:*���m�,`L��g��)j��3��3K��[�V'UO¥�M��N�����xd���Id�%�r�.`�
��_o*�VӾ���0g�8,�����1�v� �cD�窦�k��t5��)m�������:-�<�����������ϫ�w��|z�%���
��,���j��ݝ��w��e��яAzFzzЁ�kY�£� Ƈϲ</Ρ[���q��~&�������<�C�G�r4��~4��S$Qb��jl��`*@25KgU�T#U��S�\����/Ё8����/ c�C�pEN�G�0��J����toI}�T]}���Y~�gu�-:Qz�6P����Fm����,\e%��E��@�/�s��zb��C�jP�M��Y�U[����Ab��2�@�҂���J3F��f1v�1ף,���	��3�<����,�4/
l�պ�2"�	�H򖽵 ��{;ן��;��޹T�|a�»8Y�5@O-1��һP�]q1t�¨���Y!sZ�L�"�B!�Ix����VSA������Ե���[�����'��opTM]�P��
y�N�޾]z�V}�w�9�1]����3hJ߬��+?Z.�o4tI��^6B��a�LAO�4;y��_N��"L�����e4�Ub�̴�J�I����Z��2�ʈ�W'p�5��,c�j��%X8��8��
w�E�Z��Kr�?t�Wg7��<�>��6<�
��\Ã�^`b� �Nb���?Z6��Sm#
�T�ӭx`P��M�0N�G��Er�V���{�dÑ�c�$���,e`$R�p��P�����TV~��Ѥ��:�	�m)��asTx��Z,B9qqp��7�왒A!�v�'�E#��Q��1A�UTb�x*'P96��W 
��kIY̞6P�N�X�OGE��]([ƉD3rj����f�9�Bo"�F��Ng�E	2ډĔ��!D�O҂868>4��C�*�,��ң�>2��P̍^���&�C��F��?�vCQ2�����3��,��F�G����)b!����/��.��Nb"��*��x���X��3ġ�����51	��R5�'���zk+��[��1H��z����
P�N�ZZ���;�6����_��w��Z�����ˮ��r>\�\�����[KT�S	�{K��&�S���z�������"�S �M!��.��م�]Jk"�&�w��)��M�^?/}�
����ǥ��J�o d,o��?샶�  l�1Ҫ��j>%J�ߖ�/BW��xn1¨����|��bq����Z| `}�i�?\�_\_�}T��qI�u��փ}`����Յ׻���X�kWw6�2��@tN�pQ�>D���[��]Z����#| }ka�t�2N
��_�V�C��f�5@�x���'ukU�ؾU~z�t���z$<��~��d=�bh�Q��֪�=h�2݅݋��CM]���$�Xĉ\�	��*x�S�߳�[W�c���QZ��/=­��c����4����8�W��D����o��3��!���.;�P�������"�ȭp��U!�D��r��re��6�Zh�m��0�p3q=�1ZvI���m<X�B4;�E�i#���2�ӵ�1u��@����q�:-�e�l~����Y:�(G?(��d�;!�"4�+�J�y�4'(������Fw�&�3���~l����O�!��d��w��[ڨ����y_�t;r��c��^Z)����~�OxC�U��Z]��|{l��p �u	� ���Ԣ,O�lR�g-β���P��<.��N��y���:�x���:BP�A`]��UC�t�gA`a�gA`���;ϳ ���̳ ���}4Ϣ6���	xzR��6>ͳ�84ֻ�m����"���K��F�yq�?��2M`��� �	[����Bmi�]}ν�0�f.E%ITze=9W#�2R�7�+*uޚ8������C���qw2�I�;��yo��m�+���7݈2��I���y^F(�il�3g���"��Ɛ�΄�7\X�P���G�{������N0)���ǼM��#�9�0:3�ˠ!��B`r0��7'����''݇�<�R��������dX�Igmv���cB�\��Xb+3�!��J�"}��9M����S���|q��6�U��])o����own��	E��A�ᅔ�^&���ז�q)R˘Ќ��d�6���	,2��P�_p׫L�&��1��:��6��A���q��iĵ��	����q0�� ���,�FX(�ৢ��zr΄�����9��J6���nz����:S[���D8�3��֭�ޚ5���Ggh�)4�8���12J[4�����!�V�iE�M^F��FG��pJ���(�����&2U��rf�����n�+&��\^9kKZ:j7��֒�����e�h����RY%ǻ��cxd�i���'�����Vۡ������N!�N��9f4y.{p�d�ʵF���[��������1=n�D�v�UQ�;�p�+�tL��n��6<���\����4�;N���(1�%�bC�X-���ϻ�HUhi�&ͳ��4���I�(Eo�9�M�C?I� b2�d�Sn&�|"d�K���O�K���,P�F��i�Xq�w�����C��p�\�ᅊrT׮��mCM�.��H��D?xC�s��,q�k|ͥpia�ý��u4�^D:�j�n�]m�54\����h��'aΈ�2FL�I��� m��F���4�k'!�ft2��5&!SZ�rf��e�U�)^�����~�.��k����`�����G��]WWWPU��E(�а���|��1�S��.6jԅ��:�JЀ[qzڍ�e�:�b�g`N��S���>U�Dc����n�}�EBp�r�IHg���N�b;WIR6Y���Tc�վ�q�]t�5��z��C�H؆��<�v�"#������	�rS��Rb�G�#�����W��0�S�ۜ)��M$���x��Xl�6Q�\�C��z8 ����7\P��#�{��yqe��?��S��e���	�Oޫ���Y��i�Bc�b�����Ok��/w�.�n~��D>X&f�Ge{�=ڵZ���W?
W�{�o��:msA]}Y�|��כ;�p�	���w�?��zCЋ� ��?�F�:wC!HV��`6Fa#M�9)73�J�gO�կ�t�\3�!�������fH�#5n�����'��uT@��vn!`�R��̤
��ꎑ��ȉ��#h$�ș�L`�6HLPG�:r�t��0ۡ�}�4J��>�E���g[d'3.�j+#�����6�^(�]�2'��&��d4䏔��4���wdY�w<�s"`����О�R�����Ո!���J��g��r��p�����Y�o����WX���~:�6���F�2�M�J>����bxVR�K�;U��]r�E`.�P��yz�c2�R�O�R�m��PB��(��w.Q au�%K�j�u�-"4�}����,蠂O�r���j���{e�G܂���c�[ᨛ/���nQUm/�T����LN���KN�5�]D�V��8�qE�x�ڃ4WCy7,��~]>���,�Y4�\էJ����to	F��n�B�Qo㏩�w/>��t��c��c�<?��1OE!<�� �n�MIl$:	lhE��T6���n�q��A��b�V�&FES�#�:賶��R!�z$jQ7m�x.��r4��zH�;'��@bqCWv��D$Иh-a��ȪAG�P��*=7\����1�UŨ���z)������4rc?좶��Z����a���u��Ц���w^��?s�	�I�4�5�t4Q�FA�&&u �~	�>�-�Di�iNPF����&������6"�ͨ�^�X�IM��'�T'-���;�	x4n�iQA@��&��,+
0Nv�2�˳3��&xn�-�/����������EeDеS�J�S{��ա�hMuN�I��Hu�/�<G�y���#���W;�L��������hN~+����d߸���87���'`:[]ؔ(��1ҙS
#�#�Ќ�<�����~ⓓ����ߍ��w�:���N`a(a&�4͏�m'����9;(6b#R�c'R��\�L`!9���8��@R,����^b������8���}���u�q���+e�Ɯ�������X�X4�O�C��#����	l�Vv�������9X9��{�M�e]m  �Z�I�81)�М~<a{��b�q`QZi�������,��{����|Z����@'��&&��Xś�}�k�INK"ϟ�S҇�[ ۷�����;��Y
A:G�M£,�@�Eqzf,=�^�Hzg�_�yG�����#��@�e�'�/�B{��C�O�4Dǭh���׫} Mʅ|^be}�d!7�J���Y�����y������xB{��~�]�Փȟ��[�@��Z,0t�����y�M�D49�~�3�2`�ǯ2Ҵk x[���H�B/�N3^A`r�hm�cc�%�؄��*W�� ��
�<#��g����B[�,�
����WB�2 ����A�`W��3l�a�*�iS��
	��q��C�9ȅ�s6�3|��E?�h������8�>���l�������C�]�6P�	�ɘ�1�Ɇ�SB��P^���3q�H�!�8,䲳;|�������q����U�O��J�JA�FBN�����a�?rvv%���S�*�k*�
�fG��pTм2�e$Jt�q����ܸo����k���o��&����P;Vi�oa�u�vZq�Y��b���g(�Ly���'i0�l1v�)l<�X\��3hMOB��o��u�88:��s8����h�"�cG�E"7�8�[~zZ�v��n<�)r���1F�?�7x�� c��(��j<��Z5���V�+�m���0�A�Xv�\��>U�Dg���VW_7�����ap���~�_W�����^��>���:#��hu�8A��m�GMxց�Jo���E%>ñ˲'}r�k����8�	�+硨dg��%uyC]{&fl�۷:I�*�\R��
`�5�q�(H�� ��Q�3�K*�����fvk��΋���߃;��ak��[K�u��iSdY�ס����%���������;�g�J��̈�B���n�xDi4��c����~��)�K7�*=��Jt�I�
UR��{F�X^Ə,�OIǴ!��h�nX�fu�z�ȴ���K��My�{�1��x�I���:~w�����;�1�](\�]���z|%�����������T`��K�J���u<݊���)8Z��֝�dM@�L����iQ�}4�E�9!_P��<;��
�r4�e�g��/�D����[#�p�!������a�����ߺ��^Sg�K���Q4:�*N��Ѩ��B��b�+�pԭw0-�X,ݿS�� 
,���&ܻ�J���� &d6�`�0?s
���I�}��P�tf�����8?�W1�>3��̐P�����N��"�*F3*ͲL��H�!8s n4-�J�ۙ����[r��B�=�����W��9^Dz>�8�E�i�$��$�����4,`X[Vz�N�iw���Sb欖�2bG�� PK
     �N�@            
   customXml/PK    �N�@�>ϕ        customXml/item1.xml���
�0D���n�Ջ�$=�x�i��vS��ѿ�PśיyÓţ��ݍ�zR�%)G��-]\·�C��<9O�P��Jrn'��L0b>!Vpa�c�I8���iZ�*o��Q�m��p��7
��Ik�X��������3�Ou�PK    �N�@cC{E�   G     customXml/itemProps1.xmle�Qk�0���r�5F��b,�N���`�!^ۀI���1��7t}��{��9��]�\p��h4�!@-L'����kX�u����Z�ՏUg�w�:3�ѡ
�B�yl|�i��mބI���M\а��!L�fC��,k����=�28;7n	�⌊�Ȍ��ٛIq��t"���ƈY�v$��'"f��� �����{{+�j�$�R�e���FB�SiJ�u�7�? uE��W}�{�PK    �N�@W%�R�   �      customXml/item2.xml��A
� E�" ��B�@��Rn��F���hn_)�'��ޠ�L{1X�Ā��)�8�Ǽ��]^9����6��+��
=rG�@5��]ʸ�Ϧ�YVH�z��d�����Ϡ�>�Eew|eQM�b�7PK    �N�@H'���   �      customXml/itemProps2.xml]NM��0�����1���JSYI��.�5��Zh鋢���,{��03�G�����p�!x�BCoC7����/�Q4�3c����f>�;�v&�a�cDǒ0$<jϏV�\�<ߔ+��ÒW��x�U���"��X�����c�l� {Fgh.�هə��t���:ثC�Rʵ��4�~���'�$�Z�?ؼPK    �N�@]p`�K  �     word/fontTable.xml�V�n�0�G���o�ӴI�uS��.`�k7u[�خ�t��W�K�a< O�$���R�	&��jrr|d�������j7Ti&E�çȫQ������:9���Ή�L
���T{�ϟ���C)r]��B�y���y>i��Nǔ}*'T�ǡT���F>'��tr�J>!9볌�s?@��e�!U�p�Rz%�)�"��}E3�(���^T�Rm&�`�dJ��5���ㄉe��,UR�a~
��݌|S
�cd�x��x�~9R�~��p���fmA8������j�%'�&L���bȹ!Y�C�MTG�/����M�tL���2��p��Qe���	���"~C3sc4���[��ny.�;^s� &�.��U_FlNj���$&"P�e��;
� r���ݗ
 0 �  ��K���e@�i.]|��i���PL���!���Dw` �!�A�8��u)�brk�H��/"�X��F�u���)%�:�'Dx����K�ChbDT	���gLk��0B� ����3(`�A$��EV0��°m�"���l�t����~]� ��Ѕ�������P�{I�K�ۺ��@=9U�*c����Z��,ã8��*����͜�e�8�+0 �Q��-r����Q�5���?�G�H���U0"�m��p��%J��\�.a���-#+��-$Tj��#�:�{^�1��
�[���q�c����-_,W]�e5.�m"�떀����l���}ny����ݷ���6+�hX6����g���p��~��5$�^#�F���G��Gc�����1ã���b�
$)�^b���@����7�Q�S}�PK
     �N�@               _rels/PK    �N�@""�   �     _rels/.rels���J1���!�}7�*"�loD�H}�!�����L�}{������r2g�|s�zst�x��m�
�U����N���aq"3z�C��D6������2�{�(.>+�㝔Y��0W!�/�6$�\��Ɉz��U]��������ik�A�N�l��;���t����r�(Θ:b�!i>��r�fu>��JG���1��ے�7Pay,��]1�<h|�T<td��<�8Gt��D��9�y���}��PK
     �N�@               customXml/_rels/PK    �N�@t?9z�   (     customXml/_rels/item1.xml.rels����1��;�ܝ�x��xY����t23�iS�(��O+,�1	����?¬��S4�T5(��zG?�������)��'2��=�l�,����D60�����&�+J�d���2�:Yw�#�u]ot�m@�a�Co ����J��6�w�E�0���X(\�|̔��6�(�`x�����k���PK    �N�@\�'"�   (     customXml/_rels/item2.xml.rels���j�0�{��`t_��0J��K�6F�GILc�XJi�~��;JB�/5�{��3{�6U
�����������bcog�h���v�j~p�R�x�UQ"�D�^kv�%�e2PVJ�G�������?u~5�}3U��]�uz����M���-�����B���L��l�b��gk[�{A��~���PK
     �N�@               word/_rels/PK    �N�@�c��  �     word/_rels/document.xml.rels��OK�0���!�ݦ��Ȳ�^DثT���l����������K�x�ޏ��n�m{�:�dI
��U�o���b�*�{�
F$��7�W�5�G�v���HA�<l�$ӢՔ�]��}��������<M72�{@q�)��p�6 �q��{���>{s���J����R�Muh�̥$����&�9{��f�$�sUv�6_�y�o�l��~M��s֜I��\d��d d��O��9U��![��>.�<4�S��ؽ�PK    �N�@p���t       [Content_Types].xml��=o�0��J��׊��"0�cl���u.`�_�
��(Ҩ]"%������M�Fg+Q9[�A�gX�Je�{�=��XQ�Rhg�`�l2���6bFj�@���G� #b�<XZ�\0�5̹�Ś��[.�E���ڃ�G�P����iM��$$g����:�`�{��@��*?���	�ʖt�YN�d�Ǜ]�+�&����"qp���̻�\!�ip>�ӼGb]U)	��KC����*h�0�obO��ԙ��P�����/��-]�������։���3�6���/J��J�Y�ݨ�b�cnt�8���O�ʙ�п��A~�4�g!" |�܇{����� ��l<�]<=�_?�f���>�PK     �N�@p���t                �  [Content_Types].xmlPK 
     �N�@                        {  _rels/PK     �N�@""�   �              *{  _rels/.relsPK 
     �N�@            
            �s  customXml/PK 
     �N�@                        P|  customXml/_rels/PK     �N�@t?9z�   (              ~|  customXml/_rels/item1.xml.relsPK     �N�@\�'"�   (              v}  customXml/_rels/item2.xml.relsPK     �N�@�>ϕ                 �s  customXml/item1.xmlPK     �N�@W%�R�   �               �u  customXml/item2.xmlPK     �N�@cC{E�   G              �t  customXml/itemProps1.xmlPK     �N�@H'���   �               �v  customXml/itemProps2.xmlPK 
     �N�@            	                docProps/PK     �N�@w�k  {              '   docProps/app.xmlPK     �N�@���LV  �              �  docProps/core.xmlPK     �N�@
��o�                 E  docProps/custom.xmlPK 
     �N�@                        t  word/PK 
     �N�@                        o~  word/_rels/PK     �N�@�c��  �              �~  word/_rels/document.xml.relsPK     �N�@�G��  �             �S  word/document.xmlPK     �N�@]p`�K  �              �w  word/fontTable.xmlPK     �N�@���&�;  �/             ?  word/settings.xmlPK     �N�@�N��{  w_              �  word/styles.xmlPK 
     �N�@                        �L  word/theme/PK     �N�@3L�  ;              'M  word/theme/theme1.xmlPK      �  {�    v             1 9   j q \ 9   $ ( ) N�v8^(u�e�l  3 . d o c x   ery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( data_user.hasData( src ) ) {
		udataOld = data_user.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		data_user.set( dest, udataCur );
	}
}


function getAll( context, tag ) {
	var ret = context.getElementsByTagName ? context.getElementsByTagName( tag || "*" ) :
			context.querySelectorAll ? context.querySelectorAll( tag || "*" ) :
			[];

	return tag === undPK
     �N�@            	   docProps/PK    �N�@P�4�h  |     docProps/app.xml�R�N�0�#�Q-h몤pBP����l�Ķl����PT�Ό<���C}�uR�E��4�P	�JuX���}2�#�jy�.�#�x�./`c�A�%�(X(��;��!Nt8p�Ye���}��@�~/��xPy�SzE�ӣj�M��0>9�|����Z���Ks4!0��s��q�ӧ���3~@�J �vڶ��E�4B�q˅�bY�~B��T�x���,?Xn:Ǌ��ў����Y�~1l��ٞ����o��4z=��G�KN"�ﶆ�1TU^O�N$X�K�}��6��黟׌��#��������g�u�_]�IYTm�ʪ<�U]�tNi^��L� ��E�n�?2
d
�*�-�/PK    �N�@���bT  �     docProps/core.xml}�_O� ��M��-�������%&�h|C�ۈ�6����]Wg4>�{�{.��w���`�jL�hBPF4R�u���E<C���H^7
�����Y.Z&��i�z.
$�h��e;��]&���j�Ci׸�⃯��\b�K�9�q;ш�bB��� R`�A��ӄ�o��ݟ�ĩ�߷a�1�)[��8�wNMƮ�.b���.��Uce����\�a� ;�;*/��}�@e`�brSZ�+�F�[����|<�[�H��r�r���:)�����ex��y�/ջ����P���!aJ*������$�P��-lU���t�^s��P��3�PK    �N�@Fr1�        docProps/custom.xml���j�0�}�� ��%�u١��M-$��Hrb�H�[S��UH�.�;�ۼ�������	�@jnĠO%|=��:-��hY�Ez��no؋3V�0H"�}	�!�c��Ru>���Io��B�	���l���SB0�|0
�_^�b�%��v�xXl�[�o|�
�(�G�5m���mޠ��5���"kBhM�]�����^�)�S����sd��C=�8J�9�}��U�d4RI�a��'�ῌ�
×n��U_PK
     �N�@               word/PK    �N�@�N��{  w_     word/styles.xml�\O��J�#��9�a�;�7Ye�l�$b�,���c��8�݃����xzℐ�w�q���ǧ���[P]��xlw{��<!rٌ�U����_U{���8�y��"��vO|���h���t����r�,	ny6���w��py���<P�dǱ?��|~����3�잘����4f9|L��c��]̷|�YN�(�o�wwvZ�ir�Ulš��LLs)r,�����O!�n��$�
�$G��G0�d�p��b�60qV(��qG�}�M��"��y��O�H>faR��7�w&n[��-U��p�W�p�6b=�R��̢b�����I�R�f 9��?~q���M"��p��)�S>e�(����"��'�s*�<��,��p4�c�s��^�������q���Y�?�B6���_���_˻���d���m�/���˵QBAD�U*�:�H��`������b��Ņ��,��3���x )�o�8|�i���~q��"�$<�τ�����V9+Q<���\�3����D=� d�4ㅬ���s9�h 3��o@�q&	�nT9�T-T��W��_�~�U�Wq�_���*���ư�
a�C,�eڃ�.�-v���˴ǃ]�= �2��˴��.��ӽJz�����u�n�%��Y���e]�ۓu�n?�%��X���a]�ۃլT��{ə�N�<"ODν�߸I���3�֊e��t�,���A�(�4h�g�.}�c�;���bL�a�Ъ������So^-RX��&a�\�:F���S��b�	����Oy
+�$^	(��(L��,≣���$Ǔ S�6�B�9���`�|&��1@b?'��y�L0��Y�����,�����]�xݕ�ʵ(�]�"�N3�(�Ŭ����#��%	�iI��Z�`��5�N-I�SK�Ԓ�v�JZ׊rh[R^�y�ƺ'���>��s^%�C;R͞J��%���z��]��]�l>����Q<��w�ڶ�R�n	��&�v�mL����-e	�[�B��m^��/��e�9<}0��Z�t�=F��!�x1ɝC̢��`���)<rX��i�B}#���*��\���!���Bw�++9��]ɩ�r��!��C@3��¶Bo�"��휧С�u
�SEb��tmH]���+W'�q��Tʁ+��P=��3����l�1x/��I�"�G�f��H��<R�<{�3	�5��>��;����3�1���mL$,��$t�5%%72D)��a��D��ۉ`�s�˚%/`��?� =f�ܱ�B�KH�%��U�>(����Q@���tl�j�t^՘PY�g���ug�#'m���Յ̚�[�Yu�}%z1�-p�����!�}����i{E$��""��&Y\�L�"N2�Q�8h��3f��׭	W.�A��BA�,� e�P�2?(H��� �Ɏ�ݿ�h
���W\�� @A�Q��G��)~DA�Q��G��q�ǧS��4���S|Z�xV>�������]�=�E��9>�QA|���ܦ#Ö	;�|@@mD�(e���'1����{u�f�	��&ls1?U�Z[�~�[�#B�\�Ʒ�F�s��0dX�W���,�E��>�=�R�%[�ݩܶZW�e-"*߳<
xɃpSc
����oa��N����_mҵ�zv�-��&U���u��~�:~�g�5~�O�-�����vn���#ۓ����գ�ב-w�N/z8�ep	��[��{��m���[���L6_�x�/��+B�bsJ�Y�b�Pl_����TkH�(x�f"r{�K"�n��v�:��pc���1��ژ�{mV���H�dS]�b٨�����ǬG66*��F�ڼ�.���s��ԬT������b�VP�lDZ����#�ZA5ʙ��@��Mr&o*�3y��ț
bc���j�MŲqC�U%o*��J�*y��ɛ�����IA?T����ME�y�F�þQțj�3yS��ɛ
�L�T g�9�7ȍ�� �bٸ���*yS�l�PUɛ�Nކ躖��ME�9�I�T�wL�MŢ�7˙��@��Mr&o*�3yS��ɛ�F�T
yS�l�Prj���@6z(���Mr'o�&�L�T����ME�y�D�T,
yS��ɛ
�L�T g�9�7ș��@n�M��7��%�Vɛ
d���J�D w�6lT���ME�9�I�T�wL�MŢ�7˙��@��Mr&o*�3yS��ɛ�F�T
yS�l�Prj���@6z(���@p�X��0y���۟rxg4���Qp��<M�	�7��Sä�|}�fp[��.�q�>Z�9-��Q������7�,%w��{���/��a�p6g�<�����x��;p���a���j!�x�c �4�]���n=����fp��4�8ƭ�P9��_}��_�������+y���r��h��H��A�,�����8ٻyxNXq-bh^����T�{7�:9��&�,I�Ə���	q�?����۪�ӧV;�&΅��<�����%�y�|S����{^�أ]���9�ř���y���ҽ�>L�r����^�����IQ�~���c�����(�O#&�:9Q�oyZ���W�+_���|��u�ğAn��=7�!����щ&�o��Kv��{a����8�`�7�|����54$�D*i�?g�|�R�5o����E/�w.�pt��nn�R�T�w0�j�OD���,��h����`�Gi�y�ר�Lٽ�$77��g�Z����:�Lܞa���B�\���� -�Ώ:��Jiճ�6��q��SD��
H<9�B� {ʭ�*��N��h/T��0�����߃�h!�e��>��z���Sy�5Y��r7�J]��N��I��[� Φ<����囑������h�z}(P-
V+�|�,���5G+�}��������Ps�n5���mNa��;=�^�6;O8�w�0�Eq����(R�?h،�tmsk�p���b;h��h��؏N�$�5����2R^9�rY-{ϊ�����C�^��ɽ��Z�[e��_��?_|�ID5ƚ}��ғ�G5v�
s�q�>m<)Æ�aR����&E{��fR����>{���zC�iqi�)�2����l[�5{����~��?�}����|v�ş������_����G�PK    �N�@#
 �?9  Q#    word/settings.xml��[��Ƒ��7b�����p�* �@0�����&�;���M���$[�XO�N�oLu~ꐕ�f替�����~������������_]߿~xss�÷/�������W�OW�o�n}��������������鉟=~�#�_޽���ۧ�w/������뻫�_=���G����������������}�������ͫ�ۛ����������o_��ܿ�����n^_�:��|�����ן������O-����w��O������><�?��y������ߧ�o����?��>��C��W����.o~n������������#tw��s�n�~L�~񠟇�W�7�����(����}����/��l���ݼ�\]>M3�������������-��C�^��������>�|w}y�$����7��������۫��x�����y��~��?^ї��_�]s;�������o�����??�~x<<<��o>/�?^�>�O��gM��>�ҷ/��x����ۧ?_���������Y|���d�����o.7�������k������O�������n���������������������|��������ח��§�~{u�z�h|�a�������~������>�������o�P߽����O�O��/����w�����<��ؑ/��<^�W�O�����v������^?~���>��]�����?�����0���߽���%�'��z���7��}�����z�'5��'E���_ݱ?���r��Û���_n~���s6��,�st�����3��Aվy|�ǟXrϿ�6�-^�ϾH�����i�!���[>=�����f���t��?�?���{зi��3�����������CWG�A?��撱+�{ƱO�#O���%iI���G�����𡋷��k�$�gn��=�c�c0���,�Z}�/����#:�{�B�t�AJ��љ��#:���}�u�1s�:�c��2�>c�R�f�}~�)#��1h��yܵo�m�#��a��I��4,Ϳ'�$c����t��{]���J�}��D��iSڢ6���Oz'w�����}�s7�wr7��s_F�۹?�����o>�9w�l�$��<���:Om�6��Wo��u:���, iA�~
to���P�i�+l����ђ�.h��`NKn�냂h�љ�@����M�L�6��MCh�i���i\��)���-8�R���iڷ��3�y�u0�{����:x���Μ���6�O+����\���vC�g����EV�ҵٟ�0�>?�0�z�!-�����K�ﬥ��tN��Ͼ�j��ˋ����!�j���^F�{0��rXǾ�3�����泰���1H-�����>�k9�`t���uZJ0��V��[��qۆ.k4U�/݆��4ۆ����Ƽ��n#*��6Fז���Gg��|��zt�Z`WULo�|uۿ���z��)�YH����@���=Z˴����6�Z�=h3u�g�b�J��Xiu��Vn��|�ZW{���=hc�6��wIsp�ic���k�qki�\�T��X���V��5�߳�5�j�q��=�w����c��h�=﫟�{��[���������>�5��c��;���� ?8����/�)��]Gɴ�
A2����4�~H�{qzG��"�E��4�FB��A�r�mr�U�ӱa���}q���~CF��>}������w �~�/
F�%��aX�1��ȇn�S�CN�S�w�~(�����|Ӷ�ُ,l�[�j
��S�~��8,��m�-x�2f�F"�F����~L�ߌ��[?�T�dBR��ԏ���4�A��:��I ���Aꦢ��O�>O+��}V�/M+N{ "�Q$�^@�:��}�h�)	t"��{;��}��m>���:=c0�S I��������1�>��<�~�� ��6���tNQ.�Ǡ����f���u�z�����'?e�{���%'F)�Q�~���L�6�-փ︇�T�oӰ��K�}�u���hQ��'t��`����3����~N%�9����s.����T��3x��y*�W��u���e�1XRhK�[���K*��!i��.�t�◲>?�8�:X��}=���k��g���vY��7~�v8rگ��IW�R`ݮi�mM�c���w���kf���|o��X`5�;�Ad��7�׉ 2�����Ϭ-��VpJ�ne��nN�����S�����c���Q�����SS
,����gc-]pc�x�\��iv�B_�ݽ�}��O{�5����m�Sp��Ϲ6.�}�:�--���[��6S��d펳�v��@�iua���qr$�cO��棳�щ�d�zI`��>?{��}�]���~v�w��p�{H��zߎ1��ȋ{���n����=���W���0���Ё��>%~�]�q��tI������g�@�զ �#@h��j��t\��)�Ct�6\�t�a�܋����z�q��)���T��"in'���Ƃ�ͺKN�[(��7J$���#L��$�&УDm���=#�K
��%��7�a�v������8��dv���q<X.C0� ��d�����7Ø.u�P�~��M���q�I�j� �rm�`�}Kyɾ�S>f���c�HVr%I�|%��3�{��q?щ���4ǈ0Gu�7	$����<�3H���ǹ�X�_;9O�N̙{��u&%xOY���<��Mc��=��UU�H��ո�6�=�ɜ�,)}N�27����1U$�Q����ڲ��ђ��
~M�7d_@D�t��49:I�NW��	���d�$iA8a^]#������ �����>����7�6:G�e\��X(˴V��U�a�9"E�mM��@���?��ʾ�|��tX1a�6%9�?�S��:U�7[ē[�S�����a�R�k<3xZ�m�%�1��h�-V�K�nD�Uu���X��PS�=iq����H�P	�t}���P� hh��|tZ߂��(n�����Oç�cݦ�={�g�y{w���㣠׫#�H���>��z��`�($���a7�c��k��� ���ƭ�@b�@��B��qO�15�w�M;�M��X%�����q����R�g<��i�藎D�Ob��u������L�)����9 	�VH�%�R3Aߦ�;"0f�E���A���J�7RH�C�5���2c�����
ԋ����@R�{$�)�4G �~�ֆ$��Ӧ��U��~ns��fD);����񪑈�����{�!o~�!i����񉤸?x?�[航p}���]!�y���6s�B�3�ǟ�'�]F��J$O�o�#8E��c�; �ц޷�u�#���M!�ğV�wt�4�}� I�X"��ߓPIz�� i9?&��D��є�ۉ��[lLh$QҎ��~����=�t��o�g"��+>S����x
��Gb"i�A�l{��:�v\�G���7G<�s<O���)���&>�p?��9��@�E��>��CX���FlǢO���#��K�$�ZBrx�8�d�h��Mw$�p�޳F�V��)W�o��ux��\r_�)��)����$O�n�����2��|��	ת��LDTԦV���W"hH`[�ӱ�{�n����y�������֋~钖�_@ټo���]�$�D�8�A��K��T�^�c�7�3��c����O�G��@�]�2L�i�.���}�%_�8$���(�݄d������V���J`����x�RFܑ�����sw�̭���S�5���!5��*�|��<���|c����o98e8���ظp�V�������spε�p|;��\Sm��8]u�[:<�lly	�i��.s\�=	�*��Z�.�$�d������{{���Vp�Ǐ(5g�q�������/�ro$������?GYMq`���q�m�6��"];�#�Dǚ8���7��n#���Qkc�d�$GA����iD����&{f���\�Ҫ���VFR����h�DbA����L"��}�H�������d��O���	�py�d�W�U�đFڐ����1�D2���	eԽ��:fG|>����7�;Lc�U�k���"Ip�H@%~�#�*�n�`)���w|��[���4��f�� y-�S]�$;��$��!�69��8�}���w0N_?�S��Vu܈�p%�9vH��O�j���
Z�g��	��+�W��'��)$����?��|�$n������6����mb3x�I�
�d���7��@B��� �Zi��A-���{�O�g� Ɏ�"٢/��z��>sɌu��m&������~�@Su�ڙ��qK��ޭ4$�,̩EO˃g�n���&��c4�Y��C��[�i����m!��W�2&� ��}W�Z�&�I�E���Ǆ�T�\���v�|�,��[���@+/Su=m��R]	������ �	�t%�X���$�SP�C�!��$اkY���纊���ې�\_��Gэ��P�w3��-�)ȱq/O�@|gm��Ld�ߪL-�lC|6{�7��=�Fέ3W	��%�ƽ�	N����)�F��>�F�����/�n��^����L��N�WG�A {��FRk�a���'c��D^N����	l�v���,&����m2IP��p�2��;���+g)ރG��۞�]Ծ�x�}����L[�S��	8\����>:.{A��!�����s
�؉xe<. \�B���UD7�ψ��)�}�z4P:ȉ���:�g��ڐl�H��x$��0��=�p����O@$i��\�|�"�<��Og����E3�ɵ� -B���Ԙ����2�䮫rϏ�k��s@d��=�	Ib�7�+��L���L�Y<�g�!�Ơ= o��%�Y�A�XR��iӞT+gB�"	�վ�H��#v�h��V�0����$`lC��ז�C�QP���(�3���,�v� 3Щ{Ep8����"~�|3$��H�z���,�4�}��q�џFj�H��U	������$�ٹ&�B��H$[��3k�5�'�Im�) ���o�,~gB�k4������{�C^�c�%�$G�7��C�!�r���$�1�mܚ~�U
��@!�_zf�D� ˔� l}4�G�5q��&���1s��T����g�*��p�a�l�>����,���W����1���󃉋�݋��ْ�5��n�e�]���3����9C��=`��}�\<�Q�����@Ϟ��d޳�1�҈qs|'�ؓke�j<B���:��!����y�a����s��R���X��X~C&"�
	ة�yS�����m��v�:�]Kp,���<�$o�k��3����֑��m� �� 5��$�a��L�����y!�AՈ�Q�!��� ��6�$C�)�O�0_�dwN�\����L`��#��.�7�z���}��0�!����P�"xO	r"s� ���s�Ln��_H6g��mȞ��$�)΍��.��5_c��~������F�������l'�ʟ�w�:�Q�Y�Y���9]y�mV��By���یK�q�ڬ�J�S�z������'ƞ��{��qg��;���=D�E���jΓ$XoG�x$m��6u`��,]��ܗ��~u�(b���;%��HA�|� ;
I��t$�Y��4Ͼ�8��D����D`5D�z�$1���M�.�+�$8O���M$��JǬ�/ s�+�v�(n� ���ER�B) �L���3����!��m�sv��B��"`�$�#�.�,Q�';�}�d��$�ݙ ��cN�,=��dJv�$�p�)q{I��8>lLy]�$Ժ[δY=͐��F�sz�S�������t��|L"��?��*]~�8���S�x��=��ˁZ��oI�MA�(��?z9�q��d��z3�H�&N��x*~Ok�F@C0���H� ��L�G� J� �x��j�b�<0$���H���,�F]RF�o`���Nfy�96g�y�/%��#�`����4�/�6�)x����!{�h�%��+Q!�Eozg����쁆-8}oS��}��'����n��{8�S� =�	^Q���
�����9�����S�8;��A�Ԃ�H��G�P�cu�I�>s3n\��*�1s��3��-�g{.k`� �\��g���pH"	r�˂>�;-��o,�PQPOWȒ�ɲ��c@ްG�sh;���}`�X��{NtRo9�A�hkY���Vx�����?e@{�!+�RX�ǁ�6Ȝgw`�q��@��߃n	v0|�"�<����F��Ҧy|o���,P�'`}D�'S����Q$�%TI�pm	�he��+��Epm	V���qv��CS�O[���[�@�I] f�f���mH��C�(��e�;Ps`����1����z�8T6��-��+dU����^$G�C�E�q�堆�#z\�;��N���T�+@�;�������%`_����+�7B^����������G��UԠ@�SLd���A���}�d���CƱAl-}Q�~3��:,o�	�w	ƥ�1��G�P�5�/ 	"1�C�^E{ �����	8:�=�!��$&,��� yF�b�I��Ip;)-iD2{�� I��>a�}ۜ�p�r�� ��h�L�V ��.$����~��ә;�w�&�������3OU��{�W��Ѹ���Su��������q����DΝ�� �A�� &��9x�)S���0n���y��(P��e&L�`��:zL��QGHZ��i�r! I-�3E�&��w�� �@\� ���Y��Q���D�6�m����@\�}�=6T�k����N�=3ж�?3 ��,��5J\�c��*v��!9��F-mG0��ip�3���6�(��,ԛ�]����@��c��W�v�{�H[��d��q���=�|䨹���ت���$���d�q�W<�;~�VR�}�qvd�+��69uQa�����#�'�0���䙏H����,2`�/�6��"��<%�loT�����\r�9��{Ȓ�1���Dƛ�B���c�6R�>z���w���ĀD�C=�Sx���D��0:n؜~7��-r������P�߮��@���p({��5�;6�����vr�j���#a�6���~"B�~!i�f鎎�!Y�&iGd�����Ε�w0�ԁ����F��(5W�b${`E���U���X=�"J�����C�ksi���#n&�����(У��Գ�!N�^es���:r��i�6�iv���i&���ۑ�sm���).3��Ƶ״��EB�^� �#�<Ⱦ��C	���Z�Z��,p���|��Dڐ7�m�H�n$l}�"���ď�NN��`
�f2�=j� xJ���`r-6�U�l���$��A2��BB���L&��]�.ul�T���:cvoW��c=����:�l��#w�m1\����@��7m�`S���Y3��0�]`'r�|&��qe$��y3g��fC�4���	*�A��=]�9ɚ!��I��1�+��"���{��@���QזgHc��%u-vr?m𒺶$��c�	�T�� ����gR=�,fp/Gssk�k=����.z�� E�7��@WQ�$jC�H�=�`��`k�cm.��?-�������ԑn�O�w\y�� �DҜ��L@r�		�����7@(�1�=x�?�H|?�(~���c�Y�w#���&>ϐn�: sl�65�.H�^c�x��<��=6H�ä�vV��]Bb��*�9�9m�1f3�ӎE��z�z�C��
A��|x�GM��ȅW�`W縙a�l�y%��W"c���T��Br82o�jx���
,���Z�i(zQ��=���%���� qLh�p��&�Z^�>!�w���()��81׾w|t��2�>���J����A��ts��#xZi�mY�������q��m}d7*m����i�c�́�8�<��x��)q���[��*Xhݿ=������${�_�w�|�@d?���:�;�z��Ҩn["qdn�!��u+N`W�$廝V�k�/%v%�o�p�q&��������Aj��YF���(��f�Pܺ�a���� �WN������g���=�H�	h��y�ނI�>�L�i��������'
$�#sI�#!!�.x��iu��ٝ��#�ϣ�cv�Ncm�[�Ъ�AO$7�,?hh݂D��H�ʁ@�+���AH�/��#�qQ�+��Gs�.���1k\[҆[F�fN>s`5n_C%��џ���D�cN��^�
��ٸ�~���6�G�n���#z&XUg����#����Y�n��)�����$�h�f��)��
��W���I�;����L��$����y�2��kIP��`8�u�R��P7�5��A�Y��Ϲ[p��?	�a�o@f�Ϥ!�]
Z8��{�[���$�=���+%��Z���Q�i'k\ W^N��o���Gg§��w���u�1U(��@'������u@��� �<�mY���S�6xt���	΅e�=J�)RS�i(�m�"ϑ��[����}%�=r��&���o\$BI�A� �v��{��`����	^�!� �~�;Ӳ��;�{�)�$[`q�9�PXve[ֳh�� bE?�>���e�z��6�7�^ ���e����č�>?TA�M��6�_�Q����6QzY��2\�P���S���ڲ⅋$�{J�W�Po�s��EBYj},�~�]`D��$PJ���|����Q�'��Ј�cYv�6|��ؖ�T��C]�;�H��g&M ��e�hW|%�?�:8yW|%���v���9p���:"�l�~�Gs/p;������8���90�|~ȗ�ѡ,��{��� �]�Q�d�0��Ԅ�mvͷ��9];H(�c�2���I`S�>o�S&�%��>]Wܷ��~y�A�{JކҨ�W�C�^� �ކ���x��o������ 9%�m i�F�l�X
Ayߨ��3���C��UC�b���+�f~j"�	P{M���[Ҧy�'�#�m�΃/����5�XR�oэ�Y�$н�$�
 ���G�Ц�& N�W�ύŴ"���y�����D����r�ɠ��)��ܔ�7�C|p@c�=ܽk&V�5$��E��t49Hn������s����؈7�ߪWxI=� ����:��:�1��$_;��i�����N��Xa��\$ͽ�+����������ֹ�����������5�(�Dr��q��=cW�Y�Q2/�~[�D= y�g��	�Zg�+��_A=�3g�ׅ[��/��sFǍ�W�(N���f+9�^�r�t/���V	ƀ�k�Y�Sտ'<�R�۷b�%_U+��[+7q��k^��G�V6�g���@�88\���y�^��ƕ��@#�/��������H���ۈ0vKuc����=.m��T��7�0�Ө h�J�U_U�~�iŷ��k�{׊�-q�+������㑥+1���Bh�z�r��
YzW0�`���0Z��~gjD��
�?ıΕ�R��wJ�� ���E�� �k�Q��n	�ކ�_UaU)o���`�^X#���s����h���u��\$An�z�щA�'��V"̂s��v��/���W0�AGr8�#�+�����!���F����=���𫺷b�j�c#N�#LHv�����l$�39��ck��P�$��II�
7��<. I�E�����Fd�"	n�H�S�^��bގ#Yܦ@BD��u�]��^�����d$S�Ff��z Ɏ�#	|H��Y8ENY�����:�-!��qC�4�C6�<ҏ$�����%���ț�v$��YHf_�� #S,`'ڀ����d�����9���(G����q� �p[�̡����q�z#��c���o ��0�4U��o���	H sPg��ő`hy���=8�ݧ��b��Q�-����QG[x��Ǫ[Ѵi��H���
@Ҝg��Br�"��9�7�|g��!ٜ�	g}���4cE�㽐wM�2��lH��"%AuK���L�P�Sg���mry�?�=����$���T+�_�P��7b3�v�My���6��S�p��Vpx�N&�´�s��K� š�IA��>G��3�N�K�Ө_�c^�K7�k=��"ŤG�{0C\����X�6��i��]��]�T�w��2��F(��Hf�;�ȉV/A������m���s�@�Gve�Gڸ;*��Z�{N�#���<ۘ�SKgn%��gnS��C��sxm0�{d�T��f��o%`ڈ�����=ا��M���ڒ��s�6�Mg�B��]s�hr�	i):?�����&Ұ�%D_JF�k>Բ�zl���m�mڜ�6�_�=dn9����yl�V�ཆ��Y�8y�U<���"^Э��gI�@�)\��-�`�����B�\�:�H��Ӱ�^�@�]�0j�
���Jm�,��}+���[�V� �� y�$�\\+������}����Cz����F��e���PJ��������MZ�}�Y�k�-x�����cv�v�c�9=N��m(���՜dXn	A�"�Q8C{M�bq��vTA�^SЏ�3},�E��S�s{�~�}8d&=K*�������'8��P���6-���	pˊk��9$���$��W�U�m��P	Ru���&�_%�x����ґ�;�ӫ�3��e|����g<���o�X�__G"a|/��o�Y\�{�6z�RpW$���y�L��n�"Y%�@O��i_hM���W�D}�P�<�!��'�F�k��<'

�um�3�LHG߃�!Z�m�
Z�(�,�/�$��'���oH�sT
�;�c�^hX8��D�Mʾr�h�G��a�&��%�|/}���D��V<a���?�橕V�E�{0�g"�l��
���P����y���%�N5�������d�]?���;�`G�\'�`�oyF�B��<b���9��k� ����}�J���d���<0��+1YoYO�-_�D9~��8P���;�5������r`���R��=����%�38�AW܎�$8g�Y���酞V�|c S��m��;���Xv+U	�o���ǆp\�t�t�ފz�L����#�u�5�W�hӂ=c��vYp�~���r$�cOu돠�8�]���dU�Yg~AT��S+E�x���2;]E�y>-������P�@{@��@�3�o�6_Ud��5Տ�i���z�ct�iv��D	lr��&U$���d��'u�(XGak���F�A`�������@�X ��ǳ68�]#5��6���ڃ����&�p���4*��M�X�{r԰�ܔ}�!	V��������t
��7v�k�q��p�����8Iݺ��(X�dg����q�Zt��[X5���q/$���$�]B�rG!���N��g�у�k�*讕���Dx��=�"	�����%८Ĵ:.k���,پ	��@�z���F��ş�P���:����N���^$n�x̽�H�[5i��}�Hv_��3��#	���q=�(;�P�G*5�=ʚ@Rit'w}@(*��Ez�R,`�Ȅ��G� 9�ӂ�g��w�H]�M��Y滑�oh�����ۈ���
	��>n ����lD���:����0y���@�"�=.� ������
N�g�p�����)]����:P�{�Z�${t6$�ۼ s���p�q����d�|D�x,eQ{�G!���&Gԧ%�=�ۇGǀ&�)�3�*�_�>�|3Gu��/���qP�I�XC$6��Q?��x�s�As�Rm�+�o���~�,9�o��^�Un�"	"KO���iԵr�IqӰ5��L��h�eZ܊�t�W� �:�����W���O�{0WC6���1������!�98OIk�������^��c5m%��W���(�,H_��tr�x;Ò}��ey����g�42+�&�@����H� -���z])��g�#?��W�A�2���@R����m$�	�$�|T�v��F�
����`42���Sq��1��n�È�ރ�Q�� �A�O�7׽ġ:��{+�˨��D	�@ ���<0�Z��D?�N�b�!0c@(�3�=Ez��ѕ#����@*�_�7g���$�)���Ʃ�����x����<��#��=P�/D���l1�=��a�â�A�%0	h� �f�oH��Z$�~^9~�du<����^��m��(G#�PT�Ǡ`���<0��'���; � ��t+`��Hǥ�r�⌡H�;-i�A�ҙ0�YeP
��H�@����w�B�{	��#�HG�LG�� /�$�� �A�{�-�KInw�3.3�4Ѳje,)��f�؄ �mHmpI�|-�������i�s�R80�Gr�Á��N�������}#��s"w��I�ǂ$���$�;�pI����s���=S_��(� �~�~v���(�= ���u��H�����g��D�x��N,N����ә��R�=HK���Ɋ8�e2���6��w�= ��t����I`���~��v���ѕ�L�3� Y=	I�=S��U�9<�{�v�q
$�
}�����(���r"d�5,,���P!�q��1G�v��{�"�{(����L�|%�0+�Mo����O���x���YX�J�T��@$��A��#كY8��5�D�d�Hܓ�d���D�N;��~oDB<���8��d�R\��8|$ ��8�<�6u�S���z�(�wV���W��}�B~��8��˜�@ک��}�b�����q#z�9{�m�~w޷�ȁ?Ϸ��hs8c�N�p0�h�Px_&�H����E�����R
��5�M��<����w�+��}���b�A�7g��q'�I˶S���6�uԐ��΂��=){�vI$ű���Q�{�$�ۉu�$S`Sp��z����?\?���c䞮��}�;���bH���h$�6���p$�U�=��A����1��;g�A�gB�y�%��N$n� �I�y�m�G�hǣ��Qw#� 		�z����R}}�GyF"���i�M��|t�*��"��ɟF�z�-� ��M0���i�L��p��=�)6<�n�lmg<D�#[��q���AF��ڐl�텄@^�6H�sD�R%���I0���ax����ޙ8�
*� �=��ٱ�S�g	*��$�뗲}�sw˻�=��<����q�S�����Ӄ��~�@�T�C��[����ヤ?Ǒ�DE���?����
z���@8{�.����u�a�qd� ��O$L���Y�Im
�������K9�#} q���Ē�{����z�޾ϡc�P��ͣ�9ISW���|t�����\$N?$W�-zZΞ� q����dk�����T�fL��s�̹�c=G�R؆#?��SV�N��\@O��𠠸��bhp
��J;�}I
4U��^x8�٦�T�](}�9j����  �ձF�wڐ�m(����@|��S?�)����J0��`���cC�k��A���K�U�:����[�v�=GenG�!aZ�/�H�s��Q����b<��@��ht���K�Mp�Ԟ�5��st	��>T�F��AN�A�v0?�;��b��xJ���K��;ȗ�@$��{_y�]���σ�U����s+�Pf���8�0�Q�Xg�sp7#��3�����mTi���$p����Eg0�o�@MbG뗂z8{	أd�xV̱'�P�{ȍuK���G��A�0�=��$�h $��>J��n�`��}mœ�RZ��e"�p,�Rg��� /�{*R��Ͱ���ى1�;��)������"n��c*&��� ;�F��S�`�|�w�����x���7��{yw�������O_ݽ���������������[�^���u��������r����޿z~��'������q�z�,���^��y|׮������_]~���Ͽ��_�\��~~������˿^޿�����w�v��??��t��ϻ�������߿���������������|x��������]���ՇOct}��_�{�]_=>��7W߾��ۯ���^���|��l���w�n>�z�C��ۛ�>�g�'���������g��Q�����q���X~���>��_}�Ǘ�����-=�-}�[~�[�����r���O�/�7������<������Ç�7��"�ş>ᇗ��OO|��o�/PK
     �N�@               word/theme/PK    �N�@3L�  ;     word/theme/theme1.xml�YMoE�#�F{oc'vGu�رh�F�[��xw�;���jf��7����@%ą*�H�_�RT�Կ�;3��xM�6�
�C�}��~����Kwb�����'m�~��!��<�I��n��V<$N�xB�ބH�����]ī*"1A0?����EJ��҇a,��$�n�E�<�p!� ��la�V[^�1M<���^��Oг�y��o-��c�"QR�L�j�ęb��^]#�Dv�@���=P����<İT�����[X���W�IL͙[��7�l^6!�[4:E8,����օ�B�05���z�^��g ���SkKYf��R��2K �uVv�֬5\|I�ҌͭN��le�X�d�6f�+������7 �o����nw����/���Z�o@���Z'��Ϥ�g������2��PT�V1≚Wk1��E Ȱ�	R����e���PP��U�Ko�/g��.$}AS��>L1��Tޫ�߿z��}rx���{���h9�6q�g����?~��x����_T�e���<���j ��Ԝ�_>��ɣ�>}���
����2|@c"�5r�vx�������8݌A�iy�zJ�`��B~OE���,;��F� ��^�vލ�X�
�W��nq�:\TF��U
�`����Ÿ���x�Jw'N~{�x3/K��nD3�NIB���!�ݢԉ���|��-�:�V�d@�N5M'm��2�����f�&�pV���w���U? �	�e<V8�9�1+�*VQ����q=� �!a�"e՜��-%�
ƪL���.R(�W%�*漌��{��iv�&Q��܃�h��*�w;D?Cp27�7)q�}<ܠ�cҴ@���й�v8����1��ǶΎ�� ������V"^�5��6���<�Q��rз�s7�8�&P��;�}G���r���I�vʭ@�z�`7�f���!�(c�j��Ui6�։��z�9��ĔF�5�u
l� ��GTE�Na�]���Pf�C�R.�`g�+ek<lҕ=6�����j�vxI��B�YmBs��-i'U�t!
n����6�����4Cu���e��k0XD6 �-�e8�k�p0��:�v���b�p�)�H�#��l��&Iy��� ����C�1Q+iki�o��$I*�k�Q�g�M��W�4K�o��#K���t��Z�Ŧ�|����i�k�B֥��a�͐��-�c��t�4���1�	�pMa�>����j�Ȗ�y�� K�&k�b�zV�J+�V��5+ �nj�hD|UNviD��>fT�Ǌ��(8@C6;үK�	���	����t��+����+�^��,�pF��E�N�p�ǅ�d�Vi�q�����?#W�e�?sE�'pS���p�+0�����PJ#��lw@��],�����d�_�}�����a�|j��HPX�T$�Z2�w��z�vY�,d*�d�L��C�O�@s�^�=A�6�h���֟��u�0ԛ�r�9R����靏mfp��a����_�X����fz����/�۬F�������MN��Zƚ�x��Y���Q
�=H����
�S�zA��V?4haP6P����i���C�8�A[LZ�m�u�Q��3��z�[[v�|�2����U���Y;��k;67Ԑ٣-
C�� cc~�*��ć�!�p�?fJZ���PK    �N�@���P�  ��     word/document.xml��o�f�����r�hu���ݒ�M���I�t��&n���v���$>���
�(�����XǴ��e�b'���ׯ��M��Im��<m��������w��<��,м�pl��{=4�;�~t���	�G)6A�8��xi��n��z'7����4͊X�&s�xě�̤�'ēt�F�L��nN�si77��i_����?�W~��\��_�b(��.��_���,�k��Ӕ(�p��/M�g����z��Y&ň���L[��x�<;�tT}e��о��aap_��u�;�x:0p��d24:]PLj -4Cb!��>���u��Q6C���)*�-g�	��t
��o���+�Y�\A[7M1�Xg�VmU��lSU�@�Tn9Z{ӽ*�]u���a�$�e3:8�p��Ǟ��B��d��:Ԅ�����I*C��d�XV��%R���\n$�F⬪H��/��[�/y=���{�,�S�)�-{r�Qot�,�XD?3�?�臐������d�A�2�/��E�P�)�D�}��_�s)��O-P��7t�A_A��1�^�+ҟ����#��x��ݠv%&����5�z3��A7E?-�}VA����	?��A��a6 �js,�li�a����D�O���+��K*;�(5%0��bH���{_J�|i�'��K��������v�����_�����J�y��{��`kg�d~@2A/�H�Ҕ��J!Q�z¬�:c��I�m�L�D���U�nv Ğj����J�TКio�a-����?���:�ے��I�����%��w^7���?��[&�zp���o4�b Z����	�E'���S~|UZ)��ۛGJ�L�V(B�?�V~&�M`�%�֙������56��;W\��{+������/[��o�����Ƿ���t�ҥ�.�;��B��i�&\�0�c����G�t>�7^��o~*���ң]2&�o�9�qgQJ��H�"��L"�U�0,���?N���{���#����#q�O�O/��߻�������8��K&��J5�kM��	]�L��u��A��6� K~5� *�|0�h~��FsI&��x}Mz�=$��ԯo�67ַ�{�g�;�ȥ^��,����W�>FN��g�$�����{�����jw,o?���Q�/�Z\�$=��_������GPZ{?B������&�tP`Q,����rl�z����R �f�a�	�]�ә։��Y��=GeS��&8Ȼr�JT��dk�w湵��"�I��rsr�V*|<��ʒj��ʊ�i���3���A�;Ke�p'y&�x6��/5'�P�U�V���NPB���;�!p)ԫ��)V���b���~�2oX�g@��i���!��LFC\���0�<���K�5��`�)��b8�2�H�R\-���h�F3�m-��Dlb��$��#�6p*:�gH1<�3���z�d'Hk��:��mR�P����1U�Y*�sY6�Z�\bTY�z�@��ԨMba�3����+����!�Юj�lj�u�?g�u���j�s�L�,�,t<<=���1�l�9�ڕ����2!�]8p5}���ZB�v�ӄ9�C����Ju�R�j��'�:��8�%�Y��s=	}�0���3,�:��%�5tK��R)��9�W��fy�������N�ּkFuE��Z)P���4W������j�d�T����#�M�J������b��+�f��_.IϞC?�Μf��mL�ļ��umFn�Ek��C6C���Q�FA���㲨��۶5���
��ݴ�Τ�J^��Y����5����qCE]"��jD�2�jƙ��KTE���-D��f�4�+�Sj��{���G|d+Ķ�P�t� ���W;O���v����T4�hS.|E৉f��(��s/�����q<�_�%)j�j%��i�������T`b�R�����=��id}�y���|�h��V�g	:EC�}F�0�G&��Zھ�#!����{�����}z����g���7ڄ?�NdB��d�%���t#ѻ�� p����@���]�҆NY?�~e��VϤ&��w�oox#�T�J
���z�F�*�Z�Lӱ��8T�����f��=��1c��:4���fwK�=6:�������6v埿?��(o?��ؕZ�5͢�2����Yϼϣ���V��=`�&]�%�x >�|{���P�4M[Iv��'ա�kAiAm�E�|Ն2\o(��A���1:>~��z�a,�<-��u/�Ď�a稔`�q��Hv�������r�w��Ճ����5�V�%
��M'���:��N�a/F�=��IC���t��g�GO�u�|+�����!���}V)#$��<��G��YĚ��r_�����J�Ca������g��~���׈�'ub��1�8��S��(�Z�/�p�46�J_-A7Z��o��]�l��`v���ݠv��'ж��W\��f6�yb�K=� F�39�ۑbs�[(>]fm���Pk��elV��8����=8k"�#��I�N3�]7Q7�uBz4�ef�Bǩ��4r*,���&旝t�N`� s͉���eܩ0Z��S���|��wtq�ϓ� �2��-l�X�i�b�S���W����0�M4���'Z!�R�Q����4�3#E(%�_(��x���_�6�m�S�bl۾W�_�0���k���mC�,��Ц�"����@HF�~]ڿ--���L~J+wa��|����o�����������b~UZ�"�xZ�p
����1��6��0�@-5I��X��w~�7�!��.��NC�R��Fr�~�h��UR,\E'9^]��_����eT��������o�3��Bپ�o��]z��hj����YD,���p��ݚ����h��PR<�P���9,$��(���1�Ȉe��#�g`̚��QZ�q��{��1"RG�������@��j���s�y�`�ko}q�ϼ�1���)�:��w��m�����G�j���!覿�Qi���&�t�@�2ys�z���H��k�J��1[�������DXU{�کY_��6��:�d:�c��f��<�fJ$��(5K��ƎM�0��+�J��J�2�����@��\�cl:8�W���0�i1	B��I��D8�o�=4y��Php ��Qx�\���
��è��`4_#�H��^��-��0�}��!K�k��<a��Pp��rA}��S�|�(��!a�&6�t��"ÙC4��i��,���A0�J@�JCգ~ LlqB�+���J�q��J���x�Q���t��gc΋��0�kd܄f2qAp�\�&�=�ȶ�ʑY8�k��l��sp�[��Ie� E������G�6����q�y�L7Y�vx[�mB�p4)c�i�D�6���ăw�!E��{:�d��Z�
٢�¨��»�f�ba��nT(l�4��k���5/���F�{���1�+nޔ�_���������dE<s��@�,];�3�԰�$il��,`u�R�f����A�C�pDa�n�� 2<��'����%t^�"ѤJ?`"�X:��@LD;<:��I�J�B�!X���:V���~���na ��kwW �eG� ��'6rP"��fF��@Hv�B+�}�^=)�܁	&yc?Pw���E�ˤ�[�^����f��/�7����tm_��L�x��,�]���3�߿����^��C�RynQz�T��r�X�ߐ���oV��[��zy�r闭!u]�(�7lf�zP�f{���|�!D��h�ٞ��8=4M�S�'5�pKo�Po�k>p�4=�Y��s0�Z���n亸z�� �m�K׋�ו�#)f R\�L5p�-Q3��~����YB(��gǰ�M&�������1;1�e�� L�+p(Mں�{j�&�`��
���[��OK4�m����(u���}��59`�6��$���z|������T��ʕ����K��;����<�TZ�����R�̟>>V.������Ɉ7���kݚ�;��'D.�>�#��g�"�D����D�KW�FG�V�M�T��#�q���ǉU/糢�Ru�!|�C�h�+l-��T	.~�g���F3�MD�|Ȉq ?4��OR�i���:PNC~EG\*�'X1������PK
     �N�@            
   customXml/PK    �N�@�>ϕ        customXml/item1.xml���
�0D���n�Ջ�$=�x�i��vS��ѿ�PśיyÓţ��ݍ�zR�%)G��-]\·�C��<9O�P��Jrn'��L0b>!Vpa�c�I8���iZ�*o��Q�m��p��7
��Ik�X��������3�Ou�PK    �N�@cC{E�   G     customXml/itemProps1.xmle�Qk�0���r�5F��b,�N���`�!^ۀI���1��7t}��{��9��]�\p��h4�!@-L'����kX�u����Z�ՏUg�w�:3�ѡ
�B�yl|�i��mބI���M\а��!L�fC��,k����=�28;7n	�⌊�Ȍ��ٛIq��t"���ƈY�v$��'"f��� �����{{+�j�$�R�e���FB�SiJ�u�7�? uE��W}�{�PK    �N�@W%�R�   �      customXml/item2.xml��A
� E�" ��B�@��Rn��F���hn_)�'��ޠ�L{1X�Ā��)�8�Ǽ��]^9����6��+��
=rG�@5��]ʸ�Ϧ�YVH�z��d�����Ϡ�>�Eew|eQM�b�7PK    �N�@�t�   �      customXml/itemProps2.xml]N�j�0��b�l�8��l�G!��B�B^'K
^����{Uz�i��Q�ne����|�Coô�����~ F��ɬ���O$h�Ǉz�j2�P#:��%�qP�u�ٳ�c��~_�{Ҽ+Ǒw��Ð���X����\c�UB���3�7�ɜ��LLt��0ϋ�!ػC�̲R�{�wg�B���/}DS���PK    �N�@��ϡL  �     word/fontTable.xmlՖ�n�0��'�P���!��J+����]l�vm�kq��P��jW�.��L��l��;�����j��D8���_���]��I�J�D�s�)r4�Ř�Ӟ��::	���H:&�Hi�YQ�\�?v��ND���OU��=g�e��xF9Q�bNSx8���ʩˉ|���Ă�I�F,a���j;yyL1���^�x�i�����	d����*�-�ɶr<�"�J��yb�q��u��%�,�B�Iv
�q�\�
�cd~��i��b�
IF	�[b�9��5�ݔp^3NU�%]6^	NR3`NR�(�17$�9ȃ�����|�x��w\�)��h��lxB8KVET��f��e������Ŧ�`�F���+AA?�='���������j�#fLl�!8���@�|�Y�k%�G����w�+@` �  .�Ra�Yd��w8��,�lC��������a ���$\�[����*%����UJy�D���i��D1�T�2:^}�iRJ�CЃo�M�U�QPK��}p� ���׷z� �!D��/$���9$���.ԫ�����O�}�O���������Q0��}���/�b!��dVh"���1j��ү�	.�T���(^��H���� ������]��DTu�?U���O\#�$a#�*��i�h��J���GU	�mW	���p�T	��B��Rwa�;u����_w_�|�rQAc 44��Y�CkӰ�b�,�(j[�c��I����S�A�{��$��js���;���{G�9x{�j��c[(�B�P���X$��,a�����G=����b� Q�A��'�]�\F������:�PK
     �N�@               _rels/PK    �N�@""�   �     _rels/.rels���J1���!�}7�*"�loD�H}�!�����L�}{������r2g�|s�zst�x��m�
�U����N���aq"3z�C��D6������2�{�(.>+�㝔Y��0W!�/�6$�\��Ɉz��U]��������ik�A�N�l��;���t����r�(Θ:b�!i>��r�fu>��JG���1��ے�7Pay,��]1�<h|�T<td��<�8Gt��D��9�y���}��PK
     �N�@               customXml/_rels/PK    �N�@t?9z�   (     customXml/_rels/item1.xml.rels����1��;�ܝ�x��xY����t23�iS�(��O+,�1	����?¬��S4�T5(��zG?�������)��'2��=�l�,����D60�����&�+J�d���2�:Yw�#�u]ot�m@�a�Co ����J��6�w�E�0���X(\�|̔��6�(�`x�����k���PK    �N�@\�'"�   (     customXml/_rels/item2.xml.rels���j�0�{��`t_��0J��K�6F�GILc�XJi�~��;JB�/5�{��3{�6U
�����������bcog�h���v�j~p�R�x�UQ"�D�^kv�%�e2PVJ�G�������?u~5�}3U��]�uz����M���-�����B���L��l�b��gk[�{A��~���PK
     �N�@               word/_rels/PK    �N�@�c��  �     word/_rels/document.xml.rels��OK�0���!�ݦ��Ȳ�^DثT���l����������K�x�ޏ��n�m{�:�dI
��U�o���b�*�{�
F$��7�W�5�G�v���HA�<l�$ӢՔ�]��}��������<M72�{@q�)��p�6 �q��{���>{s���J����R�Muh�̥$����&�9{��f�$�sUv�6_�y�o�l��~M��s֜I��\d��d d��O��9U��![��>.�<4�S��ؽ�PK    �N�@p���t       [Content_Types].xml��=o�0��J��׊��"0�cl���u.`�_�
��(Ҩ]"%������M�Fg+Q9[�A�gX�Je�{�=��XQ�Rhg�`�l2���6bFj�@���G� #b�<XZ�\0�5̹�Ś��[.�E���ڃ�G�P����iM��$$g����:�`�{��@��*?���	�ʖt�YN�d�Ǜ]�+�&����"qp���̻�\!�ip>�ӼGb]U)	��KC����*h�0�obO��ԙ��P�����/��-]�������։���3�6���/J��J�Y�ݨ�b�cnt�8���O�ʙ�п��A~�4�g!" |�܇{����� ��l<�]<=�_?�f���>�PK     �N�@p���t                [n  [Content_Types].xmlPK 
     �N�@                        �i  _rels/PK     �N�@""�   �              �i  _rels/.relsPK 
     �N�@            
            Zb  customXml/PK 
     �N�@                        �j  customXml/_rels/PK     �N�@t?9z�   (              k  customXml/_rels/item1.xml.relsPK     �N�@\�'"�   (              �k  customXml/_rels/item2.xml.relsPK     �N�@�>ϕ                 �b  customXml/item1.xmlPK     �N�@W%�R�   �               cd  customXml/item2.xmlPK     �N�@cC{E�   G              Hc  customXml/itemProps1.xmlPK     �N�@�t�   �               e  customXml/itemProps2.xmlPK 
     �N�@            	                docProps/PK     �N�@P�4�h  |              '   docProps/app.xmlPK     �N�@���bT  �              �  docProps/core.xmlPK     �N�@Fr1�                 @  docProps/custom.xmlPK 
     �N�@                        o  word/PK 
     �N�@                        �l  word/_rels/PK     �N�@�c��  �              m  word/_rels/document.xml.relsPK     �N�@���P�  ��              �Q  word/document.xmlPK     �N�@��ϡL  �              f  word/fontTable.xmlPK     �N�@#
 �?9  Q#             :  word/settings.xmlPK     �N�@�N��{  w_              �  word/styles.xmlPK 
     �N�@                        �J  word/theme/PK     �N�@3L�  ;              �J  word/theme/theme1.xmlPK      �   p                 2 0   j q   mp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ s             2 0   j q \ 1 2   $ ( ) N�v8^(u�e�l  6 . d o c x   ive[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xPK
     �N�@            	   docProps/PK    �N�@ /�pm  {     docProps/app.xml��Ao�0����m�v�4�"u�S���Afba�$Hj����ːz�����OO���c�w�A[�I���	e;mN���}�n�$Di:9X���!�߿��[�>j	!Lؤ}��ze��6��e�֟�=����F4���/~D4v�����=�/��j�~�gG��8�AF?�8C��8����'b�R���.��W�.%4��RE��(�zl&��6t��KA8/O^����Ak�Z=��VK���Wr��b����~��ڇ���Y���IE��j��Ygl����V/�}���z^�"����U��T<V������U�eۢ.3^7���p^6[`s�z��޼�gAW�[�u��PK    �N�@�eV  �     docProps/core.xml}�_O� ��M��-�[�#-��'��8���n#� �۷�v]���x�9��@1��*ځu�6%"I�"0���lJ��Z�9���F�6P�84g��h��-<ں��(����)����b��4wIp� �k���������������7#H)Fd�i� �
4�0I��z���y�WΜZ�Cv➳�8��{��hl�6i'}�������S�j�LwW+���Qa�{�Q �㸓�2��_-�<Ng1!+rM����[�O��|<�j�n�VF9o��mg��Y*��2��Z��=0����=ԃ�߄$�b���%9��'<X7��Nu�e׳i?w����?þ PK    �N�@
��o�        docProps/custom.xml��AO� ��&�BY�ֆv��v�s��FR�Z]��]��{��~y�/�~���yeM	ӄ@ �B�S	�{����Έn�F��"=�V�w���Q���a|	�!�ƞ���|c��:݅x��}��l-��4SB0�|��7��9�),_���p�n�~���D	?۬iیd����$�Q��׈l�5m�����qy��N��O��+&�I�(]Dϡ�w\EIFQ�&q�d��(�ÿ
Ë�u��PK
     �N�@               word/PK    �N�@�N��{  w_     word/styles.xml�\O��J�#��9�a�;�7Ye�l�$b�,���c��8�݃����xzℐ�w�q���ǧ���[P]��xlw{��<!rٌ�U����_U{���8�y��"��vO|���h���t����r�,	ny6���w��py���<P�dǱ?��|~����3�잘����4f9|L��c��]̷|�YN�(�o�wwvZ�ir�Ulš��LLs)r,�����O!�n��$�
�$G��G0�d�p��b�60qV(��qG�}�M��"��y��O�H>faR��7�w&n[��-U��p�W�p�6b=�R��̢b�����I�R�f 9��?~q���M"��p��)�S>e�(����"��'�s*�<��,��p4�c�s��^�������q���Y�?�B6���_���_˻���d���m�/���˵QBAD�U*�:�H��`������b��Ņ��,��3���x )�o�8|�i���~q��"�$<�τ�����V9+Q<���\�3����D=� d�4ㅬ���s9�h 3��o@�q&	�nT9�T-T��W��_�~�U�Wq�_���*���ư�
a�C,�eڃ�.�-v���˴ǃ]�= �2��˴��.��ӽJz�����u�n�%��Y���e]�ۓu�n?�%��X���a]�ۃլT��{ə�N�<"ODν�߸I���3�֊e��t�,���A�(�4h�g�.}�c�;���bL�a�Ъ������So^-RX��&a�\�:F���S��b�	����Oy
+�$^	(��(L��,≣���$Ǔ S�6�B�9���`�|&��1@b?'��y�L0��Y�����,�����]�xݕ�ʵ(�]�"�N3�(�Ŭ����#��%	�iI��Z�`��5�N-I�SK�Ԓ�v�JZ׊rh[R^�y�ƺ'���>��s^%�C;R͞J��%���z��]��]�l>����Q<��w�ڶ�R�n	��&�v�mL����-e	�[�B��m^��/��e�9<}0��Z�t�=F��!�x1ɝC̢��`���)<rX��i�B}#���*��\���!���Bw�++9��]ɩ�r��!��C@3��¶Bo�"��휧С�u
�SEb��tmH]���+W'�q��Tʁ+��P=��3����l�1x/��I�"�G�f��H��<R�<{�3	�5��>��;����3�1���mL$,��$t�5%%72D)��a��D��ۉ`�s�˚%/`��?� =f�ܱ�B�KH�%��U�>(����Q@���tl�j�t^՘PY�g���ug�#'m���Յ̚�[�Yu�}%z1�-p�����!�}����i{E$��""��&Y\�L�"N2�Q�8h��3f��׭	W.�A��BA�,� e�P�2?(H��� �Ɏ�ݿ�h
���W\�� @A�Q��G��)~DA�Q��G��q�ǧS��4���S|Z�xV>�������]�=�E��9>�QA|���ܦ#Ö	;�|@@mD�(e���'1����{u�f�	��&ls1?U�Z[�~�[�#B�\�Ʒ�F�s��0dX�W���,�E��>�=�R�%[�ݩܶZW�e-"*߳<
xɃpSc
����oa��N����_mҵ�zv�-��&U���u��~�:~�g�5~�O�-�����vn���#ۓ����գ�ב-w�N/z8�ep	��[��{��m���[���L6_�x�/��+B�bsJ�Y�b�Pl_����TkH�(x�f"r{�K"�n��v�:��pc���1��ژ�{mV���H�dS]�b٨�����ǬG66*��F�ڼ�.���s��ԬT������b�VP�lDZ����#�ZA5ʙ��@��Mr&o*�3y��ț
bc���j�MŲqC�U%o*��J�*y��ɛ�����IA?T����ME�y�F�þQțj�3yS��ɛ
�L�T g�9�7ȍ�� �bٸ���*yS�l�PUɛ�Nކ躖��ME�9�I�T�wL�MŢ�7˙��@��Mr&o*�3yS��ɛ�F�T
yS�l�Prj���@6z(���Mr'o�&�L�T����ME�y�D�T,
yS��ɛ
�L�T g�9�7ș��@n�M��7��%�Vɛ
d���J�D w�6lT���ME�9�I�T�wL�MŢ�7˙��@��Mr&o*�3yS��ɛ�F�T
yS�l�Prj���@6z(���@p�X��0y���۟rxg4���Qp��<M�	�7��Sä�|}�fp[��.�q�>Z�9-��Q������7�,%w��{���/��a�p6g�<�����x��;p���a���j!�x�c �4�]���n=����fp��4�8ƭ�P9��_}��_�������+y���r��h��H��A�,�����8ٻyxNXq-bh^����T�{7�:9��&�,I�Ə���	q�?����۪�ӧV;�&΅��<�����%�y�|S����{^�أ]���9�ř���y���ҽ�>L�r����^�����IQ�~���c�����(�O#&�:9Q�oyZ���W�+_���|��u�ğAn��=7�!����щ&�o��Kv��{a����8�`�7�|����54$�D*i�?g�|�R�5o����E/�w.�pt��nn�R�T�w0�j�OD���,��h����`�Gi�y�ר�Lٽ�$77��g�Z����:�Lܞa���B�\���� -�Ώ:��Jiճ�6��q��SD��
H<9�B� {ʭ�*��N��h/T��0�����߃�h!�e��>��z���Sy�5Y��r7�J]��N��I��[� Φ<����囑������h�z}(P-
V+�|�,���5G+�}��������Ps�n5���mNa��;=�^�6;O8�w�0�Eq����(R�?h،�tmsk�p���b;h��h��؏N�$�5����2R^9�rY-{ϊ�����C�^��ɽ��Z�[e��_��?_|�ID5ƚ}��ғ�G5v�
s�q�>m<)Æ�aR����&E{��fR����>{���zC�iqi�)�2����l[�5{����~��?�}����|v�ş������_����G�PK    �N�@�dw{�8  �     word/settings.xml��ݒ��q��7b�1�2� L�r� �kɫ0��qs�Ivh�{��G#���������ױ:Ѱ�+�P?YY�o�����o���������7/ƿ^|u{������߼��=���������͛���o^�t����~�?���~x�t���Ϟ���O/߾��ŏ���^~��ӫo��<��û�{��?<��y�?�����߿�ͫ���n�ﾻ{s�����0����͋���/??�7o�^=><=|�|5y����w�n?�ߗ����~j�^�{{���_?޾��O?޽{����O���?�W�o����8�W����_���ӽ���ǇW�OOL��7�>�����Ϗ�_=������O���z����~��ӛ_����4���������4� �^�}���x������8��-+�?�~�����WL�q^|}	^?���s�{z���?��p�?�gE>��>��?�З�����,�~�������������}���'�χ��_����%�G����n�Yӯn���͋/}������������w_^�L_ď7����{��w��p�|���w7�������_~�i}�[���������s��|��������x�������O���مO|�����+F�s�}|x��磱�Yb�[|��?O���w(�o����_n��ѿ��?޼���??����;��ߞn�����tws�?����_޿�}�(�t{���������?޿f��?����#_�y�4�o��������ww�W������������,�O���~�������w�Z�Ꮉ|Z��5:_x����j_?}�ǿ���vz{�����"�q��O#�+I������&m�6���8D���A�eh�f9��8���������В>m�ֺ�$%xOJ=xZJ�<m]��9O��9hS���6.��m���L�1t���s:����3�i��ƹ��Lcm�B&�H�V}�������c���-���=H����)�#�r�KJJ>֩,s�f;|Ғ�q�����5ڷ�m�#:OS�Y��%�?�u��yjg I��#:��y�K9}~����y�w��eޣ6�s���N��Ǎr�X�a:]��a}%�$��y<��5ݷ4�>�9�l��>�yɋ�u^��m鋯�2��t�ЂY@҃6���2��P�e�+l��M��e��!h3����w�Q��Y�@����]�,C|�/�>��.��e����%���gɹmrι����g)��z[�c�:�w_;�x4�:�ɿgMC��֜�5�<����Yk��9l�!x��m�,�m�?mc��mc��]�i:}/lӼ�IGpnoy
%��
�
�R��V����ƀ6mS���n��zz*����:��M^'��{0��B�i���~�>�s�}~�����q�q��\�1(g��법`D��x�������OC0�h��s�O%��ݧ��n�S>�K�������~���������߳���ݗXis�ub�Rp_hi�\#�4�����r4_�=а�,��VZ��i�8�6��3�0)|%�el���@_sw�>����ӹyz���|�.�)w��J
��j�q�s\���h/9�a��U��e��s�-�������S�]�}�\-v���~�5�c���B�i	l�s����i,bnL�k�{�w��k��8��ƣ:n�4$�бF�l�v��g G?��a�f��8�F�J��6�H�Iu�����#h�����6];�lߍ�8ף�8n+�d��8.�{	p���)�`D�	;���1�P�mw��8��t�$~��2�}0^�g{Z�]��1�|}U��6�x��`�i;�i�{��LG4����I�����#صؘ����A��f4�%-��-k
z���+d�ј�K�a)�K�c
�VV�S�3g��ya��{���I���8��hD�*$��4�}���wk$����|�3N�`R�B2����<��l̸զ@��7b�yvV^V�q̮��c�q��F���0H�MZ��OI����Y��{з�_Js�۸ph����#�2-�{�L�-U�i��Y�3����߳cQ�o\���$%��u���\�u��A��W��C֥̾v��=nÐ|�n)���c���z�e���>;$=�����P��ޖ�������|)�����M�ӽ�c����:ρY�=�:�k>��3ւ�K�BeU�n�K
�m<%�񇸧��7�q�I�Zl����g��ӿg/X<��mH�)ӆ�ڌk���)W�-�A��9�el�\}�<W���gV+Cp+hD�\'�e�X�ؖ�#�cg���^<Z1vb�>�x	?z���`t�{���%����sڗ5�U}��������������cp��=���F���<f��#/��VUp�K9��8��}��c�t~N�޷3�@#�ys��x���(x��O@����9a^�:����EO�i�1�K��sII�je��c�?x���x4�S��"mt\����o,xnG�;D��#�~�F�A�����6�#�H�[iaZ���U��%�>?��ͦ�ã#ʝ�}(���c>e�4�T��'a\����\�~w���p��1?x�������E�;8M��J��Z�N�(���qq:�eJ���[����6�\A�	g�{�����H.M��Π�s޲��9����{h'�s@���C�_�v�5,���Ly�~7C��s:��p_'���G���g�S�]AD�����c}I|U��2g�:�H�R������������{�����~�����.u��uV� IN�27�̫�-�4�9�vף%�`���9ve*�}/,�O} �$�~2-��s)uNԵk�eI~���Ԃ>�#����
/y`լ���o��L�о���3.����-m����X5۲�[�[��z n�ՙ�H6�㧚�@STle�?5���jI���ev��T�!��4�N�༧='��"	��HNGsO�2���w�m_�m`�t^��������6��~k��^����6��3o�{J�ݓ55@����9�cjK�ř�P��N{�!���&��;Ne��:s�X��B_���׍�5�1n���iv����^C$-��w w	zPv�uN�H�;�r��DY�ew�sp7;��:g�nD$���	��g��� �P���p������s�w!L������� �vJ0 u]���pD�4�%��t@��BR�jK$��*.z�=%H�x�e��0Oз�yL����Q$��$��t~F���YՓ��HHI�WF���-�����!���}�H���4"QM����2�K��)�y����Ӧ����>�ρ>(��S$�chӔ��!��g�@��޸йퟦ������8qeq�(����w�o�	��'2Lt� ��m�`���Og��Q�`���7�'���ܺ��B���,hJ�6�6�DZ#�e��|JK�����o&a�߃����if����湆���6,1��NL3�Ǎ��{��\N�����OZ�ྍ+�m�u�q����r�X��1�H��aq�JF���J2^	4EN,]U�M��4������&�9�������Od�'��R)@n�{ L��:a�?��8���]$Av��Q�iɲ�^���>;�gc�/%����,����\�ӳ.8˂��%�[5��>��`7��\�ZO+��w�:��q[��ڀ͋$���`��`ϑ�Ӽx߂U�]���z���t��z����;-�2����>�D_Z/�S{M��߳.ܼc��T��!9-V�"�L
�����Klv����f�S�#��~�N;d�^��tOcjC����I�x=7�1�?��ݷA��ڷ6������+��;F[N��E���p��%D;�����\�]'bU9f!�qN�>��m�v�۝[��cBŽ�,{��t$Y�y�\�<\����{J;}N�P����h�c�«�9�5�b����],5��O�����5���c�om��<F	qX?�An�yN�37����l��91^��������K�N�H�F��0T��G�$��frEÄ��\Q$�#:�\ �����@��l�&��x����3���':yv�I���|p�̤6��,~���Jz	�O7BmM�ɾ�v&8���D���7$tڷi��-��9�o}Ƈ�L6H���@��%�=��\�9���6_Κ�i�v$	n3�6���`]z��H�v�:�(ܜJp3�� 9�,�<��B��ˆ$�0���9�iu�|���㴗�5,���Ɯ���I���������@[��'/���sA_��|B��
�3�Uh��{
i,j	u>���A3�c�^����5���p	a��X?X�פ�z��s������nS��DI���������p} u��̗a皜l�����%+��������u\�������ѳα�H��Yñ�=-O���hF�ǩ���[��9�V�7��|D7�B}�l���mi��-U�tAl���)��q�� ��*��ܖ�G��9�6�������;
z �ٵ˶4G&�3�{+ D��Ip���3|(7���	�)�`�u�Lu�T��:�H�]_�6�����YWc0:�'��A���"������i,�U<24�xD|7�������}���/%W�������ox�}PC7�EC�����6�(�)�!-�8����D_|���ڥA\�s�Iձ�cu_4>�1=�J`[vy?��M�H�LR����y,�65�T�Yr�mx��D6��d�y�&�"HN��ν�=�<` b�m�{ RɑWĹ@�j����e\�6�^�<��l#q�&e	i�΁�f �Qr�}����>�D1K���#�M���}#6�w0Y�"K|qT��&$gpb�d���7�z�|W���5�\�H��$�c�.��6�K�'-�yӱ�\�|]#Y���V W��u���I�BR=�9��f���؈��ub�-�i^s���c~����}��#x�ķ��C&;B�3]��@��m��UǘA�K��?m9f��Ha$!W�w��~�d Q�OD��L�~6"	��A���h�pv?,��6�S:�)X���g#Y`��f��"�_{�{��L ���B$��C������SH��m��[jW�7����k>������сMd�"�} '���/�`�Q�@8 7��!��ͥ�-'�yt������ӈ��F��1��/�6H�k�k��[����g�$A0�\��4��7xd<OG��x|vn�r1���r�hy^��V^���1�� *����1�'�YO�ߍ�@�ß6��v��ݭ���۰y����^34o�֎��d7�n�6x�<>;c�=x�6���K瞟|y�\'n�C���r�&�:-�M��#��N�{�s���ٮxÃ��%�T�}���<��#]H�����=��L�R��R���X]��[`��<S�K���?�ە����}�O�#��DV,��]f�c��5�p�a	=FP�"��{J���O7`EC���Ok�h��6��+�����3,;�� c�3��
ѵec��J�K�}�	��{�����������U���4$����>e��E�b�N���OǸt��Y�������������>��P�!8��d��cx�aɢ8���XG��c"���?�t�෷I�3#����MV�1����~�|�!u��ܙ��A�W��%�`
��9l�X#kwn簇mv��iA;���O$�9��XCۧ�n/Ip�9砒�� �
Iv�;�欂H�g���ʬ�o^`A"	|(`��	��z�U!�ã"H��+1@�"��7$�������^(��<>W�󺷁`�j��n�"in�=��
��� ��l#9��Gs��Q���{��II�w�UXK��.[�HV�l@�v������N5y���jv��E��K��(��wg��������[��]=�gC�3w��X���q��1��{��O�hjG�Y��?V��Kam�{#QZ���iKP��̤ Z^�Ja>:d��=�7H�H�VM���"$�	��ݳ ]pnoC�0��f޳��]�%�+@���{eiC��!I~:C�*��C��v�U�}�Hv�/��>:���`w�s��<�b�uut��y$�6dWx����);J$<�&M^�6�mʶ=(G�-!=���%�~en���(�ў��)�=S	WTbp��Z���{���f��#`�/tK���a
N�|~k���;<��t�R�s��5��;���arl^�#�e�~�#��X5H<����Qa��VN$A�z�HH�9������(��j��g� ����� � D�=�\{��r���AV���o���������i`W�d"�pt�S	I_J���6�M"|
�<����dD��_�C�����rK�����\@�9J�����ii�{\���
|�H��ll���C�b��k���� �-�1	׽p��fl�)p^���o���ǐY �tUu�|��%���i�z�g�������6`��p��` ��<���z�h�.;v��T��t�N �nW���x1J�T�L@�<IPA�pw�(����+5)�a�$aW���l_e8IF�BPSI������+	V����y�k�'�`����{�m
^��M��R=e@E�6d�yT�µ�14.�4x�t��&�Ar�=���M�^�ރd-�<%H���HN�;u��%�Ľ�HV��@d6 i�.������vgp\pWy�I���t해�':���1$��
�KA�sz1 ��Ŋ�x0��3��@�5��;�����t��Q싺�}İ'G����q�淂_�cq������5��w�ɧk> /nS�Q��)�`��P�:�G��(xZqmz��pɸ��L4yv�v/�p�=Y�,p�k��֎� }����&�ls����P'�%��=��f��:A��Yqz�ɴ�>���\�FAܸ�(�Q��AW�z���6��ip�����9�5���l��r ����hQ
���R�A��:J�.Z��X ��$y ��I�mxSURa��u7���pB�_*��>5����J��MNeV���T��]�3,��Wȵe�H-�i��Yv��#$/Ip���]����xX2�9�ttȒ��1����\8G� 9<.����� ���ǩ��;?K@�D�C��S��=N�����o`M�Y w:{���q�H��װE���6g�_�HF�~O�X	�������Ùl.����t�U�t���l�} g��P����)���}��@��x_���r��m�d$G`+S?+�́q�<	hE(�3G��{~���é@n�>�@[��p<��UZ��s
�{P�Is�e%s�����?m=�����I�"Piz��j1ڀ�������`�>m�ƛ�h�lzj��
���ކ貞s�ɧ`D��h�� �	��$�� Vr�� 8=��Y��r�P6`�@�}]#Y]S !�Y��d�I�j5��A]$�oFd�n� Y=
��?::IVYX�-��s�z ���4�n܃]B�*���F�������m���{u���e[�8s\�u��Sm���	�t���8�����������L+�z��R��o������u�v��?��k���9hC�ҵ%鹎� ~G�A�!�$�W���#)\�)Q��8�UdV��~k�$����J����=�4��S<2Η�Qq�p$A�}-���t^�s�o8��w�.�z�J\��,W���w�P��{��cdpS����d�i���:��A`0~_�J�稒���u�@���'�_Ӧ:I�k�g�Y�q�x	jD�]u�\��$R�v�2��W��
[�)�"Y7x�|�R=+����v��[��^@�vj�"��VSuV�n �_X+ � ���G����t?źC\�&�*��`t�@�Ӹ.m85}U��|�Ag��y�!���i'�<���Eg���\�w}R����������wE��;�1�/��>p9�1�cd�^��A���,P��^+��ݮx0cvI<���	vX�!�dyf�%��;�#x�1V���p2�w�?S�Vg��c~փ����A"���t��z�	��AB�[vG���%�'�������Vry���� ]��$����$�2{v�
����m�H��x$A�&A���	�R�6Xi<��ﺶ��p�H�%ս������ @x���,$�Y����9��"Amp�"�J�;B��aҠM��y#��T+o��Y���� tu�I�CT�2Ȉ�8�<+I�Dr:Ҝ�\q�[��(Q�0��h�%�Y��bs�M�g����6|{�$��H���'�6��c	6��ܲCr��������m�!���ɣc�6v�P.�G� ՝�$;'� �}��C$A}�ʩ@����7�/A�O3	��C�x����y�H6$A�#�i�|��K>�Jm�T�^s����9k��� ;�	�a�o�����l�4��ġ���[�@�I��`�8N�2�A}�m�}�'A��,al�w�]�3���P���B<�%p�8�����-! :m	'��6t�g�m8x����b�6d��^�Ґ���s
>$81P�·�]����g��=X�y���t��F����=����Z��
qk�zS����_Uu���T#o���o,[%�Uo,H��z�9�9l�Ÿ�j�W�7�J���s0f{�FFH�z�`�ga۩��j�d��5���ꤢ�#
Iţ:�~���kK8�=�C�X�[�i��=J��'`#jI}�{��]B�(ϊ�`�rO#
<�{�c ���57؀Ղ:7q_���WH�XͬOC�y�b; &��l�H�O��C��%!=׽WFH �dЃ9���`��.6_����č[5'�rߍg�ڨ^���]�zlgT��x	N�2I��Ĵ�#W�Ǎ;���O��+La~��s]�4�Vף�
��BB!�R�4
$�MAXn��H�]���;����)���i�=(�}�u����Q$���u���m�T�^ 
T��T��3hS��$��@��E���$�T��ړ{�+��u&��9^���p�"��"�����<�B��B�M�,F$g�H�� Z��H��{ߢ�&A� ��$�חdV}!�8�����Ms폳wvmY�x�'�h��C����6S�*���n�����`�M�:�D�΀��Bsރ� a 	����Q0����Z3H%�5yО������<�O^���d��䜾�I�}����1�
0�=脽!ױO�x�
N��(��ßV���$�CO�m�P:����H�G}+�� �0��u=v��v��`t �y<
 ���c � 8�W.�����^�`�����`E�Ƕ���d+�S��TW��Q�' ��Vq�;2	g��5���M�6��f'�W��xW}�$�ߨDU�1`7��k�Z ��ƭ4��U���Wb%Oµr�5��h�����-��P/�5�lnϟ�$���8���xc���+�'Ǩ�6�e'��gn-��gg�����cV�X����JG���y���J>~�ą���4b��$e�׆��m���p�F�K`m��4_�2�{B���'@��$su	H2�m2�?Z��䌡��9��q3�]�����]��FHN�CFU����
{��K�2�4�7�,_���h���{�����|$A�N=����P��}i�Wp:��s�Q������
�����$ �v/T��y'���;dڎf�$�GBB�v��P�g i���������"IP'e���#����}'G�!	2,��m$�%��N�k�#���FjNǍ��~�Dώi�G���]v�3��@�ݳ����I�s��H��ʁ�;. I`+S��(6}�u ݓc���$>h��$�nW��9I��I�C��%����	�tv�H��Gr�	xI�������)v�$ܻOI�V:s�=�M|���-՝4#G 9���t�t�TyӾ�`�'��^(A��}�P��g���Q<m���Pg�m
I�������wV �I���1�g�N"Y=� �v �7*�{��{�����ۅ6��;Dw���pO���GጠF"��Pkp�Ja�
�	�c);���r�6�/��_���A��$�sz.X�Kp������ n��K��>ec9��Vڷu���%c���  ��Mp3�Mw/dB�
�Ө��#����^��:������N�ߝ� C��qv-kjp�S�o�  O���\]Wmާ�k������$�뤼�����������4�����e���&���
�@::���\�;��6ygl��aw���;<X�椠o%��A�8f��5؍؁}��ȳ�v�M�:BR���s ��	):;�u_�;e�}t��G�C��k��kE��"ޗ�q5�����O�fv�܇���?n{�Y��|,���q��i#������)Z�c ok`qu�M�6��` q��]GI�:g}�k�����lK�3y�a�����d�Q�}���!�~vL#��5���ic��SzMD����vb�9 M�U�_�3�w�Q����~����C�#�|��~=8!��.U}=����l��☱u Sq��E���(L �׀�{[�@e]���#wK�C�D��mĽ�Əd}8~�o���ӹ� ��0H�&$��/]6�Jx�������H0��=��{�jn��������D#L�Ƽ�w|��}�F��,���$���=�J�Ѿ��V�u��{`�G�)
D������6{nCrz�.<��ݴ�X��Q?ߧs
��m��[�NY��4�U:d���Qb���#ÿnE7����A��������Gy���<��H/��7��3$ݳ��t�l܋=
G��贙��xr����~G��dDN����c=hs��a����kj����yS��ox���.@R��Um)�x$�� �Z���	�� �^Q�-�a]S\I�녌ז��{L@���U��g�+n���AiTQY�Ȩr;��ar|"��z"J�y ��ށ��1���6���A2�l��X�P��5j�x���k���X':�����	x���Hr��g5*��M�iw�$G`�UX���=���tV�$ˡ�ꑇv��ݮ�a�����`��Ѧ#z!��B�e�t��r�S��3��Nڮ޳ܵ�l��·�$`��`P�-�49F�OY�c��=�	��>�+�g�QJ���M
��us��`+z0��	ȵ ��-�@[6LH_�"�}�Q�1���QHj��Ԓ� �Xvx�<㭁
�x"��ށ�3�H�^E�l�\�H��g�Q<��}=��X��ة��������=�n���H��{ 2�p`��pp��	�ă�s�=Tn�q�$�|;��u3O�zɀ��
��p�����;���($���J��sأ [��H�v���]B�mװ'+�W"���ې��������-��o粹%tj_{�򁤺� =y���K�ͨ�@ҜI�+A�N������#���`R}g�^"9|%vp\�F �:�q��)Q�5�w�	u��G�k Ӿ��~G�F��w��w������6��TS�D=��H�v)Ґ��&�'�!=��W��w�{}���{ ������n0��9b��s����)%���!�f�mg�e�j�~�NYw��t
t��$���H6��C��6F����9��l��޲�*�+�
����>H(���uI;,���kr�.@䞅B�9�i�]BF�{N�:n���nP1Iq��v��L`�����$p�Q_	k��^����`Y�ي��,$�x5�Nm"�y#	P-�理�@�mT Rۥ_)��aekn�sp�>0��q3$�]���Dg�N[��9�-J�98KH��Fw�[���H��q!9�Sҩ��������Oѩ���~|}os/�����0����+�=P��	y}k~�}J��=νE�E$@�uU]���=W��۠]\W��m$�	�$�|��u_M��u��е�d.;��`�c�9�p���=�\�۠|���keP ��'r�y9��a�{}����L�F��3����?�.�\׽��c@����c�4,^K���#������m T��ηA�ÙE:�T��$�^8����@u��R=���^�V~��������O&��9��H��qc!�8���׸�VזH<,��O��������Q+$A$�g��g�瀄2�>N%�Z9��������F�i\6uoCl���~��m$�m�d� At�Qz��|Z	y��=D��^�fp�A�;"����>-�7RB�&�@T��AtoC%D�Rҷ݃U }i`�g;���+�.~� �����I$�dN�C�1jw ٜ=�RrA&4�3���]�f=������Ƴ�r�3I�+�$���$�.s���}������Gƃ�+��{�
�:�dr������p�tG���Z�=`d<�� 	��V}iP���^#q.�&���ãLA�3���3��9�J㹿���6|]_̾�)�����'�� �㶜��|@��$ln�Y���_�-�6���_��c0���`~�M���\+�~�v�p:�it,�A�9��BѨ?�$Bߧh��=��Xہu�^��*X�#�Q�\o���<N��f��Z��K�}\�� �~�<���耶��k$�qt�	��*ύ����(x$x��=0�xmZ��lFq���(�]�8�l���5��z/ϕ'�t:2��ߌ�=�� !�YG����{j~C>���ߟF�Yom�9����:�S�^(	b,��`�7	�F	X�? �r �u\��=��K��m���������qwFd���`�4���с0������)������`��:��/K"���㪎�;�,�$;@u:_ �%�� E= ��7.���xցǣ����9�q�4��B�~쾴�$�Ŀ�Lk���yd�����z;������A.6!� ������s�Pw� ك��5ۧ���Q�r�y����i��y�pՎGՐ?m��J`wq��ye �m��k�?��sA�r�}}p/(μ�R�If�G��잛�������� �{��*.�I0��$��`����ѹ&�#5(����$ou_�%qMΦ9�.\�R��G�.Js�|\���:����%q׉?��P���^���'4�ė��?]�����s�ʂ���2���3
z�C�ћ8C��=\�<���t��K3�%j������Is폄���\5����4K�� �t�\�����{�	���� qM~����"n��7����{.�����Β�`�TǭC^T�A��@ZpB���d�;�yq���R�г�N�����-�s���^#�҉g�}5皃L'��)%�� SJp��[<�wRb�}ޔXШ'���N��=�h��D�x	�uoE���h$0 �v�?�h�Rk$��/Ah�UBy��\�Xz���0B`qQ.��
��w=x��P����:S}�%T�r=
o`�U���O���h����Kw��\W��������K/*_�d��O����i#�3����#J�`tZ
�iO���n� ��Ȧ ���!W�qv'8��W/��@S�C��IE%�>;�Q~�
v�vP�w�nu~���,`���t�l�N��=p�z�c�Q��<��$�"��qs-�7�5�����cWNL�o�ў9|�Tqv���%�Z0:',��I^�Ι�8w��ȁ2�>��V6�JM�&~��������q��˺.�Ŀ#�~�+@"�G���t��q^}����ǧ��O��۷/��<����/�:z��O7o�y�n�~�xw���������������w�����_J�}���o~�I����͛�������y����ӻ~���Ǿ�����<��/���o��_??��������?>���mo����k���u$�|~�������~�����������������x=��_�����o��^������i�n��o߾�no������7/���ߴ�Zx���㷯�f��y���c��~�y����ǫ�3��������ϲ飌��d���������?�|�'����_����-������_����-����o��ۏ?��}|sw��o^������?�y�����?�"�՟>ᇗO���|��o�/PK
     �N�@               word/theme/PK    �N�@3L�  ;     word/theme/theme1.xml�YMoE�#�F{oc'vGu�رh�F�[��xw�;���jf��7����@%ą*�H�_�RT�Կ�;3��xM�6�
�C�}��~����Kwb�����'m�~��!��<�I��n��V<$N�xB�ބH�����]ī*"1A0?����EJ��҇a,��$�n�E�<�p!� ��la�V[^�1M<���^��Oг�y��o-��c�"QR�L�j�ęb��^]#�Dv�@���=P����<İT�����[X���W�IL͙[��7�l^6!�[4:E8,����օ�B�05���z�^��g ���SkKYf��R��2K �uVv�֬5\|I�ҌͭN��le�X�d�6f�+������7 �o����nw����/���Z�o@���Z'��Ϥ�g������2��PT�V1≚Wk1��E Ȱ�	R����e���PP��U�Ko�/g��.$}AS��>L1��Tޫ�߿z��}rx���{���h9�6q�g����?~��x����_T�e���<���j ��Ԝ�_>��ɣ�>}���
����2|@c"�5r�vx�������8݌A�iy�zJ�`��B~OE���,;��F� ��^�vލ�X�
�W��nq�:\TF��U
�`����Ÿ���x�Jw'N~{�x3/K��nD3�NIB���!�ݢԉ���|��-�:�V�d@�N5M'm��2�����f�&�pV���w���U? �	�e<V8�9�1+�*VQ����q=� �!a�"e՜��-%�
ƪL���.R(�W%�*漌��{��iv�&Q��܃�h��*�w;D?Cp27�7)q�}<ܠ�cҴ@���й�v8����1��ǶΎ�� ������V"^�5��6���<�Q��rз�s7�8�&P��;�}G���r���I�vʭ@�z�`7�f���!�(c�j��Ui6�։��z�9��ĔF�5�u
l� ��GTE�Na�]���Pf�C�R.�`g�+ek<lҕ=6�����j�vxI��B�YmBs��-i'U�t!
n����6�����4Cu���e��k0XD6 �-�e8�k�p0��:�v���b�p�)�H�#��l��&Iy��� ����C�1Q+iki�o��$I*�k�Q�g�M��W�4K�o��#K���t��Z�Ŧ�|����i�k�B֥��a�͐��-�c��t�4���1�	�pMa�>����j�Ȗ�y�� K�&k�b�zV�J+�V��5+ �nj�hD|UNviD��>fT�Ǌ��(8@C6;үK�	���	����t��+����+�^��,�pF��E�N�p�ǅ�d�Vi�q�����?#W�e�?sE�'pS���p�+0�����PJ#��lw@��],�����d�_�}�����a�|j��HPX�T$�Z2�w��z�vY�,d*�d�L��C�O�@s�^�=A�6�h���֟��u�0ԛ�r�9R����靏mfp��a����_�X����fz����/�۬F�������MN��Zƚ�x��Y���Q
�=H����
�S�zA��V?4haP6P����i���C�8�A[LZ�m�u�Q��3��z�[[v�|�2����U���Y;��k;67Ԑ٣-
C�� cc~�*��ć�!�p�?fJZ���PK    �N�@&�  ��     word/document.xml�]ms�V��3�<^fHf��c'o�q�Y������r��,i$9n`�	t���-��n�nax[v�˄$���$��{���k˶K�dn3◫{^��<��s>��2[ad��\<�H�c�@�ENX��?9�pt&STJ(R�(0��*��?���7T�E���A�����Jt.Ϊ����Ph�)SJ��Ѳ��%5A��	�T�hf�*�ŉ�d*��K�E�Qx^�V(%nWnM��U�2�*	Q^�(S�rE:
�K��-r<�����ik1��B֜�Q{B�+YcB�_�7�6*�k|s����	��a����� 㠣��5��nD��y�sU)�i{�M���TD��m8f�/�y�H�����f@|k�2�	��Fh�R�nL55M��ȩ��w���M��`I�@N�bE��#q��vJX��B+���%��HS��m�e)���#)�����9J��q��j�*)	Z0I��K�'�Ɨ�2�=�$�2��m�T&VMM�����v-��U�����#��H��fy1dr�����4
��f(E�O�O�Ɨh�e��
����􃾤��c
�\\e>SS���8A��g�Q���w'�W
���4zm�|�-էkN`Q�6���$�gg��0����q�@�x�Nh��(�hz�N��	���Gy<����ݻ�67w�~T�ǫ�/�`C�@3���e��۵K#A��$�)����9�Ra�������h������1�����#L���b�ѻO��6�j������߼x�s��E�햢�V��qv��cd��v��6��|__{8*���� �ȣ������n�����<9�~�ݵ���17w�[by��Z��*��b�̚��j�B�+��^{BGz>3;���*�n8g��(������X`��M�g�',�N&#�7-;c���QB�,ާ!	=�7e�yx�p�B[�/���߾����c�7��yR�����������?�'2-F�H�/�l�7K������w;��������v�h~3�D6>���?��5�&K���>�R2r�b.��PU�ϧ�?=}��Mg�9n�
"|�!w�l^(�t�oX�{fX�b��=
1_��AW�W��� e��aU "Sr�� �T�ik�k?���U@���di��5o�1���{/>׮� 
ӥ(K �s-��~�eO%�G���"o�D�aUQųp
���w|�L�;�@I�ē2WԷ��!UR8�2�6�'�M9(�Ԁ��HW9�803^���Ԭ��l�)`ۺ3x�yn���Dwh�d�;(1�әق)'7�uM��rJ`T�&��u�
�tp�r��NX`���p���#�F��,�аa���p�O����f�Z',�YG�d]D���@��ȋ(?6~#�)& ���n剛痃�x
�����jp޶��;5��V��!�_���=F��Uh��Q�ӌH�yq�e�!s���������6#~v���g޿�+���np���9'�⨓���(g�Ɓ��	�6p���3��w=w�wF�
�$��w|�F"u��[q�� ,�<��]lg:	p�EV�_ҹ��+�sV<��nQ��9���������o�9%�����|Ǌ:rJpO.t�H�{h�n\�	�Y x�n����QB�����GJ Q��;(Ox@ѭ EHQߊkD�ԫ��@�Ϯ�,���N�(U�dE=��#:f�#�_)���̨Ϋ�j�Ɨm*�덤g�5�~!�#�
���
xk�*��F�6-��F���Bi�p����&�UA,?�-�AI�`�:%�amk�ti6�7�~zR���e#_��l���Y����'l�M��.��V��ñob۞�e�Fd�Ei��!gC�tC}��� ��fmS�Bb$[4%aў�b���}��E�K���٢n���@O���!xmT�D��]��z�\�B�j	jW�8�S�z���h�)�,'�Xzh����J��xqw�e�	-���0�i��\�6T��gL�����n��Q��hwR`U�0�Tb,i��4� V�jd���|Kg$(�g*����n?��������Y~-���6>����HdW�#b}o�ԩ��wm�_�O�k7~1�J�ڋ��U��]���{�����{�ջ�k��/���e���x��Nv����;w��
��H�� {#�|�.��5��ھ�����]�V��Tۺ]_��$7X��h7E�/�]5���gs�00���GX��ӑaӶ_����孨�E	�pС���m��͍g�������>yr"��Y"Ɇ
I6��ZS>���� �ѣ�D�H:����#q!4?"�	c��B���'������($�8/�&�M�y�[����_99�n{�?np�V���-2��#
���������ОoԶ��?z��v~�]�o��v�2��z��ML��^m��-1;��K�w8����Y��Z���p�n���Pll�Ǘ��?���F:��[�*��ѭ��y˧�0��n�"�Ɨ
��Jy��[����ᒞuO�А�ߖ8�����O����yf�[���֐<S���ۊ��]o����no��h=�d���eЏIH����p��"����?�a�L���*b[�$�
'N$-3��B~�K�A4�o�a��J���e���"$��w4�0%����M�r^�*h7L^揧���C��ìZ�]ղ&C�mW�:��J���4[ʄ������	D����&��,,ύo�8؝ӓ�Whh�Ɵ�,1=v�3����:��B��*̟��/��sv�{�iډ�>���G�[55�1̏�p���l�S��@����d���# }>c��g|_��Q���&	�9߀��JC�umký?��y�f�v�Rms[����ß���f�\}��'C#F�2����-9�]�U\0^ͤcn�W�H�%�&�!��	�)8i]�AL6O�h�'O!��`����1��*�P���aٷ���(�:�����A����`�B|����r���[�$���<'�Nh6���u{��|3�.]r�hI\�H4+��Ü7�:��0|%��'��d��X\C�N3%��\|�(����\��J�b���؎t��"t�v�����P���j��u���3��r��8��ǡڏG�SX�J���w)0�L����o��{g�� <
A8��r�>l�o��S�i̋�$��R�u�<Ql��n	��fG,,?T���4�L�j����?y�h��zs$� �\U�2�:W���D�62SӁ����ɰ�qK,?�!�h$<Q7AET.�D2p'�@�>�vm�F$p�lE�@9�rd��T�Je�2SyQ�ŽjŁ�M�<���/mv��
�M7#:�Z��!:e�Z�0�_9j�d/��O�0�jd~IKg�V�z��Ա)����ۘLK���?Q2��E	}&����Ŭ
��$�_EUˍ�QY�ƻ,Cp�%g��%QT�~]�����M$85D%H�"CJ����7�S�2�����|�_*h\�8��駧�i�,%�5�G�Y��?���P
F��A��PK
     �N�@            
   customXml/PK    �N�@�>ϕ        customXml/item1.xml���
�0D���n�Ջ�$=�x�i��vS��ѿ�PśיyÓţ��ݍ�zR�%)G��-]\·�C��<9O�P��Jrn'��L0b>!Vpa�c�I8���iZ�*o��Q�m��p��7
��Ik�X��������3�Ou�PK    �N�@cC{E�   G     customXml/itemProps1.xmle�Qk�0���r�5F��b,�N���`�!^ۀI���1��7t}��{��9��]�\p��h4�!@-L'����kX�u����Z�ՏUg�w�:3�ѡ
�B�yl|�i��mބI���M\а��!L�fC��,k����=�28;7n	�⌊�Ȍ��ٛIq��t"���ƈY�v$��'"f��� �����{{+�j�$�R�e���FB�SiJ�u�7�? uE��W}�{�PK    �N�@W%�R�   �      customXml/item2.xml��A
� E�" ��B�@��Rn��F���hn_)�'��ޠ�L{1X�Ā��)�8�Ǽ��]^9����6��+��
=rG�@5��]ʸ�Ϧ�YVH�z��d�����Ϡ�>�Eew|eQM�b�7PK    �N�@#aj�   �      customXml/itemProps2.xml]NM��0��»���j+M����א�j�I�/..���,{�4��Q5O;�o�i�N�j� Cg|?����I��z=y�~����UO�^M��xhYƈ�N¯�fk�:��,��l�Ny��9_i٪<)ӭz��.֐�[��dnh5-�]4?["����h���a��&�F�G��;A���?}āD]�σ�PK    �N�@]p`�K  �     word/fontTable.xml�V�n�0�G���o�ӴI�uS��.`�k7u[�خ�t��W�K�a< O�$���R�	&��jrr|d�������j7Ti&E�çȫQ������:9���Ή�L
���T{�ϟ���C)r]��B�y���y>i��Nǔ}*'T�ǡT���F>'��tr�J>!9볌�s?@��e�!U�p�Rz%�)�"��}E3�(���^T�Rm&�`�dJ��5���ㄉe��,UR�a~
��݌|S
�cd�x��x�~9R�~��p���fmA8������j�%'�&L���bȹ!Y�C�MTG�/����M�tL���2��p��Qe���	���"~C3sc4���[��ny.�;^s� &�.��U_FlNj���$&"P�e��;
� r���ݗ
 0 �  ��K���e@�i.]|��i���PL���!���Dw` �!�A�8��u)�brk�H��/"�X��F�u���)%�:�'Dx����K�ChbDT	���gLk��0B� ����3(`�A$��EV0��°m�"���l�t����~]� ��Ѕ�������P�{I�K�ۺ��@=9U�*c����Z��,ã8��*����͜�e�8�+0 �Q��-r����Q�5���?�G�H���U0"�m��p��%J��\�.a���-#+��-$Tj��#�:�{^�1��
�[���q�c����-_,W]�e5.�m"�떀����l���}ny����ݷ���6+�hX6����g���p��~��5$�^#�F���G��Gc�����1ã���b�
$)�^b���@����7�Q�S}�PK
     �N�@               _rels/PK    �N�@""�   �     _rels/.rels���J1���!�}7�*"�loD�H}�!�����L�}{������r2g�|s�zst�x��m�
�U����N���aq"3z�C��D6������2�{�(.>+�㝔Y��0W!�/�6$�\��Ɉz��U]��������ik�A�N�l��;���t����r�(Θ:b�!i>��r�fu>��JG���1��ے�7Pay,��]1�<h|�T<td��<�8Gt��D��9�y���}��PK
     �N�@               customXml/_rels/PK    �N�@t?9z�   (     customXml/_rels/item1.xml.rels����1��;�ܝ�x��xY����t23�iS�(��O+,�1	����?¬��S4�T5(��zG?�������)��'2��=�l�,����D60�����&�+J�d���2�:Yw�#�u]ot�m@�a�Co ����J��6�w�E�0���X(\�|̔��6�(�`x�����k���PK    �N�@\�'"�   (     customXml/_rels/item2.xml.rels���j�0�{��`t_��0J��K�6F�GILc�XJi�~��;JB�/5�{��3{�6U
�����������bcog�h���v�j~p�R�x�UQ"�D�^kv�%�e2PVJ�G�������?u~5�}3U��]�uz����M���-�����B���L��l�b��gk[�{A��~���PK
     �N�@               word/_rels/PK    �N�@�c��  �     word/_rels/document.xml.rels��OK�0���!�ݦ��Ȳ�^DثT���l����������K�x�ޏ��n�m{�:�dI
��U�o���b�*�{�
F$��7�W�5�G�v���HA�<l�$ӢՔ�]��}��������<M72�{@q�)��p�6 �q��{���>{s���J����R�Muh�̥$����&�9{��f�$�sUv�6_�y�o�l��~M��s֜I��\d��d d��O��9U��![��>.�<4�S��ؽ�PK    �N�@p���t       [Content_Types].xml��=o�0��J��׊��"0�cl���u.`�_�
��(Ҩ]"%������M�Fg+Q9[�A�gX�Je�{�=��XQ�Rhg�`�l2���6bFj�@���G� #b�<XZ�\0�5̹�Ś��[.�E���ڃ�G�P����iM��$$g����:�`�{��@��*?���	�ʖt�YN�d�Ǜ]�+�&����"qp���̻�\!�ip>�ӼGb]U)	��KC����*h�0�obO��ԙ��P�����/��-]�������։���3�6���/J��J�Y�ݨ�b�cnt�8���O�ʙ�п��A~�4�g!" |�܇{����� ��l<�]<=�_?�f���>�PK     �N�@p���t                vk  [Content_Types].xmlPK 
     �N�@                        �f  _rels/PK     �N�@""�   �              �f  _rels/.relsPK 
     �N�@            
            w_  customXml/PK 
     �N�@                        �g  customXml/_rels/PK     �N�@t?9z�   (              h  customXml/_rels/item1.xml.relsPK     �N�@\�'"�   (              i  customXml/_rels/item2.xml.relsPK     �N�@�>ϕ                 �_  customXml/item1.xmlPK     �N�@W%�R�   �               �a  customXml/item2.xmlPK     �N�@cC{E�   G              e`  customXml/itemProps1.xmlPK     �N�@#aj�   �               4b  customXml/itemProps2.xmlPK 
     �N�@            	                docProps/PK     �N�@ /�pm  {              '   docProps/app.xmlPK     �N�@�eV  �              �  docProps/core.xmlPK     �N�@
��o�                 G  docProps/custom.xmlPK 
     �N�@                        v  word/PK 
     �N�@                        j  word/_rels/PK     �N�@�c��  �              8j  word/_rels/document.xml.relsPK     �N�@&�  ��              3Q  word/document.xmlPK     �N�@]p`�K  �              +c  word/fontTable.xmlPK     �N�@�dw{�8  �              A  word/settings.xmlPK     �N�@�N��{  w_              �  word/styles.xmlPK 
     �N�@                        OJ  word/theme/PK     �N�@3L�  ;              xJ  word/theme/theme1.xmlPK      �  m    iq             2 0   j q \ 1 3   $ N�v8^(u�e�l. d o c x   ѭ�F�=���]e�m$3$�Q�OF�<_mog�\�"��2�/g*�E���X�-_����0
���ݝ���U�&�e�Y[q�*S�\���,���SH����g�_�2�q;��A%�<\d�����8/�\�&qG�}כ�]�4X�ʗY>�#3�X�I�f��PT�n�L[�����2��k���Z��̢b���O�i*R�f =��?zy��TL#�����1�S��gr&�Q���Yj?�O��D%y�]���4P���œ$G��\���)��I���?��˷�������?�e�,��z�h��mD�\�	����hS�$��v ��^9��	��dT\x���@~1�ɛL�w��s�/� �:�7/��P��)��Ç������<`�U�&ʂ�7�\�؟��gYā,Õf��U��B"�}_��G�"CQp�(s)4�x�M�*#G�f�����*�����PK
     �N�@            	   docProps/PK    �N�@G��i  |     docProps/app.xml�R�N�0�#�QhkT�Tj�Gd9��"�-� ��8�p�3#��;���q�>�:��2�RG����/���>���y�:>h����.�f�g��ڠ�],�[ƽ��'z�K�����v�>@�'z��o�xQy�SzA�ӣ�K��0>:^}���vZL��K{0!0�G3p��q�3���#�k�G�* ���v����q���6Ų�*��x�*�2 �)�Y������	A�=Z9"+�2�Ű|�&�f;>8�KL7��g����?�_rq+}�1\L������I�2f����=ۮ7��w?�M�GH%����]�/n�$��l����d�UyB��*iMiެ�̍ ��A�n�?0
d�*N-�/PK    �N�@��\�V  �     docProps/core.xml}�[O� ��M��-��ZI��K��ML����0�K,��˿�v�u��Ǚs��P�v��6`�jM�H���h�2�
=��@���H޴*��f�����G�v`��qTtZ{�Q��X��.	�ek5���+�q��W��4��<��s��n"�)ń�>m3 ��Ѐ�&	��^V�?ʉS+���Nc�S�qr���6��C�������Ӱj�LW+��Qa�{�Q �ø�����s����또�\�,�i�V�k<��ֲ��Q�[�[�['���;�/�T o�L���nO�h�7!		�b��)�YN/���G �[ب�/�� �0w���?þ PK    �N�@Fr1�        docProps/custom.xml���j�0�}�� ��%�u١��M-$��Hrb�H�[S��UH�.�;�ۼ�������	�@jnĠO%|=��:-��hY�Ez��no؋3V�0H"�}	�!�c��Ru>���Io��B�	���l���SB0�|0
�_^�b�%��v�xXl�[�o|�
�(�G�5m���mޠ��5���"kBhM�]�����^�)�S����sd��C=�8J�9�}��U�d4RI�a��'�ῌ�
×n��U_PK
     �N�@               word/PK    �N�@�F��^  b_     word/styles.xml�\Ks�J�S�P�
�=?W&�'�)lc�8�u���Q"��~dܺK6w�eł�ł���`n��O�4=Z�G	E��3}��>���5�~��]87<I}MG�G;#�G����z:zsu��x��<��OG�<}���yz{�f�O0�G�;-�,>��N�%Y�H�<�/"	Y���%��x�a�2�~v����s0�f�t�'ё6��n"R��$�H,�����l«�/���<ʐq;��AD�ҏ��ZH�]\FnL��	���M�nE�ŉpy�BL�@5>d~T��5��{��V�ߖ� >���U�1�1�X�]��4h0�D[E�̟',Qa���ݣ�בH�<���A>y�}�,�T~L.�Q�?'"�R������_A����[�ϣ��7K���o8K��Ϧ���O����~����ĸiV1���������؈�o��\k*$��L�Xy�MG�PLp/_��k`:*.����ǿX��M�=�;}㌇���y\֢����e�*e:z�D_<�;��2 �V�k��{u��X�4����D;y���+�x!��ㅈI�^���#CY��,KΤ�8�M�*-G�������&&�M�7�?���p��M<n�I��j��P��G���%3�=y̘�l1c��Ìi�3�=̘���1�!6c�c:��w&�"ZG�ǳ��f��:�?�uD��(��1�#�#X�J5�8��8�̪�Bd�ȸ��;;$� �3�nlm���.}COZ�A�(��a�\Iz�l�d_�'�b�����39�s��Y��yK��9B�G7<�i��<�Dp�3X1X����O`�í������;Q�-#�k�G���ں���`y��X�2AB�?��d�9�J�J�3?�	p^�A�	���#_�HV�Z��eȞ�Ǒ�0k�(�9�.i$�gI�F��bM�F����~jd{?kCZߊrlZR^�Y`��ǁ�@��s�_G��~&\$�qP��K����KG>s��}!�{��v�R�(�#��ch����m�c��$j�%�j�%$k�mO�.�?���HO�yC� l��=�5f�<�N�r5g�ʻ��8�
�J�?��01o7a�Grf/b[�+v��d��K�N�ʲ��%{ ���������bN�c�����U꜈ ��3�kM�3vw�z����Dt �4���U/Y�V�(~Zp�Yl���xwH�D��<I������U������[5�����y���>$ 	�<d<�-eM��g'����ߏ`�"얔��!����ج�y	K3�� �􌅱�l
Y���oa]�1
v�b�_.�[�Z+ǆ���NëN3]�,��|���v�3$�ґN��yb�r֠v#��N��8`��&O@�-.��&�!m������@$�< �� �z\�I]AF)�Ո%6�C�L��M�U����Q�x	�!������пY�������@�����m�4\% )qD %�����8"�GR�@J'/�X�xJ��
��
�Y�8��1�*I�[g%�T|�kf��G%�e"rw��:6I����DDA)Ά�?Iy%�����&�/,7acK�S����闼�xDH�lԎ�k��"Ա�=󯗙3[���7=�R��ZoZ�+�r,"��s����5]��뜽�):r��`툯��u���kvNv>0�ڧ����>�7���}�G�����^��kSﶹCӓ����ա�ס�v�� y84UpI1��".�	����[���,�X�tt(�)+A�b
J]Y�r�H�P����LT���I���E���D�H��ƛ��+f��P��U(���?�h�q`(�I�J5��P.��\��Ô�ФF%��È6�j���9Laj�TS��c�������e����Y��NY�7��Z��D��M%�o"��xSIL�P�\M��\&m(���M%2�CITo"��xt�05ś�b
PS��,���u\*��"�T.k�Y�7��Z��D��M%�o"��xSIL�P�\M��\&m(���M%2�CITo"��xw�@׷�o*�)@M񦲘��%�T.�xS��śJd-�T"k�Y�7��Z��Dv�M%��7�ˤ��VśJd����*�D"{���$�ś�b
PS��,��t�7��"�T.k�Y�7��Z��D��M%�o"��xSI(�M�2iC��U���$��7��^�;6�}d񦲘�o*�):]�M墈7��Z��D��M%�o*��xS��śHd'�T�xS�L�PjjU��D&y(���DpjX��0y��۟2xg:�����(84L��O�_�9a'_��{n��V=�Ko\���V{N�;w���2�6��6O���Cx��vO��J`4��1s�]�_�kCp�����'Z������<�~����u����1n��[��Ɏ��m�����[�݁�	���cyf:��0�^��֛�d_��_n_�Ks8z�l͞Kc�3�0*=q,#��g�U#�ϩ(v$���#yr6I溜�%��%��fyIw�y}F��;��0���� x��S޹|"8Q!�ўL� OG��(�2��Ѿ=y&/��EC1i0G���bǓ��{z������*��ZH�%Ԗ+�s��t��A#@�� V;:��[kԥ��RhlG�d�\w7�|���Y=��S%��P�?g��	�R2���w��c�k:1�gZb����;�*0�i��`�Ծ��,a7>��Н���ƨ����^�۲L''77��W�ZY��+�r��^U���@�����_P�m��N��X�Ī<�u��`6�L�
(<$�BҠb�흪�c�NG{�}��=�FR��8x�U�ڃ���S�ҕ��T�#B�.���c�PW�/<�߲ћ�x�\�ʷ!�X��ӑ���`#D�j��O�ۣ�n-�*p�"^k�E)��xՎ>��LO/���S%t���wr"�����lN�]?�!/��1T�"���F�q]��Z�.qs=îY&u�|��.�!$r:廋�Hy��p�j9߬�[��b��TW�3y>ocF�ϭ*ڇo��ﯿr$�jc�ź�2ӏg�]��&�˖s`�|!��)�F��)���7VN���qJs
��/?������-6SvJ��1a�˓jS�5�T_���/x�������?Z��}j���d�0���PK    �N�@�߭7�8  �!    word/settings.xml��ے�q��'bށ�{�u> D9����<!yC{�@���Ft7SO?_h�#~ˣߘBvտkr�a������}��_n���}���M���w��_߽�����o��ˋ��n޽�ys����?�>��������ۏ/o����ǯxŻǗo_}�⧧��/�����O�oos�������<�?~����ß?�������7Ow�߽�{����i�_^s���^~y��o�^=�?���t=�����^�~��O<�#����z�����wO�~��7�����Ow�������m|�O�/���y����>����_>�����=��z�������G��ϟ������^��z�ߦ�7L�7����U<�6��뗑?����ڟW�w�?�<|^f6�5���^�ˏ��n�æ��/~ǎ����ۯ>�|���Eb;6͋o.�����w��������o���ȇ��G��/7������3\6s������������������e���յ]x��;����k+}��y��?�|x��o7��t������Y�p���燻׿��������7߽�y�?>�q�>���O���/O�֟�������߷Ow�n��?���O77���/?_�����w~���}`�|~���z�ć���������>��g�w�Uoxw����_���_߾@����W{&���������1��^?^�����h��4�o��e/�/��i����9/i�!I��e�����)��m8�f�&��#�m�������#h�~�����wڶ,�����ɲ�.�)���kx[ߟCx�2�.�!H������y�3|���t��T��k����|庶o}v�v��r]��;�$���\w�ن��=��4�aަ��>os3���gq	ǧ����[�K�~�}F��	g���G�O}�k�O�Y_�~��M����s:�]8�C��>oC7�s:tkX��+��з멫=簺d�N_�a���aft��y{t���[��4��4��x6��s=6���ml��w��N�됱=����[��>��؄��u���q���څ��u��;5�:]��)a���L;�S;�?�u����y�5�8t�>i�iX���p�՞ƺ���m>oӲ�ٙ۠������mn��W{�ڠ��v��q���mk���i�|����=K;�>;K{��m��z雰��q<|ޖq��ۦv�p����56M~'ꪵI����߶�ؾ>kם���nX���.����?s���5]�c�S�29E�ٚq����#ظ�|Wm]l��c|]��ַM���~N���
�P�ͷMm��M��`:�i��u
3:mo8':;{ׄE_ӽ�F�����d��x���=*���'[l�~��gg�%|��m����:d�k��
ƿk����/)}���)�N�ӿ��[�oe�A��i�����T��2Gxfn��O�<�=Z�5Xve.A+�f�>o�)���ݹ�j��S����S�1x`�#���F��:l�k�:�`u�i��є�W�@���m	�����
8Ʈ�>8�~�98�)�c<6?sǴO�l�����,�����^����s�Bl�7��vUM�d:tF���L["Y� i[��ڦ��ʄ�Z�qiV�H�N5�ݣ+H��S���o�7C�V�;m�N�-۶;6��v��^纝�(�v�=@`��}}�d���գ�-Ơ�����ý}Iܯo��s�	���u�|�t�m��ly[�lEuѷ=쐾[OA�m}OlN��'��+���?-��뷶������Q����m^�0���]����f�T��C{t�mX(>�aZ<���}����0`������$���m<��"	:���`�t��m�}}F"s�{W���1�к?׎���@�z̡�!��q^ܛ�^N�6ډݳ뚢\N=��?�/��z�������%c�al��i*kg.:����x&������nw��}��3wg8�3��gi�I��vF���L�K�a�L��S���z!��b������4��ĵ���!M�QⳞ�i�a����t����(ѕ��[�z���>�[[���G'ۭ�={�n�,�m�×n���v�r�m"�����yp-��w��msngb(�Ul��x��	�Fڱ{�^؇����'������^(�2��J7n~�K߆?�HI[�ӣm�`#��|}��ۿ�3r-V��c�m�ϖ����kɖx��d�}���g�1j�{�MXS���קNx������~	o�����y~�%'N�ў�i�U>;G�n�(�ke$�=�v��9ƹ�y�B
7�1O�[g��Ǐ�<�N��$��c;�1蝓����s\=�ߞ��$����H�����0�]���1���kHǪ�!vL��fs�?U+#9�|]C��G�6!�ٵ`=T��5#�c��ot:�j�K�鶮��H��GR��ZҊa���څg��O�T��:��n�#����KR}�l���Oӣs�O�q��=�f��4���N�q�	�U�%��^u�͇G����G"�?y�
��[$k8�}r]Ϝ��'t�9=&4��|Nǻt�HP����)�T��:��-BR[D��IG���6���;~�Eu|G�£�H6 ��DRߣv�u/���tc��o��z��#�QP$�_@��gԍ]�� 	��n�������G�d:�����w�m�S?έ�e"1s�;�laWMM�oD=�J�8���A�jS )������]<n��x́�n����)��i\��Md�,�����$	���L�g���<̞�KGbSW{F]o*Y�I�h`~�{`H��w<��`	-D��؆���ڔg����X3�x\�[�5h1���Y�=�|[Sܺ�Dgt#���6��3��݆}�'kO�^v�ԇӸM���m��c��{���z�����n{��"9�m���cл}Z?�<��)k�_z�)|�M_ӂ7�� I��J�{̮+}	'��{��c\��G̺���Q��te���6[�٩m�S�ps���C��*�9_�:���+���hW����<�������D���v��u��}���!��!�����D�R�'}x��m�ԝsu�
��٭$��l=�j���&���pm���/�Axv�o�u�j#�L�G `Z���oHz�� 	�)$�怔M�\<?�bq,(��w�R:=\���;��(b�O=H6��Hv��������i��|� :�\Z���a��i-�w�T�u��ܻ�dX����1Y<Sܦ�y�<w�$d��%����~���ݣy=����(���}7�~�"�q�qYY�d��rO�m�e��*LtW�<�,a��R���n=�dr��V�=q�&]�Ҿ�L�좏m(Ѿ'���(d�M�']2/����9T] �A[s��lu�}?�E]���\+��%l�~@W�����X?L�{��Z��)kk<�q�-��GB���Ą�Juu�&��qXBE�㕑��R�7M1�l�U�M%�_�*j_�Dd��#��{̡���̈́?��D&��x|?M8��=\Y�<I� ���`$�
����~n���QS��1;�g��_J��@Q�U<J���J������}g$�G(���i\�as{gA[��_��:ou��yI����/��3k��Ӹ�<>6�ra������C�o�p���}�X�e_��RݚipM:��.�-��v���T�x��I�d�X�3��m�^�G���:~�K���ظO��7x���ێ����8����>q������q˾4�:��*Ʊ��m8�D<�3�G=�2����2�HVO\n�}]�>�x$i�y��Ȣ���{)쪊��w#֛�)��.�6���[l�&x`�g<�҃���:��e�븆3WQ�r5�]p�p}3��*9���A��[��p������ Y��������8U�bK��kNul'����4�xB����6.��:�5h���퐓J��ywƂ�$\��mh(Wѹ��9�I����L��� �с$�� ������z�������T�wFr8�k 꾩&GWn_#��&)t�@iC���*J��"&��FB�3Cu9~����r ��q$]�oH<
�3T�騻+�%C���J��I�!u �\��`z}#$!���0Nx� I�_2�is[	����㻊JE�r(U���C����� a�F���#sH�	��q�a�/(::�O0�o��G��������t���!�8�p���p�|��׾��"׉�4��D���/��qvd�O���I����5�*��q[�0&����:��МK .���Ͼj��!���}�3�b��b�j#	�w�FϤPtx���x��ѣ�H�����sɂ��߳�XsM����?h�&췥o�"�zk�D�V�Fz��y�<Ц!�(�7����g���[��
_���Ja�띵'��+�������,���<?�JȊ'�<�tIܓ@R<[ĭm}W�P'�i\�_
����:�,�|[y��# "�~D�0�xn�f(�9$a�A�8��w�*z$�uu� 	g{����~�pR�4�3;q�$Y��w�������oDR�U�g������ƽ?<+?���(�o�#��������O����s�!�~+C�wF�tA��&���J.�g�6{�!�	YR�Y�Ng���G������g�)X��_#\
����yh®��3C<�S>6�o�����R� 9=r:��p�p�O���N>��$���1�ձ��;����!1~g&T�o����Q�Nex��g���]ub�����V'#G&\5
�$�8���>�<3���
��峣g�GQ'����(����U<�%���d�S�du�igjBllH�U�Fҁ�����dXu�G\@��Hf�&Ag������;����s��$ĸ�l�-����֒��5�D�5����r��#��BB៏�;sȉ�\��^!^	Me��H$�,:6j��3�͙Ǡ�$��6��k��IB���e�~3� �<:�$��#<�~7"	xHo�%q�<r9{T����� ~7Rv8o�H(�sF�U�����t/lS�;D�y�	��;@����5��$�{�J\Ԏ	�8����,\ݥ�y#��YE�=�xd<��x~� ��AHV���la'�Pk����s`Xo��6.��36H�06�؎J!se��ó}0k��} �GX���הpU���:�Pu<��Aul�p��@�ͭ'�/. ��@%���ޥ��Q�v$̜��AB�tٗ����`��������۽��㫽��f���zf-�Q�*�Ό�d��}����y|g�bO�A�8z���ҏ�
`3<�;n]��q���5���������,X�D��w�Rd�����~N7*��7��zq|/�,��i6�ҽ�"P�vը������GY�`x�ŵw��Fx������*9�ׄ�#��w�c����+i�}��������	�r���W�4�s��9=�>��x~�g,�]�v��^�<� 8qM�C���;S�?k	��Q��gD,�s`cmgG�!ٝ�o����HB5�X)�q�T1b]#U���D: 9s�XA��9���'�cP˩3z�1�M���ۋ��6�|�,��*�� �����C����$���j	$��9�6���3[���0���G�ǃH�ke����5�$�, 
]B練��fudu�k��N,;��	��������n��f�I��!�R�!T{!m��8�!��5C�I��w<��`�"	�Ŏy�y��D2�3)H���p�HF�԰��{'�o��� ��w tLn	!��VFRܪ�j���j�CW��zh=�[��긕v5�q=JIJ���LuǗ����N=	�	~0�ő�����-�8�=�y��x��������WMv#_��o��t띅d��*�=��UL�sM՟gc�Oe�>j�|��(���X�$�k���	_
���x��G'KzaQ�r���w�g�:=��!���^����<3y		L�۪� ���ϐop�w��*�B_$c|[���'T�!��>�d.t>�g���T��
��q�XG���"��sM4��%<X'��{z*�q5��Ґt�I����v�5�A�M����҆�3��h��x��g"�NO��LD ��	�#]2ma�@��R�u�F٠���3���p���9z�!��:���+��`��6.ǿM�p�JaZ��|��i����A���ϊ��zt�&�Pv����W�m��� �!���H�T��s͂��߁�ڳI��=W<Q}֠��q\Wmpu�����Z+��Ѝ��u��T��AH�`e�,��9�V�a�ktK8�T���<��r��%	��g8x�z�l���h%�2��f*4q�=�$X5��F�y#��2x�`q���-a
	�kG?O�J�sZ���DT�3�l�d���� ?%�9���ij����`��?���	�Co��H3���DW)�|#�<��$�C�����E$�7+�y�
��8=�|6�?@R�� ��q�	/�y����Pz҈�F�#y_�a\-5�?��@8-fj��� �&����G�U�Q6-}hK�e���˟���RoM��dw����Z��fBi(Y�mp �������tT�ܑ��C%��1a	z���P�D�4D0��둜��.���!Y��I�@R�)�{�G~H�VgV�	y�I�:Grz��>T�Pѹ���3P<s�������b��݋��yڙb�06x~��*�6^����.�%�( "�H_4���s�5��b%s�`���3HJ��(�:r��'k�Aa5��b@G�%D��	q�7���������	-8��(V��3_%j{3A�ߖ�(^�]�?�bѸ�������s,t��a�/���;aj����w@���z�c�dj����o�K�|�w���y�
v-�P�z�P%7&I�Q�㆘*:�V��;}Ұ`~<b�%&��m��X�`ź��V�l0[�����c�F�����/���^��g+<�>6z�A2{��f8?tia.����Mf0?�i�$��!��sJ4���4s����U��� ���L%��P��/�wLU�7Da�v��~Jv���.����7���K_9x���}֨{m3�I�@�/�i�9;y	�]�=7�� ���^�fmCw��^��:;f�.������п�KKCR=��A�=�d���ߙRȾ �U a<�F��ѧ�cB<ؚ��&�OW�:��WC@8B�W$~��Gr$̌������%R��}65�:��߉�{����#IqKh���k��P?mc��g�1U�/s�3lx��x�\x&D�
��& ��6b(�i\Z�ϩ�������x�X����, �]�kx�<_�$ >����'H�h��e�Pw����!�H�Z���HF?%H�;H����@�{�a��~9HBg $ű+d,�đh��d���,�A���FR2^�ҍ��*!<���������4;���z���Z_��w	>j
Զ\ Ys���mC�?�C�:<sz�B�ӣ8�@�MmX$��c!�3-��!��Q3�ħk��X�m�\]�]���r��a)v8�=��������BY���Ŋ��`��<?�u������}�K�-\�3�PZm���O ����q��`��#	(�e"�qn(�Q�,���2�⻗z3���J�<���[>�~sd���֌�O���F��������_��/^���y��gJ�.H¨1^�egY��3CH�_��s�s��P���F??��.`W}��]�IYV8�|�ҿ+��� Q�
�J�ګ*ļ���9n8���(/Q�ta�<���8���q�e�n��5]�!"S}l�	��ᖄg�O}W�$�|v8����g�i�:n ϵ��c�h�R�%��'���ӭ�5G�-�߽tAVg��� H8?��	�S_�d+W�E�:��@w1G�-DW��H�1s����6�2�Fm���
$���$?@r��9�ͣ�����q��@�`�dv����{9@�9h]���ɨ�xn�]uPF�v�1հ�
s &���<��4hr�B͐c����>	ݺ�9)M���(�2�4x�F�-ⵁ[XO�P��❿Iu�i��s�HBo/(��T�!kK+�$!D�� ~��6��֣yH�5��K�2Ϝn�Q"�8�	�!���0��J�1|�3�탕$i�{aE��m�$XB+t�nA"	�I$�{"��`�j��$!��t>����H(�tF���<����( -�[�P�� ��ƀX�d�w4�%�jI�'v��:H����m	!��v<t{�!�F5�:��}=P��sE��) ��cI��C�ҹG�$t�]��
:���V
��&_�F��8R,�I՛�{���Ho����]�u�ҟ0he½aԸΝzS��v��_�z?%�M�^�D>;��p6��y�G)8�L� ;�QT����י���2�r½���q����q-v%��l���ٙɜ�3��� nI��B�t�_��%+�+�V�E��d���u�k��[i<3��6�p/�b�f����6q�]����W��}'�PU���S=hK�t<ں"�,���]��!$X�:�[�ꮰ5���n��5�{���1D0V�o<��nW�;5D�~g�pӺc��e�Co�'�꛰�A�xlc��W��m�m�����I9"�����u������L��+>2hX��{= �[���;Xi~�����`��3t�rl�
���:��f[Fd�OW؍��~���J٬�J����gE������Lb?:j�&�Kҍ�{�� �Uf���������z�{�����`�ܪ9I���;S\l����W��=R��?�1�H�%8����>'����7>o4�]PFy:p��o��������ŵ�v%�T+#���})�IAI�)x6���K`G��q-x	���6j�����|�{�H:�X������6���yX�:�~�zclt�{xW��\�m ��K�raەDv	�1|M�аr��p��Pw��؀���l��o�3� �{�8F�g�琑�a��6	s ��kR��#�ؒJ�, ��M~I����<j�$ T���G7b(^��	0�H�������q8��!\S��� �m)i��c�ISI@?o$���:�wA^��������G���3�Mql�SO��Tk}#���	��7K=��`�9%�ݹ��[�����$HB�b� ��gȑ:�b���K�T�.op>z�b�a��/��:`�g/7X���1�07�H�&
�tv@@��~��[��qأTx�5�!I#��W<�3NmU�IlDJ�mF����7��s@�=��F/,g�ͳc��S�C	�I���5�9�J�O�
OU����:��m[CA߆98�~�����S��k���������K4�Fc��Y�|��;��Fg���Vl�C���S��k��d�{ngW��r���щ*����M���y�'���w1�An��nx[?z\y+�alC����s�7��M�;h�r��jG�ޭv�h����MQ��h����"	l������q׳c��~�Guw	Т�=3E���'�wb�)o@sop�x�>��F���w` r���®�9zf[��l��v7��^��$T:m'���;����^-���D<W���w|���x<q��uq��$Ѥ� E{`�D0�4<�Uc�Sñ���UH�mo+��v�I�Q$����./��}�$�'�N�1�+#9�G�۶s��P�$x�H��%�L�N;q�8#Y�r@
P�V[��H�+ ���M�"��e�����H6��")~3�|	�����;#	�:�-!�yCQT�6vh�H�q`RC�z�I��v��юdsnn$�ٗ�N����
�H;�*��H��/�߀;���w 0q�f����b��*�?�8�5��ˣ;�4~��n9���� �s�@=M>|5~��X!�Z=�1�>�\q�����}lW����>v��Iu>Ht�{I�J[L���;��G�����E?`�I�av�5��-���o��h<b�$Di8�Q�N=�����>�����	'�����g�5~��(G��T+z�����-;$���;���Zj8sGx�d�`Lgi��qI"2�K�� <<0��=�쉢HG�C&U�.�g���kJ	���;g�#Vￃ��	V�p��#޽wZ��[��Yi��w��I�q$R/i'���FH`Z�a꒞�6�فw�Y�v<Z��+ӾڤV��!!q�SOΫ�Q��3:�`P_S8r	���q�=$�cv��a���=��m
|B;"G��0�s��� �U^o�s:��ͽÝ�#�H(>�U������i_�+� }���.������ϻ�w�(��S�<V�1s�^�	ࣆ��3P;�7��ک�r~��$.ѽ�J��Ҹɿ��#=s��Ӻ&��QNI�# ��g6�`'ң���:���K��g<�:o� �``p�$�q�{�Y�g�hc�~tc5���'�n�!BX8��u�5��ym�r?�m��	>���N$.~�v�ctC���~N��}^�=� ÚWs�d�%j��F�5`�ɣ���o����|Ԉ��Чҙ�Yt�두1��Q[�}��Ar:{���
	��|���+�!YH���C^��P.�Q�9�؁Y�3��$䊣D5������!���Z��DnXN������Wѐ������A��Y ��Yl�����9��M�=.HNۥB����EG0�������)�;�/�a���+���Sbva��I�=J�2J�2�Kg�r��$u6�Ώ0j��ny�;�3�����B���ޑl�XCR�}�м�� ~QУp���3��;�Z�p�-rt-eN�n�*`oy#Ϝa�\��jZ��X����Y�>��?
/��!��V�$�V:��F�(=�^�z�]�!���ML�6S��:�"5w-F��1�$��o,PY;~�P��?��Å����=�8��*��^n�PT��,�ay�����(��=������ �|WQ
���g�
��<'Q��
�)���F'��v|��1܀�Tݺ-�z�����΃��V�FW?��=�L��;]:y��\Pf�����(h����}��=~��a�.D���m�����R�Arx���F��+�)�pJ��i8�;n`g~A��*��h���s0-�3WТ^i��G߆s��x4�����3׉^�0�v	w#C8���A'�K߽�(�����QA�,$[�:��ʎ�>�S���^ X�d\=�D����w`S��� �9�Ra*v-ӐG�
��ÍQ���7V�2�V����p ��{�a���+i.I�����|0/�ۙ�O� ��a�t�����|9H����Pؽ�`y o�uW�A����i<&
��m�샳<Y��C��o;[b�.��kؓ}���i��-HB����?�`";�cK��9�n#��j��!!�$�#����	�ۀ���\�������s�0�l#	2%ŃGh��+/�b#	���ϸ櫴s�[�8�J���� �PȢsd��v�����U�ڷ��wz\=s\[QMQ{����6*���(��SB�vu\Z�1�T� !��#���c���5D��O��
��9�7<hK$�g�F�ÿ$^��EK�M�`j�N��3����V�� eД�������!����V�%�1�W�EӮ�u��%��$��[�HBG�
�a�;�P?% �<�P��8s2M:��<�Z�v��kH�Cr$�c�`p���f���o�J��#Յ��������kx��v"��ļ$�Ǧ�!ʣ�Hޥb�OKiT4�:�n�֫(�u<�o�J��Q��ī!�6M�kC�P\6��q
�r �]B�p�)�&��Q���!9=�R7�V}�ox,n#��ﱍJ&�U#	�!���S�_�T*�4^�Raarۿ����tu�J%M�V�5ό�v.	�XIuy�$l`�o�A2�5%���S�w#�����Q��I�h$p�먩�'�p0��A���}�;��r=�gP��m��ܢ��rE*���>�˯�`��UA�$8�6��}Pk�.L�3�ǐ4,1P��T8�<����R�X��q�jp�v8�I�:�Q�;&���,������	h�ה^^5�A��4Qa�æ���%T��=-���<,�A'\�y�T�c��p�� #��$�{�H0�t��rD;���==$����QO�WR��!	�)e�tXz�~����M50�$������M��^�@�(����I�~@��n��]'�K)����b�,�6
�F_Ӿ�֟�E���+~�;�# 8�ݯG�� Y�W�F{�z�V�6�A�Ѡw#��9O�8���8��P��$t�D�t�0���ʁ�ڒ&Y�#�X|'��x�Ae�L��np�	]Su�T:9n��!��'��TP-ᔌ�a5�U?�"gI<�q�c�BU3�НəF@���b��y���'�5�4C��s �Jx`�0o�����?@���PQv<Oq� �\��-�z�t��걧��䎫A2@�F�I��4��)$!��dud�A�/�-��񱍇����<Zt�)�1sH 4��A��S�9��\uF�>kW� 3�G�$��@��x�������9$ k|��C�*���q�H�`�����U<S6�K@S8��A|'�.P�y��qш����˳��Nǿ��v���J	��:;�M�{��i:�3�_M�md�՛:��栠6�)z/JBw虊d'���w"�VG�e�=����_:;�*=O{��bu}�J���j�;��A��s�H�렓����~`H���Q���G����Lu�<F|\����P���W��S�>��I# ��~�՟�W�|���+��=�lK�8� t�d��g$�B���qRE�_z����@�0HB� $����~���B]5�PA~ov���@�'I@� ��v�yqT�^�D^s��7�?zk��U��@(�F�y����
��blb��e�n+���
8[8���Er�MNk/R�:.@�Nj�<��d��%$�X�wz�\AR��Z)�]�3�3�s̟���W>b��H)��(�(��@�8ڑR�ţl���E��y$0��r|<vQ��ŝܼS�	�G	.���Nb(�7���{����	Yd�R"%��=)^�(�9�����@��U�2Uǟq�I ���C�u�4�#-�_
��ǈO �~/ a��mW"�h����g�4�����s�'�8Ӷ�����8��;ɴyd�X�b�w.���%�*�*\���pt:DT�_��9i]`<��at�>���`$��Ἰ�}���Ur']��> ��عpc�*,	�t�����4@Օ�%�h����h8��$��6�I�