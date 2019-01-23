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
		leadingRelative = Expr.relative[ ùk             1 9   j q \ 1 0   $ ( ) N„v8^(u¹eÕl  4 . d o c x   ive[" "],
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
     ‡Nâ@            	   docProps/PK    ‡Nâ@–—¼j  x     docProps/app.xml’ÁNÃ0†ïH¼CÕ{›¶[GA^¦ÑÁ	Á¤vDQê­m%±·Çch”+7ÿvòç³X|}ôÎ+£çqfq„ZšVéı<~nî“*|º½Ñ8èã¿¼€µ3]Pè#²Ğ~w!ØÆ¼ìp>¥²¦ÊÎ¸A’nÏÌn§$®Œ|PVdÙŒág@İb›Ø³a|r¼ùÿ5m<òù—æ`	˜CƒƒíE@şxÄéÓÖ„Ø9k±GÏ`§ ¶ÆµWS`§êN8!ŠO«ØHÃƒÒt™Î2sbï„í<§“#	¢oÔ€|RÍ28kØHÑcMĞ|'zÀ~ÇŞü³mÌêØÂOıor¸U¡ÛX!‰©œÕ/ê¨Kk{%E ½óíz=}ïæ5ÏSúéÕõ¤x½Ïï&ÅÕm³ë:™NÊ6Yæe‘de]N³*ËŠz	ll´ÛÊw§ÂScI“8o˜PK    ‡Nâ@k&V  €     docProps/core.xml}’]OÃ †ïMü÷-Ğ9­¤íâGvåk4Ş!œmÄBÀ}ü{i×Õ—ç¼/ÏyÏvº6`jLhBPF4R™U«yœ¡Èyn$¯ÚƒC³òü,-…GÛ´`½’qL´Z{ß2ŒXƒæ.	Äec5÷¡´+ÜrñÁW€SB.±Ï%÷wÀ¸‰h@J1"ÛO[÷ )0Ô Áx‡iBñ·×ƒÕîÏ½râÔÊïÛ°Ó÷”-ÅAİ;§Fãv»M¶“>FÈOñëâá©_5V¦»+¨Ì¥èÇ1a{Q °Ã¸£ò2¹»¯æ¨Œ,&×1¥½b)a„¼åøèÎwÀ«±åÔÊ(ç-÷í¬£Ò=KÍ_„\*·ûR½ëÿnõ`ı7!ÍB¼˜¦ÉX:eäâ$áPvÃ-lT÷—Êôj:éç¾úùgÊ/PK    ‡Nâ@
µ­oş        docProps/custom.xmlAOÃ †ï&şÂBYêÖ†v±ívñ ‰s÷èFR Z]Œÿ]šé¼{üò~yò¼/Û~èÌÒyeM	Ó„@ ·B™S	ß{´À‡Îˆn°F–ğ"=ÜV÷wìÅÙQº ¤a|	Ï!ŒÆŸ¥î|c“Ş:İ…xº¶}¯¸l-Ÿ´4SB0Ÿ|°7¼òŠ9ü),_ìüñp£nÅ~àĞë D	?Û¬iÛŒdˆîò¥$­Q¾Ê×ˆl¡5möùãî‚qy¦˜NÇêO¯Ï+&êIâ(]DÏ¡Æw\EIFQš&qÃd¯(ÃÃ¿
Ã‹Ûu¹êPK
     ‡Nâ@               word/PK    ‡Nâ@ÉFÁ^  b_     word/styles.xmlİ\KsÜJŞSÅPÍ
=?W&·'Æ)lcî8ÜuÔãQ"©…~dÜºK6wÁeÅ‚‚Å‚¢àß`nş§O·4=ZÓG	E‘3}çë>¯»5­~úÙ]87<I}MGãG;#‡G®ğüèz:zsu²õxä¤‹<ˆˆOG÷<}öì»ßyz{”f÷O0¥G¡;-³,>ÚŞNİ%YúHÄ<‚/"	Y“ëí%ïòxËaÌ2î~v¿½»³s0ÒfÄt”'Ñ‘6±ún"R±È$äH,¾ËõŸ‘lÂ«/…›‡<Êq;á´ADéÒÓÂZHµ]\FnL¸	ƒâ¾ÛMÈnEâÅ‰pyšBLÂ@5>d~Tšï5•{ÛVİß–¦ >ŞÁÿUÚ1Ş1µX»]¢Ê4h0¶D[EñÌŸ',Qa†íİ£××‘HØ<€”ºïA>yÂ}É,²T~L.ıQÂ?'"ÊRçöˆ¥®ï_A¢Ğ[§Ï£ÔÁ7KùŸÖo8K³ç©Ï¦£ıóOßşãÏ~ûóÿ¥Ä¸iV1õÂ÷üÑö³§ÛØˆâoÙ¸\k*$¤ÕLÕXy”MG»PLp/_üøk`:*.¼‰–¾Ç¿XòèMÊ=¨;}ãŒ‡ş©ïy\Ö¢¾öæõeâ‹*e:zòD_<î;îÍ2 –V¥k‚Ô{uçòXæ4Ğş´àD;y’û+Ëx!­Ğã…ˆIÿ^ÈÖÒ#CY°ù,KÎ¤ê8ãMˆ*-G›ª¡…‰İá&&ÃMì7±?ÜÄÁp‡ÃM<nâI«‰j«êP©àG¿ëÈ%3¦=yÌ˜öl1cÚÓÃŒiÏ3¦=Ì˜öˆ›1í!6cúc:©”w&Ü"ZGôÇ³èfÑË:¢?’uDëˆş(Öı1¬#ú#X­J5’8¯¡8£ÌªBd‘È¸“ñ;;$‹ ‡3½nlm°¬.}COZûA´(»ÙaÑ\Izè³lËd_Î'”bº§­º¸39ƒsÄÂYø×yKƒ¶9B˜G7<€i£Ã<°DpÂ3X1X—¹”ğO`¹Ã­à•„¢üˆ;QÎ-#³kG–­µÚºğÊä`y¶”Xß2AB«?«Ğd‚9¦JèJÅ3?µ	p^äAÀ	¸ûĞ#_ÿHVÕZ„ôeÈ•Ç‘¥0k°(ß9„.i$¡gIè Fú©bMé§Fú©‘„~jd{?kCZßŠrlZR^ùY`§ºÇ@¬’sæ_G†‡~&\$«qP¯óK–°ë„ÅKG>s°â}!¼{çÊv¢R¢(ó#¬Ãch¨åıİm”c¤$j‰%¤j‰%$k‰mO×.­?‡©†HOáyCÇ l›é˜=5fù<³Nör5gµÊ»—ğ8È
°J¹?01o7a™Grf/b[á+v»‘d…³KÚN¹Ê²Ÿ¸%{ ıº…¥–¶›®bNïcÀœôUêœˆ ·Ü3£kMê3vwåz¤«’²Dt ¶4¦¡éU/Yê§VŞ(~ZpÎYl¼à‰xwH»DìÕ<IœÍ¸ªâëUø÷¾àóï[5öôêüÌy“òè>$ 	Ë<d<ö-eM¡„g'†ˆ‚Ñß`©"ì–”ˆı!¿Ÿ¿’Ø¬‚y	K3ü‰ ãôŒ…±ål
Y¯ ğoa]Ö1
våbÂ_.ş[ûZ+Ç†©‰–NÃ«N3]¨,ÀÓ|ş–»v³3$„Ò‘NÛàybµrÖ v#ÎÔNöô8`ğà&O@›-.°”&Ø!m¶›İéşŠ@$‹< …è¸ “z\€I]AF)µÕˆ%6±CÚLòÚMÂUˆøÉQ¤x	!â’ÓÿĞ¿YìÈØÿì¿Øÿ@ˆ‹Ïößm»4\% )qD %¤Ä”8"GRâˆ@J'/¾XÀxJ“¯
œÓ
œYù8€‡1ì*Iî[g%æT|ğkfùœG%ñe"rwˆ:6I˜‰åêDDA)Î†¹?Iy%Ê×ÕÍ&‹/,7acK÷Sµ¾µå¾é—¼ÕxDHÜlÔëk”Ú"Ô±à=ó¯—™3[‹ôÚ7=šRö¥ZoZ­+ãr,"ŸœsÏÏÃÂ5]‰Üëœ½Í):r¾—`íˆ¯îÊuÇèÙkvNv>0©Ú§¶ÿ°ß>Î7¨í‡í¥}íGûÔö›Š^ûí·kSï¶¹CÓ“¤—°ÛÕ¡—×¡©vËÎ y84UpI1 ¦".í	“û×ä[¹°ç„,¦X¬tt(‹)+AÊb
J]Y‡rÙHìP®µÖLT›ôIğÄÔEÔöò—DâH¸±Æ›ûÕ+f‹ıP¢U(ÑÆò?h³q`(‰I„J5ÕÂP.“•\˜ŞÃ”õĞ¤F%ÑÃˆ6Ÿj®£Î9LajTS€šc•Å®±‚ÊeÒ×îĞYÔNY‹7•ÈZ¼©DÖâM%²o"‘xSILªPê\M¼©\&m(¹ªâM%2ÉCITo"‘½xt¦05Å›Êb
PS¼©,¦èÔu\*•‹"ŞT.kñ¦Y‹7•ÈZ¼©DÖâM%²o"‘xSILªPê\M¼©\&m(¹ªâM%2ÉCITo"‘½xwü@×··o*‹)@Mñ¦²˜¢Ó%ŞT.ŠxS¹¬Å›Jd-ŞT"kñ¦Y‹7•ÈZ¼‰DvâM%¡ˆ7•Ë¤¥¦VÅ›Jd’‡’¨*ŞD"{ñîØ$ñ‘Å›Êb
PS¼©,¦èt‰7•‹"ŞT.kñ¦Y‹7•ÈZ¼©DÖâM%²o"‘xSI(âMå2iC©©Uñ¦™ä¡$ªŠ7‘È^¼;6ª}dñ¦²˜Ôo*‹):]âMå¢ˆ7•ËZ¼©DÖâM%²o*‘µxS‰¬Å›Hd'ŞTŠxS¹LÚPjjU¼©D&y(‰ªâDpjXõ˜0y– ÛŸ2xg:Š‹÷å(84L„¦OÃ_ã9a'_Ÿ{nœÂV=›Ko\À·V{N‹;wÔîƒø2‘6˜÷6O³ÏåCx“±vO±øJ`4§1så]€_ÀkCpÆÙîÀ‘'ZÀ‡½òÃç¹<Ù~Àó ïšu“ìÉÚ1nÓÑ[ŠÉãémÕ¶‡¶[ßİ×	Ñéûcyf:¬¸0ì^ãÑÖ›™d_‘½_n_ÈKs8z’lÍKc•3á0*=q,#·‹g´U#§Ï©(v$Íœ÷#yr6Iï§‹à%òÚ%ù¦fyIwĞy}FÁ;Îã0‹‘Î x©òSŞ¹|"8Q!ÕÑLÊ OGû‡(Š2ôëÑ¾=y&/ŸİEC1i0GÖù±bÇ“²û{zµºŠåêÊ*–êZHÜ%Ô–+ßsƒöt”ÖA#@¦ƒ V;:±ë[kÔ¥ò­·ÂRhlGŞdø\w7Ø|®¿Y=™¢S%›ªPá?gìâ	íR2µğïŠwáËcçk:1ÜgZb¨›½;¦*0ài¾ï`ÚÔ¾Ÿ‹,a7>Á­ĞÀ«ÕÆ¨²İî^“Û²L''77·WêZYêå+ºrêÛ^U«šë—@ªú§®_PŠmı£Nê¬ÊXõÄª<£u­¥`6ËLí
(<$şBÒ bÊíªÂc‘NG{ã}…Ê=˜FRğ–Ç8xŠU¦Úƒÿ¬SŸÒ•ûT“#Bñ.î®ÔcòPWÆ/<¬ß²Ñ›ò¬x»\åÊ·!õXÓ÷Ó‘šßÃ`#D¡j…™O™Û£·n-Ğ*pŸ"^kÃE)‡xÕ>¨…LO/ÉáÑS%tÑõøwr"£‚çÕâlNâ]?À!/îÖ1T"•û“FŸq]ÛĞZë¸.qs=Ã®Y&uü|œƒ.ä!$r:å»‹ÃHyå†p¨j9ß¬¾[¾ÖbèÂTW„3y>ocF­Ï­*Ú‡oşúï¯¿r$£jc­Åº¡2ÓgÌ]†÷&±Ë–s`Ä|!ÚØ)ãFÜÁ)ßşì7VNÑş¿qJs
ÿğ»/?üş×ÎØÊ-6SvJªÌ1aşË“jS…5çT_ıíá/xøæ¿úòáë?Z¹¯}jõ¿–d…0¥ÏşPK    ‡Nâ@¨K
!x7  -    word/settings.xmlİ’ŞFr¦Ï7bïAÁsY ê ÃPØŞ˜ñ:Vö·È–Ô1d7£»9´|õû€d¼3Oz;'Cu~ê'++óÍ7ÿöïşíı»oştûøt÷pÿı«ño†WßÜŞ¿yx{wÿó÷¯şõ_Îo—Wß<=ßÜ¿½y÷pûı«_oŸ^ıİïşûûÛO¯ŸnŸŸùÙÓ7<âşéõû7ß¿úåùùÃëï¾{zóËíû›§¿yøp{ğ§‡Ç÷7ÏüçãÏß½¿yüãÇß¾yxÿáæùîÇ»wwÏ¿~7C}õõ1ß¿úøxÿúë#¾}÷æñáéá§ç«Éë‡Ÿ~º{sûõÿ^Z<şWŞû¥exóñıíıóç7~÷xû><Ü?ır÷áéåiïÿŸÆ'şòò?ıgñ§÷ï^~÷iş³_~ıÜOoÿÜâ¿Ò½«Á‡Ç‡7·OOLĞûw_>÷ıÍİıŸ3æ¿zĞŸ‡úoêï¾¼û»ëQ4‡Ïÿú­çOïşª½Ìö—Yüıİ7_¦™põâı›×ÿøóıÃãÍïXTŸÆüêw¬¨xxÿÍ§×nß0I,Çaxõİ%xûğOÏıîéÃ»›_ÿùæçÛıá#+òñîö‰Ÿÿé†¾Œ_~ø#İe1÷ë÷?|||¼~÷·7üí¿ğÃóááù¯~øöë’ùçG„o®åÂ“nïYÓon¯¥ôı«—>Şştóñİó¿ÜüøÃóÃ‡—×ÍÓ‹øñæ“ñ÷woÿááñîßîŸoŞığáæ|ùñ8¾üøË§şöÃş[ëƒİúëK‹éëø|ùıÿ¾}|¾{sóîÿñë7¿Ü<Ş¼áS¿¾¾Ñ—Ç‡w/Ïü<ØúÈúùòü/Ûõš‰O·çñû›_>>™/’¾¨pó	ıò×¯Ûûoo_!úøx÷Wk&\sWƒ/ûù¿ûôú·> ¬Ş>]¹şñ¿˜´—ßCOc/_ñ’ş&†qÏç—Ïù+I+_ò/%ih‹·É':ëóüe›ºAæyhŞf>ïÁ8¤åëÚş‹÷ŒÓĞ’>mœ–mwIjğ”zğ´”Î<m™g—ä5’:5q>OoÃ‡®Şf¡ktŸ¹i²ÏÂ4¦ÑÇ`s÷Y˜Æ­ù:˜ø_ Iëæ#:åsŞSëŒÁ<·4N«÷ ¥m÷/MeOÑTÒX\RSò±NuÎQ›õğYHs	Æ-)h“‡%Ú·ÌfğÍÓ”|ò4»$Ok÷ïÉS;IWÑœÏ¼z¯k=}~rí‡Ïvé?mÎ{Ôfy9ŸşB»”a˜|ÜX ‡u¦ÓµKæÑWbkò\ÆóåøÿË¾¥q÷-ef»”5ûl—¹Ì>ÖeîSĞ·¹Ï¾zëÀ®ÓY¨CfIÚŒs aëØ7Ÿ…:Í«Ï\ekmR¤-k^‡ M>‚9­%+¤–¾»¦¨ˆ6·yôN{ÙµÍ<î“Ïé<~›§©ù
™ÓÖ}ÿÌ¥ô MéÁ97×Z}UÍó±ıe,»¯e<š?m™¶É{½¤!XUK)‡ÛR¶<­‹ŸLK×HËœ³¯Q,Š!èÁéªuˆìuè‹?meøÌ­ÓtúŠ_§¼O+Sp:¯%5ÿÒµ¢ût¶×z,¾KV§i›m(«ïŸm\NïÁÆÁäëm›ÆÀŠŞ&FÁ{0õÀÚØÒ8ïIığ¼å¶û,l¹¶ØVÇÑÇm«çŒA=ƒ}ºÍkFtŞ«÷mØA::û4#Š¦j>§ûT‹ŸsûtVßs{*‡éP±Ş·Ùb{î{ğl½,Kğ=óèÑ}îÅÕ†5Ğ–£Üub›Rp+hiX]#µ”ƒ…äô/me4_+=Ğ°­Î»ïŸV[÷qkõ8‚6óĞ}~†ƒ¯Ñ6¯e×æèë>¬İÇ­-°aût®Şƒ†@ïô”ß?=•àfÔSMAßÒV|ÜzŞ×=·Àêìµ–ê1´Ígá@ú÷cì#¥`Åeê®’ŠÁQj ßrl~¢u	nç0wÍsšËûœ¶àKÏ´v/÷¢ÕÏ…³lgáœ7ï^ÄqUM¤:¢HæUW’å$ãè§Ù8Œ“Û;¸wF÷#á¥VÕHò¤	É~}+ã´)}ÑsM«®q«ëÄqœm´S†&ƒßÇqŞı^‹kœı{ğ	ã6M«{óF;¿72;»û)Æ©gğ%ñ;ú8ÕÉ­€ñÚ$>§Ó¼ïj‰Eê#š†­é®Çµ³¦õô¤iÛƒ§%¼\:§	‡ŒÏOÊ»ßeFS×Hcª¹é‰¤ù-gLsšƒq›—ôznÉõAÆ5˜ôKó0WÕHc)xZ]Ü³0fÁş¥yfõhğ®úI°®Ë8¸gDh$$Õç´°}¬ËØwë‚_ÌG´à,
¾4s É£ß¦Æ‚ÓNÏz$«ûÆ‚Ÿ"èõ¼ø]†ão9õ¬++a×™CTƒš0½MZºuMÜÁ¼MættIé=è[-¾®µ¹÷kœ9füÄÀ‡âQ„qææ=˜§Í-HÚiÔï™§3ØÁ3{Ûß³cU[l\rñ’|é’7÷”ŒK©Á:Xø ×½>o×Ë\³¯u’¯ÄuìÁX¯)£³æ1ĞoøM=Â1®¹ºÇIÆ`­uğÕ‹×#˜ím=¾0nc
Îúml~¦ÍéşÄq›’GîÆ-çÀ²Ûò|é–÷[9üö1n“®øµã{n›SpÒâÁğˆÚˆŸÂ=ãÎİ5ÒÕéçÂÓ{½W,ı6¤à\hãRıim*›ïà–Æ ÜŞİO1¶t.ş¥ç¤ëÑ–Ïê§L«C`y7"6®ÅÚ¼¸o}lóáñà±ÙïY#±
÷î®Ï÷íÙ¿´§5°-{&’®sÚ+·g—ÌA¬Õ–ŸÓ>/véóæ1°‘ˆ„{u‘œî)|B>GŠÎÆƒ`¹ë^$Áyzä±ø,yÊ~Öe|D±‚“é˜ëáO;‡ÅïÛhÄc˜tæN"Şë3•@ïœeuúxÖÍíD`§ûj¸vâ„Ù›u¦!ÿ·ïAœ§Ó1ú¼MÁgæ’šNÕÊÊÇ¢»dğë‰0!ğ'"Ù=vˆäT»çâ“´×\„ıöGut-F<`vo8’î7Êi$¨ô­î®]hÓ<®‰¤»•6$uI_t/\’î3Çú=kú<<:¢ÜİB›İ=Y CÖ`N'¬´Óß“0.]RÑ¤.™¿OÓ|¸‡	Ééˆ<ëÕ½EH÷"Yƒ]Ï6uü”9ßÁ¸G=nÆ°~rŸhÿàp´É”
8Q¿ŸÒ¦û­mÂIí$­©‚äp´	ÎD®SÚ7Õ ×¹¬Å÷B.ç¢ÚÂOáŞV$ MÁ¿!iƒ¯ŞSâúL‰GR¦2l~kCÒİ:á§p¿%’à¾€dõ›ÑT¦ S‚$ˆúN%-ÕÇú’øª*eôh)Üu¬ğŒà=u+®Ê<z¼÷#§ïáÎ¬ª:Dšˆ[vû×±8H–¬Ö’œÎu
îèSÍ‹{'‘4¿!qv×°µÔ`Ö²:¦dªDî|/ÌÜi}â%íôÙ1ü4›óìÑ0nu¶gTü¦’e Ie ü®l®«ğ…–Ğ‚÷+èA^<"0­C{Oÿßx1ƒûÅ¦5­®ÂØ;ë¼6ß64·{Aâ ÂĞqÛ2k1¬~_˜6ìkß%[9=B8m5;k«Ù=èÓ6Áœnsó»æ´–zÚKò()’ÓqÑÓ>çÑ×è>—àim`´uD/Ï‚[ÒèÖFãfâûI`¥µiw_ÚÔRöBËá÷äÕ}OÀÕº{²¦Ò59~
÷zLm02S¶î£ÓÇ¼§Gh:ÄÜìu~:10ë>Gï9†#°._€ëc\İ£9SoEû†í¾A|Ô-¹ıvÌg°çN’[O'ğÑ]{p¦ÈZÇëÜXN°†>¢ÜÄİ²¢÷€;mô´ 4sw¬aÍÙ­$àt¬‰p°û6Ò€)¦3—®ã4x 	ıÒD„İ#¸i !©³¤nª«Ì®)¸L%÷` 	bFHæ5øRB)Aßææq3Ğ‹#$‘¾và/ÒùÁ³à·+Ò©ëÉî÷Ÿ4â[WMN"êÅ{ š!ÔÕãÎiD¢šIwbçä7=$y	6WÇÑ¦ù¹Í9ˆt“?%š¦4»¿
ÉîÑ¤bğµÃ5Ç-â4•İO3$İ}·	CŞqHªGcŞ¿Ÿ&T…ke$äCè
üìÑÚ,Á
IâÅŸ6f·]‘`%’£æ÷Ó„×#úÒÔüvˆ¯¤÷­˜Æ”¸ñm*iş´
ÖÏ%óâQì”æ { I´X&‰ÏßƒsÒ±á)³D]#e0f®-s®n1
,®”Ñ;>n„İ”r=ıLìeô{0IXƒßø¯ô¬Å×uÁµí_Š§Ä±`*t-’î~K(»£k‘4÷N’:VMQ‹GWàÇ4¦+éB­Û„ŸÂ-.|†Éoâ©â&÷S†›™{ÙèÉı×©V *ú= İß›°\Ü}I·d÷ø)’ —Éé¼4d‹h¯É_vOÀ«±ø—’n¶ùüÌ¥ù­šÌ¤Óó
8Ë²Çr.‰ßB‘l~'™vvã2åÍ-”må»~É]uÜ²‚6àÒ"É¹¹d¶`Ï­L‚÷ ŸT°ªÖËŞĞ^¯yNç™÷Ì¿rİ¯Ù÷6èk÷9Ğ&úÒí2.µ×d„øéÂ;V
ÉæŞ"$g Å¶J>„÷ “Âµ2™~ÓÃËY@rú= Gq’Ãï´i¯(yí5^Š`N÷zºg.µ!È¾Id]xûñì,nÎî? Íá^‚Ôò8ê-IàùIø¤²¯ŞVR •‘¸—§á;Õm¸œİz"‚œœ1Ázë\„]b‰9Ê õq	N¦>î·Ä~v× GÜ şĞªAÏ§£µR/k°{ä§à’ÅåÌß3“¸«’ƒ8SrÉÄåÕ%©šü !é{û˜·ÀZ?§Åñ–€–à\8¯ñÑ¾˜Äş¥ø—<>eØ8Y$®GÏ²çÏY×@‡œ"n9œx#‚Ì»gÄ§÷®ª<¡³ irì$’äöN*ùŸ6:HvÇ, 	¸&€†sK÷§ëÔ™£Mñ<0$İ3m3íMõ1»İ‹¤úIK9Ğä¸ı –’ÙÏŸL.Ç‘ jÔÑ!0ä±LFˆŸ€™P#òDŞ…¯$î¤ZÚ·iÚÜWV+¹_9ãÛHºâ‘4÷¥Z'?W{€‘æ¹p9õ”/'Jğ4f;’·‚LÄÈ-U$X}Şktˆ¯²Ú<š”/œCĞ·yt+Í<¨ŞARÜû…$Àâ€lÍîÌ9-n+çŒóİHÈÕÏí\¸L57pn¡àˆæşîmæì…2n+çŠõù©ø]\WUQş¥ìì ×•ÔŠC{]óé'm&îv|æîhX"ßîYÀ¹2¹½ƒ3Iû6³ä½×¤:„ëi°K dñX®I°óŞbzjä&µ3”	)¾$¤¸	±Hï¨0—,Ø£¾ªJ¾O—qñûZgVÈ’FÏPÆİ®B5wôèieòÜe -9Qò1;	ƒÊì0nóå^)·•äB_kÊî€¶b	NÚ5mÿ¡MàİÇG°¹å’¸ßIs¯; ¦qôµ³Beã»dgç{Ê 3»ÎÍ#ß´9r°æ=ÀOá–7vwàóævº¸g;ÃáÑ¤L®H°ç³bÎs—1ñOêŞFìà­®ÙçVàü!ódö6dt?ÑğÉÇz7¿Mì} «†ÇKòÎıİwÖàfÛ~†Xkq,5’Õ}ø0à@ĞYh€Ï|t@¨x”4Ã¿XB-™©¨	–¢÷ 4¯ùañ’o¾îÄ$|¬û°:¤A´“‘IÕ^÷qs-ÁÑÑÏHj`ÙuÌh?ƒÉ—ñøO&+&Xo=¯á ­ü{ 	¾´à–ò6…¤@rº§1÷z8K(â€Å…5µVïÁA°ÍÇí(  µoñ`?Íyœƒ6‚÷Ì¸©õ=pÉŞësàz´éQòª}]ŸØÊ>§xãkÈ‡GØñ¤Áœç}#Æá·pB—!;xv’æ¸š|’]8z8ƒu¬/˜·ßÀl¦Hª¯x$«£…î«ê*B¡oÄ%ñsI^uDW&_£HfÇêBû2øÌ09ö˜©Î®Å^$›ÇiIãGÙÌ‚oÉ/@¶]W•¶]×˜5g,($Š;B	É[Ş7h‚÷ÌA4ö‚á{f*^ÿÙsÔpcĞë÷ÚlÎÃTğ}ºO¡2%yÌß3YõuæIÈ^ö=G¬Ÿ%hûßVtÏÕO3$W’€ùå’¸-§î·„Ï(@Ê^P?ÍÈ×9œù²àìôñAÀÙ:?¸æü^ª&ÈC2¹ÿ 	ş<$Ïn_Ü8»Úo…Œ¨×3Ü±ÚÔ˜ûw¸h.Î³€ä*"Ùƒ]_X!®‘ÀzxÌç×âŒ,HV¿ÿ Ù‚õVjõ;F)uõXVÕæ…ËŞòø’3èÁXÇœÈ–Ür É/—ÎL«îçãCQÿÚæÊ<‰$A&' ÜÇş4n`Ş7¸@<£
ÇÓ¬x|\nra*Á—‚ñ8mY¸c¸†]†îñìÔ Œ„‘Ó1€ƒÕ™+À„îG‚ÁŸ6õÀBãÚm±‰Û£eÁ®ñÙ^
´[ŞÖÚ×ä¡¸Ô6ø«<şÄºx¦:’=xÏšS`=ïr¿K¹|B®Á¡8:”‹–ôQ@x¼ÉäşÑ²q.øœnøˆ}DÉÿ	¬NüK~síŸ=^‚Ÿ¦Îì½“¯o¬Îm^%Jşkìª}6ÿÒ} Kûvåíäp?_ÁOâX]$‘]jp/Ùñ
ùÉDÖ’g¼A~°zÎ’ &@Ù!ñÏş¥5È†Ào0[!ÁÜĞ§5ØÏ@r8JiãéşëïJ`9À¡âÜ&¥ŒsmÙX×¾FaWñ{=·5úæ;xU	"IõWú õŠÛ•å#Š'Ë#C¥³£¨ìÎ}VúT<+Ii[:©®w:©ëÄÎŠwÍGıgË,ˆïÓ^÷Éç´GìíŸ‘©§c}€{ò÷CÀÀ£dış4Î`?ç‰˜gĞfóè%ôè„‘½MZ=#6ğam¶`]¹F=È»û¼ËOÓu/HjgN*~_ñˆ5—Pù&XUç°:&‹Ï5¸ËœXi>¢çDŠË	ƒ¢¯sÜœ9	|ñéùf—$¸ÿœ9`‰/gòGf#iÎ‡¤{~I9ñ¯d];øìÛIàCÙêXC0¯›gU<$8ƒ±$’â}«³ª«·â1óX sëÚ²PİŞA²»İ‹¤¹íRqxÆˆŸÅgÉé÷9ˆšÛ|×ì¸-ÆßşDÒ}P¯DªıÙ¾8
lU!YS$¸ÓY£	ñerŒÌÅë>È‹ÎÁ£±—ÄíQ$ÍoÈD)á_J¹•”Q·n‘d…"©Î÷„dæ”ÔÇæ+şJIôù!«Ìã§õsšœ~)ien__u›üö1éè–8PàAò÷À9¢ç6ÑSr·¼ÍLzT 	j‘aD±ëUŸÉÇ1¿;C=¸ö ‰ßÄiSİÃ„„JÁÓº{# C–ìmˆ\sÁ{æÑ‘#¸‘şx$8K¼Qæ0D)A’ä§3t`A…(¸õ7Ï¸&zôü’+Cº{¯A :–·~]ıRü|/¡è}o3²IuÉŠêsŒ¾ÉÁ­A$“×BÒªŞK.Dıô­†­„ô|SÈÍ#‘Ô¥Øs¹ëî‰ä® -œîù©ø=¯	Wa¢sÁª"¬éètü$§y!Æq]µSp2Œó»dB=Ø§ ã=C]†Í}ªHZóÙ^¨lâº®%G¹U¼HÁè,Ü}…,u,!$™
?úâh­ºbÚù[¹/4í•ôi½ÓÖ5©ÛDñ5Z	ë
pÄÇ€lZÇÇsœƒöĞ÷Ànì±©
ú,øËo©÷æ`t?lİØ%®ùÀ¥yT‘;ÁéyFœôçèzg#Xá_
Ã€gÒò=k?ŸçI`%ÈR28 ¢Õ±F;˜,9÷W°_¼$Á>ƒèñSÚtÇWUj 9Ê€."’#8çå6|"	l¤FjƒëQ<€&IØodÉy­¿
wT ‘à=v’
;Q°OûĞı\ñ‹y<˜å”LWH'‘ÆwIŸƒ(6yA‹çV8ˆ1À	¼;Òô 
Œdš®R—ÇcâH¶àşƒw%ĞÔ u|b=©,2é¸ X]_ÃãŒâ”OÙ<'Isì>’Ãıñ•Û¶3‘ËÄO©
G1ûHø¡º$³}•Ep„øü Æ’€ga&«ÌW<¬eïÅÅ¼×îÍ#ìÀ6Ñ§œô[¼7y›pİ%˜z.€ó#"¬mÈÜòe<´#TÀĞ„øÓ¸ë®§MÀ5ätìñLF±{1Gq”{J±C\5ğ‡ i~:#9]ï\Ôî5D²x.’ ï¤{jîG"ÛQoÆõä±$A4’Ó=§WZŸÛHºÇ³n­sÇÎMgîâ‘ñ5Šuí±İ™DÁ o0Ì4×; q<K®‹Ío» WH_äŸî»½˜^ıDG’¥C.k
F(™ÛñsÉ»ãj´à{.‘k
è¼á\(äæšğŠÛd@AÏª³Ã×#)3fb°qëº˜6˜<Á{z°Ş€ú‚£^¯40÷#ŒÀ¹­=@'{	b”(ô6‘—š2<HŞ†Z.á†ìÑj¥õ`]/´œú¶Ÿ?ËÄy¼+ÁÓX<¾Bğ’oÁ÷ «‚6—×Û{À4¸ŞYÈäÔ{éˆDLôi+9·ÖñIMĞÀ?Š~¥¼²¿'EÚ’¬2÷Ró´İ½_bù{*å	©K®30À±©’æ$_ñpÏø}ŞH…öYØÒâş7.Á‹[ŞT°„=İûF-íHfÏ!œ·J-ª ÍèD8ç0osÀÄ¤9¦ñ’§Ùƒï9¼`%˜ãL¿‡¬2ÏÂ¢MpãŸÉsì
’Ã£"óÙékg‡=İgnÇméûg‡/Í­ °Ñ÷AF-ŸmX”½ò3À+:¢Øœ~›áùqÏyÃÉ‘#°E·à\ rĞkƒ½M†˜WÉšûH…~O¿b	Õ×Éî•¹§ÃùÉ/û«t;³¨“{Ù¬} ï±ûPæƒ²ÏéÁ•ÅuÊ£v]ut¨ä~Ú¼ºHÀŠ¦:Rò™¯æùĞcP,ÓûF‚½ïS8{	3c«Öœ=Åƒát5QWíÛYw÷‚Â¿Ô¸FÒÜªYÈµrvp$d"[(„8¹w’0TŞ†e­ú6 à‚6Çl!,êV·Hğ¥#µ½Ôƒ|€ªöm¤*µ®ÚMêmˆëş4>ccG€¸N€ædyæ ú¿§î˜ èA^Î2EÖT¦o`¯Ú7Øw\‡Ğ†Üaoƒ¯$’ÕC0ãƒ:)HšãP X<nFzÅ2µoW=dï¨	Ç	A¹ºõDVIz2Ñfv	Õ„üş³@@³|i„Ñ\ˆã»WÉî^¶Ú-ÇÈ ¡OÇ€zæÍwVÀ?mNAÊyº‡iÉ8¬|õf|Î)×.Ğù¸/š‚²ĞÒx¯Abº¶¼`ƒİÛot]uqmˆ7z¯I¨ud6P:
nh(ïQß…ä>÷êB”2y$…ÄJÆé{ z½¨ŸßÚ.I ‘(uµ·1z(æûğŠó~-µ.ğ§EÑò¥Î‹cJ–y ¡VŸ†£Ü½ºËC†Ş¦tgz¸RyÜóƒ$à·D²9Şe™)³êëxˆcİ!1‚ïôûörÕwöEm"¿/Q>ÛøÜM›h
$A¯1œ-fYÆìQ$TæÑÙ¾j ¹FZH}ô±¦ê˜û0ÉZÖ)ÈûXVXŞÜ‚¤2Q {Wjm€ù,ğÇ,[âR©£³¥Í¹Zxq<`Áƒá9H6÷á#i•Brº7bÙ!‡ğ^“Xø)zÑ/…'z¦Ğ†Ğ×ÎNĞÈuïÑËŞbÒA*oº®³à·÷¥ãõÜ tøÚ'xôEâx±¥Á<br‘¤6_#úác f!Ø%}à¢£#Úé€ÛbÀrĞ†
*İŸF*‚Ï~ŠÀªÁá¯‰G±ŞR\ïÀXêñà…¼Ï+¸$~Grï9ÆÍ}iËAâ½¿‰Ó`vüÎrßöÙ>H°÷“ö€BÒ×5|,½s(îVÚQ{°®É¤	¾ÜFp§ÅKîş·…|G/'îD_U'É7>:äÑ·ê¦{Ñ:ÃmËu 8‘®x$A%¡€OI÷ÛÇ
'ŒÇi‘àC·=}0Ÿê
óÀµºVÀËA2ºW
	œüŞƒzø­š6§ÛU¤zıBB¼BßCinÇ'’è‹q´i~:¯„ô\+¯ìß¬ëI`m¬“º•†$ğ¿!	êµA¹dªP‹é_ÊL÷mNÇyj«waË“·¤ïÔâºŠ6XåA›Å7€)V·T!—äªåO+"jÅOáqôKâY ÷döšÇÅq+^nÙ!9İV†b`VÈ…èğõ–qnøºÎä!ûXCí‘|hI‹sx!	pÑP„L~kCÔñ\!o
V"œ~gZ¹½{®Úçú ‰GEíÍŠ$à2@T¸!ÅNq]‰ÔWsoÑŠC3è5—ĞIï%ĞNÓµ^Y¾ @8úy½ÒUÔ>@²9Ó÷
›·Û|@ĞI5Ò1À>q”¥{ƒš¶ëÌåİµ!‰@ûc»çt½X\\W]!d?Ñg¢9.ÅÅÒW8İk•Ïè7Ø€İÂ_ÑnŸµâDq$»çM­ëP<FyIÜ®BBæ»Î)èŒ@Ç£.sd½‚Ï)~Ï§åÏ{°®W2¸}½±µœ/’Ä"ı{0¼C‰c¥Ö•¢·¶•jB?E‚­=Ø"æ
¯ß$ÖäÏÉŸ–÷Àª!ƒÂq$ä^‚F÷#­ 3üö$`[w¨}7’[¬^°îX÷496	QJJ~Ÿ*?;Ô5*lúÓ –w»
v¿ÿ¬ûL!Z}Z 4u	…<½Ô‘öºò€:q·úÓ°Å|õ¶´~š‘ÙçèŒ•ú?Ç²Âkå^C$”ïÕ¾Á‘Œ|·CY;	ÂŞkªºª“–é+¤S%kßĞˆEX ş´;1’à_ñ÷PÂ-»ƒP›kå+S#P0èA¸Ó×x­¯‹£Ã×(ì½Á]ó	ãVÍI¨ÚwãùVê9x…¡Ö=ë	k¶ë“¨HÒY81à|~ÈÔğÑ¡LËîú€ô¹@÷n°qù)³åj¥A"¶¸İ®Ğ”®$”C±/¥ø!›@Ø´áÅÛŒ”Su	›ºO7½Dãº?Œë µ»—z).©+Éä'ú6áô6\ƒ}ÅCØ6¹ÇÂ6,_ı*%û¹ä(ğm\÷S é•"õrtï
Jöxß¨‹àsÊç3G½÷êBMd¢aîœ²üY~#iN{M€İ1€´éq€äÖ©ËÁ—B#ãšœ %pwï[t£$Ìà]Zù’dÕÊıA1£=À}à¨dÚ4×ñ¸g³kË¯‡gXb¨h:$øÙ¼o™bGdvc†ûßõAÆà{ú€ğreŞƒ™°^ 	0´áŸ`¬¹¡;æt+à„¼×?»ÚË#Ğñä¾¸}p8{›Ëék‡Pßª7Ø-=
·1sÏ6Ag¨±uD+lTÙ%ø¢}…ÔT`%¼¸}Í…%àâE2{ş’î1×NAôxh·e=r‡¤6@»`t€^yM4
ìü¢#JŒ?8¬'?ğÜëÌ>·Ò6$Q`Wq-bÀ9ˆ¶\ÿ©ßƒo#8pÕ{¯§·Çø‘pfø{À¡øùCæ‰G 6räœQbÃëèQ$]E=£Œ½¾Vø‰šOxf­µyÜl#'¥ûnÄ€Ë¾Ş6\vnSlÜŞƒ§•5°¸`õpoŞÆFõ|³Kèª~ïØÜm`#¼bÜF¦†G6M±“‚ë3·ƒ”õ“igíø¸±yµQ3(Ğ×;•tüi³×÷iÃîmºªÈ ôü’­%–Š{u·ó²ŸHÜcF›îŞˆÆß`DÉ	ìPÄækW® AÈèºõ	8¨·ù»¹L–¯%Ü£¹QÿÇ91/‰óÇ#	bSZbÛ{ß Uúüô™ä:oC‚¯°şê5Ào°]x„JÎH‡Àûâ¬êÛ‘í5Ñm…nø¨=Iá²ct.P—Ç}\èªàt&îà±İíÄQâóƒ×Ã=s|‹[ğuº§q;	æ¨5w€	Ş‰j:ËÁÅ´c	.‰{~Î®²ïu>’æYHà=±upIõJr!ÎoãT$	êŠì{
ŞƒGfÑRêÉ±lH‚üF$Á­IÀxI<&¾SÙ½ºHV·€fÓq£¾³ŸÛ„½‹c÷ï¾®øT‹£&÷Ô#™aŒds&’æ§A‘€eÃa÷lV$åM±A(štÜP!İWdKr#•4à¯B²º§I`¿íäò8şÉæ'’€ë§K=Y0ÙìÀ«œ™	G“U?iisø9Gh
Ã×ŸÆ^Ğsn'{Á½û låOƒe-èuäßIÿq”’Ó=Û;.Hç)Œ˜ziÚ78GüŞTÄ„2hu¯.ä.xàü=yÔSO›ÃãÁ{W¿Ï!	0?{™xœöà‚ø£x”ßô(æĞ=ó?»ßr§\MÑÛ’İy~¢XjÂš9ÈäÜ§
Í\päŠ1¸'IàÍ#HT$Hš¹	…uX Án$‹$Ğñ3ù´z{ß‘8;ø~¹ÕîE‚WÕû†;Ï×˜	¿µís9ÜößçÚƒÅVp¬¨ ´oË YŠKÈÂŠ$w}`õÁÓ‚Ûmº{u!ì!ÏŸF¥	küX^r‡eÔD€øCvÒ£ü&x¸÷[µk$¼Rî p„$ú4*sûí6§{#.I°ªVŠœº®Z1ğOïÁ­kà¨îÃp	81)”¹Dmp‡ûˆÂëŒ9;7Z÷í„<ıÎDá4A0ÏsåPàÒÑÙ \úlƒ¸qìÊâÆ¹›ìØq¡«wêô­<2;øGÂì0 ;£<°ğWyŞÔÎ±éìDH6¿QîMî¿FBz…ÎÂİWïN9qPÑ÷óàšµ¼ùE-'·ùöywôÌ¾ÃGâ»‘ºIÍ{MÖ’ûjv|i,İ\ğş=0¥x4i‡'ÅQT{#Â<-bŠÜ;˜`?:E~|àSu?O¸ÂÁ½‰3Wì¸¦[Tæ,$Áuä±œF×à\@Ø£Ô@rŞ¢½W@ÎºÈòˆçŞçÍÑ@¤ĞgGH")^9I6\-û1• ×DƒOMÃÀ#s@€à+ŸgOï ê£6yvı~Ô×(ş·à='„îÁ >®Ç÷³‡Ïéy±ÂØlCœğû_”JnWAd€*õ§QJA{<±º¿·ÔÅÑ^£ÄÈĞÒ÷PÓĞw±r÷ Ù=““ÀM,oª•® g'jt zO8• ²¦—÷`^_EP$ğ‚6B»~"á*¡ï™&T…K tĞ32m.ÂŞ†khÔ†ørĞfq¯;ïÁçm¨—ãkûÑ‘q$çbèÓ¨ŠãÖFƒ+3ƒ¡÷ ]	@şÔÿŞÅ÷0U‰SøÀ¥¿‡‹«÷-{nCâ>.$İ12N»İ‹dso†C®¾·s
¢¤-çê¶eƒSÖïY
ÓŞÉÔÇğ5JŒ4–¸ç*é˜$Üt~Ó:{)ßGğ= •İöoø‚ıS¦Õã2ñ#Ùå†¤{†£8¸36î_V†#×­ Úäâ{\«àdÂ“å¸[ÒœÈİÒYÀFó\EÚœÁºÒhÿ«ÄšZª­‚ jŞƒiòøBƒ¤ÊoYSëÈŸ†eçgI…yßõ	ÁI;“ºìOjè5`ÛŒW×ß3“ÿã:Y ¯áT÷ŒÄí±c~ì*~_ Q„ò£:nğ®8r¾‘Ÿåv|EåhÇy“sµ úG÷ !ÁCû¶$ÃE’Éç‡Däà¬gMyD­QEÆ£,¬à$Å28ñ®¸MŞH<Î¬«òŒ¯Òş<s«Q“&ĞÊ€İ¢‘QX\Ş/ï@o± y%MNç‡š4_h,Ù-!8aÜ§Ú6˜l| q_ mz0nˆ(·¶Ê¥_¿N˜à\Ø‹A›Ã}OmÏà{vÒvõÎÔ`›u¿eãüsn$ÍıoHfyÊõ¸'J†c ø—ÖÅc»½ç°H0Rôi\Á<Kr¥ÛmR ¯+˜k¾¿XĞƒq	Î,jì»¾¥èÄËôÕ‹éØÊ˜gjH“…d‹z]‚ªlƒßG´vG¨40MN,6ĞHpr:‰ßë!š¢—­Ãjëºª³|N©¥œM>ét6~gêTjñ3ë >ã}Ã[ä¾ÁQq«I°z¬'·¸`éÎ`¼8ıvxzME%NÊ·ƒ ©[°ìk”Ü(Ïº Ê§ÎÌ<íB6z°çJ²­?L–ï…s˜  G‡lHŸvøê]B½j×£'ëÚ×|ÄÎÁÚ·÷Šö •”÷-âİoç¼º%Db]{ÂòdsÔ´áÁ>EB,ÅŸ–QŠ¤9Ç F|ÀçMòöê$ÁªêĞd¹çIps%Õ7{,Éák´ƒ
ó˜8’ ‡£>È/é•
fë¶c‹:¹}q CºŠÎAßõ}Ù£g#„ï»£zñïë{Wİ›³röDmµ¸HöÜ%ÙÕ¦ ­’5ïf•êpáû÷À˜ãwôN¥d÷ "Ùƒ½@­Û`ğÕ8şëq´âÁ	>Û”ÿq„> Œ 7–#˜h›eê‹ë«.êÑN±÷æ‘¸œœ½ÉêŞpÈñ‚ÊÂHšû-;'–Ÿš˜İkq-FÆñb”œİŸÍÃá1’ ö'pò Â\%:€ÜĞAÂxŞ.’æ·P$Dšô=ät¹´/ãêÙÓäU©‘TGú!ÁHñ`AúiF¾ŸÎú{êĞ;’êÑ
$‹3[!9Ü¶Dà:/‰×<éT rÏ6’ #Ó±üNKÒT
4ß:¯n÷ö+ÁŞµ?¬lq¦ÍéÙÀ¡ÈcÔ9İÆàÊ•ämdø>Õœ%$ûg#É¾îİ2ùQŞƒTÖ"UÿtïJ§
{pnÜe‚ïÁµÔåñ¸s¿ ¿>ÖÜ‹¼ÚF‡-Æ³U:ìHnû÷F©	TÇ®tBAßR'm‹p@“×"AÂbÔqûìÄ$5˜#Ñò:§3’àDè7²°œå€÷œîÅé˜Ş/ƒ{C¿Ã×±Üé`ÏÁ«ìŒ>Gg”¡ü›÷ â¦ëÜaÔrğ´#°ùÀ‡ÚŸÈ¡gõîMïõå$`6íùYÎ]ÛR_ü4»xu]ïÀ«ŒU~<ÊÓé^$õGò§ı{JÀ3×´˜[Ñpëú ¼Ï)Y`Aïœ1Áş9‰›ù‰AåÀ†=&øœ^bzBœD¢„K.B—“¯ïÁ)µ¸ND e‘tY›{Ğ=TÃ~€„qÏŠ|ú—VŒ.•…å(øz¿é!aîüi\uÏÜJœ-Ip?%Á2Àü\©—¹_€üEB.§öš˜ß$ ÊnHvÇ0‘Ô€–Fz‡÷ À÷HæœÔ÷6Ô!ô/%Ü}Ğ~qeÑ§‘ìU|NÆ¾Ş(“âš0®O"åÀ%9ù½J² r’ÕYm)×dO#9ƒY@‘»r©xd-eÕ£Hà Ò/ïây‡Y9Î‡$È/AT5Di—\¹
{ßjÀãI<ôµŞf>ıö~ª”øê ï>®ƒ½Î³ ™Å£´d"¸7œ6İQğG¡â•ØÏ:@¨;«€1S›:|Ìíuğ>EçB<àÅqÏÏQ§ ãIPçÉõ œÏ%ëÜ|\T ¾.6`×;u†ÕÇ F–ài€é‚q›OÏ‘> ‚wŸT…ö€œæ`—Ì”íó^ÏÀµ\Â Œ55ƒÜŸå¬ƒÂØ«AÎ@¿‡"‰%8¨|ì,Ê¿y¶×±À7¨7½ƒbX~E‚‡ÇûVµäM¹‡	IÀ{Œ„Z-ú*¸8šîXÇ ~ı%ñ.’#˜Sˆ÷C{À ä>®Kâñ$›ß(5bN: ú¬èµ‚àñÑÁy|ºdòi)Ä88
	r}l>¹E›¶ùÉÄ³ Ò£º®ÂÃXOP©yîË±Áiîk‚1ÏÉ'0u:2î î²ßŒ=Â	!!IZÇ¼‹óâ Zü†|ìWQ Ql½µÑæôûéAp0ÛèÊPD_ÉÁX7n,>B¯¾F½:–íhevş¬Ò#ÅG›©X­ãvw½;Ñ{MĞÈ£¾GÜä»„ºË§8:÷,?e@g{¦J—}˜‘T÷8W$ß%äò8_ÚvÓY·ÌåÀu*êU¿ÿpıf¸Ç³<2]>Àõ8ÓĞËcœ‘D
wj÷‹'™'ş=g
ø¼$ÎWƒ$¨òƒdÖÛI-×g	r¾	)Ùí~m¿3tƒºÈ$d©Ùn</—î¹‹8ÉóôÀçO#eHÏÆ“„k÷Ç#ìÈŸ6smR	\1d>¯$µG‘p¡ò§Q~.hÃ}.èÄòŞ†ƒÉÏí“Ì g!Ù=7		ğVí53éb+4çG‚¾ŠÊş4p‘ÊÛ@á«
na¿ÿRŸ RP·Éâ8HRñ÷¿]×älúÑññHàÏÕ/e+xtì";wÍÇÕpó
^'´î¸$î1;ñ¡øğ¤¨®krH[ƒºcHˆ"ë—â)™\»¼æş3S™AoïH‚ªºH ×8q½‰›äŞÃåĞó(Ohƒ]‚¡¬Q˜ZÜ¯|Ãwí„ÉÓ½ª	éYO<–¼· éZ¹ÖÙc®g­§GŠ/‰û¯)´^Ë{€Äu<J¨ğ<øİ	x}<2î¸6ÈúƒÖŠ˜€?-‘2H6GÁó´ ’’€B½€Y¢‰â9Hf¿í±5u=î¤Jp°BğÜºu{.œ2¾ª–İtâ§pÿÉÛ”Õ±†‘%8eĞ:Ÿ;)í¾u
6ÖÿÛ|'åıŒ$ˆU#!»\¿/A°záºf›ŠJ®¢¸—g{0ûzl
#§ª÷Ø»ŸÎ+,×ñ”´ğ›ğ.¼·úJ&…Ü[tnÀw6ZZ<úBacN oS¨Kàªq¹…[8°ù6Pˆ¾ç¨Èì^jˆÖàKwRá\ïÀ»âø‚±àK/*_‰dçOÉêÒÑi#×3—Àíè#Jå`tZ
2`O’Šƒ±n!”‚‘MAÖ¡ãÒNrEM‡$`[:‰:ú L‰ç7Ò¦97÷ÙÉ›ò³P°£8šƒÊ@¸¾¨j«óCÌ7¸gnõÜ¤?E`Ãv*ï½Ğ×±
Ç@=M¬½ÆàŞÉH`[’_âyç‘·ê½&’Ü(¢I~2qrìÊ‰¹ôÓÛ3‡Ï“úÎn÷^’¦£/\0n'<´¢{‰ªÂ£i9]”Ô½ŸWâwŸ^?>İ½}úİß¾ışæù—~|ù×ùpÿüÍû×ºy÷ı«vóşÇÇ»›oşÀ/®Ş½ıãã÷»ûù·?=<ŞşGÉ|~ûíÁÓû›wïÎÇ›7/‚ÏÓóşõÛ»§ıö§Ï}÷‡›ÇŸ{î×_<ê_ßŞşô?şü¬7·÷Ï·ÿøğñÃ—·}z¼ùğ÷oùóËëH ùú¼»ûçßß½ùûÓÇxiuóøë}¼û?ÿôx=ğ»ß†çÓëç_nßß^ãóû›ûŸ¿ùôeŒnï¿ı×^ñ_·7OÏÛÓİÍ÷¯şı—oÛ?]­?½~óîñ‡7W³?Ü|øp÷¹Õ?ß¿zw÷ó/ÏãÕì™ÿz{óøÇÏÿñãÏÓWÙôYÆ]²ÏÿqóæúX~ıõ×¾ü“_}ıÇoK/K¿ı-¿ü-ÿö·òò·òÛßêËßêõ·_~ıpûøîîşß¿úó?¯¿ÿôğîİÃ§Û·ÿğ›ü¯şôy?½~º}~æãŸ~÷ PK
     ‡Nâ@               word/theme/PK    ‡Nâ@3Lˆ  ;     word/theme/theme1.xmlíYMoE¾#ñF{oc'vGuªØ±hÓF‰[Ôãxw¼;ÍìÎjfœÔ7Ô‘õ@%Ä…*µH”_“RTŠÔ¿À;3»ëxM’6‚
êCâ}æı~ŸùğÅKwb†ö‰”'m¯~¾æ!’ø< IØönúçV<$NÌxBÚŞ„HïÒÚûï]Ä«*"1A0?‘«¸íEJ¥«Ò‡a,Ïó”$ğnÄEŒ<Šp!ø äÆla±V[^ˆ1M<”àÄ^¨OĞ³ŸyñÍo-—Şc "QRøLìjÙÄ™b°Á^]#äDv™@û˜µ=Pğƒ¹£<Ä°Tğ¢íÕÌÇ[X»¸€W³ILÍ™[š×7Ÿl^6!Ø[4:E8,”ÖûÖ…B¾05‹ëõzİ^½g Ø÷ÁSkKYf£¿Rïä2K ûuVv·Ö¬5\|IşÒŒÍ­N§Óle¶X¡d¿6fğ+µåÆú¢ƒ7 ‹oÎàõnwÙÁÅ/ÏàûZËo@£ÉŞZ'´ßÏ¤g›•ğ€¯Ô2øÕPT—V1â‰šWk1¾ÍE È°¢	R“”Œ°eÜÅñPP¬àU‚Koì/g†´.$}ASÕö>L1´ÄTŞ«§ß¿zúŞ}rx÷§Ã{÷ïşh9³6q–g½üö³?~ŒşxüõËû_TãeÿÛŸ<ûõój ´ÏÔœç_>úıÉ£ç>}ñİı
øºÀÃ2|@c"Ñ5r€vx™¨¸–“¡8İŒA„iyÆzJœ`­¥B~OEúÚ³,;âFğ¦ ú¨^ßvŞÄXÑ
ÍW¢ØnqÎ:\TFáŠÖU
ó`œ„ÕÊÅ¸ŒÛÁx¿Jw'N~{ãx3/KÇñnD3·NIBÒïø!Şİ¢Ô‰ëõ—|¤Ğ-Š:˜V†d@‡N5M'mÒò2©òòíÄfë&êpVåõÙw‘Ğ˜U? Ì	ãe<V8®9À1+ü*VQ•‘»á—q=© Ó!aõ"eÕœëü-%ı
ÆªLû›Ä.R(ºW%ó*æ¼ŒÜà{İÇiv—&QûÜƒÅh›«*øw;D?Cp27İ7)qÒ}<Ü ¡cÒ´@ô›±Ğ¹ªv8¦ÉßÑ1£ÀÇ¶Î Ÿõ°¢²ŞV"^‡5©ª6Ğï<ÜQÒírĞ·Ÿs7ğ8Ù&Pæ³Ï;Ê}G¹ŞrçõóI‰vÊ­@»zß`7Åf‹Ïİ!(c»jÂÈUi6ÉÖ‰ ƒz9’âÄ”Fğ5ãu
læ ÁÕGTE»Naƒ]÷´Pf¢C‰R.á`g†+ek<lÒ•=6õÁòÄj‹vxIçç‚BŒYmBsøÌ-i'U¶t!
n¿²º6êÄÚêÆ4Cu¶ÂeÈá¬k0XD6 ¶-åe8 kÕp0ÁŒ:îvíÍÓb²p–)’H–#í÷lê&Iy­˜› ¨ŠéCŞ1Q+iki±o í$I*«kÌQ—gïM²”Wğ4Kºo´#KÊÍÉtĞöZÍÅ¦‡|œ¶½œiákœBÖ¥ŞóaÂÍ¯„-ûc›Ùtù4›­Ü1·	êpMaã>ã°Ã©jËÈ–†y•• K´&kÿbÂzVØJ+–V ş5+ njÉhD|UNviDÇÎ>fTÊÇŠˆİ(8@C6;Ò¯Kü	¨„«	ÃúîÑt´Í+—œ³¦+ß^œÇ,pF·ºEóN¶pÓÇ…æ©døVi»qîô®˜–?#WÊeü?sE¯'pS°èøp+0ÒıÚö¸PJ#ê÷lw@µÀ],¼†¢‚Ûdó_}ıßöœ•aÚ|j‡†HPXT$ÙZ2ÕwŒ°z¶vY‘,d*ªd®L­ÙC²OØ@sà²^Û=A©6ÉhÀàÖŸûœuĞ0Ô›œr¿9R¬½¶şémfpÊåa³¡Éã_˜X±ªÚùfz¾ö–Ñ/¦Û¬FŞ ¬´´²¶MN¹ÔZÆšñx±™Yœõ‹Q
÷=Hÿõ
ŸSÆzAğàV?4haP6PÕçìÆi‚´ƒCØ8ÙA[LZ”m¶uÒQËë3Şéz[[v’|Ÿ2ØÅæÌUçôâY;‹°k;67ÔÙ£-
C£ü cc~Ó*ÿêÄ‡·!Ñp¿?fJZÙ´öPK    ‡Nâ@»Óâu  šL     word/document.xmlíkoÓVôû¤ı‡È›• ’>VHĞÚRÔ´Âgä:NbáøÛi(Ó¤R† PhA<Ja &^¶Ahaüâ´ıÄ_Ø9vìØÎƒ¤Ü¸	
Ÿ÷ç={îİ³÷DFLñŠ*)ÆD‚a&ÀKIR*Æ9<¶s	¨+%X‘H|Œ™æUfoüË/öä†„ËfxI@’:”“¹“Ö4y(R¹4ŸaÕ`Fà¢’¤äH&D’IãC9¢$B½áHØ8“Âñª
ı°Ò«2¥æ2•­™— ¯$Q2¬¦‰’
eXåXVŞ	­Ë¬&L
¢ MCÛá~«c²Š4Th§~2dTú±¾P*°¨Ò¯ùåh‰F!…"©iA.£±ÙÖ Å´ÒT=$¦2¢õ^ND+ú³Qn„£
›V”¬h®
1æGÑ¤ò·ÌUo‹4ènÁj7Ã
’Øæu*®GÔ’d  å.û*`¯KÛ^C¾]Ê RŸ¢ û’•mpdáÓZ—Ùm¡f7Y¸¿5µ©*t"ÍÊ¼¬dUdFYµÛÍårÁœ¬9©48´/²+Ê174’ˆÂNŠ€[.ä"}T&c×$ILã¯l)ø£Ê,²È‰¤·Cóâç,¶ÂjxVÕ˜¾­˜qD$
¼5ÅŠ1f×şáGŒü>‹1B‹Ø7’c†ÇÌVÔ“ö·½ÖÕ¾×÷B¥ÎàWÆNñ—
ì“".ÆÆÂğÏ‚Ä†£aØ Tq(v $½½‘×L’ı8:SÆˆ¤!éÒ…‘Sß©kâB’BşÂÚòoz>¿võqñúëâß×\€u‡ü%ÚÌû™S.BµT\ÒüÈPãŒKküÑ{7±|ÀÔ½og‰¶û«„01O{‚&…ëp´®xùŒAqõr!¾8÷hıŞ|ı…
]Ãğ€y‘^å•)‰ïÔ°ÍhºöpµÍhw[‰öSùŞ¨e`?fêİ*osU9¼¿ˆ5ˆˆ!½ï$Õs‹ŸÌ~¥ÒÔ‡ñÏ‚Ä6õ†ËÎĞÉ2lÑ’ùO©´ÿ5ëåi^I› "—"4ÓH/z£ƒ#ƒ}-À¡b°ó¥–±¥'è£ÃƒU¼ÈO-Ãàø†FËXáŸ‚ìêTúóŸÌ‰êv+™•8Ì€4d¾¨ ­bQuü¶÷üòkc¶™
r]æY†¦I„|êÙí'ÚÏØÕpPİ…ò->úåHïÎJ´Ø¡¹•y_Ãx5MrÛ{´à=Ñ|÷¸õD¨n^»7IÈ1œ¡˜ĞXf!cŒœ¢Äf à;x`ßÑã?ı1ØfÎ4’J‰¼k@Ä¨	İ>)aÃf„	-ÄÃÀNÙš>Ç.ÌÕ—ş[»¿²±¼¸~cÁÅó.¹içä‘Üú³Ó…Õ§úÂóÂêƒâ¥Å«/ù™BşO}a¶xíÅ‡7óÅ¥çæâ—7şy?3»±º´şì~!¿îò§¥s&ÈŸÂë»Næ¬=}ZX™¯ÊıÖõ§õ³ooŸ;c¨D(ÕÃ/Ë[ïä¶a®¼w›Kjöf$úÑ÷jë~Ô¾Œìöæù(ğ(ÒRíÌ×ú†DËôİ­×P“IW³Xe%»k0ÄƒLe‚¾µ³Š†eÌÏ¬=º²qå®é+‚«¢?{ÁİÆ“%<Î,—.é+õÅyğ\ô¸9ëÂìóñ'}öĞ¿w‘±1iß
9^Èÿ…ëïõóK,8¹†[üı~j|Øõ{÷6Î.è¯Ş^„—½BR4a°Qc†ÁG÷“a–;fî•A©S“´º™¥ 2+ˆœÑv»@‡ƒƒ™3øğfY8[¼sÛ*qˆ8w³<\Ê—çnš¯¹Ä›ï¶€={û+I¨Í
@q^†*Ì xsncæ.ZšwOŠgşøğfÎ%@m‹;YšúnªÍG1F=†jèŒˆÇ~<ºhÛÉŞ…}kæEšĞGTÏÜÍfKLM‡uÎ×¹‡$›àÇ%œ}àéÁ¬æI`o)jSNï‚23"‡I— V,7	Re¦ÅÉ„º.eyxÓÉãeŠæ³}-¾º§Ÿy€Ç³+†#cEÍ—×®BæyIŸ¿zÎSf$e†Qætsr l6|µqúíú»¥Êo»Éj*’ˆ[^ğH‡Ï(YmYj—Ÿ[cühïÔnäsÌíR³B¶%¥ÂÄf“À¸Îè£åĞˆ+ÕJ"m›{Íiƒôµå€š“î•óº›,ç°ÁŸ{¡ß_Ö_\öf(©Idûp§}UÃ¸®Á¤µ\ƒ‚åï	–ô¨k/ëe`æzSëg(0dG#Œğ¿´&Ú[bAåk¤+Á”ÊPÖ²‚p°Ï7$ZÅœ¸gö½“íavÈ·RL#mÂ¤Ø;:ú­[¾æ|UŠFIÎLûWGdO&­	Ÿ˜.5jÎ8Ñí&n İÈÀæ±CFºŸ2,‡«¯;Sª”ûóğº“G”&äÔÇØÅĞêE\¯ãñ‚~ñÕú¿¯ *ÃJjw±®³nÂ9»¤ºT@ıú.ÔVCš´¤úŒ¦yzp@¤x{Î™¤­vª<§™¥ rj÷ƒÉÁF\ÑÈ@Ÿ±®ö¡	‡JKDäÔ¬ohDÆw¢Æb—dÃ%.¹…g“Dƒ­sÊE>éxšæaÖ6¥€¥ßğr’Íq™ÊjÆeiÅ(Ğ7TÁq`¹Jé)‹3†¦Ã`û—hÓ2¼‚çËÑñä qiØ§ß ‹K³Ê„ÙÑ:¨•…8œšûñÀ‰µ©XüPK
     ‡Nâ@            
   customXml/PK    ‡Nâ@Ü>Ï•        customXml/item1.xmlÁ
Â0Dï‚ÿön·Õ‹”$=´xÔiª…vSº©Ñ¿·PÅ›×™yÃ“Å£ïÄİÜzR%)GÖ×-]\Î‡ÍCµé<9OÇPèõJrn'¾¯L0b>!VpaÈcŒI8±„¾iZë*o§ŞQÀmšíp®Ê7
›ÿIk¹XœœÇÑü –ø3ÀOuıPK    ‡Nâ@cC{Eå   G     customXml/itemProps1.xmleQkƒ0…ßûrß5FëÔb,´NèëØ`¯!^Û€IÄÄÚ1öß7t}ºœ{¸ß9·Ú]Õ\p²Òh4Š!@-L'õ‰ÁÛkXÇuÇ£‘ÁZØÕUg·wÜ:3áÑ¡
üBúyl|îi™çmŞ„IœíÃM\Ğ°¤é!L‹fCŸó,kËäŸ­=Æ28;7n	±âŒŠÛÈŒ¨½Ù›Iqçåt"¦ï¥ÀÆˆY¡v$‰ã'"f¯ŞÕ õÚç÷ú{{+×jó$ÿR–e‰–ÑFBßSiJ¼uø7ş? uEş±W}ó{ıPK    ‡Nâ@W%ÑRƒ   Ø      customXml/item2.xml­A
Ã E¯" ºèB’@ ËRnºèFí¢hn_)¥'èò¿Ş …L{1X™Ä€†ğ)é8òÇ¼Ìİ]^9û€›Š6ÆÙ+†­
=rG”@5£ª]Ê¸µÏ¦µYVHÖzƒ—döˆÁ©ïÏ ½>­Eew|eQMüb¦7PK    ‡Nâ@«fÎyÃ   ì      customXml/itemProps2.xml]N]kÂ0}ì?„û«kÓÒTfµàë˜àkHoµĞ$ÒÇÆğ¿/âÛçÎG½ùvûÂ™Æà5,zúÑŸ5?;®€Q4¾7Sğ¨á	6ÍëKİSÕ›h(†KÂ˜ğ°Óğ[vjUæmÎ³V¶|]d/Õ–J-ß
¹íÖûÕXÚö©†4\b¼VB½ 3´WôÉÂìLLt>‹0£Å]°7‡>ŠLÊ\Ø[šw'7AóøóLà@¢©ÅÿƒÍPK    ‡Nâ@ñõÏ¡L  í     word/fontTable.xmlÕ–ßnÚ0Æï'íPîÛØ!€J+ ´›]lvm‚kqŒìPÆìjWÓ.÷İLİÓlÒú;¶ş”„‘j«´D8±ì_¾ïŸ]¼çIã†JÅDÚsğ)r4Å˜¥Óóæ::	†ÊH:&‰HiÏYQå\œ?v¶ìNDš©ÌOU—Ç=g–eó®ëªxF9Q§bNSx8’“şÊ©Ë‰|·˜ŸÄ‚ÏIÆF,aÙÊõj;yyL1™°˜^ŠxÁiš™ù®¤	d©š±¹*²-É¶r<—"¦JÁybóqÂÒuìï%â,–B‰Iv
›qíŠ\
¦cd~ñÄiğ¸ûbš
IF	°[bß9ÏÁ5–İ”p^3NUã%]6^	NR3`NR¡(†17$é9Èƒ»š¨…|øxğËw\)©h¶ˆlxB8KVETš¼füœeñ¬ˆßÉôÂìÅ¦ğ`¡F¨çÀ+AA?Á='„ˆ¾òˆ‹²ÈÃÌj®#fLlò˜!8Šôˆ@|–Y§k%´GäçíÇwŸ+@`   .îRa»YdÂÆw8Œé„,’lC¾Øæƒ†‘îa ÄàÃ$\Ã[£¶¡*%ÑÊ·õUJy‘D±ïíi÷½D1¦TÛ2:^}ĞiRJÁCĞƒo¢MâU—QPK¦”}pœ ®€¶×·z§ †!D‚Ğ/$²ÁĞ9$­´ã‹.Ô«©òÅı·O‡}ÑOáó½±µÅĞ‡Q0Œú}ÿ/†b!•ºdVh"€úĞ1jĞÅÒ¯¥	.ÆT¦ÿ(^¯øH”›£½ Œ†ÿ»¯‡]£´DTu?UËÂÿO\#†$a#É*™¶iêh£²J”¶ÏGU	ämW	í÷şpÙT	ÓÀB¥ÅRwa„;u»ç÷Û_w_ï¿|€rQAc 44íêšYŞCkÓ°Åbû,á…(j[ŞcŠ®IãšÌàôSÉA÷{¬Ò$êªjs¸ÂĞ;®ÖÈ{Gµ9x{¨j¼Íc[(¼BùPïÂÑX$¤ü,a»¨­˜šG=¨˜€bß Q™A¢Ğ'Á]ƒ\F—î Èû©:ÿPK
     ‡Nâ@               _rels/PK    ‡Nâ@""ı   á     _rels/.rels­’İJ1…ïß!Ì}7Û*"ÒloDèH}€!™İİüLµ}{ƒ¸°®½ğr2gÎ|sÈzstƒx¡”mğ
–U‚¼ÆúNÁóîaq"3zƒCğ¤àD6ÍåÅú‰ä2”{³(.>+è™ã”Y÷ä0W!’/6$‡\ÊÔÉˆzÉU]ßÈôÓš‘§Øik®AìN±lşÛ;´­ÕtôÁ‘ç‰r¬(Î˜:b¯!i>«‚ršfu>Íï—JGŒ¥‰1•œÛ’ì7Pay,Ïù]1´<h|üT<tdò†Ì<Æ8GtõŸDú9¸yÍ’}ÌæPK
     ‡Nâ@               customXml/_rels/PK    ‡Nâ@t?9z¼   (     customXml/_rels/item1.xml.rels…ÏÁŠ1à»à;”ÜÎx‘éxY¼‰¸àµt23ÅiSš(úöO+,ì1	ùş¤İ?Â¬î˜ÙS4ĞT5(ŒzG?çïÕ‹½)¢'2ì»å¢=ál¥,ñä«¢D60‰¤Öì&–+JËd ¬”2:Ywµ#êu]otşm@÷aªCo úÔù™Jòÿ6ƒwøEî0ÊÚİX(\Â|Ì”¸È6(¼`x·šªÜºkõÇİPK    ‡Nâ@\–'"½   (     customXml/_rels/item2.xml.rels…ÏÁjÃ0à{¡ï`t_œö0J‰ÓKä6F½GILcËXJiß~¦§;JBß/5‡{˜Õ3{Š6U
££ŞÇÑÀùôõ±ÅbcogŠhà‡v½j~p¶R–xò‰UQ"˜DÒ^kvË%Œe2PVJ™G¬»Úõ¶®?u~5 }3U×È]¿uz¤’ü¿MÃàÉ-£ü¡İÂBáæïL‰‹lóˆbÀ†gk[•{A·~û¯ıPK
     ‡Nâ@               word/_rels/PK    ‡Nâ@ôc½  Ä     word/_rels/document.xml.rels½“OKÄ0Åï‚ß!Ìİ¦­ºÈ²é^DØ«TğÓél’’™ûí…­»°ÔKñxòŞÌÌnÿm{ñ…:ïdI
ñUçoåËİbí*İ{‡
F$Ø·7»Wì5ÇGÔv‰èâHAË<l¥$Ó¢Õ”ø]¼©}°š£´ùÔÊ<M72œ{@qá)•‚p¨6 ÊqˆÉ{ûºî>{s´èøJ„¬½ãRôMuhÌ¥$’‚¼ñ¸&„9{ûÓfˆ$‘sUvŒ6_¢yøošl‰æ~MƒsÖœIÊé\dÈ×d dãO¿í9U–¾![Ç>.Ú<4éS¼¼Ø½âPK    ‡Nâ@pú÷t       [Content_Types].xml½”=oÂ0†÷Jı‘×Šªª"0ôcl¨ÔÕu.`Õ_²
ÿ¾(Ò¨]"%Îû¾ïÎMÖFg+Q9[°AŞgXéJeç{›=÷îXQØRhg¡`ˆl2¾¾Í6bFj¶@ô÷œG¹ #bî<XZ©\0é5Ì¹òSÌûı[.E°ØÃÚƒGP‰¥ÆìiMŸ·$$gÙÃö¿:ª`Â{­¤@åõ*?ª ã	áÊ–t½YNÊdÊÇ›]Â+•&¨²©ø"qp¹ŒèÌ»Ñ\!˜ip>òÓ¼Gb]U)	¥“KC¥ÈÓÚ*hË0üobO›çÔ™ÎÙP·¾„²ç/Ú“-]€öáû×êÖ‰©ıí36üÂğ/JŞÌJ×Y«İ¨Ìb¤cntŞ8¡ì©ÑOÊ™øĞ¿¨ûA~€4Ög!" |ìÜ‡{çó¸Ñğ É÷l<Ò]<=»_?ÉfÉÓİ>şPK     ‡Nâ@pú÷t                Rd  [Content_Types].xmlPK 
     ‡Nâ@                        ‚_  _rels/PK     ‡Nâ@""ı   á              ¦_  _rels/.relsPK 
     ‡Nâ@            
            PX  customXml/PK 
     ‡Nâ@                        Ì`  customXml/_rels/PK     ‡Nâ@t?9z¼   (              ú`  customXml/_rels/item1.xml.relsPK     ‡Nâ@\–'"½   (              òa  customXml/_rels/item2.xml.relsPK     ‡Nâ@Ü>Ï•                 xX  customXml/item1.xmlPK     ‡Nâ@W%ÑRƒ   Ø               YZ  customXml/item2.xmlPK     ‡Nâ@cC{Eå   G              >Y  customXml/itemProps1.xmlPK     ‡Nâ@«fÎyÃ   ì               [  customXml/itemProps2.xmlPK 
     ‡Nâ@            	                docProps/PK     ‡Nâ@–—¼j  x              '   docProps/app.xmlPK     ‡Nâ@k&V  €              ¿  docProps/core.xmlPK     ‡Nâ@
µ­oş                 D  docProps/custom.xmlPK 
     ‡Nâ@                        s  word/PK 
     ‡Nâ@                        ëb  word/_rels/PK     ‡Nâ@ôc½  Ä              c  word/_rels/document.xml.relsPK     ‡Nâ@»Óâu  šL              ¬O  word/document.xmlPK     ‡Nâ@ñõÏ¡L  í              \  word/fontTable.xmlPK     ‡Nâ@¨K
!x7  -             !  word/settings.xmlPK     ‡Nâ@ÉFÁ^  b_              –  word/styles.xmlPK 
     ‡Nâ@                        ÈH  word/theme/PK     ‡Nâ@3Lˆ  ;              ñH  word/theme/theme1.xmlPK      ì  ÷e    lv             1 9   j q \ 1 1   $ ( ) N„v8^(u¹eÕl  5 . d o c x   o tell _how_ a key was added, remove
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
     ‡Nâ@            	   docProps/PK    ‡Nâ@ˆñ9k  |     docProps/app.xmlRÁnã ¼Wê?X¾Û`;NÒê…*ënO«m¤¸Í±Bø%Fµ­š¿ß—M•x¯{{3#†áğğ5É'ú ­Y¥EÎÓ²6‡UúÒ>eË4	QšNÖà*=bHÄíl¼uè£Æ…	«´Ñİ3T£9É†”½õ£ŒıÙı^+|´êcDYÉùœáWDÓa—¹‹azv¼ÿŒÿkÚYuÊ^Û££ÀZİ #Šß§8CŞÙ8»°°‘¢v`g}DÅ`çš^z©"mJ‹’ø	¿´¡ãÅØy"?/^º>"'ZåĞêEµ¨H»bØ*9`C¹Å^]‰ÓïáÅµöñôŠoı_rq§c¿uRQ¨’ËiØ‰kç­d¤îÅn³MÿöóVğœ>BNñæoOÅÏª\üh²r~×d³ªî²uQ—¯›zÆ—œ—ÍØÔ¨ß-ª¯ãQp`SH«¸´,ş PK    ‡Nâ@Uja"V  €     docProps/core.xml}’_OÃ ÅßMüï-ĞE×5mÿdO.1qFãÂİF,Ğ ®Û·—v]Ñ˜ğçğ»î-æ{UG;°N]"šæFH½)Ñójg(riÁj£¡Dph^]^¼É¹±ğhMÖKpQ i—ó¦D[ï›cÇ· ˜K‚Cqm¬b>lí7Œ°à”k¬À3Á<Ã0nF"‚ÈæÓÖ=@p5(ĞŞašPüíõ`•ûóB¯œ9•ô‡&¼iˆ{Îü(î½“£±mÛ¤ô1B~Š_—OıSc©»¿â€ªBğ¾\Î-0"
€üXî¤¼LîîWTF“YLéŠNó”ä„¼øäîwÀ#ËØêF(©¥ó–yc;ë¨tm©™óËĞÁµq{¨ä»*ğïã1 ¬ÿ&¤!áUœf+2ÍÃ¢ÙYÂ êŠ[ØÉn–ª4›MúºãI¿û93ÕPK    ‡Nâ@ÓÅ¦ìÿ        docProps/custom.xmlĞ½nƒ0à½RßÁònlœ’D’¥C+%Íl“XÂ6²-ªúî5JöWçêÓ¹7ß½«LÂ:itãˆ@ 43\êK_O´…ÀùVó¶7ZpîÊû»üÅšAX/…Ğ®€Wï‡cÇ®Bµ.
±Ig¬j}í›®“L4†Jh)!kÌFçBÃ/o^6ùÿ’Ü°¥;Ÿæ!Ô-óo|ò’ğ£Iê¦IH‚è>­QLâ
¥«tƒÈ–ZÑú>î?!–e
nU8ıéøX>2_²çga=ù¬Şœ·%%	T~mVëÿe9ş©Pæxévû\ùPK
     ‡Nâ@               word/PK    ‡Nâ@+Õœe  _     word/styles.xmlÕ\ÍsÜH¿SÅÿ š{lÇN\™l%NLR8Á¬öÜ#õx”HêAÒø#g`k\(
öÀrâ@Áâ@Qğß`6ÿ¯_·4}´æ=%[E.ÎhôŞ¯û}üŞkM«}vGŞ•L³P%“ÑøŞÎÈ“‰¯‚0¹œŒŞ\œl=yY.’@D*‘“Ñ­ÌFŸ=şş÷]eùm$3$ÙQìOFó<_mogş\Æ"»§2/g*EÓËíX¤ï–‹-_Å‘‡Ó0
óÛíİƒ‘U£&£ešY[qè§*S³\‹©Ù,ô¥ıSH¤›àÉgÊ_Æ2Éq;•ŒA%Ù<\d…¶˜«¦8/”\¹&qGÅ}×›€]«4X¤Ê—Y>‰#3øX„I©f¼ßPTînÛL[«ññş¯2ñkÄÖìZº€Ì¢b‹·OÃi*Rãf =îØ?zy™¨TL#©ëñşè1ÄS ügr&–QééYj?ÚOøçD%yæ]‰ÌÃ4P‡ ëÅ“$GğÍ\ÿ§õ)²üIŠÉè?ÿşË·ÿúë‡ßÿòÃ?­eü,¯¨záhûñ£mDñ·\®	ÂêÜähSË$ŸŒv ™à^9ûé	æÀdT\x“ÌÃ@~1—É›LwöÆs‡/Â :íµ7/ÏÒP¥)“ÑÃ‡öâ©òßÉà<`­U›&Ê‚ç7¾\è˜ØŸ˜¨gYÄ,Ã•f¼UàñB"´}_ëÑGÚ"CQpø(s)4ëxãM€*#Gf …Šİá*ö†«Ø®âşpÃUWñ`¸Š‡­*ª1l²Ã„B˜ò¦#–Ü2íÁã–i·L{x¸eÚãÁ-Ó n™v»eÚ]ì–é÷é^%½såoàÑºD¿?ëıŞ¬Kôû².ÑïÉºD¿ëı^¬Kôû°.ÑïÁjVšJâ½„äLrR>Ï”Ê•K/—74I‘€vzYG‘’iëÈk·Z¡\eOO¬C£;wl±#eï¾î Gú›…V]Ø¹îÙ<5ófáå2…Å@[WĞ%,“+A£è‰  Y¦p*sX#€ËèIåL¦°À‘$ñJñDa"½dO‰^ˆK–œLLŞhirª•Á!–ù\·¬!1@bë=’kr%<W&t…âi˜ÑhDxO—Q$r¯é®G¼şÚUeWé/^‘}’Å¥¿|5PŒí<Æ”¬$cfV’1A+É˜§ñ5gV’1O+É˜§•lŸg­¤õ­!Ç®EäE˜G4Ö=”~äA
Îóğ2Pú‘pYlê ]Ù{g"—©XÌ=ı”„ûT·Şµ5)¥8æá14L–ıÓm¤c!É	ÔR–ª¥,#XKÙöpíâúWĞjèBú0t`j¤côtôˆçËiNös-M—JŠ»gğ ˆ$°
¹“0…ŠÆhÅÛUãèµîåµC¨¾B§U’•-hWrÆTÄy6Ä‰è<èë&–ZØnºæxq»)ô¤ïH¡s¢¢H]ËÀ-]R_ÍØİÕë‘®LÊSÕQ ¨0®Òô<^ÌEf$k?&x¯Ä‚$xÁ3ğn—v‘Øó-xvy›¸*ãÛu÷¾Ó’ûââÕ©÷šòä6f2–yˆxiÍH©€F†(Õ?L`©¢hKJ”ı±¼*¿‹PVÁ(yK3üQ —és/ˆİ¢^@â_Ãº¬£
vÅÊşL¤¡^ü“æjï‚,XYrgËé[éÓú1„dÑfÚà™a5WÖDi5fM”FôFô8ğ3ß&O9›#.d9C.d‡Œ™ÖÏÙùªH¥³eÄrÑq!Ìšq!Ìš²Š–q’qG²ÌA£ì13İ„¸´¶Û¸øGi°…‚+¡ ÇD(È±
²Óÿ`¿™ìˆØÿ|¿C°ÿ1S—›í¿Ív• (Èñ#
rüˆ‚?¢ Ç(Èñ#
rüˆ‚?î=óälõ”G_qO+âÏê 2^ÀÎ‘ô–Ô‡˜P|ÉKA|²c$ÏR5Ó;pTÒ±Âú‘ ·1¢cC·Ïb^-ÇÅk÷jmµÖX§šçpO,0aóJ÷s´¾Õä}×/m«zÄÜPÔ.×7(³¨c‰{^Îsï|îxÒ«ßõ0Êè×lÁ¼k}n”ëZÄT¾çXü¿’A¸ŒÓtr¯qö7‡èˆù^üIµÃ¿vH×Õ³W?ìì|DRÕÏÿa¿~ì7¸ã‡-¤}ãGıÜñ»’ŞÚõ·sSïÖ¸C×³£g°£Õã§×¡+wËÎ z8tep	1`
®$.õ 	—ù×èTù°¯„M._¬xt(ŠË+BŠârJY‡bQ(v(ÖÆ\ëª5$}¼çš"r{ùÛ!³nÌñîyõ’ÙÁÆd?hcÖ
´1ıÚ¬q‘PÉ¦¶ ÅrQQ‰…á=ŒY]lTa´y«]˜Ûs¸ÜÔ¬\—ƒšµ‚‹âòNW­àb¹ˆ´†µ;ÔGäZÁ™¼¹@dòæ‘É›D&o&¼¹ .V(y®FŞ\,7”XUòæ¹è¡ª’7ˆNŞÌİËMMòæ¢¸Ô$o.ŠË;5B„ÊÅâ7‹LŞ\ 2ysÈäÍ"“7ˆLŞL ysA\¬Pò\¼¹X.n(±ªäÍrÑC	T%o&¼;~ ë[ŠÉ›‹ârP“¼¹(.ït‘7‹CŞ\,2ysÈäÍ"“7ˆLŞ\ 2y3häÍá7ËÅ%§VÉ›ä¢‡¨JŞL :ywl’øÈäÍEq9¨IŞ\—wºÈ›‹Å!o.™¼¹@dòæ‘É›D&o.™¼™@4òæ‚pÈ›‹åâ†’S«äÍrÑC	T%o&¼;6ª}dòæ¢¸Ô$o.ŠË;]äÍÅâ7‹LŞ\ 2ysÈäÍ"“7ˆLŞL ysA8äÍÅrqCÉ©Uòæ¹è¡ª’7ÁÉ`Õ£ÀôyYxHlÊáÍ›ÉhQ¼a¬wDÁÁ`ú°3{ÒŞøÏÓrzG$Üs%à¤µêù[vã¾o´ÚsZÜ¹cv,ÎR­Co—Yş¹Şaï.ÖîÉ±¸P8c…³…ğõ9\ ?ƒ…à³Ü£Ï°€ûå‡Ï—úô68êOl€¹[X8¸M£§kGµMFb®b¡''´U/Pf³¾/¦/¢1²÷Çú\84Xq-8¼&“­7ç}ö~¾uüZ_šÂo0“tëü‰VV9÷½ÒãÇÒs»x[ÕsödŠbGÒTÀio?Ñ§³áì~º^¯]Òïf–—ìİ·çğX¼“rñÔ¢eô‡Sp^fìTºwªß@î—Zoïí•Œî")j×¯{ûúH-s}ùô**ŠñÓƒ)¢Nú;™–Óß·«Õ•/WWV¾4×ú]âÏ!·|ıfŒ§#µr½ú¿ÚÑ‰SXßZc.•™ Ka°q“ã{pİ|Ğ`ó:Î°àup>LrÂNÅ-øÆb¨iŞo"Â—Ç2Š^	Ìã\-à&8«ãÂÜÜ£0’3­¾ï`¨Ô¾Ÿª<Wq·|ŠÛŸ;€%«ƒ1õºM¼F±ejî5ÛÜlŞk©h÷» 'Y×³µÁ¸í™´Ê“±}ñ£ÊyæØé—jsg•ºªçRm`Ëe-IB2$ş	!h%õ–N“Õ•MFûãûÖ•{0Œtâã-öà@Yˆw.¨ş³^›>¥)ï7BMWâÛLiëp‹)›¿Hl;½ÅÓ s¶L;´ >EŞÛóøú­G[³ácö~22}<¨{j>7®Şú5çg}
­•…’>ªjPs“m#[\²YtÛ–Í_L}şœh¯àÙ³ØUÂ©ºëG3,‹»­¡X)ş°1gl”kWk·ií%ìÅêbıb¯9ÓÇ‹è¶RvKGyåJ5d²î++ï¦¬5úĞÒªø\ŸµÛèœÍA¸UûğÍßÿûõWF4c¬Í¯XTú-ûÆ=å"ïˆ½.šéãÏÆF7üFùö¿#Åz¸›€şÑlÏïşğå‡?şÖ“LAiÇ9V™b|Ç³+«š½ÓİWÿ¸ûÛŸî¾ùÕİo¾¼ûúÏ$óu´PNú»Ï°‚€²ÇÿPK    ‡Nâ@IòÉİ‘9  Û'    word/settings.xml]“ŞÆ‘¥ï7bÿƒ‚÷²ğY –'€0{Ö±šÙûÙ’:L²İMsä_¿H¶5k=gÖ±s32³o¡P••yòdæoÿé?Ş¾ùê/·w÷ï¾}Ñş¦yñÕí»W÷¯ïŞıøí‹ÿ·óëùÅWO7ï^ß¼¹wûí‹Ÿo_üÓïşûûíÇ—·OOüÙãW<âİãË·¯¾}ñÓÓÓû—ß|óøê§Û·7¿¹ûá÷ooøŸ?~óöæáÏŞıêşíû›§»ïïŞÜ=ıüM×4åÅ—ÇÜûâÃÃ»—_ñõÛ»W÷÷?<]C^ŞÿğÃİ«Û/ÿïyÄÃ?ò»ŸGî÷¯>¼½}÷ôé¿y¸}Ãîß=şt÷şñùioÿŸÆ+şôü¿üW/ñ—·oÿîcÛüWùåu?Ş?¼şÛˆdz×€÷÷¯nù@oß|~İ·7wïşö˜vøÕƒş¶Ô¿a©¿ùüÛß\bxÛ|ú¯_fşøæWãåkşŠ¸ûşáæáógf\³xûêå¿üøîşáæû7lªíğâwì¨¿Şß¿ıêãË÷·¯øHlÇ¦yñÍ%x}ÿ¯÷Oûİãû77?ÿéæÇÛíş;òáîö‘?ÿËsi?ÿá÷L—Í¼_ÿİ‡‡‡ëï~{Ã¿ıxŞß?ıê_Ù2z@øêÚ.<éö{úÕíµ•¾}ñ<ÇÛn>¼yú·›ï¿{ºÿüsS÷,~¸ùÈÇøç‡»×¿¿¸ûëı»§›7ß½¿yÅ?>ÿqÛ>ÿñçWıå÷_FœÖŸŸGt_ÖçóßÿïÛ‡§»W7oşıê§›‡›W¼ê—Ÿ¯ÌåáşÍó3?-vå€>°>?ÿóq½¾Ä‡ÇÛóøÃÍÏ÷>}™Ï’ï>«ğîæ-ôó¿~9Ş¼}ûÑ‡‡»_í™¸ç®Ÿ?ì§WüæãË_æ€²zıxMæúÿÅG{şÛ¦Ùûv¿,â%ıEÒ4m×Ù%¿’lÃùùE%©ã—%ş{I×l›é›:»d8ÑsŸ–íïŸVæ#Ìzššêc¦óğ¹µM?û›¶]S{}ZÛÍ«¿OÛ7%üNßïái}ş;ı<M.–!HJW}uÚé<}/ºø˜®9š]g€d÷/×µÍà_¡kûÖ× k‡İ¿B×®Õ÷AÇÿ%ÉĞ†Y÷ËêkİgfPÊVgjÆ°¢Ó¹º¤o»Ågİ·sçëÖ÷ëæëÖM{ê÷éÇ¾]RúŞ¿\_¦!Y0·i_ahú0fhæşĞ¹-ÿ
C×õşå†n
gÉìë6tËîo:tõ’¾]|­‡áŸRÎ0ƒ²¾C†‰ÙùÓ¦aKcæç»óï´åØ4¯([çğ¯06İéZll¦ÖwïØ–ŞÏÜØÏ¦ÉßÏ­o7_Ñ±ïZ_ƒq¨{˜õØ„½3Ëà{gœÆÉ¿Ï8í]xŸiŸü,”†Ó­_®45|9${ÓNAû—v_}J7-şµK?aLŸ4y–&Œ°Ê¸o®]
¢ÕWgjƒ®*Ó>n:fj·Î¿ÜÔµA'N]W}LıºûÉšÆqcÆ=Ü´S)Å÷Î4Û¨ï3·ãæû`nêO›»µóYÏ}öÎ<‡¯Û<®%<­´³ß€sé?§X.Mø)éª¥IvÕÒìA“/|lÿ>K»´¾w–®;}_/İ°ø¬—±VÀ2öÕÏÜRú#Ì­ /u,å˜ıü,,hÕ1k3.~²Öv>}n+—™ïÄµkƒW°v¬Ï ÛƒU³öm~§ßÿ>ë°ßoëP7ÿrë°’g5áwJÛúZ¯åœÂº•3œúuZJø
ÓV|Ö[ÃyÔİÚiõ²uMø>hÄê;dëÊè7íÖa­·~<|¶Uî³î“¸ûæßrğuÛÆyï3µA_oÓ¬ÁÚöÕ×ºâ~¸î­]üŸÚ7‹k¾Úáœ"9ıMë¸[Ç=hòZ¦ÍOc-u÷u«å©NÍîß§b†øî­ÓlË:Õp/ìÍ²ûºíMVôŞ‹Ï`ï› Åö~8ükïı<½½/}˜[¿¾Öû°6®Cö¡»w/c°•¦®ş”²¿ÏÑÖ`W}ìcìv×ÇØ¾ÇX‚æ;Æ#x»G™ƒ/s6mğÏf:şÄŸstvkXƒ³ß‚}Ï¶ø½pk@WÎiõYƒ¾¶‹ê$åĞµF2-ºwÌg´­ßš-˜İ «ÄÕ:–†äp½†Ó,ªCj1$Ûf=¶G3î³Ş%L¹[ÔmÛ¶¸mÛîX}ÚÒ¸OÛ¶Óæ8 `;ùû€˜…í:,E»[ŒN÷vùn›ã.m7†{û’8²Ğv¥s›¢½ÓnÚ6µ6 4›â+Ú7kUMÊ·…¯İwËé3è»uOğ½Ó0ù÷é‡Íı¬–kaèõûp9»~kûq
»ª/CÕ›©íKu¯­í§~
k\Ştª½ïª°Õßgh¦¢ú­Ú£O+³ã!í ´îo:Lì8]Qp¤ -‘„³0¶#Y-’ ßß#gØ×zl÷Í×zôÅÂ›öÇ$CëŞa;OªMdql£Ç!œ¬qšİãšOµ)ÚÂNØôË¡BŠ¯Æô˜ªş´~Şı+”ŸÒÇÜÂ.÷=Ì Œáœ–RÍk‘¸%ÔN\g~3#y,§º©úÜ¦nuë–1‡ÇÚœáÔOèÿ¹i‹Ú‰íÜŸÓ©+:£ûYí<”°ó°:ÔÎc	»jæU«Ï€(‚k—y*A_/MÓû¾^ú>¬Î2´A'‚{œ©]†â¨!’=¼éRJãû|'|íµi=.Ó®Ü@®ÛÚV÷Ñs:¦Ú®]ïñÓv†`[®ÃŞtGÃÛu<Ü3j×ÌæïÃñ3·N}¸ÑÁ]<®Ù‚®8îÒnÀ®«6¬[¿K¶á8}Ö[ÁâÑ÷©Mî’Ú,ÅOcmçâ¿S»qõ³]û6ÌÌÁÑ•¶öçìkP‡!X\u8‹ßYu,A÷ÖÒ¯ k}İ¦Ù#mä·;ğ¨ëƒ½Üol‰ñxT¤İ‰Êû> Y˜üfÚû%XÄûĞ„²p]ƒ}
Oön?û>Ø§9èª}Z=ŞØÉqÉé˜P{€~ù}ºƒş}„½síè_á'–·GÙİão±ÑÂmvLåp…Øåàgûlæğ;g{4®¯OâÎş>g?ıv‹G+Ú³¬nÃÂ<¯Â¥6l‡I>è÷éÜµ»fÀì´İF:è’ÒŸªã1ÕY×ºk@Ğ}mSh(G£Ú…ø ×¹á¤»—BÜº#Z29îdwo·ÃìÃÜÊæ:„1Õ£¾Hv·ß:BÈîI Ùgİñ—d÷ïÃ’º?×}Z]Q|wÇj³9ş¯gñh9Ô²ÿNÙé’‚¾tÉt¸¿İuÓáè’Ó¹RD
Š#YHfÇ{‘,á÷]ˆ/t=+§¶2‹S<ªˆ$àş\1§ówº~ÔuCÅ»·Ë˜İ=½hİ±'$µªœ‰;¥3ÀPsÆeô}=Œç¬Z¹Ûp¼É
İVXˆHjã;ñbÜ¸…qãhk76«{mHvG[;°ÇG‘ÉâQ7v=ƒ$D¾»±Ÿ‹¯õ%ñ½3SĞ‰ãˆ¨k=BD	¿SÖÑÏö8µË’båôwğÙÂ®*MÒb`(n‹uœEg!™µÔpŸ–.xâ]fGA‘TG#ˆ7›kË2–°GË¸8¯¦+Dı,Lø´¾ 3$	·ß?Ó0y” 0~Ó	¥¼ªdn`T$‰³& '«k$õ`¡ÌÀÇ¾{gÌø0³0ëaö˜D·4õ™ÿóì`m4¥uK¿-N¬šeÚ‚ı¶6Õ-Õn%^áû¶Éì{gØ¿ú}@ÒÜ+èVle?Yëx:Î×­¥§q-CørëÔ„²NÕ=Ênk?»ûpŞF·½Çƒ‘œÎuï¶)°Ÿ‘Œáiµá;èZ_h„¯h…>êvHÅÿğS$ØoµÛ™ëj_Ã™«C|Ÿaq$àî¸XWG¢¾¥q¤¤ƒ±n>f
¢noVg°v;†Ï`OÌE€h|~ÁNLÏ¿Â>¥ß9š#XJàéhGNÁµWG‘ÔŞm¾
«ëÄ£«¿Ï1áŸ(>·ßN¨ºşåÎ>ÙşD$‚ÿsÂøô¹á£;	ï
LS¿Ü‰œ¸Rİ9íÎ„!€;¹½ƒ“Í 'ğíxHßğy{ê¯=<J‰¾i—ÀcÕ}OUw’²ê]drí‚kÖ;¶$DºLKxS‚9anSõhŒ€‚"™ÛŠäğ]…ŒI¿†ûY¤Ş4áËµ=ªÇŸ†»­§„§mîµõ-±‚ğ4\	½ÑIU	Fß–ÅQİOÕHHvG4ûvêİ?E2ÌáiR_)ÄqŞCä.ÃéüŞ¾ë'GÌl¿õ0Gß‰¸mná÷İ¸ù}Šdwô¸Ç1qKIñˆtRâşvÏFô{	Ù/ºÖÚ=šÄ˜9ìşb
ùÓÚÁ­§HciHv÷·{™ô¦}uoV£ÏmüÑ¾Ác
I6ş´¯Ò%Óìñú¾ŸBŞ’=èÄtRÿ€SÏè¶¨k±ÖëŞa(nç
6_? w|İ|;úÕåt¿èOë~=Éx#WšŞìûz\÷7ùq¾üÕÅyHvÇT„6g2#©œ’BX‚¦{6î**Îí¯DµnAnÓm"ã–Hgï˜C_ ÷ışÁŸt<‘OĞ9êätvS_
Ô]ˆÙ_÷ØNÇ_Ï8@²yIÈÜBr:Û±ŸÈ2õ{ì{Gó ¬µ£¿)	‰«Ói¬‡vz	÷ßàQßKâ^5’Õ1Òº§p‚É?
'xî÷çúİç:d"ë>˜ÉI	c`ú%É¹ºdiÖp‚>Ï`iñwun`ya'.ØBşµp¿eFŸ5¹Iîíl”07õ»0&­“#=™Aîé]œ~gŸ!YKCrm	«%èƒµı¢_)Üäå¸çŠ-88×Éé~#Ô™Ñ™WHÈûÓ¹m).)\@Ar:

5#äg‘<‡O©O#ûÆY m8§à
¡0æp¤¤¯CëÙÆH.F*|Öc´§¤¯€ø~²*q÷Àˆ¯‡ıÆ-öèËïú+Ñ9ıŞÎánÜÛÓ‘`lÛfs¯ÆQØ!„¤uE÷átf\¿K8Á{Bdp q)ıwàæ.™HWÉA´¯wI»xÕ“ş ¸Šmp±p—p[İ‚<¦5xg7;SRÚn¦óZS}Ÿß×àúpc€Ëyd•’'°ıwÆ9Ü€ç¸á,KĞH'æ“ë·'Ì`Ú¼ÒZ2šlÖ4!ç”Àü"Äác¸³t¿1¦wûmh
Ïş´²yŒ…1¡Š) ş4¹úµ3zŞ!’ÕóB‘ì[>@ê÷<Wtòà¶?’âöÁ'Â€~S$áşHÕğü`$“ßšù¢wF¹UW”Ğ¡Ç³2üŞÜy–éĞ‘çã»
‰ã°Œ!‹PçÖu«c\C7ôû`B½¯uWªã–d<‘®3Àèô|Íº8ák_àSx_;I‚g4t›	V¬Ï]¥·ó@æ¥G‘¯-Ú:“>îĞ¨C2:jˆ$ğ«`85<ŠSUßt@'ªÍ7”w›bq(ıiğ]Üz" î¡3‰k†§M5œ’q:Ü+
úÚ¿\ÉrÍWà¿ùpæÃûv\Ç—áô»~€iáË ²ôõÒW‡è[i YwºÖ‡ÁgMòZĞ.8ïáüPĞÈc9€½dWøˆÓª2LÔÛPv äˆó.‰gì a_ù&âËAr:
Š_ƒ>˜á²ù™›ÛÙ½ôQvÈÜ·_½Õºe‡$­58EzÚØyæ=¤§!¬èLÕß;dì8‡–:CK8?°ZÜ*ÃùŠ.$ÀúYúÁ‘Ê¾Ìáv^úÕãsŒ	‘p’Õ±§Kâx’êÈomëºj!Zîçg™&÷eø;A+/SucÎ`©®}`5nûcù‡øÂ@µÏd…3‡$|S8•_É	z«gI8ÁkY<€§áş!7iò/GnÒîúßûŠníêş×=XÔ„ñÔ°aøùÙú#hr${àç»_OÉºÙ9õH— Ù‚NÜğÀNırİ×­Bvôµ{r^À »ÉãÛUJ‚-†Äs"2®QG]Ğ.5¡áD1Öp/å¨û°7[ĞH{â´ÜÀl]ë>·‘8N
Û:ÛI	V'’f€ñïöùYíÈÂ
gag1†Q¾ó	sú|ÌH2\œê{9¼şøP‰İ²¯êÎ
#n»Uçvı÷ûô˜Ú)Œ!4äßç˜èïkuúºQÆã´T	ŞÓpe×o'v¼Sb"ÁR%få|
ò'vÇA-©—éoJÜÊ½Øgk#~r.’êl­á$k¶õ`èW¸ÒÜ£Dj%#)~,Î1#$¾-zuW.‰ßÎH†EWtDÃûîE29RK[¸´½sêùÔƒk>$¯B²z¼’(8ûr$wş$Õ¹#I
®ßÆ–ÚMz(PX=ò=RÁ9LHH#ô¹QŒ$üÎ¢òWâ‰çb{iı, ™<	¾‘Îlt·6³z½4Š“àèO›J¯:@õTû.“„L~?§¤|ûÍDñ\¤,÷
FjBûİˆ$ÔôCª-]×Ê#—³£ºH°¯û10À/‚Šßšä®Íî/ 9¼FîHìQ+âÄ”ZÕÒtßWÈ–DÒ9º‚„
"ş;à.A2Lî}Œğ<3hşÚzÿRvÔckœub78.†>{,¤·‹dÚed¿¹N„uöYe^	 qq¿ÉvïXŠûfãXB}e$‹Çç°WÇj.+Ñã?HÎ0k‚òÎ²9–®‘(±æ–)w ŠºC
§Áõ(EOÂ×¾òÀüü Ì½néyÈ¥vg;R ®¬Îzp~Àİ¾ÆÃ›ÂG:ıñ³\ÇÏÍî‘;ìîÀ@ÂÊéûPÚëÈÀhl=*‚LÆŸÖíÁ®¢R¿[#€Ü¾†Q’öÁ<RlÏgÀŞQ¬PøÂ:Ğ£p¤Œ^éÉ~gú`óÁAt$k„‡éùã…¿¹†…÷äQl’™j°`¡xty\»ÎQêqåşñ¯½‚ÔûZ“s¬h°<÷ŞÉ‰<Ö†dY¿èg{Qƒ|Vô:ÍÎ~&½›okÏ·†¬HÛ•§ç:dk?d_r:’dóQE9øYØœßsäzvÅCBŸ”q£}‰[ƒH<3$Ó[Wç’øÓ¨u¬õJSõëùÃ«µ==V0R)Ø!T4òzBc…£éz´²¯}RëÈÈ–Kzz«„ß)!ÓvÜŠéZƒÙy¬N†¡/‚¹½=Gz¤Â€ÇøÇô×!p¹Ë›„ŸûÚíúPyõÜq‡Ùã§q/[ç_şá;à¿ùÓ&Tş§Š­@ô}«Æ™K¸ƒ“„ør³z¤˜†ó}L¿x}
ÆP.ŒYÃî=†’f0l_Ğ[¿KÈğjeãAŒÅwü§Ñ%t»êlÇßÈ^‚gtb¥ùŠMˆÊ'5Pı,œíê5É`ºŸAÃ"	>Ó	¶1è—ƒgçÑ±ñ¤¸‰Ÿ¹“µI²{vÔx‚ı„Àêw»2à;ğ¥
“zõ¼6î*iüfBî`$èK[QlÎÀ»E‚‰àcØ	ºãØ c¥!A÷”’â–’Íme$Õ­š€á96pµfÿÚHN÷)mRİ¼¾¨[iü{¨€JZNĞ!åjä¦{”#ì _¡£v†jXÆ’ÎìÌ_ÊİöÎnºji;¦zdñ˜ø%qK	Gj3è-SH¬vëÉài$Å+©!ÙÂ—»j}­É‰ôXuù”ä©ïsá‰ş¦$©y0Ğ
uÄüiÔùÑ{›¨3ù…>f"…/HB3†ÆT÷ŞÉ\‚ru™ó%óÑ½j
íÑH@g€Ä}tÆÇ«Ğ-&<mwœ‚¢E¡÷'’İíÒèùŒä,$¡’1>¼2Ÿ”yO©£Û‡¤÷É’$°éüœ‚h:@…Ös ®Ú»XÎBdsÖ5 Oô˜cÈñ1-»Ç%İèL%0ĞÆ-H$wKCR‹ú€WÆfP aÁK×´°ô˜+]<C•küã-ì*¹	F¯€·VW”hcØ!íÓÓJèqP&J[¹~››.Ü?ğİŸ£è×Î)üDç0ÑÛeu´I­şMgº#¹¾¦&šs(’gj”ÿĞ÷ÁL9â0*²Œú}¨¬U\»,p~~<‰0†² ş;K8{†í unËj£–òŒ¯ıÈ`ÌîŞ;& d?ŸÁF%T.÷¸YÖàÂ:ı¦]iéÖàÊÉò¹­Tfó¯°R{&Hàï¸MNgëºŠ|M÷ph[÷ë‘„ÎMÄ'ÏéBr	¤Ñ³o°FÃ˜¼ ŠLë—Cï²¥ìÓÏ™²—$h
§åaÌîxb¡“›ó6hCª¦"9Â­Yi ä§I°Ò*É/®ÉÁ ÃŸ/X•Ø‡ëk*ÆHµs¯'T*e4ı4îÍö(HMĞà|gã@Ô½³“å§qŸBôŸ<´ÙscõÅœi°9w…lÍĞ}‡Ú…¡ß’À,t$s.’)Ü'\ÿ¦àHAWÑgÜyªTÁıƒ‘€ƒêW r†w2 =Ôê2TÏArx|ñm- ^y¬œÄüüÀKso—² ÄØíM	b„½s5jqÖù ¡ë
’P)e"'ÒOl|Ÿ­}Ö\f=]=ı–!(ÃqÔßAë5i(óæcF%\‚±¬:V'ñrCiGgĞv“ØÇ {ÃÓÈcÑBÙòa‰$T˜Ar:?~"WßZŒu>ë1d•¦†!äêhcª[(HN×‰WÙÇa‘Ì/ƒ$ä¤ ©ádÑ-ÇQ6BØ»çòL 8Î`EB°ÍW‡
Â¾©lå(õ•næqt$»G‘îÿàRzRçvUœò=Š¿âÑò‰ÔØ07jQyulPæ>ƒqu, ŞÍb|Ì´xôÿ*•ì89Õ¯Ç¢‘ôÎ¯Â=¥Q¤Î ²¡ßÓ8lÎ{BRÃ›^ä/ß;0ñ¾±ÓH{M_ˆBn=‘óGÉj} tgMÄa÷”;êÎ˜âl-${Ø‰WÛKß£PNÃ]R4èûpÑ¹?…@‚à¥–·BÈ$’6´ş´+ À şš¡ÿK@0<nFoË=œ…«ŞS§¿3wÜgAÒ»_O÷zŞ5Œ¡KÀÅÂï_ğµ†+åÈ6±¤c«ƒõ}=§® ÓÌGõı6“=íïC&ç˜$ãHôŠ˜7¾qôIÒ×ğ¸¤h+ÍÛõ+-éQR:·c{û˜ëê	Õ…U²R±ÍO	õ«C™VÊøZ¯ıìÈ)°ÂìŞ:è\ásƒ¢2è;÷ÍL‹„>€ş;«s‘A}ÌjöLp¿œõzIÂM»QDÅO#ˆŒ³ŸÉ»çBÕ¹‘ÉéùŒ	èÊD¾¦3•7›68%¾n=-ü›nÀÊ¾G7ª>ºN„£“Şg1~¼Ÿ½„¥Û“ïêÔ{µØ;Ÿt­±¡İs¨æøYü½s‹ìá›V8^®aéfçx"5·¦ğ¦D>Â)¡{Ğ;dezÄioÉ4ÒÕÙ¯êÜA2{Ş´÷›s¥ŞƒâÂåƒD²;gÃÓ;ÚŠ$dÍN„
ß;Ô©wÄl: &øŞ9p]»PóŞ£±ô‡¢¡¸®(}îecL¨vä>}îzÿ¦ğ#=—‡r94^ö¹º> ÷Òq¾‰*bÎÖ"óRï'X\ÔÚTÊ£<
)ûï”Íqrz,Œ•GRİ~›ÉoôŞH¨L`3 ©nçø5¡6Êäú‰~ÆÀìcr:“z™f@½ZKÿFÕb#Áå×´İê3ÆÛíc`&èÉ"±¡+J£ÇÀ )5¾Cî1idêùÜ¦À]Á) 0¢c Û;ç”ÔŠñ6ƒV¹Ç‚$X\”UiŒa¨úåºŠ1Tğ÷åJ’Ğ½
''ôéBRı¤\M¨`B¹šÙ#Å¤‡µÎ-BÎ¦ïÓ£¯ƒ¤ŸGùŞÅmKÒÚöß!¡WïSÆlá4ÒçÎ=Ê™‚Ñiİør®)¨æŞÇsÅ#H6ÇTgÊ
:_	•Nu†nõ
”=& Œ9=zÉ²å} ¤z®ó æ$ÔÇsıFé1cĞêœBY>øÊ®G/rm˜õ•çO#*¯·3-ÕOg‘d´{n,	U$éï@¦sôÂéáÜˆ™ô\Çı)êÔyL0‚f¦:ƒœè«íÕıàIĞo´ZJc`*ùvÆôL—UÏl@B¨Éß'qJæVâö´€ğµ	¥8†?OTóQŸ	Éî5a >¯nq]Ir^Ã	İñôM1Éİ¾
uĞq#ÀÌüiyüü°mÌ…C™éÎç>’€ !›Gçvñ\‡ 	³Æàqú<·ƒGÔĞMÎg@Åİ0‘}İè®é¨î»Éù‰óÒ…¼©y¡Š¥ï^ºé}½Ğ+&Œ4ç§‘_ñ¸æ¼ÒBÙ5ÅJáA×míW¯85“{ãy93õÖg7¯©6’Õ£<Hª³‘œÌ¥gü}È;ÖhÑ>êP,=W&Œá¦õı¶ptM¾hyŸ\‹0†Ó®]`é8¶1“ÛçÑ±¹B÷Û¹BnòHÅ÷Ö×‰³7çJõ™ğ´²Û²ó5€¥NÖŞà¸éŠîm²¢wüí0†n\~~èèœÆ'XO`5Îªœ‘8ŸbæWF×UÔwvşM†éYçù?3G#adã9Ö9”ÛğßqÌ“sÙæ¦…ïƒƒFÒ~£Üõ}Š,!ê@‹ëÀêt»ŞSšAÙÃY K.¬L¥€-q|t&ÎsfªÑ;Æ5Ÿ@Ä®wNRî|­É^ÎIŸH·à#¹E¼44áÓ“…$dO/¨x¯edwoj¡~•31±SB¹w^Õ%4“èñzNisºÖ¸‹Çô´nu"	5™‘ĞÆg]G#sºHRhãLL$Äºôw:@;SšĞ:‰’ ÕmŠ…@qÕcAƒºG‘ëi¡\´[HÖ‰$t9¥Üm¨i±pi:	Iˆ–#9=»ƒ0mq†
„lEı
Ğ¸\[2/#Œ™}hqË›Â¾8•ş´1ğ°çz\Ï&)gó[sÚÙ¹+µ=ïÉé¶?ÅH¶°C.>’ï·€ÇõÁ@
_kÚ8×ƒbÑ£3¼„<	Š	uî…"	½´JĞíBõ÷Ju9–†$Æ‘T_×H<Ò• ñŒx$¡ê	’Ğ¯4uºCè%áÙ±´ˆ8Ìw»SšCçÙŸË•…å§*ç/,W’šÚ.HÖp—Ğ—Á-U’UHJÔ5ÀvrÙBŸ;¯jK²ÊnCá^ÀŒwÄy¹*A¹»ènLÄá\B%¨`PgÕ1U
…AóQ½İı’½ç™œ@’GÇP“_¿¹^{¹,ÍèéKâö*nèïÀ
÷*Ösp—K‰¸MVä™÷üóvüB}ß‰:¯I“!âËş>¸QâÀeaï¸MA<–/0ˆŠï7Ğ•`İ’æşÏºâˆÙ²’Zî;d¶`#­c@=ª:9–¶Qåh’P%qÙ(ëç”ì¨°{aÜ8¶±ltuò]µÑ\Å×z#"f0ÎS%É•îÓºw6š„¸¥ºM4v×1µ¡È³Kheí¿Séäæ7`%
—$Püw°Ö]B/9Ï*[¨€ç((šŞëïP7Ü½Ğ¤Ä‘……àÎaBBqÿ<~·«¨ï¬VXƒ>½ç‘”¬(Ü$ß‰¶e’°
>ºü¸5x¢t­|eT	^˜Áz],´qß!W ß½Ô:>í	ïÉí’ŸÓ‹»âg4ÂùñU»]YÈ
–Îtû/'¦r |uhÅµ¹> ötæâJE?¿eÖC^í7
Î®G×+p§{	-¯l¿Ñ0•€V›‚1Ôò1D_t¿‘LrCa=Û+ŠÇƒ‘ĞUÃŸFm†0·²;¿¶´WÖ=Š¤ó»~íÀ:}NµŸŠ>bë¬;ÒbôdA#xÈ%qlÉîü7R±[GdĞ–ÍçFÿr¼Nø>ô·q›ò–!cs'ÔÌ^©Îçw0ªUê¬!&8”1»g#	ŒOÈÜ¡‚#‰ê›kr‚´$køÜ’¯I@-p‹­|IÜ+ `(Å¨t@ÎPaLu@<¸¶\AJ<GšBa”qñ$î$&,¨]3¸t™½á4ô]q}0  øi®Ê+>rÑ\ïPgÛ½6Lu‚áiÍ½è
ßßùÊë[Ëß‡‚ø“ ïî¼Fg@Š°¹µq•”š‚øÓé;‘ ˆ{ï+Éà£$±!Té%ŒO#]ëBµ½Á%àä~NK	=È)1ºûØÏH&Ï±Aí+UN=ÂAH<ÔÌ^ç"¤¾)Õ6‚…råZùê@€s1íÕH÷òß¡+›ß%3¶X’¤HÎ¬Û|+’4õü>…ƒá•RÖ™Ü“Sß¤$Üf¼³ã
ìîÜ$Ü@ş;0{ü6£›ÇÍV2I½ÆÍ
†´2’`‹ÑÍ®„5 óŞwz"èx`Ãp.¥z´oÅ´|W­ €¾¯W° ?Á+„Üğ´q	Vu†5\9¨{yI‚ŞY©Mç³†9âñÆæˆw]É&ò˜Ä
?$ØbÉíşå68ÎnÃnì_QÎ¯³ÜV:Æ}½ÑùÌŸV1•ıœVú!W=%dÓzÔZ‰í†§õ££ÇkÅs#ÏÈïS*‡u#)Ø°¼ÃM[¯X}ÓXc
âŞgï ŞúÓà_»í²Ãró}@ÇGWz¯yıŞKâµö„èñÈSğYC`õ†Š£Ç+µè‹ïØ{õØÜ+5n<’Bùà¤C¨å Ö£g}ôM‰¯{4vñöl$!j=Ût/ĞÍ±´îY¸‰oxty=]üû€¡86¸R[xv+à$4¤g– e½=u^Ú%ñÜØ¢÷Îf¸$#!9¼¦Ò•Úqe$Õ3S‘PÓÈöÁ•æêÈ) $C¼$	½–6í9“É1ë±µ$éîErp‘I¨fzI<*¿µ]	«s]an\?]·–¢œº{	¼ÎÄÜàâ„]ãÆıÆ­ÅıP<Éê((’ê·”PÃó`ó¼j$Á¾¦ÕlÈ›ÚP»ïJ¬9Ÿ¤æÎ£¾HB=;$‹ã–H‚e·‘…åŒv$«ßLHBi œûY*NmTır[	W“î7ğY¿isø=·ÁÒ	ºŠ".nldŠx¬€%„Ç|nÔŞ³NèşF–³œ“o š^ç‡"èt¤Ô¹Q³Ço@ÈÏ¡S2¥½G‚‘$}@[·(µ²ÊwŞÆvqOIà#mW»Aÿ
ÂuÕ­3Œéw¯(é?8>ºdø«Ï„dóª[ëğéVç*:¯ŞîUÒQ]$ÁoÄ-iCPCé„~®p¯È‚„F¸ºGÙ:á“Ëîz‚†7Eâ(ÀÀíè3¸¨d.ôkÃ=½Îxî/lı³Üvá8«’P%ÛtnsCI!—´w¡IaLğÀ³;FLÁ+Ò%ıi”wñé±$Àäáit$ó?cløŠ’¾æŞû6hõ>ë«Ú‘JèÏálnZQ¶'Œ©îñ3ætcƒ°ì’9ÜšPeÃî…*ëÈÆN¨K“â9B÷u£Î·×ˆÚğuaÚ@²œ]»tu?‹PÍ!t­×ö:„ ç¬r‘pkùÓ ú>€äUv 1SÁŸ±Ó÷5]œç°Õ‡¿B]³.¡ÚÒëÈ™=•—ƒ>Àav¸˜g¼m\Â^©ÉêëÆEç89RYtE7ØöŠ¶2&ie¸é}Èq=Š*_}Ç£Êƒ>Ø¦ÍyBUJ‚íO˜#?Èœóa·J¯Ÿ5€<jµQåÇ¹_[%Æ–êÃn;g¿™vÚ›ù9VÚN›4æğÚ&óB¼ñ’„S²cS„Y@õSOíç`ÒÉ-èƒ½@³ÖİKV™ÇO·}ZuD‰ƒÁ™˜HÆà7ô8p½s´¡ÎÏß3x9G7†÷!ÚX]#Ñ³5 8s|¿óyvûF@3¬á“U¬Án«ï7Ğ¼0<³p~àG:“y£k¹gÍng9ß!'^µ®(¥ÂŠów®"bn¥Q¶µh;Iõl<è–ÅqåÚĞ÷KgMÛKò×ôwèæêµ¹i2DÛ{Ón­¯“û?4Ñ¿’ÓëdÕ+ =øJ¨ûE	}Zú˜iqVÁ—€ÃVBÈ~Ÿ"ÁıĞßé:Kè¶¡ö5åı¡€û˜ËáâØQ²	PŸKèæ{4Ñó+UqÜ¦¨Ô§ïÓ·ÔİÒôø%>ƒ¾ãù˜+	*HêìoÚÃÒ9|•¤}Ç÷ô÷¯p¹Á>ë¡	•±+¯SdwfOeÒn+#Yõ¸$İ2xÍ+$!‚[ &_¿~æ¨tÕ@7!ßñWŸ®$áÒÒ/Gr®gX’^ÏfÔ1#öµÏ^¶{Œ+ìŞ±[<2TIåq–’ÕY{Hv¯ÀPG’îÂûoôïC-k·6êHÂ›Ÿ²ÊÂEÅjÇ ¯¶"Î0&Õ‹ü5ı
X‰îk2æ;òf¸1®¶“jAÖÂeR}]ç±Jé3÷$(_Og8¶¥ïªBÇ×…ûÇõÛD2¸?R¥×$«ˆ³ÿtËğM'r \‚Ù9››àÿá™œ•’æÎTªTÙq¿„dZ?ëŠRÇ³*ÙkAV¸_Îø¬W±0??”©rœ‚‹dqÌ¡.9ğóƒ$Ø.1_kR»ƒMÁ>ôa¥O—G_*9já¾’V}÷‚	¹¿PIØ7àÕÁË÷é’óP:&ø9%À+~TòÍ‚e·Ò·Âg ÙİcF‚I"ÔıF/kÖ‹´íÙk÷Ö•ZG¾C8æÀ˜=¬Ü¯Óí*…/·5JõMA˜Éª[{†Y@§„:ÎœÖ
@›Ï€æ;~ê·>t éX`kU‚9áŞÆ‚õŠz½çùÁHª3>iî2‘Ğ¸Bß´6}Ğ‰—Cçk@Ë`á“?n3\‰p¶k¿xŠ¾G17‚}éà1°ŠÄ9fHÖ4ë1t·¤y#Í.|E1CÜ#ìx"ÈAï€‹­L­Ù C8~@és­;uœ]WQ9ÉQÃºSnĞßtG“»Í·f
c¨‘îÖÆÈçÆåèJ%‡pô»IØ×—kêR‡Û„)Ø|ô0kúÂùêp“8Ë „vİR¥rRØ½dm®ß¨©äÑHë5X5dñ‡ÓxR‘õ,P• Xgê~Ñ’€Rú´³½§ëÙ£[Ñ'ûÚ÷Õ´=7¶"	øÁI[×£H‚§«&h¾sZÜ‚ŒJÁh[$	‚du%ôÃ9EBÌÆŸ6 .ƒ¤º÷ájÛ“Ú¾xLb§À™sĞ‘o—éÁ£±Hß‰;Æ­Gå‘ŞàÎÏ¸æÛiLÖİQ;YŒÎÌ†ÖC’®5t?Û{IïFZlÎsØû–Øƒşè—×ÎàZX½nëŞÓIµ©åád!Ù:ß×4p}½÷˜Uª] õéûPiÈ½÷ó'"ÙÂ§ÿwø
à;^Ç9hK$‡ó zlWpI<û†‹–¨®AiBm ıê¹¥Úr§#€$o÷^ÁÉâØ:×p~ Z8Ö¹_íƒ]#Mİ2	Ÿ[-Uç¶ARê"ô&BºC‚½‘ ¢èW€öäøcçzì°t¼!b]ú;d¢9rºÏíâä;…÷Oqe\#ÿN½ß?s¿¸‡ÌÓ0_ÂÓö È¬ğ{{§o†ÇçÔp²f¸®)fnß;ô:÷úb;]¿ÜE¸­—Äc,;Â[G8?;¶†{È$Ğµ^¦‰Ü¯’~—PÏyŞŒ9ÃŞ¡«¼ã‰PÂ‚O‹„êµ:kğóğMA=Ü›¢hëî,«ÃLbuĞñğwÍ£ÄAè´‡ät¬f_IÏõ³°âù™£#%ûŠâñ¯MÏ-½ïeÚuş—÷¤Ù©æãY>;5ªÜÇØAÂ;g'¸æFĞ5Üõ5qA÷JŸ!õÑ‘°u¿UÚ9l.¡‘§kŠOáŠ0¦„¯,$ávFô(½ÎÃ¬1ÊãÚ1°=z¹“YÎ5™Ã)Á¸t†
#Z;êêÀwq¤dÇtˆcPØáiÇæßÄÎı9RÁI õ§QBÅŸvP5ÕßçÂ‚¤ƒœ§¿C^›×=ŞR†ÜV¾j2»ıFMæ°:tèu§³–Ç¦$M>ë(ÎN½6;#¡|†¯Á¸yÆ^-f'£Ëóƒ‘çîïÜXáüœDûÜ£¯|°¯OHşµ¯œ;½O)yEê‰­›Š*’.¡Êş°ØìÚIà#	>PÚê>t±ĞÉá~	éB”	Í…ıM&œJÈkóhi{¡Høvş4œZ=“×9E|gRV»éJfõ\8(s1„ìX518÷r(r<#$›³µH¯½§!í‘ã3©Ç$¡ Êéùf%:<NñµÀ ÿ$Qˆ„è¡Î­§L–ï7šü¸‡jŒãOëIÈpÉĞ;æ@É¸ĞİÉâ•Ši‘2Õ‘œá+ôeõHÊ¥âİ9Èô>EB&}SX:ÉyÍä5ı„ì$¡c)’¤]†‚›îs»ºÉéøÁ1Ò/Ç÷5é²4óöû‡’~şuäiøÌ˜İYıÇH¿67!vÀ«q<Øõ»‘†	 \:k$^«Ò`¨Îz”.ä£#	=Bœi }ş}hìè¸òqJñ}}ÕdvR&
ÎúP¯&<¢_X·éôòƒŠ‹F áØëÈø;~¢¹¥Ïz‚Jæ:‘:Îa­'ˆO¾{¡Wyù˜ 3øMøt"C™pÌ°Ô&.ë=¯ÉâÜ¼ƒ¶lîk"ûÑµ¦{¼Gî2Ä•:èäã¬=$‹ó/‰G}‘áû\™[ş}¨uäHÖÄc,HV÷e9ìÅÓƒu»¸=º¢dn…]*å¬=Úˆ6ÎİGº®¿CE#ÏDcL]ıÆ jæqÀHq½C',ÇÅp¤`ïPhÎ1Õc¥~¼bªEÖ¼ba®Ó+_çætNw/çØë	)äºÖğj¼jĞ±õÕıàc»š6øÓ ñº®¢~°ãä<íô:?IÒaïˆìì&”è˜ÆPWÊ÷xUørÅ×­Ò(ÙO04^gÓPX=¾p@ulã -rn:ØëW¸Ï>·½İÂ~# åéc‡’åëFtçz;˜ï˜#á4RcÔ£<Ç>Q0Úßt*á_=·ü4’åµé§^áÉì­4ÂÁîâ˜„/G4Ë£p(ÇÄØH^Õé ¢‘³¹‘${oÛ±´ã$ûÆßçìCö‰×Bú@!ÙÂ~;éöäzçC®<ĞPà wN#’Ğ·ül(ú¨'Ià#!!µİ{^0’j—«|•g>"¡ªŸ?„*½·Ï†À³¢áH(9åO›èò¦*ö83û¼ò³ÔîE‚{æO£bSN·ãO¢æ…^>”N'Hg@F•ÇÚÎ®Û<§	t]Zš$ÕëWq°B™Âcô6ñ§Á]IBCùß‰Ô˜vßŒ@hëUB d…ş%HfG0Hnœç»$~/ BZÏ@Be}SGî®¢÷®Gq[WïwI<*RvÅqŠKâ˜İ	ŠãëISj¿1(Ä:à!!*®k Vã‘®“t@Ç‘Î3~J°ëœ)Ë˜#ÌÉ¬@8Gø\ÚÍ¿)æuØ£TÒqüú$áÀï$|"]·«ß”Z4\dËû¨ ®ÉK9=V}"q4œö0Óüw¸öÇ¥õ˜ŞI|Ğ±AŠ“¤¿sg]]‚~óÕ™zÊ]„1«³ú!U†îHHBí
†ú–”á=³ÉäøyU…ö¥‡¦çt¿_´×íŞsæ.ñµ[ëq‰txÚİêZSã&Üè	ö´A÷ü,špŞí	¶áÖàIsI÷Ñ‘Aó-ÔÑô[#ì^*„¯M—¬ ]håæym'Ø†Ç³0B€hu­‘x„1d éÚ”¸],ØÇ¹å÷6Í!¼¦ÅI›…ÑO0Ì}ØĞ|›;Ãg0ÒkÂ%ô^sH…ç`ó­°*ıÌ‘áéÕ2Oú‰;NQ©%¬,ÕÓ5õjœ‡rRæ-¬ÁU‚Á÷(96á–©-YjºnµÅ¥s	µ7}­éóÖ­ÂÚó/Gbuø
5UŠ¤äc²È¯<üË‘ãÀVËæûšvĞ°Z<“ó$“&XtãòªêçNî˜…KâV ”içSp‡ŞQ vôWÖoJÔ9xmP=së	ÖíN×Éğ;T¤ô=
fö5h„£­'<”`A’Iã.ç1¬‹M;æ%x¡¸SÎ‘9Ïnqvà‰QfíhÑyÒÜ­ÛKRõËQ/¬ÛIaÙ×@‰4€0D“’©\?ŸãLß||ùğx÷úñw¿}ûòíÍÓOzxş¯óşİÓWo_şåæÍ·/êÍÛïîn¾ú#qÍîíËïş¼İ½{–ûÃıÃí–|÷áûgá×_<¾½yóæ|¸yõ,ø´uŞ¾|}÷ø~¿ıáÓcßüñæáÇ_ûå/ô__ßşğ?şö¬W·ïnşùáşÃûÏ¿öñáæı¿¼{Í??ÿ©._w÷îéwoŸÿıñÃ÷ß=zwóğó}x÷úşåázà7¿,ÏÇ—O?İ¾½½Öç7ï~üêãç5º}÷õ¿÷‚ÿu{óø´>Şİ|ûâ¯?}]ÿõıñå«7ß½º†ıñæıû»O£¾ÿ±ıöÅ›»zj¯aOü¯×7şô?¾ÿ±û"ë>Éø_—ìÓÿ¸yu½,ıå?®?øüŸüÕ—ÿøåßúçëù·áùß†_şm|ş·ñ—+ÏÿV®ûéç÷·oîŞıùÛûÏëß¸óæşãíëßÿ"ÿÕ?}ZÂ/oŸxùÇßıPK
     ‡Nâ@               word/theme/PK    ‡Nâ@3Lˆ  ;     word/theme/theme1.xmlíYMoE¾#ñF{oc'vGuªØ±hÓF‰[Ôãxw¼;ÍìÎjfœÔ7Ô‘õ@%Ä…*µH”_“RTŠÔ¿À;3»ëxM’6‚
êCâ}æı~ŸùğÅKwb†ö‰”'m¯~¾æ!’ø< IØönúçV<$NÌxBÚŞ„HïÒÚûï]Ä«*"1A0?‘«¸íEJ¥«Ò‡a,Ïó”$ğnÄEŒ<Šp!ø äÆla±V[^ˆ1M<”àÄ^¨OĞ³ŸyñÍo-—Şc "QRøLìjÙÄ™b°Á^]#äDv™@û˜µ=Pğƒ¹£<Ä°Tğ¢íÕÌÇ[X»¸€W³ILÍ™[š×7Ÿl^6!Ø[4:E8,”ÖûÖ…B¾05‹ëõzİ^½g Ø÷ÁSkKYf£¿Rïä2K ûuVv·Ö¬5\|IşÒŒÍ­N§Óle¶X¡d¿6fğ+µåÆú¢ƒ7 ‹oÎàõnwÙÁÅ/ÏàûZËo@£ÉŞZ'´ßÏ¤g›•ğ€¯Ô2øÕPT—V1â‰šWk1¾ÍE È°¢	R“”Œ°eÜÅñPP¬àU‚Koì/g†´.$}ASÕö>L1´ÄTŞ«§ß¿zúŞ}rx÷§Ã{÷ïşh9³6q–g½üö³?~ŒşxüõËû_TãeÿÛŸ<ûõój ´ÏÔœç_>úıÉ£ç>}ñİı
øºÀÃ2|@c"Ñ5r€vx™¨¸–“¡8İŒA„iyÆzJœ`­¥B~OEúÚ³,;âFğ¦ ú¨^ßvŞÄXÑ
ÍW¢ØnqÎ:\TFáŠÖU
ó`œ„ÕÊÅ¸ŒÛÁx¿Jw'N~{ãx3/KÇñnD3·NIBÒïø!Şİ¢Ô‰ëõ—|¤Ğ-Š:˜V†d@‡N5M'mÒò2©òòíÄfë&êpVåõÙw‘Ğ˜U? Ì	ãe<V8®9À1+ü*VQ•‘»á—q=© Ó!aõ"eÕœëü-%ı
ÆªLû›Ä.R(ºW%ó*æ¼ŒÜà{İÇiv—&QûÜƒÅh›«*øw;D?Cp27İ7)qÒ}<Ü ¡cÒ´@ô›±Ğ¹ªv8¦ÉßÑ1£ÀÇ¶Î Ÿõ°¢²ŞV"^‡5©ª6Ğï<ÜQÒírĞ·Ÿs7ğ8Ù&Pæ³Ï;Ê}G¹ŞrçõóI‰vÊ­@»zß`7Åf‹Ïİ!(c»jÂÈUi6ÉÖ‰ ƒz9’âÄ”Fğ5ãu
læ ÁÕGTE»Naƒ]÷´Pf¢C‰R.á`g†+ek<lÒ•=6õÁòÄj‹vxIçç‚BŒYmBsøÌ-i'U¶t!
n¿²º6êÄÚêÆ4Cu¶ÂeÈá¬k0XD6 ¶-åe8 kÕp0ÁŒ:îvíÍÓb²p–)’H–#í÷lê&Iy­˜› ¨ŠéCŞ1Q+iki±o í$I*«kÌQ—gïM²”Wğ4Kºo´#KÊÍÉtĞöZÍÅ¦‡|œ¶½œiákœBÖ¥ŞóaÂÍ¯„-ûc›Ùtù4›­Ü1·	êpMaã>ã°Ã©jËÈ–†y•• K´&kÿbÂzVØJ+–V ş5+ njÉhD|UNviDÇÎ>fTÊÇŠˆİ(8@C6;Ò¯Kü	¨„«	ÃúîÑt´Í+—œ³¦+ß^œÇ,pF·ºEóN¶pÓÇ…æ©døVi»qîô®˜–?#WÊeü?sE¯'pS°èøp+0ÒıÚö¸PJ#ê÷lw@µÀ],¼†¢‚Ûdó_}ıßöœ•aÚ|j‡†HPXT$ÙZ2ÕwŒ°z¶vY‘,d*ªd®L­ÙC²OØ@sà²^Û=A©6ÉhÀàÖŸûœuĞ0Ô›œr¿9R¬½¶şémfpÊåa³¡Éã_˜X±ªÚùfz¾ö–Ñ/¦Û¬FŞ ¬´´²¶MN¹ÔZÆšñx±™Yœõ‹Q
÷=Hÿõ
ŸSÆzAğàV?4haP6PÕçìÆi‚´ƒCØ8ÙA[LZ”m¶uÒQËë3Şéz[[v’|Ÿ2ØÅæÌUçôâY;‹°k;67ÔÙ£-
C£ü cc~Ó*ÿêÄ‡·!Ñp¿?fJZÙ´öPK    ‡Nâ@ˆ èĞ  ó    word/document.xmlíkSÛVöûÎìğx;i˜ÙÛ˜GhM'@Èd¦»ÓiÚÏ;ÂXYòJ2.İÙš@	)i“Ğ6¤MÓ&m†æÕMÍ©eÌ§ü…=G’e_?°1ºBRo˜€-ËWçsÏósî[o˜Cs¼¢
²”Ç"Ñpˆ—RrZf“áŞŸzc$R5NJs¢,ñÉğ<¯†ßûóŸŞ*Œ¦åT>ËKZ†ÔÑB.•g4-7Úß¯¦2|–S#Y!¥Èª<£ERr¶_™R|AVÒıñh,j¼Ê)rŠWUxŞ'ÍqjØ.Û<šœã%xÖŒ¬d9MÈÊl–SÎåsoÀè9N¦QĞæaìèPu9Î+Ò¨Ğ6@ø•Q ëOõJÓ,Z<×üæ¤…ã‰ı
/²¤f„\m½SÌTAšÛosY±z_!K4=Ïr74˜T¸¢6`Óp-‘6¿”M< }kTm±›Éªãf9A²ëm¢u¨ŠE÷Cªµ2Ú#›`ß·qc}×=2,u9­ÈùœNN8Ühg¤söXÈÙ€,:Ô45õ@4ñşÙ—ãmprêD^Õäì$§qö¸…B!RÈ©‘”d	’:î‹ôÃGµ/…CÙÔè™YIV¸iæVˆ%B…Ø`$<²kZNÏãßœñë]ÿ¨9.k?TDH<ÂĞ|ó^Gá´wxNÕÂıx·b~iÚx“’EY{ç81šŠÂ?ó.õ£êÕxõÊ„j_ÂkıÖ`ğ7gj€c=@™’%¿‘$-F Nªg6íÜÓ£ÚØkÇûJÅ+»·õbq÷Æƒòúóò³›ŸfBiü6QvX¼˜ÂD¶zƒŸ@l&Ãÿ¡³/¾oL|ªŠE‡]ãñk€}XØÄúÑÓ¼T\ø}ác‚È°é¬p\H9N›A=ŞG<Ò1ÚÁº"Ñµ/¿ºâº´sØøÕö­Ê'¿ékëúÎu}åª¾ta÷ço€ÉË+åÛ+»÷×õ¥åÊåó»çŸÿ¾p¾òò†¾ñ5~úÅX¥âæŞÆEıÚ2|ÄFUL!Áôµïõ{ëH°'÷Mé[yù…¾ö¤ôâ~ù“ûå¿š$Ñ×Î—o>}µ½ª|«TÜÚ}´±·°RşênéÅ¯pÑ$¡u§Al›„¯¶—ä0`åÂy›~FØ|µ½Ò‘º!-&@)²X¾––ãòš|´'?yªí'oøD•¸ÜûòiEH:¬¦|¹éoİ¨95%€áp¨²ˆŞ(Æ“’Úp)æˆ}‹9¾­ˆ-†y„ñ¸B¹WHæ?•hTfíaCı?›á¿VEä</Šr‡¨Kè˜¨½IĞ²xrdñ¡ã†æSîvèöX]9…Wye¥…¹kS›OFc$¤]›ÃÀH"‘§0‡¤kSˆ'F&F)LáØ¿ò²ö&,©˜ùÊµPãüÙÎoeT1)n¹SÈ?Z´ä¦-©nØáuÆ¸m]z|¦„
£ˆ)!#¢ÒÚÒ	’ŠI	¡	Úïš>¥eƒ¢¹éÚ$h)’±cİ5çë ‘OÒ¡êûŞ!cÜPçƒÿÚìŸ“«‰™È=Ûİ¸áÕx|59><Ò¼â@ ã5×„st(ø Ç]›ÂÀPb|¢iOêğTh¨™ÉK)Ü	w/ZCD}ÿ&ˆÄ|ê}¶(ñyh‘Ò-Ÿzbød”F`7e„¼yb5ÒŒíÒ¢ÃXD”g‡^sOøQ‹!¾şğâ¯ûŸ$}{[6ÔGn0Ç^ñnl¦‘Æ:x¶ä˜À;ÀF-±¶¨é šÀsMxÓÓB˜Ì%Ôêa¡*H åş§İï´²[ì>Ê²$Ëmãê¹\ÚZu5C4%Ê*¯j´2Dí-ôV¨;‚Ew Âº¦’¥ö±\—„¾ôlïóGL~òŞ¥{CÚpùöBåå§˜¼zI|^Ôç×W—ÊWÖçW.mV¶~ìÃüÔ—K{w_T¾ÿX¿ø¥™¥
ß®e¯>‡|ÖúÚ&d£–Wş§/?­OZ:¡	–0ç»ç›»J’&„:5/£/RÕğ‹·‘‡°	=ß#À± 8ßÁ©ÇqÌ(ğš¥èØÄ>wÇµjÃİGlƒ£•[^¿T¾ûÔÜÒ¨%®3éjíEJä9‹OTBi(TÀàÛA„
ĞØ)ü1¸ô?¡–õ=,Ü8#Yµ.K_`$3+ÄañMûT{v'+«%¤É°şøJiçº1¦‚bL&ğ§1bÀN(¨+i5®öœ«¤é^#@fC4ÒH;Ãë|MÀ˜˜l*ªéxGs{€ıPˆoLUl#3<·ÊqÕøñÎæëö°lØ’GåU×LíÔwR`jÇÒ£ğ§Ú‚šô;ÂÆŠD˜On‹î?¬Şñ7æ}­xüúFc‹i¦y,#Ämá}Í“cjÇh‚ÑƒÑİ«u…îÑîkãc¼3…ÓĞ’†EØÌÎ5‡ìqĞƒä;ŒÂÉÄ˜Æ9
ãg¼ûZåøñLç0ƒêÅé¶hnëœ8Ó9G¢s|Œwë#é¦s sø,Ó9G¡süŒw_ë?#¾+ÓËñDŒÊLÁ–Q½À=4­½j˜f(WÜ,Âjİ×G¦!qš÷‡ÈÖ>ÑìÖ[›İ.d¦ÖêpŒ¦üõ%6XF³´¨oß1÷ªšÃéD0€`·æ/=¿ÓeG~jg&0¨C·=*…¸ıÚ8ÎÁ!ª„è.«òéU¦`zJ
S"5­CP%€bÎ‘E…Q2®èæ Â‚¡F‹¾WLáOQÅgƒ ¨BøY:9{ <0}cÃMlL‚ãïNŠ"úZpÎœñ20K¬œò‚ÓU¼²÷Õ·ÖÙh¤—¥¶Z*^n÷)¶;0ÎåO3Ûè—ï@sƒÀÍ1É@hIW: ;8(SÑ¨+mİpUªY}F?4Ám!sµw(é¬wa’¸.®|¤¯L•$8v(Á¢j°ËË›åGßğúYæ¸&Hßk(‰ZÇ3ªÈÇyŒ´p²0ªNƒÀĞêG¿¾©/¾„™şıùò×·Ëÿ½kœL‰[âÅk«¶ıoíôå/ñ»†Õï-Âá—°\@ó–v.–ŠW­VDÕO )v
#€R¶o¨üò›şÃøzı"[s6Äµ‡i8W†ß!EÍÕea/…Ú‰Ç8†’îX†mÄæ‘°l·'¤²hœ§:ZÕØ‚Ğ#4W½ƒL 4 ágñägØI dûaàvn"ù8Ûøò†ocÅH80«”D½s”æ^ÒÔV1ò‰#¶Ù"U_B÷£Áç	Éı,˜ƒİÁxÂ´OÎD+)æàÓ1° /=r5XP¸npà_k¯_‘$^ÁëyÉ¼Ã–éUõ@4Ç„#Ä;*ß-•×Ÿ—Ÿİ„à™şô§İ"¤‰•¶>)/Zzñ°ôüii"#¥âf©x»rÿ%îRÜ~ ?¾€±{ë‘Aàı§ó»Ÿé®a´åÙƒòâšd¾<]¯üğ™¾ö|nèHvÊ¼N™Æ1ícÎöáéæ¢zP3Î$ ‡g‡(LØ!\‹#Óc0¨N!hÙÆp$ìGíPúàğvØxùàQLz¤*"šÌMLDIªPwÚ(0³Ç’áÃŸÓ #™Ğá…qìğ¡#êŸÊfx5ÒàØœ‰8Ä‘nµ¶
m¹†¾bû¾\†¦EØ«Fó ê0dôdÍŒ2¡UWZ‚ø”‚ùf@œ»H¢*+¶¡‰we®t–Pã¥„ƒÓ	† ¹¨è%`Ü
ü8A(æ!C~V¹~†½+x@çÅ=g.4y{h1ÜüÎ2w°0·¸{T¬BLp]3»Á:©‹šÂıA»Yà‰6ïÈº¢Gf:Ä£Où;÷&€"Ö¦Ã€çL+ß¦Qâü5& BÏE612¦..í]x`š1 ˜~õ¤×ì]Z5k ú¶©Ú6æg˜†sÿs3dÂÂ"µ†¡şTB«,,ÒÓV$5Zôæ)–º‘JÌÀiîuH8,6‚ıßÃÊ¼˜†.“ô­”„§œ–9Ä¤Í`oşyÃºÑ—¿ÙûòmS¼Ú^6¯ì.ÿº»õKv.B^®]Ï<-§çÍ•WÛ+„¸ ïˆ¨§&ÙŞŠ—öV,Ö'X¢ç;²¬XˆD˜Íˆğ_sr“áy^åªJE–®ÔÆú˜áÂÏÚÁ1Ø¬ B˜¶~«T¼°¿íåàlÁgnİ%œK§Yƒp}tİ YØÂMëo÷Å¢~m¹|ı*\'t^+fa%Z¬D«ñxjUâ$$M#Œ^v6¤¶`†‹³§œtÈof$ÙÏÄl#baµ’t°å›‚S+À$…Ã+ød8îÑİ62+Y`%'Æ‡Ìh¨úQÕñc%Šu\7"ŠccC‰ñ‰¨ó+²µ»3Ç)äaH4å8­Àeë©ñ"ŸuonƒÃÃ'¢'Ü"[Ò½‰Ñ"Z02ùÁ¤BB^g;”	y&ä9ãHÑ>-yÑ^ÈÇİ†LÊÛå¼™îvKPG0¨Jxº4­zûXAI¿&¥}Zx › ¿?T¾|±‡—€¦5CÄĞBR¡:±¢XìDñìb"2v<BĞ ÍJrdwz`bødtÀyûz,¥ª®M‚–n‚tæRçf9/¥`QÿÕµ5EOİ™é ËØx'PÓÍjÎÅ¨>İ¨ÁXúÑÍ¬‡1URüñ>B>Ğxò€ùj'8@m}m}oŠ„YÉ·+«ôŸË%h¾ûğ¡Y­d·6OQ*í\İİy4À¶ Œè„g8á	ˆ/®—¿ºÍ`ì{ò–ÍÌOYca+, Ë—õÚ<P8j)y‘ñT}³S‰ñA¾YW,2íhdš-94›P<àÆ²ùËÊ6òøé6.
Á
Ic
9ˆEÕÊ„e2ÚB®õ[ş!¿D¦)Ã©™DAa7&ı<•µH0“~û9³DÉBeÒO…üWO“hB&ı˜ô“O+BÚØ¨ÕGp3¯$ÃVê¬U®k7Gèu]w“„¨“~Lú5o«1S|ŸF ,:Ç|&ı“Œİ:°³ıüeûÕ¬3V½ŠİX“p¬Zw©Õa†?ÌF%cğÎFğÍ‡™!½ËD!Ù–3ÅŒ‹ÒÜ/81›85NaMÅ\›5¶p/™ş§B«“8PR5v`u½ÛK îÉ'zu
„ŠV$¬"	’À=os×wZ–Ïe9åÜYS°ªÆx!qYh^õÓò8Ty™¦ZõŞSRÚ¾Ó'æï€Oiæ ¹Ù³Ø™§Ç±áAC‚A#¬ht8f”›ı´1b
9‡÷$Œ'*ØÉŞD·Ó²¦ÉÙÚÇ"?S÷i†çÒ¸y4¾	4#ËÆ^’õv6¯Õo-f1â‡îÌÉºGÊãà&<i9…ûSÑ|nÁØ‡Q:/Ş´Tú+`¥2œrÖÈØ¸TªÖÄá%öÆ6¬0b>ËKÚØÿPK
     ‡Nâ@            
   customXml/PK    ‡Nâ@Ü>Ï•        customXml/item1.xmlÁ
Â0Dï‚ÿön·Õ‹”$=´xÔiª…vSº©Ñ¿·PÅ›×™yÃ“Å£ïÄİÜzR%)GÖ×-]\Î‡ÍCµé<9OÇPèõJrn'¾¯L0b>!VpaÈcŒI8±„¾iZë*o§ŞQÀmšíp®Ê7
›ÿIk¹XœœÇÑü –ø3ÀOuıPK    ‡Nâ@cC{Eå   G     customXml/itemProps1.xmleQkƒ0…ßûrß5FëÔb,´NèëØ`¯!^Û€IÄÄÚ1öß7t}ºœ{¸ß9·Ú]Õ\p²Òh4Š!@-L'õ‰ÁÛkXÇuÇ£‘ÁZØÕUg·wÜ:3áÑ¡
üBúyl|îi™çmŞ„IœíÃM\Ğ°¤é!L‹fCŸó,kËäŸ­=Æ28;7n	±âŒŠÛÈŒ¨½Ù›Iqçåt"¦ï¥ÀÆˆY¡v$‰ã'"f¯ŞÕ õÚç÷ú{{+×jó$ÿR–e‰–ÑFBßSiJ¼uø7ş? uEş±W}ó{ıPK    ‡Nâ@W%ÑRƒ   Ø      customXml/item2.xml­A
Ã E¯" ºèB’@ ËRnºèFí¢hn_)¥'èò¿Ş …L{1X™Ä€†ğ)é8òÇ¼Ìİ]^9û€›Š6ÆÙ+†­
=rG”@5£ª]Ê¸µÏ¦µYVHÖzƒ—döˆÁ©ïÏ ½>­Eew|eQMüb¦7PK    ‡Nâ@Ö(:GÂ   ì      customXml/itemProps2.xml]NM‹Â0¼/øÂ»Ç¤j]•¦Ò´[ğº¬à5¤¯Zhé‹â²ì7²·=3Ã|û‡Ù'‚WÍ%0ô6tƒ?+8~µ|Œ¢ñƒGßH°/goEG»ÎDC1LxˆèX†„‡FÁÏ¶^×ú#Ë¹^U’¯ÚFsWšË&ÛäËí{U·òXÚö©†\b¼î„ {Agh®è“Ù‡É™˜èt¡ï‹M°7‡>Š…”kaoiŞÜåëÏ_ú{e!ş,ŸPK    ‡Nâ@œ\ áC  í     word/fontTable.xmlÕ–ÑnÚ0†ï'í¢Ü·±Ch*­€6Ònv±uÚµ	¬Åqd‡2`W»šv¹wè`êf“Ö·Ø±M(”„‘j«´D8±ì/ÿOÏßóÔ¹¦R1‘õ\|Œ\‡f‰³lÚsß\ÅG‘ë¨‚dc’ŠŒöÜ%UîùÙóg§‹îDd…r`~¦º<é¹³¢È»§’åD‹œfğp"$'ü•Sùn%‚ç¤`#–²béù¸«4ò,b2a	½ÉœÓ¬0ó=ISÈ(25c¹*³-É¶rœK‘P¥`Ï<µù8aÙ:vq–H¡Ä¤8†ÍxvENÓ12¿xê:<é¾˜fB’Q
ì8pÏVàœE7#‚WŒSå¼¤ç•à$3r’	E1Œ¹&iÏE>Ü'¨…Ú(€¿×Ó™’‘ŠëÈ†'„³tYF¥ÉkÆç¬HfeüšH¦fç(6…s5B=^	
ûQèÚî¹DôµŠø°({<Ì¬Ö:bÆ$&‚ãXäYÍ2ëô¬„vˆü¼ùøãös  Àå]	":©Aæ…°ñ-c:!ó´ØÅ°ZlëƒE±î` ïÅÀ$ÜÃ[£¶¡ª$Ñ^-nã«’òÿ"‰rß›/Òîû^å˜JAlÊèpAôA§i%@1ˆ6‰_g\EA-˜RöÁa‚¸Ú~ßêœ†	£ ”È=†Î>Ah5 -_Äpé ^M/î¾}Úï‹°x
_˜·èŒ­-†V4ŒÃaÜèü|1sÉ¨Ô%³F!Ô‡Qƒ.–A#Mp1¦2ûDñzÉG¢Úmè `‚0|øÚ}=ì•%¢®kü©Z–şâ1$)IV£ˆØ´MS@µU¢²}6¯ŒìoV	í÷şp9°Jè.Œp§i÷ü~óëöëİ—P.jh€†¦ ½Q_3«{hc¶Xl%üÅ­aÛL±Ài\‘œ~j9èŞaUšD“CUc— 
ÿr­Uï8AíÁCşŞŞª€oóØ
¯Ğ@Ş×;†p4)©>KØ.j+¦æÑŒÄ#*f¥AâÆÑ'Ámƒ\Ä¡n¡XõSuöPK
     ‡Nâ@               _rels/PK    ‡Nâ@""ı   á     _rels/.rels­’İJ1…ïß!Ì}7Û*"ÒloDèH}€!™İİüLµ}{ƒ¸°®½ğr2gÎ|sÈzstƒx¡”mğ
–U‚¼ÆúNÁóîaq"3zƒCğ¤àD6ÍåÅú‰ä2”{³(.>+è™ã”Y÷ä0W!’/6$‡\ÊÔÉˆzÉU]ßÈôÓš‘§Øik®AìN±lşÛ;´­ÕtôÁ‘ç‰r¬(Î˜:b¯!i>«‚ršfu>Íï—JGŒ¥‰1•œÛ’ì7Pay,Ïù]1´<h|üT<tdò†Ì<Æ8GtõŸDú9¸yÍ’}ÌæPK
     ‡Nâ@               customXml/_rels/PK    ‡Nâ@t?9z¼   (     customXml/_rels/item1.xml.rels…ÏÁŠ1à»à;”ÜÎx‘éxY¼‰¸àµt23ÅiSš(úöO+,ì1	ùş¤İ?Â¬î˜ÙS4ĞT5(ŒzG?çïÕ‹½)¢'2ì»å¢=ál¥,ñä«¢D60‰¤Öì&–+JËd ¬”2:Ywµ#êu]otşm@÷aªCo úÔù™Jòÿ6ƒwøEî0ÊÚİX(\Â|Ì”¸È6(¼`x·šªÜºkõÇİPK    ‡Nâ@\–'"½   (     customXml/_rels/item2.xml.rels…ÏÁjÃ0à{¡ï`t_œö0J‰ÓKä6F½GILcËXJiß~¦§;JBß/5‡{˜Õ3{Š6U
££ŞÇÑÀùôõ±ÅbcogŠhà‡v½j~p¶R–xò‰UQ"˜DÒ^kvË%Œe2PVJ™G¬»Úõ¶®?u~5 }3U×È]¿uz¤’ü¿MÃàÉ-£ü¡İÂBáæïL‰‹lóˆbÀ†gk[•{A·~û¯ıPK
     ‡Nâ@               word/_rels/PK    ‡Nâ@ôc½  Ä     word/_rels/document.xml.rels½“OKÄ0Åï‚ß!Ìİ¦­ºÈ²é^DØ«TğÓél’’™ûí…­»°ÔKñxòŞÌÌnÿm{ñ…:ïdI
ñUçoåËİbí*İ{‡
F$Ø·7»Wì5ÇGÔv‰èâHAË<l¥$Ó¢Õ”ø]¼©}°š£´ùÔÊ<M72œ{@qá)•‚p¨6 ÊqˆÉ{ûºî>{s´èøJ„¬½ãRôMuhÌ¥$’‚¼ñ¸&„9{ûÓfˆ$‘sUvŒ6_¢yøošl‰æ~MƒsÖœIÊé\dÈ×d dãO¿í9U–¾![Ç>.Ú<4éS¼¼Ø½âPK    ‡Nâ@pú÷t       [Content_Types].xml½”=oÂ0†÷Jı‘×Šªª"0ôcl¨ÔÕu.`Õ_²
ÿ¾(Ò¨]"%Îû¾ïÎMÖFg+Q9[°AŞgXéJeç{›=÷îXQØRhg¡`ˆl2¾¾Í6bFj¶@ô÷œG¹ #bî<XZ©\0é5Ì¹òSÌûı[.E°ØÃÚƒGP‰¥ÆìiMŸ·$$gÙÃö¿:ª`Â{­¤@åõ*?ª ã	áÊ–t½YNÊdÊÇ›]Â+•&¨²©ø"qp¹ŒèÌ»Ñ\!˜ip>òÓ¼Gb]U)	¥“KC¥ÈÓÚ*hË0üobO›çÔ™ÎÙP·¾„²ç/Ú“-]€öáû×êÖ‰©ıí36üÂğ/JŞÌJ×Y«İ¨Ìb¤cntŞ8¡ì©ÑOÊ™øĞ¿¨ûA~€4Ög!" |ìÜ‡{çó¸Ñğ É÷l<Ò]<=»_?ÉfÉÓİ>şPK     ‡Nâ@pú÷t                Ån  [Content_Types].xmlPK 
     ‡Nâ@                        õi  _rels/PK     ‡Nâ@""ı   á              j  _rels/.relsPK 
     ‡Nâ@            
            Íb  customXml/PK 
     ‡Nâ@                        ?k  customXml/_rels/PK     ‡Nâ@t?9z¼   (              mk  customXml/_rels/item1.xml.relsPK     ‡Nâ@\–'"½   (              el  customXml/_rels/item2.xml.relsPK     ‡Nâ@Ü>Ï•                 õb  customXml/item1.xmlPK     ‡Nâ@W%ÑRƒ   Ø               Öd  customXml/item2.xmlPK     ‡Nâ@cC{Eå   G              »c  customXml/itemProps1.xmlPK     ‡Nâ@Ö(:GÂ   ì               Še  customXml/itemProps2.xmlPK 
     ‡Nâ@            	                docProps/PK     ‡Nâ@ˆñ9k  |              '   docProps/app.xmlPK     ‡Nâ@Uja"V  €              À  docProps/core.xmlPK     ‡Nâ@ÓÅ¦ìÿ                 E  docProps/custom.xmlPK 
     ‡Nâ@                        u  word/PK 
     ‡Nâ@                        ^m  word/_rels/PK     ‡Nâ@ôc½  Ä              ‡m  word/_rels/document.xml.relsPK     ‡Nâ@ˆ èĞ  ó             ÎQ  word/document.xmlPK     ‡Nâ@œ\ áC  í              ‚f  word/fontTable.xmlPK     ‡Nâ@IòÉİ‘9  Û'             *  word/settings.xmlPK     ‡Nâ@+Õœe  _              ˜  word/styles.xmlPK 
     ‡Nâ@                        êJ  word/theme/PK     ‡Nâ@3Lˆ  ;              K  word/theme/theme1.xmlPK      ì  jp    }‡             1 9   j q \ 8   $ ( ) N„v8^(u¹eÕl  2 . d o c x   hat's where global variables be (#6170)
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
     ‡Nâ@            	   docProps/PK    ‡Nâ@wï—k  {     docProps/app.xmlRMOÄ ¼›øšŞ[Zºİó³V=İd«{4„¾İ[ €Æı÷R×Ôzõöf†®?û.ú@ë¤Vë8O³8B%t#Õq?×÷É2œçªáV¸Oèâkvy[«Z/ÑEÁB¹uÜzo®q¢Å»4È*(m{î´G¢)ğV‹÷•'4Ëæ?=ª›ÄŒ†ñÙñêÃÿ×´ÑbÈç^ê“	ÔØ›{dCœ.m´ïŒ,lù[9°×¶ql¶Z 9PµÜráÃK1º,ÂÊ	R…í´ r‚ŸåGËMëØ|0ÔÚó®–=²¢,C„ÂNğ«›xçÈ/1ğæM­o‡KüèÉIÂ½ôíÎp2]M³N$ØÓIÁ}¨í·»èé»×<OÃ?H«‚¾Şçw]ÜT	¯ªdV”M²ÉKšdeUÎ²e–Ñjdj¡ŞŠw+ı‰e@¦0¼ÄX2ûPK    ‡Nâ@¹ØåLV  €     docProps/core.xml}’_OÃ ÅßMüï-¥[æFZÿdOš˜X£ñán#Ú ®Û·—v]Ñøxï9üî¹@¾Üë*Úuª6"IŠ"0¢–Êl
ô\®â9ŠœçFòª6P 8´d—¹h¨¨-<Úºë¸(Œ£¢)ĞÖû†bìÄ4wIp˜ ®k«¹¥İà†‹¾œ¥ékğ\rÏqŒ›‘ˆ¤#²ù´UCŒw˜${=Xíş<Ğ+gN­ü¡	;qÏÙRÅÑ½wj4¶m›´“>FÈOğëÃıS¿j¬LwWË¥èÇQa{Q Ğã¸“ò2¹½+WˆÆ<N1!%¹¢YJÓô-Ç'×p¾Yµe×R+£œ·Ü×¶³J÷,wş!¼àZ¼90õ®sü»=Ôƒõß„dâÅ$+ÓLé”œ%<X7ÜÂNu‰e²èç¾úùgØPK    ‡Nâ@
µ­oş        docProps/custom.xmlAOÃ †ï&şÂBYêÖ†v±ívñ ‰s÷èFR Z]Œÿ]šé¼{üò~yò¼/Û~èÌÒyeM	Ó„@ ·B™S	ß{´À‡Îˆn°F–ğ"=ÜV÷wìÅÙQº ¤a|	Ï!ŒÆŸ¥î|c“Ş:İ…xº¶}¯¸l-Ÿ´4SB0Ÿ|°7¼òŠ9ü),_ìüñp£nÅ~àĞë D	?Û¬iÛŒdˆîò¥$­Q¾Ê×ˆl¡5möùãî‚qy¦˜NÇêO¯Ï+&êIâ(]DÏ¡Æw\EIFQš&qÃd¯(ÃÃ¿
Ã‹Ûu¹êPK
     ‡Nâ@               word/PK    ‡Nâ@˜NĞğ{  w_     word/styles.xmlİ\OÜJ¿#ñ¬9Áa³;û7Yeò”l²$b³,™ïÜc÷ì8±İƒíÙÙÍxzâ„‚wàqâ€Ä¡Ç§åå[P]İöxlw{ºœ<!rÙŒÇU¿®®ª_U{Úığ“›8ò®yš…"†÷vO|„ÉÕhğúòtëşÀËr–,	ny6øäÑw¿ópyœå·Ï<PdÇ±?Ìò|~¼½ù3³ì˜ó¾œŠ4f9|L¯¶c–¾]Ì·|ÏYNÂ(Ìo·wwvZir¬UlÅ¡ŸŠLLs)r,¦ÓĞçúO!‘n‚«$Ÿ
ó$GÄí”G0‘d³pÚbª60qV(¹¶qGÅ}ËMÀ–"æ©ğy–OâH>faRªî7•w&n[™¿-UøpÿWÇpÇ6b=íRº€Ì¢b‹·•ÏÂIÊRåf 9îØ?~q•ˆ”M"©åpğâ)şS>e‹(ÏäÇô"Õõ'üs*’<ó–Ç,óÃp4¸cÁs¾ô^‰˜êåñìq’µÃY–?ÎB6üû«_şëë_Ë»ı¬©dûÑÃmÄ/ş–ã€ËµQBADU*€:±HòÑ`÷òîåÓŸbøÅ…×É,ø§3¼Îx )§oó8|—i¨¯½~q‘†"…$<ĞÏ„ÿ–ã€¥V9+Q<»ñù\†3Àş´ÀD=‹ d®4ã…¬ƒşs9úh 3Ò‡o@™q&	ÇnT9êT-TìöW±×_Å~ıUöWqÔ_Åış*´ª¨Æ°Ê
ağC,ÙeÚƒÇ.Ó-v™öğ°Ë´Çƒ]¦= ì2í·Ë´»Ø.ÓíÓ½JzçÂßÀ£u‰nÖ%º½Y—èöe]¢Û“u‰n?Ö%º½X—èöa]¢ÛƒÕ¬T•Ä{É™äNù<"ODÎ½œß¸I²ä°É3ËÖŠeµºt•,¶ÚAÔ(Í4h´g’.}cÙ;ı„bLŸaëĞªÁ„ËæÍSo^-RX´õ&a\ó:FÈ…SÃbÁ	¸Œ¥”Oy
+î$^	(š‚(L¸—,â‰£§çìŠ$Ç“ S‡6ÚBÚ9ñÊà`‹|&ØĞ1@b?'×ä‚y¶L0…âY˜¹‘Šğ,¢ˆäÎİ]xİ•¬Êµ(Ò]Ê"ûN3(İÅ¬¢æÎ#˜¤%	–iI‚Z’`§ò5ÅN-I°SKìÔ’ívÖJZ×Šrh[R^†yäÆº'‘Ï>œ‚s^%ÊC;RÍJÑÇ%³ªŠzÕï]°”]¥l>óäÃ§Q<Á­wéÚ¶”R”n	³ò&‹vãmLè’”°-e	[ÊB·”m^“½/¡ñeõ9<}0”ãZœtÆ=Fá!Çx1ÉCÌ¢…ê`âî)<rX…Üi˜B}#´éí*ãè\öùÒ!®ù¾Bw«++9· ]É©©r´³!îˆÁC@3±ÔÂ¶Boª"ôùíœ§Ğ¡¾u
SEbÉ»tmH]™´»+W'†qóTÊ+Œ­P=‹ç3–…™Ól¿1x/ÙÜIğ"‚Gãf—šHìÙ<R<{¹3	ë5ù÷>å“ï;öùåË3ï1´èÉmL$,úñ$t¤5%%72D)¨şaá¶ÀDÙòÛ‰`ğs‰Ëš%/`¡†?äœ =fñÜ±·BÔKHü%¬ÒUĞ>(û–†òQ@«­µtl‘j´t^Õ˜PYg‹Éî»ug©#'mƒ§‹Õ…Ìš¨[ÅYu£}%z1ø-p“ç¡Í²”!²}ÆìÖİi{E$Òé""¹è¤&Y\“LÑ"N2ê¨Q–8h”í3f¢›×­	W.şA¤‰BAÊ,¡ eŠP2?(HœîŸ šÉˆİ¿»h
ââ³ıW\‡« @AŠQâG¤ø)~DAŠQâG¤øqï©Ç§S¨§4úªˆS|Z§xV>àñ¶—¤·­]‰=ŸEüŠ9>çQA|‘Š©Ü¦#Ã–	;°|@@mD”(e²¡÷'1¯”£âµ{u³fñ	ƒå&ls1?UëZ[Ø~×[Õ#Bè\ÂÆ·öF¸sÚ0dXğ…W³ÜÏ,EºŒ>´=šRú%[´İ©Ü¶ZWÊe-"*ß³<
xÉƒpSc
äÎñïoaˆùNü¹Õà_mÒµ¡zvê‡-”Æ&UıÔñuëÇ~ƒ:~ØgÚ5~ÔO¿-éõü şvnêÌß#Û“¤§°íÕ£§×‘-wËN/z8²ep	ÑÃ[—ú{„mú×è[ù°…L6_¬x´/ŠÍ+Bí‹bsJYûb¹Pl_¬¹ÖTkHº(xÏf"r{ùK"±nÌñv»:Éìpc²ï´1ë÷Ú˜ş{mVú‚ØH¨dS]úbÙ¨¨ÄÂğîÇ¬G66*°F÷Ú¼Õ.¦ÚsØÜÔ¬T›ƒšµ‚Šbó©VP±lDZÃÚíë#çZA5Ê™¼©@ÎäMr&o*3yÜÈ›
bc…’çjäMÅ²qC‰U%o*J *yÜÉ›¸ ÛğIA?T›ƒšäME±y§F¨Ã¾QÈ›j—3ySœÉ›
äLŞT gò¦9“7È¼© ò¦bÙ¸¡äÔ*ySlôPUÉ›äNŞ†èº–âäME±9¨IŞT›wLäMÅ¢7Ë™¼©@ÎäMr&o*3ySœÉ›äFŞT
yS±lÜPrj•¼©@6z(ªäMr'oÃ&‰LŞT›ƒšäME±yÇDŞT,
yS±œÉ›
äLŞT gò¦9“7È™¼‰@näM¡7ËÆ%§VÉ›
d£‡¨JŞD wò6lTûÀäME±9¨IŞT›wLäMÅ¢7Ë™¼©@ÎäMr&o*3ySœÉ›äFŞT
yS±lÜPrj•¼©@6z(ªä@p†XõĞ0y²¤ÛŸrxg4˜ïËQp„˜<MŸ	†7¾ÀSÃ¤œ|}î¹fp[õ¤.½qß>Zí9-îÜQ»æ©ÔÁ‚7‹,%wÂ›Œµ{²„Í/š a´p6g¾<±ä§ğÚœx¶ƒ;päùğa¿üğj!xƒc ğ4°]ÃÂén=­ŸçÆfp›4¼8Æ­¼P9½íŸ_}óõ_Şÿşçïÿñ+y«Ÿårãåh‡‰HŸ„A¨,ÌŞæÀë„8Ù»yxNXq-bh^ãÉÖë±T¹{7Û:9——& ,I·Æ¥²Ê	qè•?–ÛÅÛªÓ§V;’&Î…û‘<Ç‡¤÷Ó%ğyí’|S³¼¤´{^ŸØ£]ğ–óù9¨Å™‘ÎÀy™š§Ò½ù>Lír©ööŞ^éàÑààIQº~İÛËc±Èåå³ë¨(ÆO#&ˆ:9QèoyZš¿¯W«+_®®¬|©®u»ÄŸAnùò=7!µ²°ÚÑ‰&¬o­ÁKv— {aà†Êñ8ó`ï7Û|™®ïá54$ŸD*iá?gì|ãR”5oŠ÷áËE/æw.æpt‰ñ¢nn˜Rñ©Tßw0„jßOD‹Ø,Ÿâ¶h£˜Õê`ÔGiyº×¨·LÙ½Æ$77¡·gíZŠê‡æÊ:‹LÜa«üêBª\¨®Á¼ -»Î:¾³JiÕ³¬6˜ÍqÎÉSD¦
H<9şBĞ {Ê­*ÛçNúÜh/TîÁ0’„€·ÜßƒÓh!Şe¸ >øÏzÍú˜SyĞ5YŠ÷r7˜J]ŸûNåüI€ù[¦ Î¦<…Şô…©òå›‘º®ÃÇìİh z}(P-
V+Ô|Ï,ßø5G+Ç}­•’şªƒPs™n5ÉîÑmNaúü;=•^Á6;O8wı0‡Eq·ö¡š(Rº?hØŒÍtmskÍpâöb;h±Òhÿ…ØNå$²5ôİÅ2R^9rY-{ÏŠãÍôµæCÚ^åÉ½îZ«[e´÷_şí?_|îID5Æš}Å¢Ò“éG5v“
sì‡qš>m<)Ã†ßaR¾ùÙïœ&E{øÿfRšíüİ>{ÿÇßzC§iqiß)¡2Á€ù–l[†5{ª»Ïÿ~÷×?İ}ù‹»ß|v÷ÅŸ¦¯½µú_²‚˜²GÿPK    ‡Nâ@åîÃ&;  é/    word/settings.xmlÛ’×q¥ï'bŞ{™u> L9ªj×¶=–<
Ó_7&Ù! ÑİD?ı|…)‹ßò8Æ7¦]õïÚ‡ÜyX¹òoÿîÏoß|õ§ÛÇ§»‡ûo^´Ó¼øêöşÕÃë»û¾yñoÿZ³¼øêéùæşõÍ›‡ûÛo^ütûôâï~û?ÿÇß~xùtûüÌŸ=}Å+îŸ^¾}õÍ‹ŸŸß½üúë§W?Ş¾½yú›‡w·÷¿x|{óÌÿ|üáë·7|ÿî7¯Ş¾»y¾ûîîÍİóO_wM3½øüš‡o^¼¼ùù¿y{÷êñáéáûçë‘—ß÷êöóÿûòÄãçw?=Y^½{{ÿüñ¿~¼}ÃîŸ~¼{÷ôåmoÿßÆ'şøå%ú¯>âOoß|ù»mó_ıåçÏığğøúç'ş;Ã»x÷øğêöé‰zûæÓç¾½¹»ÿù5íğ«ı<ÕÃTıé·¿¾^Åãmóñ¿~ùÓ›_=/«ıiw÷İãÍã§ef\£xûêå?şpÿğxóİ6Õ‡vxñ[vÔ<<¼ıêÃËw·¯X$¶cÓ¼øú¼~øç‡çr÷ôîÍÍO¸ùávxÏ|¼»}âÏÿtÃXÚOøÃe3—ëï¿}ÿøxıİ?ÜŞğo_şğóíëÃÃó¯şğõç-ó‡G„¯®íÂ›nïÙÓ¯n¯­ôÍ‹/c¼ışæı›ç½ùîÛç‡w_~nî¾ˆo>°ÿx÷úïşãáşùæÍ·ïn^ñ_ş¸m¿üñ§OıåË/OŸœÖŸ~~âóü|úûÿsûø|÷êæÍÿã¯ïşğşşÕóû›ÿŸnïÿrŸ^øêÇ›Ç›WÌÆç÷ñáÍ—Ÿı¸gø‘-öù‰'úçÅ:ÿü¥ñíwß?ÿËí3'ú—uü÷Ç›wÿzûçç¿{şñã@~ıÛÓíyóô¼=İİÜï·7ü—÷onŸ>Êß?İÖów7?=¼şOÿ÷¯Y…íéŸß¿ıîö‘/ù¼ _ÚŞ<ÿÓİıÓÃßÿîîşö¯^úI}ûI‘ñq÷7oÙŸşõ³rúıÃëÛˆŞ?ŞıjÇÇs=ği[v×ì|ıáå§w^Óƒª}ıôå?ş…-÷åo›¦ôm?oëÏ~‘4M;ÌÇ§™ş•djãÇßÿô£ù¶¾9f¨èâ“÷×¿35ë$ËF=ÏMõ\O[ÛôËçÓüW#h»æèum·l»Kúf
¿Ó·Cx[ß—(©>m¿Ì³`X‡ ™ºÃç­kõg˜‚ÕŸéš³):$ÅW»k›Á×§kûÖç k‡âëÓµÛá{§ãÿ’dL’~İ|®»a^Ã÷µc›¦9ÌÛÜŒ>×}Û­>ê¾ßvŸ~lÚª«Ğ};ºdê{ÿ~š‡ôÌzúÊõsšÑ¡éÃ3C³ô§màhùŒ]×ûúİÎÜĞ­Å¿gè$}»úŒCVõ4U_Ÿa*§¯ö03:Û<ìé™åËışWºjlšÎçrú\MW]WÍÜúN›²ø¼íÔ»>ÛúÅ°úëQ÷íîs=ög	£º1HÆ&ìq\ß;ã<Î¾rã\ºğ=s	wãÔp†uM§ækŠ¤„gÚ9èø‰-ºûï´eóÙ™ºyõ2q„Ã3¬‚kŠiX›ğÌp†½3eoC´ù÷ÌmĞbÓ\FŸƒ¹İ;_Ó¹kƒ¶œ»îğ2³¤¾>s¿?§óp×–ó8–ğ;c	·ó<M“ïÄy>÷QçmiÇİG½´çáo[º­óïYú&ìÄeOŸëeÜ¦ğ¶©]ün\¦îtˆµÓ„ß™“N\›d¥­h1ÛÊñõY»®ú_»ao»`¬cøi\'4©®é:‹ŸŸ•É9ô™­W?Y[»TÁ†vñ]µumğ¶Yğt%X5[ß6áwúrúÙŞ†c÷UØ†ìÄmj[Ÿ·mªs˜ƒ©†Ó¸ÍëftŞ'ÛŞŒ›ïë½áé¼í]æívøjïİ4ú}ºwuò3·÷ãés°÷¨e[Ÿ¬Á}({ø¬'Ÿ·}\–ğ=s4ì>—`ó8®ù®ËÑ7«¯ÏÑád!©ş=G¿ìámã4ß1– aiŞıdSºeé<Ã3sS|}Œß½Ç¼Ûò˜ ¯K³ŸƒÒÁŠ.]]}¥o‚F*}vUé‡ÓOVéÇàµ•~êÃ¨û9hŠÒo£Ïu¶ÆõN`—iVôÙ›¯Ü‰Rö/=Û#ØUgß›âdl>êsìŠk—sìGŸ·sœ‚=ÇssûàœÚÑOÖ9-ÁgªM¼êÚÍáfBü…ÚmaŞj¿kßpõ;«[ˆÈÔyóQ‰nWÕbH¦SWIˆS Yª®iÛ´­ß´HºAïf­Çìˆî4«jr$C§kŠd?ÃØÆöÏŒeÑ›‰u«îª¶m'××mÛ›i;5î!·í¼{lƒ a;û÷KóÖ5Å£“¸«ÇT‘T÷Y·İ£8m7ûà’x£í¦Î-”ö:>¾Úİ¼ïjÃ¶=Û×çºo¶Cu‘Á=ìƒ¾[« ï6¿ƒÛ¾'nhV’Ó£Ôm?ìîg!	vbËUâ‘$Ã¡÷’Ã}³–wÍaFç¥ß3½ë0l¯s04ó¤Z¬ÚÓı`ÂÚËâgn˜–0zŸƒafÇéØˆWm‰$œ…±m<bÖ"	úÉä'xätû*ŒmÙ}F">×#á·ğ¥„n“äœƒdhİ£lG¤j¡ Y=RÒãÎÜ8/îÏq/U-”vb÷ìº¦(—Éggê1‰ı™~)¾
SêÏÎ
#¸Ÿı™±”ğÌ4†cš¶3ßYÄ<ÿÓÎ]õÜmnEóÌÙ·ú=sWƒ>˜Éù™çqñ¹Ñ.>;KÓNj¶Ë0º§‡d
³³›G˜ÚeœÂ®Zø,Lßy×HË<yæ®]›¦÷¿ö}˜uhƒ†]‡.ıÎ0x¦«]‡Éã–HJ˜,Š°¯×‰¤«îbOaWm¹H}fkû Å¶öğ˜C»µÕã½íÖõõm·a6ì6ìa¶áô~»)ş=ãéQ»M„ ıö›ŸúmîƒMA„É³±-Ñ"0±İCü İ±¼}}öá¬>ê}ÂæÒï9š>ÜfG»Lş¶£7×Gß†]q¿¾=ú¬c‚ewurıvLMğ>2w®CyñÜG{Ìg°ãK;¸¯Ù–n
>ù'ÏË´¥gt}ˆzÌ~›•~öuš°ÚÄ)<¾Ó–	™`yZvhï¹C$qæ%è·2oYmÉ?yIõèW{ôy;ût×ŸÀ6\S 	öÁ9´£¯Ü9ÎÏ(_¸Ïy:ıv®Íâq
ôëÙtºr•l¹­öcĞUµ/kŠ:®/ië´[¹’sÕs
b³z”w;XÑNÁ ëÓ5¸`juvÍ€yk³ƒ$œFâô³G‹;õ·M}Õ{c÷ÕFr.:×]CæÁ¿§mBÄ(ÎÙ¨~#GÊÇê¨	:¸×|§¸M4¾uK.iöL
’â~}×N¤Ç|lÓîúgÏ‰#)nv¤Şİ3BRÜ"¾$Å×”¥óœDÇ2¸O‹„‰Ó/%~á‘,Ù=	
¿­[™À#\3şLéí’	-ï’ùô8E×Í§ß€Hª£Ïøš¶õ¹€ç±AY<¶duÔõ]È!éÂúZ÷.ò2\™Õqi]?TÕåbòX Ï÷;¢R³CrêowCÓ¹UC€UÇ†IF=Œë¨wV7ŒuÑ›	 zÙgŞ s~”gÆwï…•ò{¬”ççº±ÙÜ§ER<²İ-òX4’à!YİoìÆ. ›”A7öËäs}I|Wãtï8â=ë\ÀÂïLÛèú`œ[Ïµäcæüwæ=Üšø­a¿MMÒ–D¥Üí8¿A²j#!9‚å@ŒËqO:CÔIñüO7‹G©‘ãĞx<Évü4®•ê&²Ë~²fb¾« ¨DÉîÖz7c¢¸Ç‘»w’-ŠÊcë G—`¿-Èİ‰H=|uÜ\'’-	VÚBDS½İæÙ¤nm/åÿU	¸‰zí× ‰ï[lgnk¦Yıúnk¶ÍG°5‡{`Ï $é¨‰éºH”=ïÏ«ûYİ†_â'x«ç·»mêÃ©ß¦Áó2İ67a‡lóá~}·7¡‚Oæºj{ÇtûXƒÍ·ÏC°öyo;VHçúŠüøŒ@İ†=ğè\S 	Vçu+àèv©vG„ÓxñK‡Õã‰@D‹G'»c$å³35¯êˆ#9¾
IÀ¥u¥Ùİ•¶„”„m%íP‚v)dp}}Êœ~çlÎ`	]×g»zd›,Ææñ^$GïûàœÆ%üÎ\Ã	®(K· ë…ZĞ5­`‚÷ I¾Y¦àéUğ½>×DJ<Şšø±€(Az[@àuÄ]_Eº~v[	¨9®ÙìQ©»ÛÆH(‹ñ·a8„ßt¤sĞ³nYèğÊºwL›ZHf×H¸š½G˜„¼&’y_JR/Œm><·gq$3’Ówb€:×ÄwÜ;¤8«÷Š$»ûÔ»í³»²ÛëD"2}KˆØ÷Á%ÑSÏ3ÅmË¾{÷‘®CLÚCr¸å@ø ä\A¡TGs÷XC=ÁHv[‚‚Üß;¸‡nû÷¸%~7")nqõ\ÁJF29b 'Šã~ı%q¿±G½¸öGBå”î^Š<?Ç3KØ;ı…ó·µƒ[O=¹1")îñ:êÂôıáş6Ñ7±>6Jî|Ç-r¼rß]	o›(Ğòß™@ëºd^Ñ÷s¨BR‚æ£RĞ=	Ôk	ßCtÔ+Búïúm ½éºw&·aÉCkÉQ}Fô[’,çë‡©º…OF¯u;„âÏÆ#2WYèâ§d$ùás@$ËQà¥·ß¬#FR<Mèkw>’ÃãÊ³NAW=[Q÷(&G%÷W–ZëıUt®¾1İŞ£ıDº¤Õàz|”%è<[ÑO@.6¹ëxl'ÏVôW±±mnvÏäóL¨úCRÛÏ-Õc:j)<	¤±ıK)€İ|}æñšo«ç¹MÏ×_÷Ä‘l§€, ·M¿t¡A½‚~A÷¹>X’üş6ê™Â3 >“¤n.Y›-œ¹•Eğ¬`ˆ|ïûm½l!ı•ˆŒß2+qK5Õkîíò˜?õÔ\xD†gÒl—á«£¦ªÌ==ª>°ø3 .İ~Û€ø{
šo›¨©òßÁÜqO˜G‚{êÀÜÛÅ²ª¾÷(0¦Crº_ßï/Oú=ûT=>ÚM¨íë©érÜ1‚6œF¢)á™Óã!ı1´­ÏÎ1„¸XO,oğ}}Œ}ĞäH<:Ùş}ï€17·OØU÷İ5,ŸcWúÒ.áÎ*mõ¼l³»> ÃäP5¤Øu‡”¡:ÖôÁÎ\IÑÀ€:"*-€à$wØ»¤Ã±vIO¼*œÆsŞ‚¿ ²'ØU•r×bµ[ñ	˜o	·È`=UŒrŸbl§í‰<9¿K_	Ùù)©Ó4EÅxqk£Cñõ©óî¼}%\¥ûmh(hRb®s´0’Şm¤¡™¨.·‚dwT’À²C¡±Hf]½–Iñjı è¦ú8¸­Œdò;À@ĞäÅ/ZOHf¿eTÇhÔ {Ş	`]7wM¨öòp Õæ•ÃCGå”ï*$Ñäj9ul95Õ.fÜ}³XM¯gÉá±A*EàĞ`Øy=íĞ·Áâ® Pxû I‚1ƒs»	–¢íâ»ŠúWÏÏıüŸ7Ç‘Ù ‡F5’Ñ£yHZÄöàÍZ+·¯‡ıæç””¸ßõ9+¡ !]®3
Æ­Bî!KŠ„Ø‚¿m:ÃYç#œ¬q>İZàßqÄ ’!h—‰“kË	lÏ($Ì,;ÅµËDAÕ©s0Õíƒ†{D«&ÏĞ„{<…ÇP0|’Î-;$„ú=3ÛÀ¿”"Æ°Ú¸èálC“åÂÀT¿øÈÓªµ>Ìğ®¨İ;@0ãˆKR\^f¢¯6ÕQƒk¤™˜·K,o×U8;×.K»¸ÿƒ®lÂ®ZúÖQıXo­[ƒHÒ\/CIo;çs v5„¥¢ÊÑÂğM­áÌ„qKuX#ùN\áô])wö²öƒGJ ÿY‚å°ö›ççx&d_ˆ“laº$•BX æµ­ïªeåçggçç@…{aÇ9ğL¶òÆıã# Vã~DÈ/ Ù=Î7À4äÙ¾aÏp‘„Õ	ê|ÊDoU#!	g{›ÖÁ×v¢p’ûO#˜Y!µcÅotî‹ŞWao7÷Éì–`	ÁNäù¬a'"âgnïOÏ½ºÉ59?€<qñ*$«çKà<¡Açíàjôyİä™ï†›`C¨¢GµtAS)~Mva:¾åñ¹. :\'–fz§4!ƒË=Ërë¼•vó˜7ÕÖ+LÁº…ç'x,T¼y®m ®-ìÄ2¬3âòïî)|)†o’P^èo«G[‡2ÎÃ¢>ğd±§ÖÉGp’òôós£c‹ÈšaÕQ_Ì<~7së\êl‡4hıdD0ü{`õœ+<Ò¸µ:êÚ”ôì~JÀ~y¶‚:‚Äş;€0Z—ÏirÏ¨ö§gÇà+ ìÏì¾kÿ:É*uÈaÔXº>W…û´H›6’ÉÏ’Õ‘d$±;ß!Hvg'½øw.‰ßÁH†UWaÄmô„KØV2®ÆogœêŞó2lÁµ%’KC²y$Ô¥	õ;˜’”Ã±#e®-Ç/Õ–PXÎâ2B„á¸'$À}ÔÒ„ß™C†rü}å2^O¾föœ|#¼_ªCxfs>Ğ;†úÛæsĞ³=«LXüK)¯÷Ûl0æQP$Áöa÷ûIàƒD¸µ.‰ke¢HÌ¶ÎN?4÷ñû”ê¹ÓyG‚Ñ›"K9‚€ ©{Sà®B%'’Îã!H`xñß!R$°Ñ»Ş!Èµ÷ş6
â}‡PY—¾g†»\ß†êó¸óâ3XH¡Éôày€œZ4Ûpz†äâœWHV÷ôlaÓä>Ó8N«gîF*Ñ<º‚äôœ’ÆFİÑÏ#xn»P¦G¤OçmbJ]¿]TG~!‹	«MÔßë1Æ«BÌOA¶ ]ˆAz]5Ğ¦âÈE¸ÀÊê—ÎÃN±A·¼±·Æ0; ˆ<_?.xS®É—¦x»;à0sú=ğy;3Ï¸Pßî+VËıS)ÁF¢cƒÛ‰#MnE#	¬hã‚Íåû`¡Vô/e¿¹æ£ĞqÑT¬‚$Ö·ô!E£30 ÙÃøı`ó'ôHÖxEÙ\_ƒnr’¥£wÍ
ÅsÕãÖQZ­s°qg¹í²÷¹¦æ.ØÊDìÜ¯§ò¥ól’!JØ=>jb?Ûìê7R)¿8úÉl¾½i<ö4î5–:¶«‚ÏÇFlÒcª#ñ%G§#IÖàŞmA[ÂÚ|3ö®£Z ğ”:1|)e®áZßş¶)T½…H0Ÿôm|·¾ÚGs:{Ôx\Äş¶¶zæa„¿*XBpQ9ş`<Àuº¾>8%¾¯a©òH	 Í5})½|ÂïL¡Öw,DU:D =?7Š_\WÁ2ç,–céF¯¸FjòÇB™‘k¤‚FÀîuıFw3¯¢awä/’ÀãŒdï|åèîÓœëƒ³	]#`™ƒI×çlªc0F2âBB†ÛßÖm‘¦¥à¦_oƒg`Ïla÷Ã”F0ì_O¢Ä~3öw¹ñ$ûâ;ş;éúÒ…ı†Äëv©·NIğÚ*v¢Ïum.`¬tçóSRÛÍ¹Z@ÇW¯ä¼$ÁŸ«Cè†2Ö!ÔÏ!½® ÉáLHŠWa•HÒ »Šˆf°n‘„hkÇÃ‚¾ŞÜ‚RXO„{;5`u‘`<Ø÷L«ªûz"jèŞîÔPŠ {èÊä6’İík$‡Û;dß;!¯¤{¶øš"©îŸBÈr¸my­›[vü{àÈ¥,'è$ä­t®ÆzË F·ã‘,~— 	Ş; ¢Å9¯¸—zÇq!=¢yÑÈx†ı’¸İ‹äğX ¨ \¾	œ¥ÓUr­÷’ÉYëìaM¯b_ÕÊ/©g±§e¦>jâ–~æ(Ró:d‚;ğ¯ùÛ`4
_
«†z®dª)îó·ÑVD­è‰êSWQPÌ­ÅçšH÷Ş!B¤Õ„‰Çx&i1À“1ã:…ß))„	P½?C6HB†ß™[ÇüMÈñ¤š|È–Bm’ŞïmHC/FúÁlÎe Ã@ëÕQ÷@ñQƒEu´#Á<bÛú¥Ä-=›Ä3Ôø3tğ}sUH•üm}ç¨J9¦ğÌ´îaÓ´åDÂÓÏ6Q=ƒKŸ×Ài¼{/¸z´h"néìHp…uvh˜àùz>g{‡²³ˆM3tX®«–†rcÁÒtá–!
ê±'hÇ÷ô”pNA;:º‰¾@›Ç{‘§˜z{¹¾†uËqƒ1)¯/™àò	×2mAÇ#ñZlúf,Ó¡s½bôù™[ñ$Â3Ğ¨‡<­ıéuDTiLê# cÛëj§`Ÿ,êÇ½º 4 ÎyÏÜM 
Ã—^‘Sõ™XÖ#ÁÓÆ™ó¿Áóæs:Şëç°jëºj#-ã_
«‡Wˆ‘?ƒíB<Ñ«|°˜ú#½u®ÑaAPÉéñë	lç/I8ÁàJ=¢É3ÅQÖ] AÓ±ÀèŠä7àAıœïQ$Á®:(¿q­LÔ0h~Á<È}¸î…1.è*8ç½`‚E,œàÒ÷'âo-g{ õÓR(óSR`^ÏÌ!ûO½Ûâµ±,b§à>ß¡B×ŠĞk	¾Ã€œè%çX$›g+Ô )èïÈÒ©ÒÙÊõh®ì:æ&ïIû®Íù)^Ãäôèş„‡îŒ`H– ı+vŸ0fîQBJ&İv)„°®F:À£‚#tÅAØHfê(ı” Áöö±Ñ’ÓGÍUâñD-}hX÷™à}¬ëÏŒ0¸SUïšä¾õ*=ÇBÃì€`…üQzêy&0² ©4§y#©ÿÎP}'b*Ä÷gÆPUF8t6Aâ.H·T×bé‰G4‘,^á‚$ÔŠ 9Âùé9rª•I:ïÉBRœ¯s&øå¹$} IõxïUæ–’âY8$§ûxfPBêj_|O¾ã±ü=¿=SNÆÔ¡ú”¹`ÜÜï¹ºgtQ{^ì~ó³ ÿO˜7 }îI İdÍã°;†	É¾çr¹Ş$Ä{Ï Ğkøb5>£øÙ×”`´g†fÕpN	9{üšg&G^!)a¿ëÚ”¥ö5´Ô`ôuïpiyôÜÁz&UãQªH3`&ÅÖQ¼4lógèäüzÏ&Ñ-´„¿tĞëï,×ı[SûƒöèÒ‡zMò(¡*É¹…/E¿ùN\®X½—³¯öBUsÕg¨‰“¤óH	»7GÎ#	‘`trã±'$IÃ‚ˆòh$§“gpgê=Cˆ›Øçàº7ƒ6^•l”’úGR‚$a‚ç’_…~ï®Å6¸úı÷ä•N3½äÜËA2{+z!ú@›fç\ú3©×VÊ1§—$Ü€;´'~¶‰m8ö˜
v®@UŒ^ÛÇ3!N1S«è($§g†æÃ×çm§?…k¤Ğíæ£†×Ğ-+é{pÂ¼Ñ;ÊW^wG&€OÚ£cÃ‚uïp†[Ëã!Ô¶÷«Ùş7Æ1ÍaÔğ‰‡SOİ¡÷UœKKÅŒ~O¹¸¤ƒ„ŸA²;~g.Jøšyò(1©âv8vÖp3Ñ5É£†„5Xğ­{Lh>I–ûjŸP’ù©‡»İ3„ôm¢AºÎ½ñ<Ä3›Élrzãõ¾¦ ù¼ZJ²>6è!üÃ­å8¡Ë?X(ğdKÜÅslwhuluÚ=ªïÿèØp$‡[B¤e:ïW€„jy-z;¶’ÊlÕŸ¹ºP	ÈÁ 	q¾…BÁ4‚	¨¹¾­Mhº…ø¹WO/-=Õ~ƒTGØ§Ûœ/€g¨kögÈ–ëÉÔß…U€ÙÊ³/K‹á­{PM@Ê"AcûØˆ¢„QÏO±ÀÌà¸h$TØëïÀ_åZl¡±•#ıK¢äÀ»‚dô3‡dq-†„:z5ñ¢$	¢p>B—,$‡#{ ]Y<G‰ÃÒ:ªÉö(ÕxÖ‚lvuË„'Ï:HYÊ3¨ğÌN0]æÜŸ[ 7N³Ãú¸vuËmÿ4…ÇÉ‘ì\ ès¤¸<õK¼)?ÛCr=<S=?åoõXÚ2šSI`~Yˆ_¸'N³uñ}lT‡/Cëº÷‚u¹]½ƒiê^İ£$¦®C(wä<PÇÎcªHNÏ½/”™z4
¢Î³V„h?ª_
HÓû&-@1İ½$AWÑ(=z¦õĞ(ÒO0à/Ç/€‹œ!		ÿ„fX¦yqÌÏ27}ëÛH=xÌ{™a˜ñ=Jm_¸Ñ	®;ãÅ^„Ó|ıæx¤e¦Ñ¸ïx€=^Ù İa,ª$ÒìLƒc ¬gZè2ç?’à×#¡ÂDçàBÜ¸vA¾ƒÇšLÏ@!¡_š ºA×–ÁºÅ@gáêš¾¥~‡b__m:ez„v¥ã¨½eíBÍĞ²ÂHé–7}éÂ½°Ò%<”Ìõ¿â˜’eëqÓu¶~s¶¥Î+¯<Y66¶úÎH6Ï¤ 9g‡¤z|gÙ!dñQSsl"?ÅÇ³Uz.Sx†ÛÙwÕNRÏï0nY 0x:7Éíà¹ÒªŞ:]¹8·ßÛÀß;°·>£H…H¡|à>[˜WÂïL%XªGbó!8º/Ô¨¬4¸:;¥M–w¡»Xx†¾VÅßF‹ïbBó^ˆü8Şå’8faáWF×H02{ö¡BÌsF—ÄcHÎğ;gºuôX<öÄ?Ó [çt•#¼–4ƒŸŸ
·ˆüûí„"×Ï¼IÁ~;¡Sp«óœJ8Tn…/Ùö(Y‚.Ôg9n}©u}¿UŠ½|Ş¨Û
^N¯x[@é¸­Lšivşƒµ¡Íœ$¡ÖwE‘;o’â~Ö
C“çŞ‘ã°ı¶6‰ù²õÀp¶¶4_Sâ=v=+@ÏÂ!!Z£c£ŒÅ#f<szÌIu;‘BÅÆ±†HÈ4é:}>6L1ç¦£´ıp+`%M{¨ö_ÑƒîQ$ÁªY!Qv«Iˆ"	}<¡mÜ+W£×M!	i$ÕkH’N•BMP[§«  Ê5Ïà„gGkYİò† wÓß64İJ¬ÆQ—Ä=JJHv¿çh´8
d…Ï-H$ÕmrH5ö°C.üï· Ÿm$îÄÙİF‚ô¸sD’Ñ™ûì>´<{®HBé’µ ]à¤qïp%¶NãHaªk
$é"‘ßxìI`ï@º‹Q Mİ£t×ôXÚJ 8ŒG¼SÏAçu‡ëU3ä§¸‹ãğ×«¤J­$›GNWÊ£<‹dq«“2	
åtv°áE‹úĞ»}	mş¶‹Õ/H:E¯?’ë·0àöE˜*ƒ‚} û¨G[!ÖªA'ÂOîŞÇŠFôêÂ•à“çÚì^õ·bnxFú’¸ı†k°8á^@Å:3Ïz©
_SbE^'Î?ïaÇ¯pø~ãĞ9¯!MyÈ/û÷`úG‰£éÖ•â6Ü<›´‚ß™|¿m)¼Âî¾ÌºQº¬¾’=XB0yda…ƒÈ#fëvµOÔyÛ ¤ô;k‡ÌÔÏU>a‚wñhÄºÓëÈ÷ÎN›ŸÑ}¬Ş¤¼’.Êú=;Í.ÜêÜgšë3GqĞÉÓ%4köô*sıvkK ş;ıê±4š×Î€´ÂşæqK$4o×À™í¾æ
ÿµ#ˆ@áoÃG÷X(öR`‰rKµÌ8¯ú;è=Ï±¬'Pÿ2IˆãøïĞ/ÇwÈI"ÒuïU$4`#Bg†õ€í{çâñ}ÏwğB+è&·j*P?§5Å¸Vº¿9|­WShÑ:ì!JPÉùjW8_ê|vhjµ»¦¸J<UÏ€ŒÛà¬ó(Î%ñûgk0äÕ²£¥T|†iÕÊÛ•Ôˆ„VT6×´%	–$å™`¡ !ÉßÖÒ€Û%”¨¦Ø¡x	İ!üm°„LÅoÍ­¥°îx$Û[G¬ÓŸÁ÷“"Ö²š†³ÖmE)z‚¥…èÊ%ñª¥Kâ1$Åqv”!·ùAB‹5ÿX{|µ™‚°¦ôƒq¿¢ÈP{‰YØ§7˜éÜ>@²y|ÉîÈR$Åëi‘Ô°C(ğ_
‰ß%¤‰)¯Ğí“OKª- •„{á’¾«h;é1HH9Éá·º]è÷\­ıK‰Õx2¦rÀh"!:è¿3Ğ¶.Höp‚z›¸Tø	¦!˜£Z &¥%¥`&é$³½‘s<’âçmûå£†&Ş³ĞÓáÆ >Ëm—‹N5œz²LÕï,½°ßH—¸Ç¿ÁOë¸[Ê«-  èõu®'à—[÷½3M¡37d
êÛÈ¸:
löJ$ÅsÕ4aZßU0|z¾„4zà¥F²¸õ´au,’#XOà)ÂŒÁó^™4*£¨Kç¤E°ìD¿ˆ^‡İK•«Û£’4Šî|MAg8WØ¶P•¢^ÎF¬&Üs¤+¼{âFàß}@$ÜM:ots6zÙ<s·Œv~—(NĞÊH‚eG_¸)Ìñ~æV d‡O¼W˜ÔögqB,`Ã„|¿m„ ıÎÚˆ`¸>ØÆ5Ø|pìxtrãp{å%	ºj£EˆŠç57p(ŞÇs£ÎÈ³"h“`»ì=Tº>;…ê¾¦;(ëôÌæzg¿ù\sæ›·í„-}MÁŒ‡c§‹™ÿÎï§>JS ‹CÇêìd¤ƒ¤=æ½alCñ(Îx˜kª£‚…6=hËãª›Õï#ãÕ…[i—àå”(±¿¤ùæpv¾wà„ñxï†Íé\ã—Ä{] 	Ù>šÜQwácª»»d¦5HªWÄ£’C‡5$¾ÁJã™!ˆx“F‚¹É»9lgŸ¬uğ]Şˆ…‡•;ÄºV&êïU>75Üj›n¦
ÌÀçºâîº} Ê.Xäx<÷¾UÂU¾ÚÄ<rºÁù»„S›âÿ€NßÉ-;OÉ²Õ—Ä£lHN¯ØÙÉñ8o‚îU$H¯§EÛ‘Šs	§¹º$	½–vÚé9šÉ¹èÍ´·m¾â¤ğ=-½;4nÉÛ—è%qdÂŞv“ÇÖ‘¬~7"»¨óÖB£©{ˆÁèÈÒ½%Ç¹X™ıwpšôlï-±jK$‡ßL¤™ƒ0Êî5ßH‚…OX\J5ê ø>€HÍñ‰\n:$«G[‘;q§ªÌ±áH6¿³g‚H} ó-0Ní„Å¼F Éé7í%ñ{c3Zçâ·jvjb<+Bş6xÕîİaæqË{'öäè$µ÷·RuˆÆé!©cîâˆ6¿ç€l‡>ÅP{­¿†6‰ˆ¢€„šŸÆa>=¾íê~#’€¯ÚÇ×éh±ã›´P÷6’â$îÂàqØ•Q-|$»³n>øxRÈC˜
i‚¿ã¾&nIãñ7$!¹ãÒz¤q§ãV˜B·ÎüBz›¦¶º>lp‚1Ò‚'Âæ ‰÷€‚›ÎGpAã\BxÒwîœû€8z§[û<•pæ8$K#™e›¨˜gRh›¢8H–Ãm"fîñLñX4TX”úØèVã3J¼Ì{çîp;òŠæÛeg§èÎız$ û}løÛ®‘`7:Sİ¯§-PõØÆ¾ÒÚïúÃ[cO¤xÒNÆë1;ŒÀ]K#à%=C@Şg^lgÚñ[=Â´_ÜÂê!#	,ş¤7j8õ¤î¼zÕÏ=£kºTõ5…uØ1?;H%ç>C²;Òb'ˆöèD2Œm
œJ;¸'Çíp‡sŠìXvS²ıòZ8$sx!ÙÜ;Ü¹š<N$0 "Yƒ~Û§¤GÁY¤/¥&ÅíeÛQ¾½[ƒû¼;Ï±ÒıF½™ÇjvbiÈİú<ø¨aòL×gãÒöÄ@x[âmİXj¿K
íÀüKaDvUe'=szÍ* A:#èŒ"	ç§`„Qª÷SórĞñH‚mIO4ïeî£ ıuÉxævz¢yfbÀú¶+À5ìIO ŸÑ³ìDÔá{È]®Åè¥b'„¾‰ÙyMşNBzfØÂÙ>A×ú~#b~§BdãëCÿoÏ^îuª§¯v½xl} ›ósÑ‹¹õ=jÑßF›5PĞÉã½GC7,5Í ©“Óß¡/ª3cÓ ‰N„á™â™»ƒÜ¿Çì­Ï—™3æÄò|M‘Tçğ‚Œ>0!¡qŸÏ¼:ÆŒtIˆu¤ı>E‚Ã ¿Ó¡\|M»ÅãÏ@-¢Väú§çç ×Çyö·Ñ×İç uàÙŞ¶x	Á9ÿúgùN$şçµŠ]²Ü9à§sĞÓ¤Ş§¿Ê°tl},>êü¯‘¯L=p\=ÃN+âÖ3ùH ÄúØpvı{†&ğ_HœIqïıàCİ¾F²†¹ÚÍ£˜.ÃäÚeèCÖ÷¹tzçúˆN†Ù¡cŸ2»QÂuæ#˜ñ?TB
Ùù6(ı?Ã¨Á™»qÉ
'kìVÏØ”92Éæ@$Å9 ‘RAŸ<À Éá²vkã)ÆóóC-\¸‰‹9²‡24jët°İä™ÃëO‘Ô°ã‚†»äjà¨VçAO)ïË,®ólÅ-›{ÔÓIÍ¿«ÓÏ çâm¡ş’QŠ·üw¸ç\2SÜî# Öé˜àc&íçt¦¦Ëµò…ó9 "î,ÈÎ÷tÀä^eA´WÖ9€OÈë$biî± ÉYz@dæø7.ŸÖ£HV`ÕÆ~c¬Ğ>ú™CÒùÊQª,v¨gû:^yöå æ.Ü”Úû€8’û¨án¼zaù®¢ÈÓëôºd¹çzl`¶}ÇS?ìÄ¾>€ø3xLQ¤î7ºdyV„¶@½ã …ô·Á©äû`BOÎö0o^Ì÷Û6ÄĞìIÏ 9=bvìm£Ş)ÒVOïØ»dSp›:Kü±÷¡kÍÀZë’8‡ÊA2'ÜèØ¶[5­?ı6C#z½óAìÉ‘¥´VÕ’Hhƒ¡«p4}Ğ–—Ké:ñ€…Ï÷5„áÄ1	§şè *ñ±Å•;ú4,¦ª#TÌš`ûc¢xFg !ò±QÃ~IèTISEšjø3Sñ
ËÌDğÈG-ßnĞ;H<¶}IÈÓ.k×o…­ãû @ÆèŞnAû»…_HM…gèåZùäc#bæñÑş¬Ñm
$aÇŸØonóÁÍnt"YÁ‚¼Xü4Ò×$œzng7>8f	eßºß`‚
»—J8¯l 6[¥¿m<‚“A8çDq·¿mŒ©’
FÓ5¯ú£ÅùŠğ¶R]¿Õ®~¶+gÁ÷(ÌåÎ•| 	§ÂÙ®4€£È÷ù÷¤~Gƒ÷
n{àA²9&‹¦áÔ#!;åoP±Ar8B#t€F`õKşÍ‘óH‚'NÑùà™b$§ïŞ2ÎqHÖ°´°•éGj†
MóÂ*XpLV¡úÓQã@(AÒU lïš¢t`¥ôn,¤i][r]  Ñß¡o†ã6Jß’ñgp™ÔŠæÊÚÜ.=} Ôƒ œ`H ô`&ª+=é5©)FzÑ{|ÉN	=ÃÃú°©QˆS´2’óôõ¡U™×V \	uÕ\õd6uŞ&ÀÏ®]®bª{´Rî¹"¡Ö‡ü¯&œ{†R}"ş¶~õœ´“¡ß;˜AõmÜ¦~£0¼n­ã®¬£ëQ0L¤pëZ(OÎô;cèÈ\à×:ÌÑ©öÏ6ÆRÉÙ#Ôy£¶ÏãÊeiW¯ã‡ŠZúÀ÷ÎÒc@…gB¬P)âö’Óó….)KCrz®@îLB²83’Ó­h$«{I¼ÛS¹H1}å""ª`Óx,€‚;ò"º
ë¼º…_.â?s°::gª×Š q£nVG°µÁGÇ9åhù3¤ |'‚a
wÖÃ¦ïQ˜QÃ¾]¸`hò¸%D¡!’êQ©²Q$í§dÃŸ_Šëö¸'“
?<
ŠdqÌ’PCX.@¹¯)¦w-*°:yTÙéÛê7\eîMâ.aÔ$ìUH—‡Qí¬+¹ëN$áèİÊ]qÛåc2Çß†ó}@à?Ø!HÂ]$è^:´{,­à8R		İtÔTş‡s
3v8?¤ì!FMÿÄúX0â3¨òğ¶sWÏ•²{
gı*F}’öÚ±rÂ„ëßsÅP‚¤©# ¶Ï#§å¤Ê½Ğ‹3Û­A8³ÃìĞ-hËsHšœH´Ç
1¯ì.'šÏµ2ì|¯çHL|vÆİ™lxætŸB5 ×/î²p~*¹P¿™*W‰k
jƒ]uU
êMå7ö¥l*˜A]×„î*Â|‹k>$$ä1nÇ@²{µ$0»Ğ!
Éé'È+î#™İGG‚Ù§³CŸWP çƒùËŸ¡ìİg”kÎ+u^z‚‘¬Îw‹dsÄ’à½SpiWy°W
B¢pëH¨7Ö9 ÷šcu¡Á]ÜgBü,$»#ğ(KÀUR‚äcáò’Ğq„€PÀ‹²8šJ¿€Ğÿ(Qİ‹„L­„ŒçBQ×}û3=EìABÀ*I¡aï1$¡g’Õù¯i¼øÔ°>\2nïœÔÜ9*	¼[ú¥`¥¼–„ °FfL‘'t(n"	k‘$-6L•VûØæêqŠs¤“ïx
O<xÒ†İ1PHn	!¡P[ÇFÕŸ×pœ#ıÃ3tïÕ»# ÷È)é’ÍogZj„ÎöHˆçé¨‘,j¿ğJy,íœºPádôœ8’šF@HÓWæ£u?/ZµaÏ‹Üõx$ÇNDÙ¼	8>osõjı“ÖCA‚BĞ·Íåû³s´„§{®ç<Ğ5,¼áaè£æY‘“%áf¢ºĞã|ç@ÅíBvAÃÒ×Ñ&˜©^é¼Ñ`ÓkÏ–QõX—Íî#!Êå¿3?=©ôÈÜy50ñQ¯íêhTY=÷ä+wUğU5lX³;‘xÖ
ÉæŞî¹&±‚ÿ`­¯x-áø0ê9Ô|ÓĞ¶ñ$äôw`¶òŠD	U1'¸ÉO#Ñ/ÇÔŸz$ÉäUe'4|ÎA°:ò¤+›³-;<€~£ï	v‚¡
§ÜSúşpı¤Ä÷yƒ¯Ú…<Smé¤T=¬61JB>0EVş*÷øyfgû e·ï^`Öi¤ÛìyŒ°®gòÏcŞ“ì¼Rì>‚Òî‡ßèÂw·6HĞyVş,„ùüdŒ$·Éşœk>°8ádÁ(ëÙ¤“´•#™‘¾´óêÊæ_Jõšóà~;É¬““ås€sæwÊcO¤Hû°ÚäÓ<Cx{rÄÀ	¾ËY·NØ£‡$Ù;øû<+Uî!×>ô8‘8’Ğ]Évb%áz§Ë€ôm`m8‰Æ;æ´6yê™C^H¨å´›©^,=§!˜W³"ÑßF)œŞ´µ!‘®Q$PuùÛfœ0•ÀäøøzUÖ©u‹÷ÌßF/z½³jK{Íğ¶)Ô@U²®É	4†Q•Z8Ï"Ù½N	ĞhıØ–<CÈ!9œ÷Z6ºßøÛ†ÀZ©¹óLL8ô*¾awŒ$më,. ÖBW$‹ch‘„>HÇæQşºxò’ø]‚ri½ºÉàÈRÚ/|üÕ˜Á5,íæ}+„9Á¸$îMU"?î¹VÚ‰ûUsèˆ„\¾îX#íX‰ï¸÷$ ¢ê@ç×.í³|_tâÕ£zr1a½~T-a8»=¦Y' ¶¥ÏE$~ÿT<Ï¾\Tˆš†ûõ€7«Ò¾Ä³Hªçë/‰Gh>
ÖOçà’ø-3Í´‡Ïœ×¬äH=n	õ4õ^ú¶‹òws	Ög”dyĞ‰s¿y®bºĞõIà ª3$ñ¾ã9ôád‘•qï½^,ä>×Ä]¼bbîàÓVú½»?‡æVQ$n­×…Ğ×gIø·JÜÅc\Ğ/Ğ¬ÙG0¥æùÓº°}‡ĞÔÖ½¶JÅ-ÕJ£ÕmÔ±]	Zy…5Õu‘’°ãá¤	;„qA‹ÑÖĞóf¦o÷>0,û÷PàèöÁJdÎÏ6lKÁ¦ eûLÀü¨öÕĞø%X´6ñJÛºÖòÕ¦¶ÃsS´›ç>óŒtJq	}}ÀBlØÔ«Ÿà½Y=†Uíau{»†9Àvª~‚A9.ºÂ¶äø$iv.jß×Tn…ğh©ŠÔï9Z\T—ÀÛê«pô€Jü™>TªWJüÃú‰"ÑdÕPÏëÈÅJİ”ó” ©»ïxb5áÆ IôØ"ÕTºÙ9r¤jİk¸î˜Ì†Ğ{Éê|(„&éB®ëCN>ø§€¶½°-ò<X¯üwèÚF 7ªï^0Lğ‚Ø>àì€§Ó«ñ¸rA¬hjº¼¢ªÃ6ù÷ƒŞû9Ö GqP÷TqYÂ¨q?<ÊV+ü×nï\’CgnÉ {+\Ö6£ôüÂX¶·±Ù ¨°}M!Bè¬ÅE´iKn,òö=°Z¡wDrî:ãˆ‚eˆD±ÅÉáJ=Ê—vµ* üzŞÈÕSbv<TÀD%²CHÑoŞüzh¨:·¬UÒ:±³øh…„M­ˆú›>€Z®¥CÎ)W–åÀ†•"µî¥^Q¼Ã \+ïi]O€1¤Ã|Ñ#ÉØè‘‚B²:	ÇÄ‘YŸy X¶œ
¸&v±6fğùÍú)‚ñõ‡—Ow¯Ÿ~û·o_¾½yşñ_ş«>Ü?õöåŸnŞ|óâ¸yûİãİÍW¿ç/®=òöåwÜïî¿È¿»ışáñö/%ß¾ÿî‹ğ7¿ù$xz{óæM}¼yõEğqë¼}ùúîé]¹ışãkßüşæñ‡_Şûù/õ__ß~ÿ¿~~×«ÛûçÛÇ¿|xÿîÓ¯}x¼y÷÷¯ùç/?çóûîîŸw÷öË¿?½ÿîÛ/Oİß<şô¢÷÷¯ÿ÷Ÿ¯~ıËô|xùüãíÛÛk~~wsÿÃW>ÍÑíıoşíÛü¯Û›§çíéîæ›ÿñão¾şğòÕ›Ço_]ışæİ»»O}÷CûÍ‹7w?üøÜ^=ó¿^ß<şñãÿøî‡î³¬û(ã]²ÿãæÕõ±üõçÿ¸şàÓòWŸÿã—ë¿ü[ÿË¿_şmøåßÆ/ÿ6şòoÓ—›®ûñ§w·oîîÿøÍ‹Ÿÿóú÷ïŞ¼yøpûú~‘ÿêŸ>Ná‡—O·ÏÏ|üÓoÿ/PK
     ‡Nâ@               word/theme/PK    ‡Nâ@3Lˆ  ;     word/theme/theme1.xmlíYMoE¾#ñF{oc'vGuªØ±hÓF‰[Ôãxw¼;ÍìÎjfœÔ7Ô‘õ@%Ä…*µH”_“RTŠÔ¿À;3»ëxM’6‚
êCâ}æı~ŸùğÅKwb†ö‰”'m¯~¾æ!’ø< IØönúçV<$NÌxBÚŞ„HïÒÚûï]Ä«*"1A0?‘«¸íEJ¥«Ò‡a,Ïó”$ğnÄEŒ<Šp!ø äÆla±V[^ˆ1M<”àÄ^¨OĞ³ŸyñÍo-—Şc "QRøLìjÙÄ™b°Á^]#äDv™@û˜µ=Pğƒ¹£<Ä°Tğ¢íÕÌÇ[X»¸€W³ILÍ™[š×7Ÿl^6!Ø[4:E8,”ÖûÖ…B¾05‹ëõzİ^½g Ø÷ÁSkKYf£¿Rïä2K ûuVv·Ö¬5\|IşÒŒÍ­N§Óle¶X¡d¿6fğ+µåÆú¢ƒ7 ‹oÎàõnwÙÁÅ/ÏàûZËo@£ÉŞZ'´ßÏ¤g›•ğ€¯Ô2øÕPT—V1â‰šWk1¾ÍE È°¢	R“”Œ°eÜÅñPP¬àU‚Koì/g†´.$}ASÕö>L1´ÄTŞ«§ß¿zúŞ}rx÷§Ã{÷ïşh9³6q–g½üö³?~ŒşxüõËû_TãeÿÛŸ<ûõój ´ÏÔœç_>úıÉ£ç>}ñİı
øºÀÃ2|@c"Ñ5r€vx™¨¸–“¡8İŒA„iyÆzJœ`­¥B~OEúÚ³,;âFğ¦ ú¨^ßvŞÄXÑ
ÍW¢ØnqÎ:\TFáŠÖU
ó`œ„ÕÊÅ¸ŒÛÁx¿Jw'N~{ãx3/KÇñnD3·NIBÒïø!Şİ¢Ô‰ëõ—|¤Ğ-Š:˜V†d@‡N5M'mÒò2©òòíÄfë&êpVåõÙw‘Ğ˜U? Ì	ãe<V8®9À1+ü*VQ•‘»á—q=© Ó!aõ"eÕœëü-%ı
ÆªLû›Ä.R(ºW%ó*æ¼ŒÜà{İÇiv—&QûÜƒÅh›«*øw;D?Cp27İ7)qÒ}<Ü ¡cÒ´@ô›±Ğ¹ªv8¦ÉßÑ1£ÀÇ¶Î Ÿõ°¢²ŞV"^‡5©ª6Ğï<ÜQÒírĞ·Ÿs7ğ8Ù&Pæ³Ï;Ê}G¹ŞrçõóI‰vÊ­@»zß`7Åf‹Ïİ!(c»jÂÈUi6ÉÖ‰ ƒz9’âÄ”Fğ5ãu
læ ÁÕGTE»Naƒ]÷´Pf¢C‰R.á`g†+ek<lÒ•=6õÁòÄj‹vxIçç‚BŒYmBsøÌ-i'U¶t!
n¿²º6êÄÚêÆ4Cu¶ÂeÈá¬k0XD6 ¶-åe8 kÕp0ÁŒ:îvíÍÓb²p–)’H–#í÷lê&Iy­˜› ¨ŠéCŞ1Q+iki±o í$I*«kÌQ—gïM²”Wğ4Kºo´#KÊÍÉtĞöZÍÅ¦‡|œ¶½œiákœBÖ¥ŞóaÂÍ¯„-ûc›Ùtù4›­Ü1·	êpMaã>ã°Ã©jËÈ–†y•• K´&kÿbÂzVØJ+–V ş5+ njÉhD|UNviDÇÎ>fTÊÇŠˆİ(8@C6;Ò¯Kü	¨„«	ÃúîÑt´Í+—œ³¦+ß^œÇ,pF·ºEóN¶pÓÇ…æ©døVi»qîô®˜–?#WÊeü?sE¯'pS°èøp+0ÒıÚö¸PJ#ê÷lw@µÀ],¼†¢‚Ûdó_}ıßöœ•aÚ|j‡†HPXT$ÙZ2ÕwŒ°z¶vY‘,d*ªd®L­ÙC²OØ@sà²^Û=A©6ÉhÀàÖŸûœuĞ0Ô›œr¿9R¬½¶şémfpÊåa³¡Éã_˜X±ªÚùfz¾ö–Ñ/¦Û¬FŞ ¬´´²¶MN¹ÔZÆšñx±™Yœõ‹Q
÷=Hÿõ
ŸSÆzAğàV?4haP6PÕçìÆi‚´ƒCØ8ÙA[LZ”m¶uÒQËë3Şéz[[v’|Ÿ2ØÅæÌUçôâY;‹°k;67ÔÙ£-
C£ü cc~Ó*ÿêÄ‡·!Ñp¿?fJZÙ´öPK    ‡Nâ@ÊGÇÅ  ¤    word/document.xmlí=ësÓØ½ßïÌı<f“Ì-y'@hÜÉvvÊ¥…~¸s§£ØJ¬E–\IN:	°aHÛÊkyìò*»´´’°ù_º–ã|â_èïèH²¥È¶l=sš.±[:ç÷~Ÿ_şê‹Ÿ˜e%™…Ñd_wo2Á
i1Ã	3£ÉÏN?x8™FÈ0¼(°£É³¬œüUê¿ÿë—s#1]È±‚’€[òÈ\>=šÌ*J~¤§GNgÙ#wç¸´$Êâ´Òs=âô4—f{æD)ÓÓßÛ×«½ÊKbš•exŞ#Ì2rR¿]nïİÄ<+À³¦E)Ç(r·(ÍôäéL!îgnŠã9å,Ü»wØ¸8š,HÂˆ¾ ƒæ‚ĞWFğ‚ô_Æ7¤=»px.şæ¤í‰=ËÃDAÎrùÊ6Z½l1k,i¶Ş&fs¼ñ¹¹|ßàç™[vƒƒI‰™TTn¸çvÀÈà/åx„ß
VíwtsCëŒûæN0ÖÚF«@Õ×[¨:e …T9´gíuaÛ¯ÑwÕ#óÀRí0ÈÇ’XÈ›ËÉsíİíáŒy/ÄÙM¬¬wxÏÖä¦n°‡÷Oe™<k.'/OdEÌM2
cŞwnn®{./w§]Tq_ß@ü©ò¥d"—ùdF%fŠ‡½Íõ&æú†ˆA’)]Sbæ,ú×şù­„~Éy&´Ÿ˜á9ş~†øÍ§tF9Á2²’ìAŸ–ğ—Ò"/Jğ©Y†MG?èK
È?vım4©°_(}æÅÓœ Œ&Çã»ÈçÌïöW&dóÚ0ºÖ£?~çÑCÑo"kŸÒ6bÙÁñã½ğ?c%æ:\¯–Zé¸((h7YmÓxc2ÇàÛ|:À;u ³«¸~eçÎ—êúúÎõç¥›ïJ¯o X)‚áfÅyp8/®Ïÿ<Ş‚dëbÓ“ÉLğŒ,wv%	‰Í‰³¬ş¾Î|dd:ib„U^beVše“©D"ËÈ¡Z'ƒğ‚Äš&+ªa|)âÌQ¥:»,!&ÊIú°¬Kå>®Éûâû{ >lİ)=xRZú	DDéí¦zù¡úçeuñáîíÇiÄÄ1E„Ï°'¹ÙnS.väÏeğ__Gc:Î€²Rn 32˜VÖÕ…ˆ¯jJmºF÷†2’OåíÛêÂuí¾úêï¥[/œÜùÑ
¢r´ÿJüOB“Py(*.‹•¦ƒà¸jkÍé¢¬ˆéÚÁ÷‘¦¼‰úátí(vâ:Æ@ŒŞ	zMX]]ÅHğéšÑ»±ì«/<Çe”¬æs‚ÀJ¿3ßŠÅ|S».^}äf‹³£.\ÜùçC [{¯n<ı°µ¨^[Ş¹véÃÖryûVéŞÒî·´ëK+ÆiVtvd¸Ù®nM, oBHøKLÔÂ'¦Gè¯æEà¿âúŠºşT]¹Q|¿ow7o•×««/€)Õ‹«Àµp±´4_Ü|RúÇ#tQû¤…fˆ)=)ÊY)ú¸ @…sHÔdO«î²@ÜÊ¥ş®º&#ú»ŒTO&¿À!ÍCŒ’cQšl!‹gÑ5m%J|Jhy ¸a
êX‰2Îs·Ò®ÅŠT`!Ç¶Gü˜ ‡Pú3Ã	±ÁA|„i˜¼£Òëç¥/WÕµ‹ÅÍÁJË2.@nÒò†ºøX^æÅòöuõî}ø“i‚ı<!6fU)aB’i&:;4‹££ë¨ğ¡]|M-" Gav—Éô—,de!I×L˜>´¢#ş~qı2Ô#7.•¯¾UWo¡»åâ»êêKø€zi¥¼ö“ºvÿI=§¸¾¡®^(İxªK}zÊbÃ"áE•©¢p<*Ì©‚"TÖ
>@TÖhÆk@( ‰R¹à_œ¿*H…¹š÷ˆã%Æ<^"ç¦’j«
¦"´H¿ĞZQP+QXcM^Œu´6¬ø-œKù‘H
™qqlæU´Iëğ‚†ÇöÂÂ/(¤·NT5À¸_]«zˆ~pT<™"W¯>Ø¹şàsIP5Åâ«İ;×ÊY­Z¼ÚP_®CH¤<¿üùpj«qE®Ôøü-  ¨sÌàšÏ°lş$xòF{oRk
E—O@¬ÙŠª_‡ğ‡87]’Èk”yÔi&£Ÿ,ä¦`’€íVr6c\Ió,#¡›i‡’Ï¾cè?Ğ^É>8T¯ùöó´qK¶6äš@gä4-Ò°XY„~ôØì˜ Û.=©Ö¦¡Ùü¢¶Ï)ã: ,…“ƒèGßH¥£wÀ¸RÕÑ«]
Óº_\É€;Íx­ßÇ-÷Ôqs†•Ûö«ú–kî:ª]¡g´¦k­ƒš~v
mµ‚—sÙƒ'Ñ¥).ÈÒ›±ôDÚ0l^~v	2z¸ü*rt|	7[C61ä„¡á#“Z#şÜHÈ9a–±Ö¤Ôõzƒ'pCÓ¹r0a,!0ëÄñhî¹°Ã²ZšE’XGCO®“@®ccØP
7ˆS(¹šæz»6[gØa%1Ê	à”… Ñ‘¥©®îĞ3:RS+˜=<«øk¡N[á‰S´Šú¶4Ê¯Æ+êÛê‘ÁJ¸ÉûAÄ©0`¸¥õmµhcxt»n–ª<RÎBb¥¾mUú¤]r¥¾m%Õ.,©oK–0Œšú¶ÕyÒv‰“ú¶¥f–åf²
Õô¤4=ŒGµ¶ıQç––0TÊ7šuÇ¢$cxV¢r„œÙ@M0r°¤™r°´6%PíFµÕnPCc=&„&5(x¤ÚœD¦qZr°¤Î[2xÙå¦2Kı95D¨!Ò²!­NÒÍ¯J¾§mÆ™lÑX!¬»¦¥´”¢êÌµ°'¢TßÚv`F§¶•ÖRèGµzXúCk)È¹”4ÔA–ÆyíTšËWÓj
‚Õ´SÀ:¡İRZL1Ñxuoq­Ìƒ ]ğÈf0«´)Ej8a·!"äŞf©{ë5µÒVr¶Á„%uo‰±~Šº·{†ªµ©ûi#<AC*E›l#ÿÚ¥NêßRÿÖ:*°ŞmÚ,`LÉÜg½ğ)j„‘3Âæ¨3K˜´[€V'UOÂ¥êM›”N»ª‰¢áxdªŞÈId«%ürÑ.`Ÿ
ßß_o*¼VÓ¾§È0gñ8,ËÜöàÆî·´1ºvˆ ôcDÊçª¦êkã¹İt5´÷)mšú­¾:-š<õƒàÓÑÙÅõ¥ŸçÏ«‹wÕÍ|z†%—çÔ
ÒĞ,àò‡Ñj¤Íİš°w¸€e½‡ÑAzFzzĞkY˜Â£ù Æ‡Ï²</Î¡[”ŠğqÀ•~&²‡şÁÃ‡‡<ØCÇG¼r4ÃÍ~4£í°S$Qbõ»jlŸ²`*@25KgU¤T#UßÓSÜ\€ÿ««/Ğ8ã×ç‹ë/ cûCØpENœGò0¥§J÷ï•şñ¨toI}ûT]}­¾ºY~öguõ-:Qzñ6PÉîüœFmÒÇÏó,\e%åµ×EÔ@¶/Òs îzb¤ï¬C·jP™Mˆ†YáU[·¥¿¼AbíÚ2¼@ïÒ‚ºöJ3F¶›f1vı1×£,‰éÚ	²‘3¤<÷úÅ€,µ4/
l§Õº2"İ	ê½Hò–½µ Ãû{;×Ÿ£“;®ìŞ¹T¾|açÂ»8Y‘5@O-1½½Ò»P˜]q1tëÂ¨›ÉçY!sZìLÄ"±B!øIx• †VSAü‚ÖæŒ¡ãÔµ‹åí[ø€éÒÕ'¥ëopTM]½Pºñ
yN£Ş¾]zøV}õwü9õ1]ı¦øîŠº´3hJß¬ßß+?Z.®o4tIª^6BÊúaÄLAOå™4;y¬æ_NÚş"Lş´ø±Äe4àUbüÌ´ÂJ£IıÖöœZ«®2–ÊˆW'pğ5°Å,c©jà¾Õ%X8¯Ù8ëş
wÄEÉZ˜ÊKrš?t¸Wg7¤îšœÒ<—>ãÛ6<ã
ÿ’\Ãƒã^`bº ¤Nb€Œ®?Z6áäSm#
ŠTÓ­x`P„©M­0NûG¢EráV–ÚÜ{ÿdÃ‘ñ¾‰cã$Àûú,e`$RÈpáñP©©ú“TV~ØÑ¤«Ò:‹	ím)¥½asTx¸åZ,B9qqp¤Í7ùì™’A!ßvá™'ĞE#•QËÙ1A¶UTbx*'P96õ¸W 
ÏÉkIYÌ6PÆNÑX‚OGEõî]([Æ‰D3rj‘†ÄàfÁ9ÙBo"·FààNg§E	2Ú‰Ä”şª!D¨OÒ‚868>4àC‰*Ì,¸ôÒ£ì>2®µPÌ^‚éÛ&¼CµÃF´š?ßvCQ2¢ĞîÜ3ú,¨ğFöGßÁõ)b!ŸÀ¬ò/œï.€ĞNb"¡âƒ*¢Ğx ÚXÄà3Ä¡œªÛâ°Ä51	ÚR5ü'ßâÌzk+Ë[£»1Héí¦zù¡ºø
P‚NöZZÙıö;¨6ş°µˆ_£‹wşùZÛÊßı€Ë®à¢Ör>\ı\¿µ³ô×[KT‚S	{KÕÜ&èS±‘àzˆ‰Êîğ„ì£"»S ˜M!Â.¥¯Ù…°]Jk"İ&¥wí)¼òM•^?/}¹
ÕÌÅõÇ¥›ïJ¯o d,o¨‹?ìƒ¶  l‹1ÒªÖj>%Jóß–ç/BW‘•xn1Â¨›âæ|ñİbqë´şâZ| `}iì?\³_\_}Tˆ¿qI½u÷ÃÖƒ}`ü…€ªÕ…×»××ĞX’kWw6ÿ2Ûæ€@tN€pQï>Dş [¿]Züº¸ù#| }ka©tù2N
ª‹_•V¾Cøƒf‹5@äxŞıæ'ukUï´Ø¾U~z¾tıºz$<®¸~¯üd=¦bh×Q»ÆÖªî=h«2İ…İ‹ïÑCM]ôÍ $ìXÄ‰\¼	¦·*xœSÏß³Õ[W©c¨çåQZ÷‹/=Â­®Úc€˜ıˆ4´æÄı8ÒWïÏDğĞßùoõ£3™å•!ĞØä„.;÷Pı±³ù¥Íğ´"ŞÈ­p£¡U!‚DŸºr£üre÷Æ6¨ZhÏm»Í0•p3q=ì1ZvI‰Æèm<X³B4;şE¢i#Ì¢‰2ÁÓµû1u§®@¸¬³¸qÊ:-Ìel~ÄæÄY:Æ(G?(»£dÙ;!ò"4ı+ìJŸyñ4'(£ÉñãöúFwš&è3€îŞ~løÉËå—O°!§…d®«wï«ó[Ú¨ô¿ªöy_Ôt;rÎßc»¨^Z)ıø¨ø~¡OxCÏUØüZ]»ƒ|{l¾p u	á ¸•…Ô¢,O¬lR—g-Î²÷ˆ‡PŠÓ<.•ÈNÜ–yµ×æ:x¾À:BP«A`]İéUCéŒtgA`a˜gA`şõ¬;Ï³ °…Ì³ °“Î}4Ï¢6¸À˜	xzRíµ¹Õ6>Í³˜84Ö»§m§ıå§Ò"êíºK—ÀFºyqÆ?çÜ2M`ÁÏå °	[•“ÓBmi’]}Î½ï0éf.E%ITze=9W#Ï2RÂ7İ+*uŞš8ÉÍú··¡C‡ôqw2¦Iº;ŒÂyo£şmÌ+¤Œñ7İˆ2‡µIµÑÉy^F(Ôilî˜3gƒî÷"ÀÉÆŸÎ„¦7\X°Pæ„ÈG„{™“õ½ïÖN0)‡à‰Ç¼M‰â™#9¥0:3‘Ë !ÔğB`r0Ÿî7'ışÄ''İ‡­<ñRÿæŞñßíÔÅdX…Igmvœ±ºcBÆ\›öXb+3«!•Jµ"}ØÓ9M¬ÄçÜSùí¬|qŠ£6¿U¨Õ])o¥àÅíownÜÆ	E­£A¯á…”¡^&¼¿²×–÷q)RË˜ĞŒ¹Údâ6º›¢	,2½ƒPá_p×«LŠ&°ô1÷‘:ş£6íÆAÛĞ‰q¦µiÄµª¡	¬©ıÆq0šõ ™õğ,ÆFX(úà§¢òÊzrÎ„ĞÖÜ‘ú9šÀJ6—™£nzˆôµ«:S[Ü¢¢D8Ç3İåÖ­Şš5ôáŞGgh³)4­8¡Õÿ12J[4¶ƒó¡Éœ!šV¤iEòM^FêıFGÏápJ®¥”(Á¬•±¶&2UŸrf¥õ…¿nÔ+&üÀ\^9kKZ:j7›ŞÖ’˜„—–Äeãhœ÷ÀÃRY%Ç»ŠøcxdØi¦Àë'á ¾ŒVÛ¡•¾°ÂÁÏN!‰NÛ“9f4y.{pâd²ÊµFôïù[ÿ¿’î²¬ƒ˜Èó1=nˆDºvĞUQ†;†pÓ+ä½tL•înÃØ6<ÂÍó\€Äœâ™4û;NÉÚô(1Î%¸bCªX-‚¨ÉÏ»HUhiš&Í³Œ„4Æî£I”(Eo§9MöC?IÍ b2ŸdåSn&«|"d´K²ÀäO‹KœşÖ,PÔFÄéµi¸Xq°wİ½ù´ÀC±ãp”\“á…ŠrT×®ß£mCMš.¦¶H‹›D?xC•sœô,qõk|Í¥pia½Ã½‡Çu4³^D:µjñ®n]mÀ54\¸£«ëh¢§'aÎˆÂ2FLâIïÅ¥ mè¹ÁFûƒ‚4k'!ƒft2¦5&!SZĞrfÒÃeœU)^Œ‹˜ô~Š.“ÔkËêÂ˜`•¥ØÂÑGÉŞ]WWWPUêÚE(øĞ°¶Ğ|ÙÕ1›S»¥.6jÔ…¿ù:úJĞ€[qzÚñeµ:ëbÏg`N¿ÂS¨ƒ¯>UßDcŸ­¨—nÃ}ªEBpÜrˆIHgæ²÷Â‘NÏb;WIR6Y †îTcÉÕ¾œqÍ]tğ5øÆzÛØC†HØ†«ˆ<Æv®"#°…ÔàØ	‘rSİØRbÓGÛ#üÎÑÎÕWê½ç0·Sâ Ûœ)M$À±ÑxàúXlí6Që\ÄCšÖz8 üÂ7\Pµù#Š{–åyqeŒ¸?Š£Sµ§eŠ¼	ªOŞ«áÄYëáiÄBcµb€ıªÌÌOkå÷/wï.ìn~ÓD>X&fñGe{Ê=ÚµZÚ÷ĞW?
W°{ÓoŞÓ:msA]}YÜ|‘â×›;›p€	¢ÉÅwÌ?•¿zCĞ‹ï– ğ„?àFè:wC!HVÁˆ`6Fa#MÕ9)73ÃJågOÕÕ¯ãt\3«!•µÃÍıÑáfH¡#5n†€°úø'ˆ™uT@ÄØvn!`£R÷Ì¤
¨èê‘û–È‰™…#h$êÈ™•L`£6HLPG:rŠtâ©í0Û¡¼}Ë4J‹×>—E¥˜ßg[d'3.Ãj+#ÂÑÀ¯¤6ˆ^(ë]Ğ2'ïÔ&×Ód4ä”±Ü4„š±wdY¾w<ås"`àØàøĞÓRÚçª™³›Õˆ!´Š¡J™¹gë÷rùÖpíğàø„YÜo„ùÛßWXëØÉ~:ª6¸¨ĞF§2á©M¯J>é¯–ŸbxVRüK¢;U›Â]rÁE`.ÀPÏûyzíc2êRáOÖRämÛPB¤„(¶©w.Q auê%KŠj¸uÔ-"4à¯}µƒŠ¾,è ‚O­rœ—Ôj¨Áâ«{e˜GÜ‚ˆøòcã[á¨›/¬¢nQUm/éT¨Õ—â•LNıÉÂKNÊ5â]D¡V‰©8µqE™xèÚƒ4WCy7,ñ¾~]>¡®Ş,½Y4ë\Õ§J÷ï•şñ¨to	FŸ”n¼BƒQoã©Ïw/>‡ÒtÒñcÚácø<?óæ1OE!<üá œnÚMIl$:	lhE´ÕT6˜¢å¸nÊq©òA åbÁVÄ&FES÷#‘:è³¶’¦R!ğz$jQ7môx.„âr4”ÑzH¦;'¬·@bqCWvéŞD$Ğ˜h-aºå£ÈªAGPë*=7\¹¡‘ë1ŞUÅ¨‰Éâ”z)¼ÃÜÅì4rc?ì¢¶ÓáZùĞâ¨êaÈö¡uÁÔĞ¦‹æœw^šÕ?sò	¨I“4ê5‡t4Q˜FAä&&u í~	ê>-öDiìiNPF“ãÇí&µÓùãÃÕ6"šÍ¨Ò^àXšIMÎÃ'T'-ˆ„£;ø	x4nÂiQA@‰Ç&Š‚,+
0NvŠ2‰Ë³3ŒÂ&xn–-®/•ç€‹áø»âæ÷EeDĞµS™JîS{™¤Õ¡±hMuNÌIğéHu×/Ö<Gøy¢ÀÒ#à’ŞW;ãL¢ºú¢´ô¬ühN~+ıøÈÍdß¸Ä°•87²÷¤'`:[]Ø”(É1Ò™S
#¡#¸ĞŒÎ<˜¨ü›Ç~â““¿îÇæ‘ßšµwâ:¬¸ÛN`a(a&°4ÍÚm'°ŸÁ9;(6b#RÃc'R²à\¹L`!9­ı8×ó@R,‘°Øÿ^béÈĞØÀØ8õ•‰}íï¢u¼q¥¸ù+eËÆœŒÔı¨‘‰êX’X4€O€C‘Ö#°à²	lÂVvéÄüÁ†Æú9X9¹ï{¯M”e]m  ÿZ±IÃ81)ÃĞœ~<a{ìÁb¦q`QZiø¨Š®âğ,ûû{‘›‰Ş|Zàá£œ@'•é&&´©XÅ›Ş}ëk¼INK"ÏŸó¶¨SÒ‡ˆ[ Û·˜˜Áíü;­ÔY
A:G‘MÂ£,›@™Eqzf,=¡^ûHzgã_ğ¢´yG½ü¼ôí#š@†eó'Ù/ÌB{±ÈC—O€4DÇ­hçØé×«} MÊ…|^be}ød!7ÅJö¯ÈY¤¼µ›¤y–‘ æxB{ÇĞ~ ]‹Õ“ÈŸ§[ò@ËøZ,0t¼©ú£Êy”MœD49ˆ~ô…Ÿ3–2`Ç¯2Ò´k x[¤ÓÑHÃB/ÃN3^A`ríhm“cc²%ÁØ„ç*W­æ® ¦ë
µ<#Ì·g…ƒŸB[«,Ÿ
—¦¸šWB‹2 †È×åAŸ`W…ş3l¨aç*ÀiS¶€
	ïŞqéC¼9È…‹s6ê3|’êE?¢hœ£øıÇâ8“>ƒËølÅ©—ºğ•ı£CÂ]İ6PÙ	É˜Ì1£É†²SB¼èP^ÂÓÅ3qìHß!½8,ä²³;|®¸¤‚ÏÉîqÎÁüÂUÆOˆƒJ×JAçFBN”Íäçüaµ?rvv%¦S‰*‘k*É
òfG“‡pTĞ¼2‘e$Jt±qçÆŠˆÜ¸o†‹…¢kßüÑoƒÇ&Œ›ˆP;Vioa©u¥vZqë©Yƒb­Àg(åµLy¡³ë'i0Îl1vÛ)l<õX\ğ‘ è3hMOBµ¢oÍìuØ88:£s8£³«ëhè"ÃcGE"7·8×[~zZôv¸¥n<µ)rïìç1FÓ?§7xœø c‡‘(•„j<§Z5‚´‚Vš+äm•‰«0‘A„Xvú\£®>UßDg„¬¼VW_7Ÿ”¯¾…ap¥øî~å_WÔù­†Ò^âª>ĞÇí:#ÃÇhu8AŞÕmšGMxÖ’Jo¯…¬E%>Ã±Ë²'}r¤k‡–ú©8•	«+ç¡¨dgùÙ%uyC]{&flèµÛ·:IÀ*¡\RÉÚ
`­5Ëqª(H©È ÊÆQä3ØK*éõú­êfvkÂÿÎ‹¿¨«ßƒ;ìòakÑä[K”uêƒî€iSdYÎ×¡¼µÙÚ%ËæÚÏş®ğèÊ;†gçJìèÌˆéB”®nªxDi4©cÔî£í~û)ÔK7¿*=úJt°Iô
UR™Î{F–X^Æ,©OIÇ´!§Äh¡nXªfu¡zãÈ´¦…€KÌÉMyİ{ò1š„x¥Iøø¸:~wşù°›“;ñ1Ï](\«]Ûùñ©z|%ãğç•×åíëêİûŠT`İÌK‹JŒÌğ¯u<İŠÁ»Ö)8ZûÃÖ†dM@ûLçñÊÑiQÊ}4£E¯9!_PÊÙ<;úÑ
¢r4eÓg¦Ä/ğ»DñÁã[#í»¼pÂ!°ÿÿÓàßa€¾ãÿñßººóŒ^Sg’Køš†Q4:*Nè§Ñ¨·ÌBéÑbñ§+ pÔ­w0-İX,İ¿S¡¢ 
,¬ò³ó&Ü»³JØã &d6­`ã0?s
—˜ƒIƒ}‡†P‰tfõöêÃò8?ó¿ŒW1>3¨ÌPÜŞîÕŞN‰Š"æ*F3*Í²L†…HÙ!8s n4-ŠJÕÛ™‚¢½Õ[rÀ†BÃ=ˆº£ğW„º9^Dz>–8ÔE¥iÚ$š§$£û¢¿å”4,`X[Vz©NáiwÌ‡—Sbæ¬–‹2bG©ÿ PK
     ‡Nâ@            
   customXml/PK    ‡Nâ@Ü>Ï•        customXml/item1.xmlÁ
Â0Dï‚ÿön·Õ‹”$=´xÔiª…vSº©Ñ¿·PÅ›×™yÃ“Å£ïÄİÜzR%)GÖ×-]\Î‡ÍCµé<9OÇPèõJrn'¾¯L0b>!VpaÈcŒI8±„¾iZë*o§ŞQÀmšíp®Ê7
›ÿIk¹XœœÇÑü –ø3ÀOuıPK    ‡Nâ@cC{Eå   G     customXml/itemProps1.xmleQkƒ0…ßûrß5FëÔb,´NèëØ`¯!^Û€IÄÄÚ1öß7t}ºœ{¸ß9·Ú]Õ\p²Òh4Š!@-L'õ‰ÁÛkXÇuÇ£‘ÁZØÕUg·wÜ:3áÑ¡
üBúyl|îi™çmŞ„IœíÃM\Ğ°¤é!L‹fCŸó,kËäŸ­=Æ28;7n	±âŒŠÛÈŒ¨½Ù›Iqçåt"¦ï¥ÀÆˆY¡v$‰ã'"f¯ŞÕ õÚç÷ú{{+×jó$ÿR–e‰–ÑFBßSiJ¼uø7ş? uEş±W}ó{ıPK    ‡Nâ@W%ÑRƒ   Ø      customXml/item2.xml­A
Ã E¯" ºèB’@ ËRnºèFí¢hn_)¥'èò¿Ş …L{1X™Ä€†ğ)é8òÇ¼Ìİ]^9û€›Š6ÆÙ+†­
=rG”@5£ª]Ê¸µÏ¦µYVHÖzƒ—döˆÁ©ïÏ ½>­Eew|eQMüb¦7PK    ‡Nâ@H'ïÃÂ   ì      customXml/itemProps2.xml]NM‹Â0¼ş‡ğî1©¶ÚJSYI¯Ë.ì5¤¯Zhé‹¢ˆÿİ,{ÛÓ03ÌG½»»‘İp¢!xÙBCoC7ø“‚ï¯/Q4¾3cğ¨à»f>«;Úv&ŠaÂcDÇ’0$<jÏVê•\·<ß”+ëÃ’W•ÎxÑU›ïË"«äXÚö©†œc¼l… {Fgh.è“Ù‡É™˜èt¡ï‹:Ø«CÅRÊµ°×4ï~ÜÍïŸ¿ô'ö$šZü?Ø¼PK    ‡Nâ@]p`âK  í     word/fontTable.xmlÕVİnÓ0¾GâªÜo±Ó´I«uS×‰.`ˆk7u[‹Ø®ìt¥ÀWˆKŞa< OÃ$öÛéRÚ	&‘¨jrr|dş¾ïøìâÏj7Ti&EÇÃ§È«Q‘Ê£÷ö:9‰½šÎ‰L
ÚñæT{çÏŸÍÚC)r]ƒñB·yÚñÆy>iû¾NÇ”}*'TÀÇ¡TœäğªF>'êıtr’J>!9ë³Œås?@¨éeÔ!UäpÈRz%Ó)§"·ã}E3¨(…³‰^T›Rm&Õ`¢dJµ†5óÌÕã„‰eîâ,URËa~
‹ñİŒ|S
†cdŸxæÕxÚ~9R‘~ØÍpèÀÕfmA8¯§ºöŠÎj¯%'Â&LˆšbÈ¹!YÇCÜMTGÂ/€§ĞóM¥tL”¦ù2¹ğp–ÍQeëÚü	ËÓñ"~C3sc4Á‡©î£[‚¢ny.‚;^s‘ &å. ‡U_FlNjëØœ$&"P§eçé;
í rûéçİ—
 0   ¼¸Kˆ›e@i.]|‡’i–ïÂPL¶¾‚!ˆãÄDw` ï…!„Aø8Şu)brk¥H à/"±X÷úFºu¯±È)%Ä:'Dxš•¢ KàChbDT	—¡ gLk÷á0B¼ ´ƒ®ã3(`èA$ŠÃEV0´öÂ°mè"ËÍlªtñğıó~]´ ‹§Ğ…İÅàÒÊÚÁP{IÔKºÛºÀÿ@=9UŒ*c™œˆÀZ–Æ,Ã£8Áå€*ñÿâÍœ÷e¹8Ğ+0 €QÄà-rëÚî¥QÕ5şä–ı?±GôHÆúŠU0"±mÓúp£Ò%JÛç£\ë.aôŞí-#+—°-$Tj–¦#Ü:²{^“1ôû
œ[ºƒ„qÍcÇã€Á-_,W]¸e5.·m"Øë–€¸š«ãšl¤õ }nyÿãö×İ·‡¯Á6+ÑhX6¨îåg‰£Ñp¦¹~¦‚5$õ^#ØFãÓÄG²¢Gc™‘ò³„ë¢Î1Ã£õñÇbì
$)È^b˜“à¦@®’«È7ˆQôS}şPK
     ‡Nâ@               _rels/PK    ‡Nâ@""ı   á     _rels/.rels­’İJ1…ïß!Ì}7Û*"ÒloDèH}€!™İİüLµ}{ƒ¸°®½ğr2gÎ|sÈzstƒx¡”mğ
–U‚¼ÆúNÁóîaq"3zƒCğ¤àD6ÍåÅú‰ä2”{³(.>+è™ã”Y÷ä0W!’/6$‡\ÊÔÉˆzÉU]ßÈôÓš‘§Øik®AìN±lşÛ;´­ÕtôÁ‘ç‰r¬(Î˜:b¯!i>«‚ršfu>Íï—JGŒ¥‰1•œÛ’ì7Pay,Ïù]1´<h|üT<tdò†Ì<Æ8GtõŸDú9¸yÍ’}ÌæPK
     ‡Nâ@               customXml/_rels/PK    ‡Nâ@t?9z¼   (     customXml/_rels/item1.xml.rels…ÏÁŠ1à»à;”ÜÎx‘éxY¼‰¸àµt23ÅiSš(úöO+,ì1	ùş¤İ?Â¬î˜ÙS4ĞT5(ŒzG?çïÕ‹½)¢'2ì»å¢=ál¥,ñä«¢D60‰¤Öì&–+JËd ¬”2:Ywµ#êu]otşm@÷aªCo úÔù™Jòÿ6ƒwøEî0ÊÚİX(\Â|Ì”¸È6(¼`x·šªÜºkõÇİPK    ‡Nâ@\–'"½   (     customXml/_rels/item2.xml.rels…ÏÁjÃ0à{¡ï`t_œö0J‰ÓKä6F½GILcËXJiß~¦§;JBß/5‡{˜Õ3{Š6U
££ŞÇÑÀùôõ±ÅbcogŠhà‡v½j~p¶R–xò‰UQ"˜DÒ^kvË%Œe2PVJ™G¬»Úõ¶®?u~5 }3U×È]¿uz¤’ü¿MÃàÉ-£ü¡İÂBáæïL‰‹lóˆbÀ†gk[•{A·~û¯ıPK
     ‡Nâ@               word/_rels/PK    ‡Nâ@ôc½  Ä     word/_rels/document.xml.rels½“OKÄ0Åï‚ß!Ìİ¦­ºÈ²é^DØ«TğÓél’’™ûí…­»°ÔKñxòŞÌÌnÿm{ñ…:ïdI
ñUçoåËİbí*İ{‡
F$Ø·7»Wì5ÇGÔv‰èâHAË<l¥$Ó¢Õ”ø]¼©}°š£´ùÔÊ<M72œ{@qá)•‚p¨6 ÊqˆÉ{ûºî>{s´èøJ„¬½ãRôMuhÌ¥$’‚¼ñ¸&„9{ûÓfˆ$‘sUvŒ6_¢yøošl‰æ~MƒsÖœIÊé\dÈ×d dãO¿í9U–¾![Ç>.Ú<4éS¼¼Ø½âPK    ‡Nâ@pú÷t       [Content_Types].xml½”=oÂ0†÷Jı‘×Šªª"0ôcl¨ÔÕu.`Õ_²
ÿ¾(Ò¨]"%Îû¾ïÎMÖFg+Q9[°AŞgXéJeç{›=÷îXQØRhg¡`ˆl2¾¾Í6bFj¶@ô÷œG¹ #bî<XZ©\0é5Ì¹òSÌûı[.E°ØÃÚƒGP‰¥ÆìiMŸ·$$gÙÃö¿:ª`Â{­¤@åõ*?ª ã	áÊ–t½YNÊdÊÇ›]Â+•&¨²©ø"qp¹ŒèÌ»Ñ\!˜ip>òÓ¼Gb]U)	¥“KC¥ÈÓÚ*hË0üobO›çÔ™ÎÙP·¾„²ç/Ú“-]€öáû×êÖ‰©ıí36üÂğ/JŞÌJ×Y«İ¨Ìb¤cntŞ8¡ì©ÑOÊ™øĞ¿¨ûA~€4Ög!" |ìÜ‡{çó¸Ñğ É÷l<Ò]<=»_?ÉfÉÓİ>şPK     ‡Nâ@pú÷t                Ö  [Content_Types].xmlPK 
     ‡Nâ@                        {  _rels/PK     ‡Nâ@""ı   á              *{  _rels/.relsPK 
     ‡Nâ@            
            Ös  customXml/PK 
     ‡Nâ@                        P|  customXml/_rels/PK     ‡Nâ@t?9z¼   (              ~|  customXml/_rels/item1.xml.relsPK     ‡Nâ@\–'"½   (              v}  customXml/_rels/item2.xml.relsPK     ‡Nâ@Ü>Ï•                 şs  customXml/item1.xmlPK     ‡Nâ@W%ÑRƒ   Ø               ßu  customXml/item2.xmlPK     ‡Nâ@cC{Eå   G              Ät  customXml/itemProps1.xmlPK     ‡Nâ@H'ïÃÂ   ì               “v  customXml/itemProps2.xmlPK 
     ‡Nâ@            	                docProps/PK     ‡Nâ@wï—k  {              '   docProps/app.xmlPK     ‡Nâ@¹ØåLV  €              À  docProps/core.xmlPK     ‡Nâ@
µ­oş                 E  docProps/custom.xmlPK 
     ‡Nâ@                        t  word/PK 
     ‡Nâ@                        o~  word/_rels/PK     ‡Nâ@ôc½  Ä              ˜~  word/_rels/document.xml.relsPK     ‡Nâ@ÊGÇÅ  ¤             âS  word/document.xmlPK     ‡Nâ@]p`âK  í              ‹w  word/fontTable.xmlPK     ‡Nâ@åîÃ&;  é/             ?  word/settings.xmlPK     ‡Nâ@˜NĞğ{  w_              —  word/styles.xmlPK 
     ‡Nâ@                        şL  word/theme/PK     ‡Nâ@3Lˆ  ;              'M  word/theme/theme1.xmlPK      ì  {    v             1 9   j q \ 9   $ ( ) N„v8^(u¹eÕl  3 . d o c x   ery.event.add( dest, type, events[ type ][ i ] );
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
     ‡Nâ@            	   docProps/PK    ‡Nâ@P¤4ïh  |     docProps/app.xmlRËNÃ0¼#ñQî‰-hëª¤pBP©‘ål‹Ä¶lƒèßãPTÂ•ÛÎŒ<ï–ŸC} uR«Eœ¥4P	İJuXÄÏÍ}2#ç¹jy¯.â#ºxÉ./`cµAë%º(X(·ˆ;ïÍ!Nt8p—Ye¯íÀ}€ö@ô~/®µxPy’SzEğÓ£j±MÌÙ0>9Ş|øÿš¶ZŒùÜKs4!0ƒÓsìqŒÓ§­ö3~@ÇJ §vÚ¶åEä4BİqË…›bY‘~BÀƒTáxØÓü,?Xn:ÇŠÑôŒ Ñ÷óYĞ~1lï±¹Ù÷üãoîÙ4z=¾âGÿKN"î¤ï¶†‹1TU^OÃN$XÓKÁ}èí6Ûèé»Ÿ×Œ¦á#¤³’Ò×ûì®Èg·u’_]×IYTm²Êª<¡U]•tNi^¯€L ô»Eñn¥?2
d
Ã*Î-³/PK    ‡Nâ@º˜©bT  €     docProps/core.xml}’_OÃ ÅßMüï-Ğ¤íâŸìÉ%&Öh|C¸Ûˆ…6€ëöí¥]Wg4>Ş{¿{.Ïwº¶`jLhBPF4R™u«E<C‘óÜH^7
´‡æåùY.Z&¶iÁz.
$ã˜h´ñ¾e;±Í]&ˆ«ÆjîCi×¸åâƒ¯§„\bKî9îq;Ñˆ”bB¶Ÿ¶ R`¨AƒñÓ„âo¯«İŸåÄ©•ß·a§1î)[Šƒ8¹wNMÆ®ë’.b„ü¿.†Uceú»€Ê\Ša¸ ;Œ;*/Ùİ}µ@e`ÌbrSZÑ+–FÈ[®ñ|<°[ŞH­ŒrŞrßØŞ:)ı³ÔÜùexÁ•y»/Õ»ÎñïöPÖÒ!aJ*’±‹ŒÑì$áPöÃ-lUÿ—Êt–^s§ÎPıü3åPK    ‡Nâ@Fr1ş        docProps/custom.xmlĞËjÃ0Ğ}¡ÿ ´—%«uÙ¡¶“M-$ÍŞHrb°H²[SúïUHû.‡;îÛ¼«ÌÒùÁè¦	@jnÄ O%|=ìĞ:-ºÑhYÂEz¸©noØ‹3Vº0H"¡}	Ï!ØcÏÏRu>‰±IoœêBİ	›¾¸lŸ”ÔSB0Ÿ|0
Ù_^½bÿ%…á—vşxXl¬[±o|½
ƒ(áG›5m›‘ÑmŞ ”¤5Êïò"kBhM›]ş¸ı„À^–)ºSñô§ısdÅÄC=£8Jé9£}óÁU”d4RIüa²º'„á¿ŒáŸ
Ã—n×ÏU_PK
     ‡Nâ@               word/PK    ‡Nâ@˜NĞğ{  w_     word/styles.xmlİ\OÜJ¿#ñ¬9Áa³;û7Yeò”l²$b³,™ïÜc÷ì8±İƒíÙÙÍxzâ„‚wàqâ€Ä¡Ç§åå[P]İöxlw{ºœ<!rÙŒÇU¿®®ª_U{Úığ“›8ò®yš…"†÷vO|„ÉÕhğúòtëşÀËr–,	ny6øäÑw¿ópyœå·Ï<PdÇ±?Ìò|~¼½ù3³ì˜ó¾œŠ4f9|L¯¶c–¾]Ì·|ÏYNÂ(Ìo·wwvZir¬UlÅ¡ŸŠLLs)r,¦ÓĞçúO!‘n‚«$Ÿ
ó$GÄí”G0‘d³pÚbª60qV(¹¶qGÅ}ËMÀ–"æ©ğy–OâH>faRªî7•w&n[™¿-UøpÿWÇpÇ6b=íRº€Ì¢b‹·•ÏÂIÊRåf 9îØ?~q•ˆ”M"©åpğâ)şS>e‹(ÏäÇô"Õõ'üs*’<ó–Ç,óÃp4¸cÁs¾ô^‰˜êåñìq’µÃY–?ÎB6üû«_şëë_Ë»ı¬©dûÑÃmÄ/ş–ã€ËµQBADU*€:±HòÑ`÷òîåÓŸbøÅ…×É,ø§3¼Îx )§oó8|—i¨¯½~q‘†"…$<ĞÏ„ÿ–ã€¥V9+Q<»ñù\†3Àş´ÀD=‹ d®4ã…¬ƒşs9úh 3Ò‡o@™q&	ÇnT9êT-TìöW±×_Å~ıUöWqÔ_Åış*´ª¨Æ°Ê
ağC,ÙeÚƒÇ.Ó-v™öğ°Ë´Çƒ]¦= ì2í·Ë´»Ø.ÓíÓ½JzçÂßÀ£u‰nÖ%º½Y—èöe]¢Û“u‰n?Ö%º½X—èöa]¢ÛƒÕ¬T•Ä{É™äNù<"ODÎ½œß¸I²ä°É3ËÖŠeµºt•,¶ÚAÔ(Í4h´g’.}cÙ;ı„bLŸaëĞªÁ„ËæÍSo^-RX´õ&a\ó:FÈ…SÃbÁ	¸Œ¥”Oy
+î$^	(š‚(L¸—,â‰£§çìŠ$Ç“ S‡6ÚBÚ9ñÊà`‹|&ØĞ1@b?'×ä‚y¶L0…âY˜¹‘Šğ,¢ˆäÎİ]xİ•¬Êµ(Ò]Ê"ûN3(İÅ¬¢æÎ#˜¤%	–iI‚Z’`§ò5ÅN-I°SKìÔ’ívÖJZ×Šrh[R^†yäÆº'‘Ï>œ‚s^%ÊC;RÍJÑÇ%³ªŠzÕï]°”]¥l>óäÃ§Q<Á­wéÚ¶”R”n	³ò&‹vãmLè’”°-e	[ÊB·”m^“½/¡ñeõ9<}0”ãZœtÆ=Fá!Çx1ÉCÌ¢…ê`âî)<rX…Üi˜B}#´éí*ãè\öùÒ!®ù¾Bw«++9· ]É©©r´³!îˆÁC@3±ÔÂ¶Boª"ôùíœ§Ğ¡¾u
SEbÉ»tmH]™´»+W'†qóTÊ+Œ­P=‹ç3–…™Ól¿1x/ÙÜIğ"‚Gãf—šHìÙ<R<{¹3	ë5ù÷>å“ï;öùåË3ï1´èÉmL$,úñ$t¤5%%72D)¨şaá¶ÀDÙòÛ‰`ğs‰Ëš%/`¡†?äœ =fñÜ±·BÔKHü%¬ÒUĞ>(û–†òQ@«­µtl‘j´t^Õ˜PYg‹Éî»ug©#'mƒ§‹Õ…Ìš¨[ÅYu£}%z1ø-p“ç¡Í²”!²}ÆìÖİi{E$Òé""¹è¤&Y\“LÑ"N2ê¨Q–8h”í3f¢›×­	W.şA¤‰BAÊ,¡ eŠP2?(HœîŸ šÉˆİ¿»h
ââ³ıW\‡« @AŠQâG¤ø)~DAŠQâG¤øqï©Ç§S¨§4úªˆS|Z§xV>àñ¶—¤·­]‰=ŸEüŠ9>çQA|‘Š©Ü¦#Ã–	;°|@@mD”(e²¡÷'1¯”£âµ{u³fñ	ƒå&ls1?UëZ[Ø~×[Õ#Bè\ÂÆ·öF¸sÚ0dXğ…W³ÜÏ,EºŒ>´=šRú%[´İ©Ü¶ZWÊe-"*ß³<
xÉƒpSc
äÎñïoaˆùNü¹Õà_mÒµ¡zvê‡-”Æ&UıÔñuëÇ~ƒ:~ØgÚ5~ÔO¿-éõü şvnêÌß#Û“¤§°íÕ£§×‘-wËN/z8²ep	ÑÃ[—ú{„mú×è[ù°…L6_¬x´/ŠÍ+Bí‹bsJYûb¹Pl_¬¹ÖTkHº(xÏf"r{ùK"±nÌñv»:Éìpc²ï´1ë÷Ú˜ş{mVú‚ØH¨dS]úbÙ¨¨ÄÂğîÇ¬G66*°F÷Ú¼Õ.¦ÚsØÜÔ¬T›ƒšµ‚Šbó©VP±lDZÃÚíë#çZA5Ê™¼©@ÎäMr&o*3yÜÈ›
bc…’çjäMÅ²qC‰U%o*J *yÜÉ›¸ ÛğIA?T›ƒšäME±y§F¨Ã¾QÈ›j—3ySœÉ›
äLŞT gò¦9“7È¼© ò¦bÙ¸¡äÔ*ySlôPUÉ›äNŞ†èº–âäME±9¨IŞT›wLäMÅ¢7Ë™¼©@ÎäMr&o*3ySœÉ›äFŞT
yS±lÜPrj•¼©@6z(ªäMr'oÃ&‰LŞT›ƒšäME±yÇDŞT,
yS±œÉ›
äLŞT gò¦9“7È™¼‰@näM¡7ËÆ%§VÉ›
d£‡¨JŞD wò6lTûÀäME±9¨IŞT›wLäMÅ¢7Ë™¼©@ÎäMr&o*3ySœÉ›äFŞT
yS±lÜPrj•¼©@6z(ªä@p†XõĞ0y²¤ÛŸrxg4˜ïËQp„˜<MŸ	†7¾ÀSÃ¤œ|}î¹fp[õ¤.½qß>Zí9-îÜQ»æ©ÔÁ‚7‹,%wÂ›Œµ{²„Í/š a´p6g¾<±ä§ğÚœx¶ƒ;päùğa¿üğj!xƒc ğ4°]ÃÂén=­ŸçÆfp›4¼8Æ­¼P9½íŸ_}óõ_Şÿşçïÿñ+y«Ÿårãåh‡‰HŸ„A¨,ÌŞæÀë„8Ù»yxNXq-bh^ãÉÖë±T¹{7Û:9——& ,I·Æ¥²Ê	qè•?–ÛÅÛªÓ§V;’&Î…û‘<Ç‡¤÷Ó%ğyí’|S³¼¤´{^ŸØ£]ğ–óù9¨Å™‘ÎÀy™š§Ò½ù>Lír©ööŞ^éàÑààIQº~İÛËc±Èåå³ë¨(ÆO#&ˆ:9QèoyZš¿¯W«+_®®¬|©®u»ÄŸAnùò=7!µ²°ÚÑ‰&¬o­ÁKv— {aà†Êñ8ó`ï7Û|™®ïá54$ŸD*iá?gì|ãR”5oŠ÷áËE/æw.æpt‰ñ¢nn˜Rñ©Tßw0„jßOD‹Ø,Ÿâ¶h£˜Õê`ÔGiyº×¨·LÙ½Æ$77¡·gíZŠê‡æÊ:‹LÜa«üêBª\¨®Á¼ -»Î:¾³JiÕ³¬6˜ÍqÎÉSD¦
H<9şBĞ {Ê­*ÛçNúÜh/TîÁ0’„€·ÜßƒÓh!Şe¸ >øÏzÍú˜SyĞ5YŠ÷r7˜J]ŸûNåüI€ù[¦ Î¦<…Şô…©òå›‘º®ÃÇìİh z}(P-
V+Ô|Ï,ßø5G+Ç}­•’şªƒPs™n5ÉîÑmNaúü;=•^Á6;O8wı0‡Eq·ö¡š(Rº?hØŒÍtmskÍpâöb;h±Òhÿ…ØNå$²5ôİÅ2R^9rY-{ÏŠãÍôµæCÚ^åÉ½îZ«[e´÷_şí?_|îID5Æš}Å¢Ò“éG5v“
sì‡qš>m<)Ã†ßaR¾ùÙïœ&E{øÿfRšíüİ>{ÿÇßzC§iqiß)¡2Á€ù–l[†5{ª»Ïÿ~÷×?İ}ù‹»ß|v÷ÅŸ¦¯½µú_²‚˜²GÿPK    ‡Nâ@#
 Ç?9  Q#    word/settings.xml[“ŞÆ‘¦ï7bÿƒ‚÷²p¨* Ë@0Ûë°ìë&Ù;ÜÆ×MÑò¯ß$[ôXOÎN¬oLu~ê•õfæ›¿ş—¿İİ~õãõåñæáşÛı¯º_]ß¿~xssÿÃ·/şòçãëùÅWOW÷o®nî¯¿}ñÓõã‹ùÍÿü¿şğòñúé‰Ÿ=~Å#î_Ş½şöÅÛ§§w/¿ùæñõÛë»«Ç_=¼»¾GøıÃåîê‰ÿ¼üğÍİÕå¯ïß}ıúáîİÕÓÍ«›Û›§Ÿ¾º®¼øü˜‡o_¼¿Ü¿üüˆ¯ïn^_¾:›¼|øşû›××Ÿÿï¹Åå¿óŞO-ÛÃë÷w×÷OßøÍåú–><Ü?¾½y÷øü´»ÿß§ñ‰oŸòãõ?Şİ>ÿîCßıW¿üü¹.o~nñßéŞÙàİåáõõã#twûésï®nî~LŸ~ñ Ÿ‡úWõ7ŸŞıÍù(š÷İÇ}éùãí/ÚËlšÅßİ¼º\]>M3àìÅİë—ÿöÃıÃåêÕ-‹êCŸ^ü†õ÷‡‡»¯>¼|w}yÍ$±»îÅ7§àÍÃÚÍã»Û«ŸşxõÃõöğy¹¹~äç?^Ñ—şÓ_Ñ]s;ÿİûËåüİo¯¯øÛó??Ñ~x<<<ıâ‡o>/™?^¾>—Oº¾gM¿¾>—Ò·/ûxııÕûÛ§?_½úîéáİóë¦áY|¹úÀdüëåæÍo.7¸ººıîİÕkşøüã¾şñ§OıòÃö¥õÎnıéçŸÇçÓïÿÏõåéæõÕíÿã×÷|ÿúéıÇÅÿï×—ûìÂ§¾~{u¹zÍh|îa¥»—‡Ûç×~œÊ¾°Ä>·ø¸£¬ıoïPß½½ùşéO×Oìè/óø—«w¾şÛÓÜ<½ıØ‘/¢¿<^ïWOëãÍÕıv¹¾úëŸŞß^?~”¿¼>öß]ıôğşé?ışßîß0ëãŞß½º¾ğ%Ÿ'à¹Ñzûôï7÷}ÿ»›ûëzè'5ôİ'EÆÇİ_İ±?ıõ³rúıÃ›ëˆŞ_n~±âÃs6ø´,‡st¾ùğòÓ3ÏáAÕ¾y|şÇŸXrÏ¿íº6ö-^çÏ¾Hº®ßÒñi¤!©ùã[>=úÛ¹«Şfìêì’t ‹?Ş?¿§Ì{Ğ·iŠŞ3»÷­ïÆùóı§÷ôCWGíA?Ìëæ’±+Á{Æ±OÇ#O›§É%iI¤ÕG§ŸÃÛğ¡‹·º½kÚ$Ígnè»ä³=ôcïc0ô©ù,ıZ}ü/ŒËê#:Œ{°B†tôAJ™‚Ñ™ºì#:öÃâ}Çuó1s×:Öcûì’2>c™RÔfÙ}~Æ)#šº1h“ºyÜµo‰mâ#š†aôùIÃìŸ4,Í¿'õ$c¿øˆ¦t¤Å{]Êáó“JÛ}¶ÓDïüiSÚ¢6óó‰üOz'wİàãÆÙ}¬s7®wr7õ¾s_FßÛ¹?îÛØo>¢9wÁlç¼$Ÿí<åÉÇ:Omú6µÉWoéØu:¥«Á, iA›~
toéÛê³P†iñ™+l­ ÍéÑ’–.h“ö`NKn›ëƒ‚hõÑ™ú@»”©åMÛLı6øÌMCh±iª¯ƒi\›ï’)ç´É-8ç¦RŠ¯iÚ·¬ß3÷yóu0÷{õ§ÍÃ:x¯ç±ÖÎœóîã6çµO+ıìçÏ\†İõvC¼gŠôÎÒEVÍÒµÙŸ¶0Ù>?Ë0¾z—!-ÁÓòœ´K«ï¬¥ ÇtN—²Ï¾§j›µË‹ï’µŸïÁÊ!ã«júÀŠ^FÁ{0´ÀrXÇ¾Ş3¶İ÷éšêæ³°¦–ƒ1H-°ÅÖÒ÷>¢k9¦`tÊìÓuZJ0ÖÓV¼×[ÇÒqÛ†.k4Uõ/İ†’ı4Û†£øÛÆ¼û—n#*Öû6F×–Ú¼ÅGgËó|ÏÔzt›Z`WULo×|uÛ¿İâz§)ØYHÿš×@¿ÕÜ=ZË´ùş©¥6Zö=h3uÍg¡bøJ¬ÓXiuªVnİÒ|ÜZW{´Çâ=hcè6¦İwIspËicƒ¾köqkií\´T²•XÜÌVŸ…5êß³÷5°jöq¬€=ÍwıÇìc°çh±=ï«ŸÛ{™ƒ[ÁÑõÁ½ñ¦ÀŠ>†5øÒcÜ–;ÎâçÂ‘× ?8¦ÕûÚ/ª)”]GÉ´è
A2¤ïı4ë»~Hª{qzG‹À"ºEõ’4¨FB²íAßr¿mr›UûÓ±aÑÒ÷}qØó¡~CF²¯>}éüØ÷Óæ·w ®~ò/
FÔ%˜ÓaXì1ıŞÈ‡nSôCNçSâwô~(ƒÛı¹±|Ó¶©Ù,lë±[«j
ÚìSğ´~ÖÎ8,‡÷mÖ-xÏ2fÖF"´F’İÑÖ~L›ßŒö[?–TõdBRıÎÔÓÎ4A¯§:ºŞI £Aê¦¢š¯Oı>O+³£}Vö/M+N{ "èQ$Á^@â:¾Ï}çhÑ)	t"’â{;³ï}æ¾m>”ÍÇ:=c0îS I½ßçú¨Ö’Å1‡>çì¬<Í~›â µ6úÂÙtNQ.ÅÇ Œ˜ªŞfœ›u¹z›ÄùìŒ'?e¸{´ ×%'F)ÕQ¶~âô÷Lİ6©-Öƒï¸‡ÉT½oÓ°ºİK›}ìu¦áôhQ ı'tˆ÷`îúâß3§ì÷¬~N%9­ïôs.ÁªšùT×ş3x¼ëy*ÉWâÒu£¯ëeƒ1XRhK[÷¾ôK*æ!iÁ—.¥t¾â—²>? 8Á:X»Ş}=·÷ôkßûgíÇÀvYûê7~v8rÚ¯§£IWïšR`İ®iÆmM»cŞıšw¿õkfó°Ş|o¯ÓX`5î;ìAd«é7À×‰ 2ƒ¯ø›ÜÏ¬-í‡ÏVpJè—ne•ÔnN³ÚÏÅßS‡¼º¦¨côÔÃQœ¾Çì£SS
,»šâgc-]pc©x­\ÖivÿB_§İ½å}ë“ßO{ü5îáèşmŸSpŠÉÏ¹6.}İ:§--îåé[ğ6Sà‰dí³Ïv›æ@óµiua¿Æqr$‡cOıÊæ£³Ñ‰¾dàzI`ì©Ï>?{‚}Š]œ€Ü~v·w´ò ³pô{Hğúzß1ºêÈ‹{ú£¬nİ÷·ù=ÉáèWçÀî0ğ“ÎÂĞ²é>%~¢]Âˆµqñ…tIÕñşû¬ûgè@İÕ¦  #@h‘ìj¼€t\ûà·)ÂCtğ6\Ûtàa™Ü‹€¤ù­zèq†ï)›ëÚT÷ú"in'¸ıÆ‚¤ÍºKN‰[(ƒí7J$#L´Ù$ª&Ğ£Dm Êı=#æ­K
šÔ%Óî7şa˜vÇì©„¯¢8ş†dvÄÉèƒq<X.C0Ö Îî‰dØÏ‡Ïá7Ã˜.uÜPş~«¦Mó»æ€ÚqôI­j‡ µrmÓ`Â}KyÉ¾®S>fÕñèŠcÑHVr%Ií|%Ñ3®{‰q?Ñ‰«ß‘4Çˆ0Gu‘7	$‹ßÀ†<Ñ3HŸøÇ¹øXŸ_;9ONÌ™{¨u&%xOY³ïí<õîMcäô=ÜƒUUºH‹Õ¸•6°=êÉœü,)}NÚ27ş¡¤Ù1U$ÕQ¼ÎİæÚ²ä¬Ñ’«
~Mß7d_@Dt·¦49:IÌNWÓ	¥¼ªdîˆÂˆ$iA8a^]#í¶Ëşô Íîû–®>Àÿçø7¢6:Gæ†e\‚X(Ë´VÚÚU·a‰9"EÇmM¬¸@²¸…?¬ØÊ¾Ö|¸—tX1aƒ6%9º?¬SÌé:U¿7[Ä“[İSŒäğøŞa›Rïk<3xZímÑ%ğ1¨„hº-V¹KønDØUuØ™êXƒ½PSø=iqì‰À¼æHÖP	ìt}æàÆP§ hhİÚ|tZß‚÷´(n¸™»¸ÎOÃ§çcİ¦è={·gıy{w²÷‹ã£ ×«#€Hêè×>î«÷zŸ`Ï($·‘Âa7cŒìküÁã ªÒûÆ­Ú@b¨@½ÜB£§qOÃ15wÁM;¹M„X%ëÁˆãÛqŠ±ÃàRäg<Íàiè—D¸ObìˆÕu€¤¬ª«L®)¸şŒ9 	¼VH¦%øR3Aß¦ê;"0fE²ûÚAö£óJà7RHÆC×5’Íï2c¶®šœÄ
Ô‹÷€ˆ@R{$ª)4G Ç~ıÖ†$ÍÁÓ¦âñU´©~ns¥üfD);ãä’Íñª‘ˆÎ×—·{Ç!o~š!i¶òñ‰¤¸?x?ğ[èˆªp}„ü]!„y»÷…6s°BÆ3êÇŸÖ'·]FüÁJ$OÏo¡#8Eô¥cõ; èÑ†Ş·Äu#÷ú M!ÄŸVˆwtÉ4»}§ I´X"‘Ñß“PIzşŒ i9?&¯ëªDëÑ”ŠÛ‰ø…[lLh$QÒ©~ÆÃÒû=˜t³Îoüg"Úì+>Sû—‚”x
§‹Gb"iA l{Œ¤:Òv\’G–•®7G<âs<OÔîÁ)Üÿı&>Àp?¸³9ÊÆ@E¥>£ßCX´ûÀFlÇ¢O‰Çî#ÙÜKŠ$ÈZBrxâ8õdÌh¯ÉMw$‹p±Ş³FëVŸŸ)W¿o“ƒuxÖ§\r_è)ñû)’Õïè$OÁnœ‡´ºí2£Ç|×Ï	×ªÛLDTÔ¦VÀÌÙW"hH`[ÎÓ±ú{–nöéÂÄy¯Á±‚•¸œÖ‹~é’–à¬_@Ù¼oäòø]ğ $×D8‚A›èK×ÓTÕ^“cã7°3¢Şc¿£âOËG ù@¯]µ2Lüi˜.®ãÉ}ñ%_ò8$‡ßç(Éİ„d÷»ó¸íõVÇùÆJ`Ï÷x’RFÜ‘¾‡Ü÷½swïƒÌ­ŞÚìSŒ5õ½Û!5ØÓ*–|Å×<Ú‰ã|cÀöõ†o98e8±‚•Ø¸p»VÆâóøƒ±õspÎµşp|;µÛ\Smâ˜‘8]u¶[:<’lly	öi‹ğ.s\ı=	Ï*ÙñZ.¸$»d¬Á¹°ñé{{ŸÖàVp³Ç(5gÉqöíÀôö/Çro$ÄàùÓòœ?GYMq`¼¸µq€mï™6çÀ"];©#ÁDÇš8¥Á£7‘Œn#¥®Qkc€dó˜$GAğÜùıiD–êüĞ&{f’æÊ\¦Òªúí–ÜVFRü¤ÅíhòDbA§úÉä§L"»Ñ}”H‘ÔÑÁÍäâdÏğOäØø	˜py¶dÈWñU…Ä‘FÚ§½†Õ1¡D2‘ã×	eÔ½€¤:fG|>¹ĞÚÌ7Ï;LcØUék‚§±"IpÇH@%~Ó#*°n‘`)ú÷ w|½‘[èş¬4–àf”¸ y-ñ©S]…$;ş†$ˆß!‚69™Ò8»}šÏw0N_?ÑSæÒVuÜˆ§p%å´9vH‚àO›j°ò´»å
ZÙg®€	¹æ+ÄWù '‚ï)$ìÚë’?|¿$nï¾Áó±Æóá6À¦•ömb3x¯IÏ
ôd¿ä7îÇ@B–€÷ £Zi‚éA-È¥…{±O‰g Éİ"Ù¢/ğ z¯‰>sÉŒuëëm&ŠÊ÷öÜÏ~Ç@SuÁÚ™ÇŞqK¬ªŞ­4$Ñ,Ì©EOËƒgn“‚±&óÄc4á±Y‚ıC¤…[i÷ËÇm!ÅÓWÈ2&Ç ™ƒ}W÷ZÑ&ğI€E¬ïœÇ„T÷\Õ÷¾v…|ÿ,Óä¬[‰˜’@+/Su=mÀR]	¦ó€‡¸ õ	÷t%òX‚…$˜SPÏCÆ!ÕŒ$Ø§kY’ÏÂŠÍçºŠ¬˜ÉÛÓ\_£áGÑœPâw3¼š-°)È±q/OÚ@|gmÄøLd¸ßªL-lC|6{œ7’Å=°FÎ­3W	™ó%âÆ½¾	NÀ®ª)ÈF>¨F‚¿úºá/ñ±nİè^åú­õLªNëWGA {²FRk°a”ûŠ'cÇçD^N°ŞÈË	lòv¶òï,&øÒ”åm2IPäpÜ2µ²;¿ÎË+g)ŞƒG Û‰]Ô¾íx±}¶÷©÷L[²Sô	8\ß£ßá½>:.{A›µ!İ×õís
êØ‰xe<. \şBïş×UD7¹Ïˆ¬ê)¸}¹z4P:È‰ì½œÁ:ÖgºßÚl³HŠ¯x$‹Ç0á¦İ=çpÓ¼§ÄO@$iÑÍ\¦|"™<ÂÎOg®£ÇE3ÕÉµ’ -B²ºúÔ˜ÍúÕã2áä®«rÏ®kèçªs@dÒè=®	IbŞ7ˆ+‚÷L§øLğ¬Y<“gÉ!áÆ = oØï%´YAÚXRÑüiÓT+gBğ"	™Õ¾³H´õ#väh’ÀVÎ0¥ø™…$`lCğïœ×–™CÓQPø¦‚(Ş3˜ÁÏ,ò‚vÇ 3Ğ©{Ep8®óœç·"~‚|3$ƒãHàzğ÷€,’4¹}q¶ÑŸFjÃHàéU	ÊÊñ®“»$’Ù¹&°B‚œH$[°ë3kÇ5ä'úImâ¾) ³ÙÙo,~gB²k4—â÷’œ¡{òµC^c§%æ$GĞ7œ¾C›!Ğr›‚Ô$1mÜš~ƒU
İÛ@!ì_zfÒD’ Ë”  l}4G¾5q•Ş&íÁş1s–«T¾”¨÷g¬*÷æpµa‘l>˜»æş,ìáÀW„ÑÖ1€‹×óƒ‰‹ëİ‹€¤ÂŸÙ’5Œænóeø]ÜîÍ3ö“¯9C¿æ=`½é}\<âQµ¸˜û³@Ï“dŞ³¤1°Òˆqs|'ŸØ“keâj<B’„”:úÚ!ÊÁı§yÇaóÊÉäsº‚Rûˆ’X·àX~C&"¹
	Ø©ÎyS˜üÎm‚¤vï:Í]Kp,»­ë<‹$oùkÚë3×Ê÷ÂÖ‘•âmú ıÊ 5ıŒ$²aÏîLˆ•Ÿšäy!ÔAÕˆ¼QÌ!ù÷” ‹ä6à$C‚)¤O«0_dwN˜\ûÃô÷L`ÕÀ#ãü.¹7èz´²â}õÂ0Ø!àôÑ÷Pƒ"xO	r"së ™ÑÑs¿Lnıä±_H6g ËmÈ™Š$È)Îô×.Ã×5_cº~£³¦æFìŠï¹–Ïµ‚Ól'òÊŸ¶wß:ÜQ”YĞYÀ¯ê9]yğ mV÷…By»ÚÛŒKï»qáÚ¬ÁJÜS‰z€ßÙ×Ûê'ÆÓê{›˜qg‚Ê;ş…à=DÓE’ÃãjÎ“$XoG·x$m–à6u`¥ù,]à«ÎÜ—¾~u(b¬ÏÆ;%ÁìHA|¤ ;
Iöèt$ÕYø4Ï¾É8¯D°ÁÀ¶D`5Dêz„$1¼«çM’.Ü+‚$8O±ƒèM$÷¶JÇ¬êŠ/ sî…+íºvš(nÕ ÙÜîERİB) ÉLœÒì3‡äğÛ!äÕm¾svÜâBäŸÒ"`±$¹#Ğ.å,Q¥';»}döŒ$Áİ™ •ÙcN¡,=²çdJvô$»pğ)q{Iõ›8>lLy]‰$Ôº[Î´Y=ÍæF²sz†S¨î…§ø­úätü |L"ôï?ƒÏ*]~ã‡8¶÷üSàxü=ğ®£ËZëøoIó§MA…(²Œ?z9«qùˆdùİz3äµHü&N›âx*~OkF@C0µ·ÁH€ ƒ÷L½G¨ J –x¢¼jÈb‚<0$£ŸÎHÏ€ø,¨F]RFµo`ÃNfyï96gÎyó/%¢Ñ#ğ`‡Ö€4º/‡6ä)x›Õã’!{”hç¶%’Á+Q!©Eozg†Àô ì†-8}oSĞÏ}¡Ô'˜Š¹ënîå®{8òSÀ =ë	^Q¼€Á
Òù‘Ê9¯·¹‚S†8;¿›A›Ô‚İHœGéPŸcu´I­>s3n\ÃÂ*å1s¬È3ÊÌ-Ğg{.k`ï ñ\øëgıâpH"	rËË‚>Ğ;-’İo,ÄPQPOWÈ’ŞÉ²†âc@Ş°Gõsh;¢ïÚ}`…X¶à{NtRo9ÌAïhkYÙ®«Vxªª÷¨?e@{×!+ÿRX©Ç¼6Èœgw`ñqªä@Ÿ«ßƒn	v0|"É<ó”û”ˆF÷ÓÒ¦y|o¡â•Ç,PÈ'`}D²'S¥¸Š¯Q$%TI»pm	šhe¢Ï+­âEpm	V ‘àqv®–CS°O[×ü¶[Ú@ÙI] fî‘fá²æmHòıC…(”e ;Ps`ïÀİä1œÀ›ÇzÀ8T6É-ˆç+dU»¿Éê^$G C¨Eìqå †ò #z\ë–;ÎÄNÕTÏ+@²;êÎÍ¶ï©Ÿ%`_Á½‘È+¿7B^ˆ·ÚŞ´¬ƒ³ …GŸ‘UÔ @ğSLdÖùşA‚µì}£d÷šCÆ±Al-}Q~3‚ï:,o“	ªw	Æ¥Î1ˆ“GéPè5¸/ 	"1¡C†^E{ ±®Ÿ´´	8:=‘!íè$&,°»÷ yFøb¤Iõ³Ip;)-iD2{’ IöÕ>aÂ}Ûœ£p”rÏ’ Éáhë™LäV ’æ.$»ÛşÜ~ ÎÓ™;ùwÔ&Ÿ°ÕİŒäú3OUê×{W¿íÑ¸¸û¤Su¼†ÜÑã„ÈÚƒqãöî¶ÿDÎÇï ©A¯Ï &×Ğ9xË)SĞõ¡0n‡y­(P°ûe&LË`Ïø:zL›âQGHZ°ªi´r! I-â3EÍ&˜àwçÛ š@\Ç ìùY¤µQøÒÛDÈ6×mø£¼•@\Â}Û=6TÓkÁºˆNõ=3Ğ¶Ÿ?3 ±ï,âï‚5J\cø*v÷Ü!9‚õF-mG0¦™ip½3“ª·6’(ñ²è,Ô›ò]²€ó¹å@¾¨cªèWŠvû{ÆH[äèd”qö§å=Ğ|ä¨¹êÎØªş´ó$°–ªd…qÊW<ü;~ãŸVR»}Öqvd+õì69uQa÷¾åÍ#¦'ª0ùíÉä™H¨æïà,2`ƒ/6’‰"·<%ÁloTøŞğˆ\rš9èô{È’ó1ÚÈÂDÆ›ßB‘ìîc™6R·>zŸÓÔwÖÛÄ€DßC=ŸSx©ıÎD¤¡0:nØœ~7›à-rœ‚œæÑãPàß®Á¹@•í ×p({›ì5¯;6µüıvrîjà’Í#a¦6îÎø~"B~!iî«féÙ!YË&iGd¦·³ÏéÎ•Åw0¬ÔößÑñ¾F©å(5W¦b${`E“áéU‹ÈíX=ë"J£êÌí¥­®CÈksi‚·È#n&¬øÀ·(Ğ£ Ô³Ü!NÕ^es´®ó ¦:rÕıiÓ6úiv¥­i&«ÌÙÛ‘smï¡¸åàÈ).3½•Æµ×´Ù»EBÜ^ğ´ ³#œ<È¾™‰C	¾´§ZšZªĞ,pİÕô|®DÚ7ëmğHën$l}Æ"÷Š¸ÄêNN•÷`
âf2ò=j‚ xJÏèÓ`r-6‘UÕlÀª$ûşA2»®BBş´÷L&’Õ]¸.ulT„:cvoWŒŞc=¬Áª:«lû#wÌm1\‡äê@Óë–7m¶`SÓÉïY3±Ñ0®]`'r›|&ÆÀqe$›£y3g¿ƒfCƒ4¬Îä	*ØA›Ã=]´9Éš!‰ò³IÀŞ1ƒ+ø™"Á€{ßÈ@¾”øQ×–gHcó§á%u-vr?mğ’º¶$©ØcÃ	ó£TŠö ÷»ûªgR=†,fp/Gsskƒk=…û´„.z—™ E¿7’@WQ¾$jCäHï= `›ï`kœcm.‡…?-òşÏÔÁµËÔ‘n¬Oªw\yú DÒœíâL@rì		õ¼ãê7@(ï1æ=x‘?H|?Í(~ØŒ€cóYÜw#•¨ü&>Ïnù: sl65Ğ.H‚^cˆxÎĞ<÷É=6H¨Ã¤ãvV¼Ú]Bb¨ë*É9¢9mâ1f3ÜÓEÏŒz¾z©Cèë…
A‚˜|x‹GMÌëÈ…WÇ`Wç¸™aòlˆy%ñÄW"cãşÚTğBr82ojx¯ÉÜ
,’ÀZ‡i(zQış=Äı¶%¬ĞÁ÷ qLhŞp‚¹&ßZ^ç>!çwÁ±Ü()µ±81×¾w|t®„2»>¨ÂøJ„á¹÷ùAâÑts…¥#xZimYñóø¸Ñì¬Öq¡Òm}d7*m¨±Óüi¤cøÌ»8®<ƒ®xüÛ)q¯üÌ[²ë*Xhİ¿=“Ïä¹§Äñ${ğ½_œwè|Ü@d? Œƒ:¢;şzŸíÒ¨n["qdnŞ!ÿôu+N`Wí$å»V¬kòŒ‚/%v%¸oãp¤q&›Èã¯çàÔ×ÛAj’YFÁ½ä(Éó³fâPÜºÅa™›Í’ —WNÀ‘‹¤ùıg™Ç=ÒHğ	h¸³yŞ‚Iá>ÒLıi„ë¥˜é¤ŞæÌ'
$½#sI#!!ë.xÚá–iuÇÙ÷‰#ÁÏ£ï¡¬»cv¤Ncmª[®ĞªÚAO$7€,?hhİ‚D “H‚Ê@“+ÀÂè™AH¯/’Ã#çqQÏ+ ÜGsß.ª…ì1kÂ„\[Ò†[FĞfN>s`5n_C%ÊÕÑŸ–ƒ³DÆcN‰ç^’
±ùÙ¸¤~öŒ¾6·G‘ná”¸#z&XUgôŒ¯ÑÀã#šÈñ÷Y€nİã) §ÍÎå†$ˆh‡fğû)’ 
í‰W ‘àIñ;à‚ìÓLê¥ë$îÂÁŞy†2’€kIP…‰`8ìuRĞ³P7è5—êAïY¸øÏ¹[p—¸?	õa½o@f¾Ï¤!µ]
Z8÷Ì{¼[ª¤$¦=Àªò›+%©ƒZÍË€Qıi'k\ W^NÎ×o§»ŞGgÂ§æøwœ‘uÒ1U(@'Âí÷’è™u@’óü Ù<ãmYºìâSâ6xt¬‰‘	Î…eØ=Jº)RSıi(Ÿm°"Ï‘æÏ[°â²ò}%²=r„²&øŠ½o\$BIÍA› †v¡â•{†`ıëÓÖ	^Ö!² á~ö;Ó²’ê;ø{à)‰$[`q­9ÀPXve[Ö³h÷ bE?çˆ>ğÜòeƒzÓ÷6Ù7Á^ ªÅñe£öŒ¯Äâ>?TA÷MÒ©6«_ºQÊÀ×Î6QzYÛÔ2\—PºÖßS©öäÚ²â…‹$ø{JÀW³PoÊs“ÉEBYj},Ê~§]`Dö˜$PJøÓÀ|½‘§î»¥Q–'éÓĞˆîcYvÂ6|íìØ–‘TÈßC]ß;H×Êg&M ¡„eĞhW|%î„?û:8yW|%ÂïÜvâ‘ÜŞ9pñûÎ:"Äl¡~–Gs/p;º²°§»¦8ğùş90í|~È—ñÑ¡,Ğæ{›”È »]áQó³dí0×õÔ„şmvÍ·î9];H(²cë2ˆ¸­I`SĞ>oÓS&Ø%ğ³ê>]WÜ·‹¶~yïAˆ{JŞ†Ò¨ºWâCü^² šŞ†«³¯xõ°oµÔùöó”ğ® 9%m i—FÒlïX
Ayß¨á3ÇçóCİ¿UCäb ¬Ã+üf~j"	P{MÇ[Ò¦yö'’#˜m’Îƒ/…æÇõ5®XR¼oÑ·Yóƒ$Ğ½§$©î…Œ
 íğG›Ğ¦º& N®WğÏÅ´"‘€Íyß…²Éì¹Dßõ”¼rÚÉ ê×)ñÛÜ”Ş7ÂC|p@cÍ=Ü½k&VÊ5$àîE€–t49Hnœ›ÁŞÆûsøÚõğØˆ7†ßªWxI=• ı€Í÷:äé:Ö1×ä…$_;…üiÚµ¼ÏşN§XaÙö\$Í½Ë+œîÇÀ½°Ÿ·ÅÖ¹ïİ‰¤Ö¡‹Á¸²æ5ø(ÎDr’ÎqÁ¹=cWùY¬Q2/İ~[‘D= yÌg¨	ç•Zg²+Ôö_A=‚3g×…[×İ/ƒ„sFÇŠWÎ(N›Õıf+9Œ^İrõt/’Àâ¢V	Æ€ŒkßYœSÕ¿'<ç–RİÛ·bÀ%_U+[+7qßÛk^‹¦GóV6ªgı’@ï¬88\û¯”yğ^âşÆ•ø@#‘/ãş…•ˆÀÙH‘ö™Ûˆ0vKucíøˆ²=.m¥ªT É7ª0ùÓ¨ hØJU_Uä~çiÅ·ë»kÇ{×Šô-q+ŒÌÁ¸‘±ã‘¥+1ÖÁÎBh¾zærêÎ
YzW0‚`¶0Z±Ô~gjD¬ù
?Ä±Î•ªRÎéwJ¼ö ’ÀÓEÂ¹ Şk‚QıÜn	“Ş†à_UaU)o™½Â`â^X#½ÿsè¯ûÈøh¯ñ¼»Ïu½ö\$AnÒzôÑ‰Aµ'ÇÅV"Ì‚sû€vÅç/†ûW0AGr8èŠ#€+Œ®³Û®!·•±Fı¬‡¢=ˆÌŞğ«º·bƒjÜc#N‰#LHvçßÙ¥öl$Õ39‘Àck‡´P $—ÀII‚
7ÅÅ<. IE¿õ¤ùèºFd¦"	nïHÉSâ^ùbŞ#YÜ¦@BDŸuË]Ãâ^Ï‰¹áğ¨d$SÊFf¬Çz Éû#	|HªŸY8ENYŒÍó‘Ö:Å-!ñÒqC¹4µC6è¸<Ò$à€áÉâ¸%’ÀÜÈ›òˆv$«ŸYHf_À #S,`'Ú€«ü†Œd÷“ö”ø9·‹è(GÜŞÙÈq ¥p[éÌ¡âØà„qûz#¡Êc†o šÎ0õ4Uø´o°Åø	H sPg²§Å‘`hyÀóü=8†İ§ÍîbïÅQ¶-÷‹ß‘QG[x‘öÇª[Ñ´iÎàHÀ
@ÒœgëBrä"ÂÍ9Í7ª|g½Ï!Ùœï	g}ƒ“4cE¡ã½wM®2£lH¤‘"%AuKœ±ÉLPüSgåìmryí?‘=­Èö†$˜…¶T+’_ïP£¯7b3üv¸My÷›Ä6•ìS°p¿ñ“Vpx„N&ÈÂ´×sKú Å¡øIA›à>G›æˆ3”N¤KúÓ¨_âc^æK7¸k=†‰"Å¤Gù{0C\‹‘¾æXÀ6îıiÜë]óÁ]ØTw”€2‹ÿF(³£Hf¿;ãÈ‰V/A´…†£êm—’­sÔ@ŞGveçGÚ¸;*µáZõ{NŒ#Ğ¸á<Û˜ã‚SKgn%äÓgnSõµC”sxm0Û{dÂT¬Ñf« o%`Úˆùñè˜=Ø§˜ëM±˜íÚ’ãÙsÔ6Mg©B²ú]sãhrœ	i):?ÑöŠ¶Ò&Ò°Ä%D_JFˆk>Ô²ózl¨åÑmòmÚœã†6à_ú=dn9¾³ÌylëV©à½†ÇıY¬8yµU<ùÁÓ"^Ğ­•ìgI£@”)\¼-Ö`˜‰ÚìÎBÀ\ù:¢H‚ıÓ°‚^ã@õ]ß0jÜ
 –óJmí,×é}+Ùı§[›V ‚” yì$’\\+ïğÇûèì}À²³íCz·±ºF¢‚e€®ìPJøª³ó¬óøü¨MZƒ}ºYêkü-xÏ¹ŠãÔcvãv”c÷9=NÖ›m(¯ŠÇÕœdXn	A"ó§Q8C{Màbq¼·vTAÒ^SĞŒ3},E™ôSŠs{›~ë}8d&=K*ˆÏ’Ããğ¡'8¯P–Íû6-¶â	pËŠk×Ï9$˜øú$ÁW‡Uám ÈP	Ru®»Ş&ã_%ªx ™·¡Ò‘¯;ÏÓ«Ô3ò³¾Âe|Ï­¡¿g<“†´oãXİ__G"a|/¦êoÜY\ú{¸6zßRpW$Î¤yôL¥Ón"Y%à@OÅ÷i_hM©¸ÍW•D}—P<Ğ!‰š'¾Fñ„†k¢<'

ìumƒ3ÖLHGßƒï!ZÙmò
Zä(Ê,î/©$¸¸'ÉêñoHšsT
Ë;ëcå^hX8ŒıD§MÊ¾r†hÎG”ÌaŸ&È%Š|/}–˜çDÒæV<a?Ëæ©•V±EÕ{0îg"ŒlòŒŞ
í—ÛñPŒ§Äy‘ù%ĞN5¡‘àÜõïádò]?‘¾í;˜`G¯\'`×oyF¾BÀÅ<b×ûî9‘úk ªğÕø}J×êÀdãú•<0·ı+1YoYOÚ-_ñD9~Àá³8P—¤;í5’Áç‡ôéÀr`º¯­RÈ=•ÄĞà¤%É38ëAWÜ¯$8gãYµÈ×é…Vê|c S¾ïmÂí;£’¹Xv+U	¼o„š»Ç†p\õtæ¨täŞŠz†L»Åÿ#§u…5ÈWÇhÓ‚=c²ÜvYp€~ÏÖár$»cOuë ×8ƒ]ƒ°ÇdUÎYg~AT  S+ExÌÿ2;]E»y>-’êñ–§òçPÊ@{@åô@ó—3×oÆ6_Ud•ç5Õài¸ŠİzªctâivúÅD	lrÌ÷&U$‰†d¾'uû(XGak¸öüFôA`ûã¿ôœ©¦@âX ôÇ³68Œ]#5ˆÏ6õ¦‚Úƒ£¡ãı&ŞpØøè4*ö¸M±Xã½{rÔ°ÂÜ”}½!	Vü•æÚ¶æàt
ìÄ7vĞkªqùèp’¸¿î8Iİº…ƒ(X½dg¹¯šqÈZtõÂ[X5äÃ»q/$õúÓ$ó]BÕrG!Ã¸µNÉîgãÑƒâkÎ*è®•ö‚¯Dx©=·"	…ªş %à¥®Ä´:.k·…,Ù¾	®ü@²zÄòÁF‚ÿÅŸ–P¤¤:ÿ†ÀøN’øâ^$nƒxÌ½ËH‚[5iÈÉ}¡Hv_½3÷–#	¢ö¯q=Ú(;ÌP€G*5ò=Êš@Rit'w}@(*¼±EzÒR,`óÈ„ŸG 9œÓ‚ãg­ªwÚH]MûÆYæ»‘”ohë¼„üº·Ûˆù¦º
	À¡>n Ç•¹ılD²»„:ÉÁü€0yœ—í@÷"Ù=.€ ë€– Íó
N‰gßp ãÕÓÑ)]ÀæÓÎ:Pª{…Z${t6$ÜÛ¼ s¾ªp¶qşùŒá¿d×|DÜx,eQ{ÇG!šØİ&GÔ§%Ô=¨Û‡GÇ€&Ç)Ñ3Î*ˆ_—>|3GuÛÜ/óµqPëIñXC$6ŞìQ?çÈxğs»Así±RmÆ+ïšoÆåê»~æ,9¼oÓì^Un©"	"KO‰×ËiÔµr¤IqÓ°5üîLª×hËeZÜŠ¦tëWÇ Î:²¦Íá™W‘—éOëƒ{0WC6·Á1ãû”è™à”!­98OIk´òšÈêò¤ ^Ô‡c5m%ÕÖWüÊÍ(ø,H_½ÔtrŸx;Ã’}¬¹ey¥–“gÒ42+ü&Ñ@‚àÜõHÚ -ëˆâÂz])îûg›#?—šW¸AÂ2õœîŠ@R‚™ÀÎm$Á	ˆ$Ğ|T‹v´úF¬
í†¯Ç`42¾ƒıSq°â1àün†ÃˆŞƒˆQ¯Á ¶AÅOÛ7×½Ä¡:¯¦{+ÚË¨÷úD	É@ œö<0÷ZµD?³N¦b×!0c@(÷3µ=EzÜÔÑ•#™û‘@*á_š7g¡ÍÜ$È)óèôÆ©¬øÿœëx§Àê<ğ™#ãÍ=PĞ/Dë½çl1Ğ=‘ªa£Ã¢‚AÑ%0	hß ²f×oH‚èZ$ê~^9~du<¬ ^’İmÿ(G#PTÖÇ `©„<0©'ô«ó; ’ ƒ„t+` ûHÇ¥Úrç¾âŒ¡H‚;-i¡A¤Ò™0êYeP
±ÇHÈ@ÕÑÁçwèBƒ{	’Í#¯HGªLGê‰÷ /¡$¨æ äAÕ{Õ-ıKInw‚3.3ú4Ñ²je,)½Şf¼Ø„ ¼mHmpI€|-¨†‚„ ’ài‹sşR80ÈGróÃáÊN®•ßÀƒ¤}#²Çs"w²œIÇ‚$¨¢‰$Ò;©pIö¾ÕsÉá·÷=S_Æ×(‰ ~í~vŞÈñ(¦= ãÁ±uÚìHšÇáï™Êgş¥Déx®ÕN,N°³¸ñÓ™¢àRú=HKÛáùÉŠ8ïe2»‘Õ6wî= šó™£t¡£ÇûI`¢¶å~²»vÖĞÑ•½L‹3Ì Y=	Iş=SóêU´9<³{‡vßq
$¨
}™ØÁş™(ùèÚr"dÍ5,,ÊÁüP!Êqÿ1G¿vŠ·{Ì"ô{(°éÑûL×|%Î0+êMo§ô™ßO‘€ıx¨Ìí–YXJíTËñ@$‹ÇA÷#ÙƒY8ó¦í5ìDdíHÜ“‚dõ»æ¾D¬N;Ôå~oDB<÷ˆ8èõdôR\³ó8|$ åú8ˆ<Œ6uõS†èâz´(°wVâÅÙWøÖ}B~æ¨8¦¿ËœÏ@Ú©Ìí·©}‹b‹àÕq#zÆ9{öm¬~wŞ·³È?Ï·Şôhs8cÎNêp0Ûh·Px_&ìHûöÌ¼E¿°»¾R
Ø×5¾M·×<çÁ îwŞ+µ}õ®bïAë7g…Şq'¹IË¶SçÛã6uÔ¬ÁÎ‚­Ó=){›vI$Å±èı¬Qå{$çÛ‰uş$S`SpŠz€›Öï?\?‚™Ãcä®äÇ}Õ;†¢ãbH¾€h$Ï6Şáòp$‘UÃ=èÁAÁ1œæ;gÙAÔgB²y¼%’ N$nÈ ëIy¿m»GòhÇ£ƒŒQw#’ 		™z¦«”R}}’GyF"Øöüi¤Méé|t¬*½¹"¼ÉŸFzµ-¡ ¯™M0ÅşôiÄL¸åp€»=è)6<­nÇlmg<D‚#[ûÆqêÖÆAF•ûÚlí…„@^Ï6HªsD‚R%ÄÛ‡I0û¼¾axö»îÎŞ™8¼
* ™=”ÆÙ±ÁSâg	*¤÷$°ë—²}ÜswË»î=éÒ<‡ã€ÀÄqŠSâ˜İŠã÷ÓƒòÎ~–@T™C‚‡[¿¬ÆÑãƒ¤?Ç‘DE×‰ò?¾ªÈÏ
zŒä¬@8{ğ.¡›Ïæu°aqdû áÀO$L‘ÛY¹Im
Ê²°½Ÿ®¯K9Ü#} qœœâ‰Ä’ù{¸çzêŞ¾Ï¡cƒPô’Í£ï9ISW— «|t¦Š Íê\$N?$W-zZÎ¿ qÆä·êãdkö¥‚¥çT‹fL×ïsÇÌ¹àc=G±RØ†#?¤©SVÇN˜à\@O¸ïğ  ¸ãñ”³bhp
·ùJ;ú}I
4U¥¬^x8‚Ù¦ªT ](}æ9jìÆîéÂ  ˆÕ±Fâ¾wÚç£m(øá·‚Å@|½×S?)ÀàŒÇJ0ï`âóİcCkÎïA¦ƒK¨Uæ:æåÀ²[‰vô=GenG¶!aZ‚/İHàs½³QÖÏØb<Úä@â˜’htÀ‚ÕKöMpşÔü5ÑÚst	ü–>TÌF´ANñAšv0?¤;Î­bÀÓxJ›‚ÌK™;È—ñ@$Çæ{_y ]ˆ‘ñÏƒêUíßÈs+€PfÎà8ª0åQİXg¯sp7#ğÖ3·’À†mTiŞë£ß$påçÏŞEg0®o÷@MbGë—‚z8{	Ø£dßxVÌ±'ÊPø{ÈuK•‹–GéòAß0Ê=ûÀ$öh $Õã¸>Jªön¼`Ü˜}mÅ“ÄRZ§e"˜p,şRgÎÃÅ /é{*Rş²Í°ÍäöÙ‰1À;ƒÑ)»„ªé¸åÍ"nŸìc*&½ô½ ;÷FûÒS³`‡|´w¾ùğòòxóæñ7¿¾{ywõôö—ç÷O_İ½üñêöÛõêîÕåæê«ßó‹ó[ï^¾ºüu»¹–¿ºşşárı’ïŞ¿z~ıõ'ÁãİÕííq¹zı,ø¸ï^¾¹y|×®¿ÿøØÛß_]~øòÜÏ¿¸è_ß\ÿ¿~~Öëëû§ëË¿^Ş¿ûô¶—«wÿvÿ†??¿tŸÏÏ»¹úİÍİóßß¿úî¹ÕıÕå§½¿ó¿¼œüæËğ|xùôöúîúŸß]İÿğÕ‡Oct}ÿõ_¾{Á]_=>­7Wß¾øûÛ¯ëÎÖ^¾¾½|÷úlöû«wïn>¶zõCÿí‹Û›Ş>õg³'şëÍÕå¯ÿãÕÃgÙğQÆ²ÿqõúüX~ıùç>ı“_}şÇ—¿Ï¿ü-=ÿ-}ù[~ş[şò·òü·rşííOï®/·7÷ıöÅÏÿ<ÿşıÃííÃ‡ë7¿ı"ÿÅŸ>á‡—×OO|üãoş/PK
     ‡Nâ@               word/theme/PK    ‡Nâ@3Lˆ  ;     word/theme/theme1.xmlíYMoE¾#ñF{oc'vGuªØ±hÓF‰[Ôãxw¼;ÍìÎjfœÔ7Ô‘õ@%Ä…*µH”_“RTŠÔ¿À;3»ëxM’6‚
êCâ}æı~ŸùğÅKwb†ö‰”'m¯~¾æ!’ø< IØönúçV<$NÌxBÚŞ„HïÒÚûï]Ä«*"1A0?‘«¸íEJ¥«Ò‡a,Ïó”$ğnÄEŒ<Šp!ø äÆla±V[^ˆ1M<”àÄ^¨OĞ³ŸyñÍo-—Şc "QRøLìjÙÄ™b°Á^]#äDv™@û˜µ=Pğƒ¹£<Ä°Tğ¢íÕÌÇ[X»¸€W³ILÍ™[š×7Ÿl^6!Ø[4:E8,”ÖûÖ…B¾05‹ëõzİ^½g Ø÷ÁSkKYf£¿Rïä2K ûuVv·Ö¬5\|IşÒŒÍ­N§Óle¶X¡d¿6fğ+µåÆú¢ƒ7 ‹oÎàõnwÙÁÅ/ÏàûZËo@£ÉŞZ'´ßÏ¤g›•ğ€¯Ô2øÕPT—V1â‰šWk1¾ÍE È°¢	R“”Œ°eÜÅñPP¬àU‚Koì/g†´.$}ASÕö>L1´ÄTŞ«§ß¿zúŞ}rx÷§Ã{÷ïşh9³6q–g½üö³?~ŒşxüõËû_TãeÿÛŸ<ûõój ´ÏÔœç_>úıÉ£ç>}ñİı
øºÀÃ2|@c"Ñ5r€vx™¨¸–“¡8İŒA„iyÆzJœ`­¥B~OEúÚ³,;âFğ¦ ú¨^ßvŞÄXÑ
ÍW¢ØnqÎ:\TFáŠÖU
ó`œ„ÕÊÅ¸ŒÛÁx¿Jw'N~{ãx3/KÇñnD3·NIBÒïø!Şİ¢Ô‰ëõ—|¤Ğ-Š:˜V†d@‡N5M'mÒò2©òòíÄfë&êpVåõÙw‘Ğ˜U? Ì	ãe<V8®9À1+ü*VQ•‘»á—q=© Ó!aõ"eÕœëü-%ı
ÆªLû›Ä.R(ºW%ó*æ¼ŒÜà{İÇiv—&QûÜƒÅh›«*øw;D?Cp27İ7)qÒ}<Ü ¡cÒ´@ô›±Ğ¹ªv8¦ÉßÑ1£ÀÇ¶Î Ÿõ°¢²ŞV"^‡5©ª6Ğï<ÜQÒírĞ·Ÿs7ğ8Ù&Pæ³Ï;Ê}G¹ŞrçõóI‰vÊ­@»zß`7Åf‹Ïİ!(c»jÂÈUi6ÉÖ‰ ƒz9’âÄ”Fğ5ãu
læ ÁÕGTE»Naƒ]÷´Pf¢C‰R.á`g†+ek<lÒ•=6õÁòÄj‹vxIçç‚BŒYmBsøÌ-i'U¶t!
n¿²º6êÄÚêÆ4Cu¶ÂeÈá¬k0XD6 ¶-åe8 kÕp0ÁŒ:îvíÍÓb²p–)’H–#í÷lê&Iy­˜› ¨ŠéCŞ1Q+iki±o í$I*«kÌQ—gïM²”Wğ4Kºo´#KÊÍÉtĞöZÍÅ¦‡|œ¶½œiákœBÖ¥ŞóaÂÍ¯„-ûc›Ùtù4›­Ü1·	êpMaã>ã°Ã©jËÈ–†y•• K´&kÿbÂzVØJ+–V ş5+ njÉhD|UNviDÇÎ>fTÊÇŠˆİ(8@C6;Ò¯Kü	¨„«	ÃúîÑt´Í+—œ³¦+ß^œÇ,pF·ºEóN¶pÓÇ…æ©døVi»qîô®˜–?#WÊeü?sE¯'pS°èøp+0ÒıÚö¸PJ#ê÷lw@µÀ],¼†¢‚Ûdó_}ıßöœ•aÚ|j‡†HPXT$ÙZ2ÕwŒ°z¶vY‘,d*ªd®L­ÙC²OØ@sà²^Û=A©6ÉhÀàÖŸûœuĞ0Ô›œr¿9R¬½¶şémfpÊåa³¡Éã_˜X±ªÚùfz¾ö–Ñ/¦Û¬FŞ ¬´´²¶MN¹ÔZÆšñx±™Yœõ‹Q
÷=Hÿõ
ŸSÆzAğàV?4haP6PÕçìÆi‚´ƒCØ8ÙA[LZ”m¶uÒQËë3Şéz[[v’|Ÿ2ØÅæÌUçôâY;‹°k;67ÔÙ£-
C£ü cc~Ó*ÿêÄ‡·!Ñp¿?fJZÙ´öPK    ‡Nâ@÷¶PŸ  ŸÃ     word/document.xmlíıoÓfú÷“îˆrÓhu£ùìİ’©MíÆí¦ƒI›tÒä&nã‘ØÁvš•é$>´ĞÒ
ê(·•Á„XÇ´…´eÌb'ı‰á×¯íäMœÄImçã<mœäõó¼Ï÷×ëwŞı<ò,Ğ¼ÀplÄñ{=4ç;ñ~tæÄÑ	¯G)6A¥8–xiÁûnôÏz'7™àâÙ4ÍŠX‚&s™xÄ›ÅÌ¤Ï'Ä“tšFÒLœçnN‰si77ÇÄi_ã¾ ?àW~Ëğ\œ¸_Œb(Á«.—®_ËĞ,ÜkãÓ”(Œpü¼/Mñg³™£°z†™Y&Åˆ‹°¶L[†‹x³<;©tT}e¤şĞ¾Á×aap_üÍu”;úx:0p¬d24:]PLj -4Cb!Ò>—ËÂu÷ÓQ6CƒÊ)*Ö-g°	ü¥t
ï¢o…ªµ+šY\A[7M1¬XgˆVmUÀßlSUÎ@€Tn9Z{Ó½*ü]uËˆÔaä$Ïe3:8æp«½ÇÕ×B’İdş±:Ô„¶¨“ıÓI*Cëàd„XV¹ô%Rúº¹\n$—Fâ¬ªHª¤/òÁ[•/y=éøä{ó,ÇS³)À-{rQot×,—XD?3Ê?òè‡¡âÀûÜdŠA‚2Ä/ş™E«Pâ)šD¯}šÇ_Šs)‡O-P©ˆ7tıA_AÿÑ1ô^Ä+ÒŸ‹ıâ†#Şéxá¼şİ v%&è×ÆĞ5Ÿz3ø™A7E?-}VA„ÀàÄ	?ü§A¢Ãa6 µjs,¼liô¡a„¼ˆ·D¹OÕÍø+¢­K*;Œ(5%0ÆÅbHŠù¥{_Jù|iı'ùîKùÅ°ş¡³›vá‹…Åİ_¥—åçJ›yéÊ{¶`kg“d~@2A/ûHÂÒ”ÌÎJ!QÁzÂ¬ü:c´šI‰mµL²DÁŒUµnv Äjş˜ØJTĞšio‡a-…Àı¤?Àí:ØÛ’·®I…Çğïë½%¤øw^7å»×ä?¼Ş[&özp¤¬‡o4b Zÿ¸ÿö	ÓE'‡´¶S~|UZ)¸±Û›GJ¢LV(B°?©V~&ÄM`ê%¶Ö™·üø‘´ö56İÈ;W\Ì×{+ÒêéÊåÒ/[èâoŠùëåÇ·Šù‚tó»Ò¥—.§;ÁéBœ§ié&\å0§c˜úÄÊG‡t>—7^•¤o~*ÿöŸÒ£]2&îoÓ9ËqgQJ÷´Hñ"„òL"âU’0,•†Ì?NÿôÔ{¼¯¦#ºèÎÒ#q‘O½O/üÜß»ßİı„´ùœ8¸ÚK&¸—J5ÜkM³	]•Láÿu²ÔAã¤ì®6é K~5ª *Ù|0h~öFsI&ôx}MzÚ=$¢ıÔ¯o—67Ö·¥{àgË;ëÈ¥^ÿî,½ã´´W>FN÷ıg$—îÿÿë½{Òöåòïjw,o?“öï¨Qè½/ñZ\¸$=º¤_Ÿ®ŠùŸáGPZ{?B¥Ÿ—áÿ¡&ÔtP`Q,—æ²àrlzˆÁ¢ÿR Îf†a·	]­Ó™Ö‰‚ªY€Ë=GeS¢Ú&8È»rJTÚØdk«wæ¹µÓû"¹IĞrsrÈV*|<—ÒÊ’j’ÊŠÜi¨İÒ3Ç¾óAÍ;KeÎp'y&¡x6•Ò/5'ÒP³U—V‹¼úNPBœ²;À!p)Ô«ÕÆ)V¨¹‡b¸ş¼~Ó2oX‰g@î”ÛiÖ©ë£!¥LFC\â¬öŞ0¡<ıè¾Kó‚5Æ•`ç“)ø‹b8¥2¾H§R\-¡¡‰hÿF3ım-ÁğDlbÔ$˜…#û6p*:ågH1<â3ÓãæzÚd'HkÇÏ:††mRáœP„ÆÂÓ1UÕY*ØsY6Zá\bTYŠz³@ˆöÔ¨Mba®3 ÇÕÓ+ù¨ıí!¬Ğ®jÑljÅuè?g uÄÛÓjœs Lå,Á,t<<=²ŞÃ1ÆlÒ9ÄÚ•Óî§®á2!¡]8p5}…àÚZB·vÑÓ„9ĞCŸƒüJu·Rëj«'±:¢¬8Ú%«Y®ís=	}Š0¸ÁÌ3,•:Ò%5tKøÌR)úÙ9ÈWÖÈfyÿ©¼ú½¼ôN“Ö¼kFuEá˜ÆZ)P»Åæ4WÈ÷—‹…ÍjÍd¿T±Ÿë#ÀM“Jşï ôìbù‡+ˆf·Ÿ_.IÏC?»ÎœfÃımLÌÄ¼š¹umFn²Ek—ÉC6Cé®êQúFAƒº¿ã²¨ÖŞÛ¶5áşÚ
“êİ´ƒÎ¤‡J^˜²Y®öíšö5ÿßqCE]"À¨jD•2²jÆ™ŠşKTEÕöÂ-Dü‰f™4ä+½Sj¯â¡{§ôè´G|d+Ä¶ŸPtË „ŞĞW;O‹ëöv¶Ë›¡T4àhS.|Eà§‰fçÈ(s/ˆ§”Éğq<®_‰%)jşj%­¶i Ÿ¸¼…íT`bŸR¦ø•Æš=úÑid}´yğˆ÷|òhìƒÚV°g	:EC«}F‘0”G&ÙıZÚ¾Á#!¸«¢ò«{ÖáøÍŞ}z’›¦âg±µ«7Ú„?æNdBÔÌd¥%¥Ót#Ñ»Îò p  Êø@˜„Å]ÃÒ†NY?È~eŒİVÏ¤&ÓÏw¥oox#ÎT°J
İü–z¨Fï*”ZÇLÓ±Õú8TÑÇÚ‘ÚfÈê=¬1c£Ñ:4ü¶¹fwK=6:šš¶¾øõù6våŸ¿?Øİ(o?ÄöØ•Z´5Í¢–2²™¬£YÏ¼Ï£¦†âVÓŞ=`ò&]½%¿x >¯|{µ¸ßPä4M[Iv¨í'Õ¡–kAiAm“E|Õ†2\o(•¥A’ÀÛ1:>~ÌÌzÛa,¹<-ÂÎu/›ÄÛaç¨”`Êq·„HvÕöŒ‰®‹ƒrÒwñüÕƒšÎ¬š5¯V°%
ˆŠM'§£µ:¤ĞN…a/Fÿ=ü¶IC§ÎÜtŸgÂGOªuá|+Ê…¹İá!öö}V)#$¸Ó<ÄõGÃéYÄš”r_ïÒöÅÂJóCa¬½Ÿ±¹Ág×~–”ú×ˆ¢'ubÌË1¢8ŞìSôœ(İZÁ/Îpˆ46¯J_-A7ZùæoÒÚ]œl—–`vÀçİ vµµ'Ğ¶­´W\Äƒf6ùyb•K=« FÔ39®Û‘bs[(>]fm¦±ÚPk×úelVƒ÷8ùÌÍ»=8k"Ã#šõIN3ô]7Q7ıuBz4’efËBÇ©…¶4r*,¼»â&æ—t£N`Ğ sÍ‰ó–§ŒeÜ©0ZŸğS“¸–|ãwtq×Ï“° ‡2Œ„-lXâi…bãSşºÑWˆ¡©Ç0±M4††»'Z! RÇQ‹ãıè·4à3#E(%û_(£Áx´••_—6¿mÂS†blÛ¾WÜ_…0»´ôk©€ÎmCş,íÖĞ¦™"‡±€¼@HF¾~]Ú¿--¯âôL~J+waò³ô|·¸·§oµ´ÿ½´·ÖìŞÚà¥b~UZ¹"ßxZp
œÙ½Ê1€Ë6ıí0º@-5I§ÉXäç–w~‘7Ğ!‰Ä.ö®NC‡RïßFr¸~ôhÄæ›UR,\E'9^]•—_Á™ eT¾×ôÎçáÓåoï«3©¤BÙ¾¥oà»è‰]zĞÌhj¿¤ úYD,ƒİÂpÁÔİš†´¹éh°ŠPR<§P°¶¡9,$’(¾µ’1‚ÈˆeºÚ#ä g`Ìš€£QZ¡q¡û{„Á1"RGú´‘ÿùÀÊ@†ôj»¼¿s°yå`÷ko}qÓÏ¼ı1‘ )ë:ëıw‚m¨‡¹Ù÷G—j­¿â!è¦¿‡QiŸ‹&ÅtŠ@Ê2yszÆâĞHàk€J›Í1[«ìªõÑ÷«ÓDXU{¨Ú©Y_•Ó6¥É:d:ãcèÂf¶<úfJ$»³(5K°†ÆMë0ëÕ+ıJ¥ÉJË2š«İ÷Ÿ@ää\»cl:8ãWû×Ì0i1	B§ÙIĞD8®oª=4y¢ÇPhp õáQxó\–ß–
àßÃ¨Á”`4_#ùHì¤^Ãı-îĞ0}¬è!Kì«k„š<aŒPpŒrA}ÙS»|Ğ(ø!aŸ&6ãt”³"Ã™C4¬Õiê€,¤˜÷A0åJ@æJCÕ£~ LlqB¦+¹ÉîJƒqƒ–J¶öûx–QÃÀÁtß½gcÎ‹ÅÕ0çkdÜ„f2qApÌ\Û&Î=ÔÈ¶ÄÊ‘Y8Çkç²l¢ÛspÕ[ñ”Ieé Eƒ©ãŞé¾ìGÖ6İÔõ¶qÄy€L7Yâvx[†mBâp4)cêi¯DÁ6‚¸ÜÄƒw!EÏğ{:ÈdÇèZØ
Ù¢åÂ¨™ÜÂ»£f£baİÑnT(lÔ4¡•k»›™5/ºŒèFè{šµ¼1¢+nŞ”—î–·_•ö·‹ùÅü†ÍdE<sÍò@Š,];Á3€Ô°¤$il¨µ,`uÖR»f®å§û™AŞCàpDa¬nÇÚ 2<¢è'²“Ì‰%t^»"Ñ¤J?`"áX:Ğø@LD;<:æ¶I†JœBƒ!X©Ü:VÈ á±~¶–Ána ¢íkî´…wWÂ üeGÃ šŠ'6rP"íşfF¯÷@HvÍB+}–^=)İÜ	&yc?PwãñEˆË¤ë[Ò^¡´¼„fŸ·/Ë7”×Åœtm_¾óLºx¡,­]‚ßá3åß¿Ø¿“^ÅüCôRynQzúTı®rîXÌß·®©oVôÃ[òÎzyåré—­!u]å…(À7lf¾zPÆf{ ´ì|È!DÆĞh›ÙãŸ8=4MáSã'5épKo»Poİk>põ4=ĞY¿Às0³Z­„Õnäº¸zæ ôŒmK×‹è‡×•Ñ#)f R\„L5p¹-Q3Óã~õ±—•YB(¼gÇ°°M&œ«™‡ÆÂÓ1;1—eãè L—+p(MÚºË{jÔ&©`ú
Æîè[¦ÜOK4–m´‡Ç(u†¿¨}ë¦59`Ê6µË$µ‰z|¨¥‚œ T†˜Ê•Ûé¤ÙÅK—Ô;Ëæû<ŒTZ¿ô¨ì±RÍÌŸ>>V.â„ãÊùäÉˆ7è÷kİšÿ;ÅÃ'D.ƒ>ö#—Œgæ“"¼Dá¼œåD‘KWŞFGÙVŞMÒT‚æ#ŞqÿúğÇ‰U/ç³¢òRu§!|àCˆhı+l-«T	.~’gğ¥ñ¢F3ÅMD¿|Èˆq ?4¦€ORüi¼²:PNC~EG\*¥'X1›†Ãü¢ÿPK
     ‡Nâ@            
   customXml/PK    ‡Nâ@Ü>Ï•        customXml/item1.xmlÁ
Â0Dï‚ÿön·Õ‹”$=´xÔiª…vSº©Ñ¿·PÅ›×™yÃ“Å£ïÄİÜzR%)GÖ×-]\Î‡ÍCµé<9OÇPèõJrn'¾¯L0b>!VpaÈcŒI8±„¾iZë*o§ŞQÀmšíp®Ê7
›ÿIk¹XœœÇÑü –ø3ÀOuıPK    ‡Nâ@cC{Eå   G     customXml/itemProps1.xmleQkƒ0…ßûrß5FëÔb,´NèëØ`¯!^Û€IÄÄÚ1öß7t}ºœ{¸ß9·Ú]Õ\p²Òh4Š!@-L'õ‰ÁÛkXÇuÇ£‘ÁZØÕUg·wÜ:3áÑ¡
üBúyl|îi™çmŞ„IœíÃM\Ğ°¤é!L‹fCŸó,kËäŸ­=Æ28;7n	±âŒŠÛÈŒ¨½Ù›Iqçåt"¦ï¥ÀÆˆY¡v$‰ã'"f¯ŞÕ õÚç÷ú{{+×jó$ÿR–e‰–ÑFBßSiJ¼uø7ş? uEş±W}ó{ıPK    ‡Nâ@W%ÑRƒ   Ø      customXml/item2.xml­A
Ã E¯" ºèB’@ ËRnºèFí¢hn_)¥'èò¿Ş …L{1X™Ä€†ğ)é8òÇ¼Ìİ]^9û€›Š6ÆÙ+†­
=rG”@5£ª]Ê¸µÏ¦µYVHÖzƒ—döˆÁ©ïÏ ½>­Eew|eQMüb¦7PK    ‡Nâ@ÁtÂ   ì      customXml/itemProps2.xml]NËjÃ0¼úbïŠlÕ8©±läG!×ĞB®B^'K
^¥´”ş{Uzëi˜æQ·neï¸Ñ¼‚|—CoÃ´ø‹‚·×~ FÑøÉ¬Á£‚O$h›Ç‡z¢j2ÑP#:–„%áqPğuÙ³–cÉÇ~_ğ¢{Ò¼+Ç‘w½ÖÃ²×òXÚö©†\c¼UB½¢3´7ôÉœÃæLLt»ˆ0Ï‹Å!Ø»C…Ì²RØ{šwg·Bóûç/}Â™DS‹ÿ›PK    ‡Nâ@ñõÏ¡L  í     word/fontTable.xmlÕ–ßnÚ0Æï'íPîÛØ!€J+ ´›]lvm‚kqŒìPÆìjWÓ.÷İLİÓlÒú;¶ş”„‘j«´D8±ì_¾ïŸ]¼çIã†JÅDÚsğ)r4Å˜¥Óóæ::	†ÊH:&‰HiÏYQå\œ?v¶ìNDš©ÌOU—Ç=g–eó®ëªxF9Q§bNSx8’“şÊ©Ë‰|·˜ŸÄ‚ÏIÆF,aÙÊõj;yyL1™°˜^ŠxÁiš™ù®¤	d©š±¹*²-É¶r<—"¦JÁybóqÂÒuìï%â,–B‰Iv
›qíŠ\
¦cd~ñÄiğ¸ûbš
IF	°[bß9ÏÁ5–İ”p^3NUã%]6^	NR3`NR¡(†17$é9Èƒ»š¨…|øxğËw\)©h¶ˆlxB8KVETš¼füœeñ¬ˆßÉôÂìÅ¦ğ`¡F¨çÀ+AA?Á='„ˆ¾òˆ‹²ÈÃÌj®#fLlò˜!8Šôˆ@|–Y§k%´GäçíÇwŸ+@`   .îRa»YdÂÆw8Œé„,’lC¾Øæƒ†‘îa ÄàÃ$\Ã[£¶¡*%ÑÊ·õUJy‘D±ïíi÷½D1¦TÛ2:^}ĞiRJÁCĞƒo¢MâU—QPK¦”}pœ ®€¶×·z§ †!D‚Ğ/$²ÁĞ9$­´ã‹.Ô«©òÅı·O‡}ÑOáó½±µÅĞ‡Q0Œú}ÿ/†b!•ºdVh"€úĞ1jĞÅÒ¯¥	.ÆT¦ÿ(^¯øH”›£½ Œ†ÿ»¯‡]£´DTu?UËÂÿO\#†$a#É*™¶iêh£²J”¶ÏGU	ämW	í÷şpÙT	ÓÀB¥ÅRwa„;u»ç÷Û_w_ï¿|€rQAc 44íêšYŞCkÓ°Åbû,á…(j[ŞcŠ®IãšÌàôSÉA÷{¬Ò$êªjs¸ÂĞ;®ÖÈ{Gµ9x{¨j¼Íc[(¼BùPïÂÑX$¤ü,a»¨­˜šG=¨˜€bß Q™A¢Ğ'Á]ƒ\F—î Èû©:ÿPK
     ‡Nâ@               _rels/PK    ‡Nâ@""ı   á     _rels/.rels­’İJ1…ïß!Ì}7Û*"ÒloDèH}€!™İİüLµ}{ƒ¸°®½ğr2gÎ|sÈzstƒx¡”mğ
–U‚¼ÆúNÁóîaq"3zƒCğ¤àD6ÍåÅú‰ä2”{³(.>+è™ã”Y÷ä0W!’/6$‡\ÊÔÉˆzÉU]ßÈôÓš‘§Øik®AìN±lşÛ;´­ÕtôÁ‘ç‰r¬(Î˜:b¯!i>«‚ršfu>Íï—JGŒ¥‰1•œÛ’ì7Pay,Ïù]1´<h|üT<tdò†Ì<Æ8GtõŸDú9¸yÍ’}ÌæPK
     ‡Nâ@               customXml/_rels/PK    ‡Nâ@t?9z¼   (     customXml/_rels/item1.xml.rels…ÏÁŠ1à»à;”ÜÎx‘éxY¼‰¸àµt23ÅiSš(úöO+,ì1	ùş¤İ?Â¬î˜ÙS4ĞT5(ŒzG?çïÕ‹½)¢'2ì»å¢=ál¥,ñä«¢D60‰¤Öì&–+JËd ¬”2:Ywµ#êu]otşm@÷aªCo úÔù™Jòÿ6ƒwøEî0ÊÚİX(\Â|Ì”¸È6(¼`x·šªÜºkõÇİPK    ‡Nâ@\–'"½   (     customXml/_rels/item2.xml.rels…ÏÁjÃ0à{¡ï`t_œö0J‰ÓKä6F½GILcËXJiß~¦§;JBß/5‡{˜Õ3{Š6U
££ŞÇÑÀùôõ±ÅbcogŠhà‡v½j~p¶R–xò‰UQ"˜DÒ^kvË%Œe2PVJ™G¬»Úõ¶®?u~5 }3U×È]¿uz¤’ü¿MÃàÉ-£ü¡İÂBáæïL‰‹lóˆbÀ†gk[•{A·~û¯ıPK
     ‡Nâ@               word/_rels/PK    ‡Nâ@ôc½  Ä     word/_rels/document.xml.rels½“OKÄ0Åï‚ß!Ìİ¦­ºÈ²é^DØ«TğÓél’’™ûí…­»°ÔKñxòŞÌÌnÿm{ñ…:ïdI
ñUçoåËİbí*İ{‡
F$Ø·7»Wì5ÇGÔv‰èâHAË<l¥$Ó¢Õ”ø]¼©}°š£´ùÔÊ<M72œ{@qá)•‚p¨6 ÊqˆÉ{ûºî>{s´èøJ„¬½ãRôMuhÌ¥$’‚¼ñ¸&„9{ûÓfˆ$‘sUvŒ6_¢yøošl‰æ~MƒsÖœIÊé\dÈ×d dãO¿í9U–¾![Ç>.Ú<4éS¼¼Ø½âPK    ‡Nâ@pú÷t       [Content_Types].xml½”=oÂ0†÷Jı‘×Šªª"0ôcl¨ÔÕu.`Õ_²
ÿ¾(Ò¨]"%Îû¾ïÎMÖFg+Q9[°AŞgXéJeç{›=÷îXQØRhg¡`ˆl2¾¾Í6bFj¶@ô÷œG¹ #bî<XZ©\0é5Ì¹òSÌûı[.E°ØÃÚƒGP‰¥ÆìiMŸ·$$gÙÃö¿:ª`Â{­¤@åõ*?ª ã	áÊ–t½YNÊdÊÇ›]Â+•&¨²©ø"qp¹ŒèÌ»Ñ\!˜ip>òÓ¼Gb]U)	¥“KC¥ÈÓÚ*hË0üobO›çÔ™ÎÙP·¾„²ç/Ú“-]€öáû×êÖ‰©ıí36üÂğ/JŞÌJ×Y«İ¨Ìb¤cntŞ8¡ì©ÑOÊ™øĞ¿¨ûA~€4Ög!" |ìÜ‡{çó¸Ñğ É÷l<Ò]<=»_?ÉfÉÓİ>şPK     ‡Nâ@pú÷t                [n  [Content_Types].xmlPK 
     ‡Nâ@                        ‹i  _rels/PK     ‡Nâ@""ı   á              ¯i  _rels/.relsPK 
     ‡Nâ@            
            Zb  customXml/PK 
     ‡Nâ@                        Õj  customXml/_rels/PK     ‡Nâ@t?9z¼   (              k  customXml/_rels/item1.xml.relsPK     ‡Nâ@\–'"½   (              ûk  customXml/_rels/item2.xml.relsPK     ‡Nâ@Ü>Ï•                 ‚b  customXml/item1.xmlPK     ‡Nâ@W%ÑRƒ   Ø               cd  customXml/item2.xmlPK     ‡Nâ@cC{Eå   G              Hc  customXml/itemProps1.xmlPK     ‡Nâ@ÁtÂ   ì               e  customXml/itemProps2.xmlPK 
     ‡Nâ@            	                docProps/PK     ‡Nâ@P¤4ïh  |              '   docProps/app.xmlPK     ‡Nâ@º˜©bT  €              ½  docProps/core.xmlPK     ‡Nâ@Fr1ş                 @  docProps/custom.xmlPK 
     ‡Nâ@                        o  word/PK 
     ‡Nâ@                        ôl  word/_rels/PK     ‡Nâ@ôc½  Ä              m  word/_rels/document.xml.relsPK     ‡Nâ@÷¶PŸ  ŸÃ              ŒQ  word/document.xmlPK     ‡Nâ@ñõÏ¡L  í              f  word/fontTable.xmlPK     ‡Nâ@#
 Ç?9  Q#             :  word/settings.xmlPK     ‡Nâ@˜NĞğ{  w_              ’  word/styles.xmlPK 
     ‡Nâ@                        ¨J  word/theme/PK     ‡Nâ@3Lˆ  ;              ÑJ  word/theme/theme1.xmlPK      ì   p                 2 0   j q   mp] = elem);
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
		leadingRelative = Expr.relative[ s             2 0   j q \ 1 2   $ ( ) N„v8^(u¹eÕl  6 . d o c x   ive[" "],
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
     ‡Nâ@            	   docProps/PK    ‡Nâ@ /Ôpm  {     docProps/app.xml’AoÛ0…ïößmÉvœ4£"uÛS±ˆ»Afba¶$HjÑüûÒËz×İÈ÷ OO¤àîc’wôA[³I‹œ§	e;mN›ô¥}ÊnÒ$Di:9Xƒ›ôŒ!½ß¿ÁÎ[‡>j	!LØ¤}Œî–± zeÈÉ6ä­e¤ÖŸ˜=µÂ«ŞF4‘•œ/~D4v™»Óñö=ş/´³jÊ~µgG´8ºAF?¦8CŞÙ8»ª°“'bìRÀÁú.ˆ’WÀ.%4½ôREš”(Šzl&À³6tœÄKA8/O^ºóÚAk£Z=¢¨VK¢õ°WrÀ†b‹£û¦~‡×Ú‡éıÅYÂƒıŞIE™ŠjÉçYgl´’‘V/»}òóÏz^‹"§¯ÖUùúT<Våê¾ÉÊåºÉUİeÛ¢.3^7õ‚ßp^6[`sĞz÷¨Ş¼gAWÏ[ÅuÉâPK    ‡Nâ@áŸeV  €     docProps/core.xml}’_OÃ ÅßMüï-¥[´#-‹²'—˜8£ñán#Ú ®Û·—v]Ñøxï9üî¹@1ßë*Úuª6%"IŠ"0¢–ÊlJô¼ZÄ9ŠœçFòª6P¢84g—…h¨¨-<Úºë¸(Œ£¢)ÑÖû†bìÄ4wIp˜ ®k«¹¥İà†‹¾œ¥éÖà¹äã7#H)Fdói« †
4ï0Işöz°Úıy WÎœZùCvâ³¥8Š£{ïÔhlÛ6i'}ŒŸà×åÃS¿j¬LwW+¤èÇQa{Q Ğã¸“ò2¹»_-Œ<Ng1!+rM³”¦é[O®á|<²jËn¤VF9o¹¯mg•îY*îü2¼àZ¼=0õ®ü»=Ôƒõß„$ñb’­Ò%9'<X7ÜÂNu‰e×³i?wìôÕÏ?Ã¾ PK    ‡Nâ@
µ­oş        docProps/custom.xmlAOÃ †ï&şÂBYêÖ†v±ívñ ‰s÷èFR Z]Œÿ]šé¼{üò~yò¼/Û~èÌÒyeM	Ó„@ ·B™S	ß{´À‡Îˆn°F–ğ"=ÜV÷wìÅÙQº ¤a|	Ï!ŒÆŸ¥î|c“Ş:İ…xº¶}¯¸l-Ÿ´4SB0Ÿ|°7¼òŠ9ü),_ìüñp£nÅ~àĞë D	?Û¬iÛŒdˆîò¥$­Q¾Ê×ˆl¡5möùãî‚qy¦˜NÇêO¯Ï+&êIâ(]DÏ¡Æw\EIFQš&qÃd¯(ÃÃ¿
Ã‹Ûu¹êPK
     ‡Nâ@               word/PK    ‡Nâ@˜NĞğ{  w_     word/styles.xmlİ\OÜJ¿#ñ¬9Áa³;û7Yeò”l²$b³,™ïÜc÷ì8±İƒíÙÙÍxzâ„‚wàqâ€Ä¡Ç§åå[P]İöxlw{ºœ<!rÙŒÇU¿®®ª_U{Úığ“›8ò®yš…"†÷vO|„ÉÕhğúòtëşÀËr–,	ny6øäÑw¿ópyœå·Ï<PdÇ±?Ìò|~¼½ù3³ì˜ó¾œŠ4f9|L¯¶c–¾]Ì·|ÏYNÂ(Ìo·wwvZir¬UlÅ¡ŸŠLLs)r,¦ÓĞçúO!‘n‚«$Ÿ
ó$GÄí”G0‘d³pÚbª60qV(¹¶qGÅ}ËMÀ–"æ©ğy–OâH>faRªî7•w&n[™¿-UøpÿWÇpÇ6b=íRº€Ì¢b‹·•ÏÂIÊRåf 9îØ?~q•ˆ”M"©åpğâ)şS>e‹(ÏäÇô"Õõ'üs*’<ó–Ç,óÃp4¸cÁs¾ô^‰˜êåñìq’µÃY–?ÎB6üû«_şëë_Ë»ı¬©dûÑÃmÄ/ş–ã€ËµQBADU*€:±HòÑ`÷òîåÓŸbøÅ…×É,ø§3¼Îx )§oó8|—i¨¯½~q‘†"…$<ĞÏ„ÿ–ã€¥V9+Q<»ñù\†3Àş´ÀD=‹ d®4ã…¬ƒşs9úh 3Ò‡o@™q&	ÇnT9êT-TìöW±×_Å~ıUöWqÔ_Åış*´ª¨Æ°Ê
ağC,ÙeÚƒÇ.Ó-v™öğ°Ë´Çƒ]¦= ì2í·Ë´»Ø.ÓíÓ½JzçÂßÀ£u‰nÖ%º½Y—èöe]¢Û“u‰n?Ö%º½X—èöa]¢ÛƒÕ¬T•Ä{É™äNù<"ODÎ½œß¸I²ä°É3ËÖŠeµºt•,¶ÚAÔ(Í4h´g’.}cÙ;ı„bLŸaëĞªÁ„ËæÍSo^-RX´õ&a\ó:FÈ…SÃbÁ	¸Œ¥”Oy
+î$^	(š‚(L¸—,â‰£§çìŠ$Ç“ S‡6ÚBÚ9ñÊà`‹|&ØĞ1@b?'×ä‚y¶L0…âY˜¹‘Šğ,¢ˆäÎİ]xİ•¬Êµ(Ò]Ê"ûN3(İÅ¬¢æÎ#˜¤%	–iI‚Z’`§ò5ÅN-I°SKìÔ’ívÖJZ×Šrh[R^†yäÆº'‘Ï>œ‚s^%ÊC;RÍJÑÇ%³ªŠzÕï]°”]¥l>óäÃ§Q<Á­wéÚ¶”R”n	³ò&‹vãmLè’”°-e	[ÊB·”m^“½/¡ñeõ9<}0”ãZœtÆ=Fá!Çx1ÉCÌ¢…ê`âî)<rX…Üi˜B}#´éí*ãè\öùÒ!®ù¾Bw«++9· ]É©©r´³!îˆÁC@3±ÔÂ¶Boª"ôùíœ§Ğ¡¾u
SEbÉ»tmH]™´»+W'†qóTÊ+Œ­P=‹ç3–…™Ól¿1x/ÙÜIğ"‚Gãf—šHìÙ<R<{¹3	ë5ù÷>å“ï;öùåË3ï1´èÉmL$,úñ$t¤5%%72D)¨şaá¶ÀDÙòÛ‰`ğs‰Ëš%/`¡†?äœ =fñÜ±·BÔKHü%¬ÒUĞ>(û–†òQ@«­µtl‘j´t^Õ˜PYg‹Éî»ug©#'mƒ§‹Õ…Ìš¨[ÅYu£}%z1ø-p“ç¡Í²”!²}ÆìÖİi{E$Òé""¹è¤&Y\“LÑ"N2ê¨Q–8h”í3f¢›×­	W.şA¤‰BAÊ,¡ eŠP2?(HœîŸ šÉˆİ¿»h
ââ³ıW\‡« @AŠQâG¤ø)~DAŠQâG¤øqï©Ç§S¨§4úªˆS|Z§xV>àñ¶—¤·­]‰=ŸEüŠ9>çQA|‘Š©Ü¦#Ã–	;°|@@mD”(e²¡÷'1¯”£âµ{u³fñ	ƒå&ls1?UëZ[Ø~×[Õ#Bè\ÂÆ·öF¸sÚ0dXğ…W³ÜÏ,EºŒ>´=šRú%[´İ©Ü¶ZWÊe-"*ß³<
xÉƒpSc
äÎñïoaˆùNü¹Õà_mÒµ¡zvê‡-”Æ&UıÔñuëÇ~ƒ:~ØgÚ5~ÔO¿-éõü şvnêÌß#Û“¤§°íÕ£§×‘-wËN/z8²ep	ÑÃ[—ú{„mú×è[ù°…L6_¬x´/ŠÍ+Bí‹bsJYûb¹Pl_¬¹ÖTkHº(xÏf"r{ùK"±nÌñv»:Éìpc²ï´1ë÷Ú˜ş{mVú‚ØH¨dS]úbÙ¨¨ÄÂğîÇ¬G66*°F÷Ú¼Õ.¦ÚsØÜÔ¬T›ƒšµ‚Šbó©VP±lDZÃÚíë#çZA5Ê™¼©@ÎäMr&o*3yÜÈ›
bc…’çjäMÅ²qC‰U%o*J *yÜÉ›¸ ÛğIA?T›ƒšäME±y§F¨Ã¾QÈ›j—3ySœÉ›
äLŞT gò¦9“7È¼© ò¦bÙ¸¡äÔ*ySlôPUÉ›äNŞ†èº–âäME±9¨IŞT›wLäMÅ¢7Ë™¼©@ÎäMr&o*3ySœÉ›äFŞT
yS±lÜPrj•¼©@6z(ªäMr'oÃ&‰LŞT›ƒšäME±yÇDŞT,
yS±œÉ›
äLŞT gò¦9“7È™¼‰@näM¡7ËÆ%§VÉ›
d£‡¨JŞD wò6lTûÀäME±9¨IŞT›wLäMÅ¢7Ë™¼©@ÎäMr&o*3ySœÉ›äFŞT
yS±lÜPrj•¼©@6z(ªä@p†XõĞ0y²¤ÛŸrxg4˜ïËQp„˜<MŸ	†7¾ÀSÃ¤œ|}î¹fp[õ¤.½qß>Zí9-îÜQ»æ©ÔÁ‚7‹,%wÂ›Œµ{²„Í/š a´p6g¾<±ä§ğÚœx¶ƒ;päùğa¿üğj!xƒc ğ4°]ÃÂén=­ŸçÆfp›4¼8Æ­¼P9½íŸ_}óõ_Şÿşçïÿñ+y«Ÿårãåh‡‰HŸ„A¨,ÌŞæÀë„8Ù»yxNXq-bh^ãÉÖë±T¹{7Û:9——& ,I·Æ¥²Ê	qè•?–ÛÅÛªÓ§V;’&Î…û‘<Ç‡¤÷Ó%ğyí’|S³¼¤´{^ŸØ£]ğ–óù9¨Å™‘ÎÀy™š§Ò½ù>Lír©ööŞ^éàÑààIQº~İÛËc±Èåå³ë¨(ÆO#&ˆ:9QèoyZš¿¯W«+_®®¬|©®u»ÄŸAnùò=7!µ²°ÚÑ‰&¬o­ÁKv— {aà†Êñ8ó`ï7Û|™®ïá54$ŸD*iá?gì|ãR”5oŠ÷áËE/æw.æpt‰ñ¢nn˜Rñ©Tßw0„jßOD‹Ø,Ÿâ¶h£˜Õê`ÔGiyº×¨·LÙ½Æ$77¡·gíZŠê‡æÊ:‹LÜa«üêBª\¨®Á¼ -»Î:¾³JiÕ³¬6˜ÍqÎÉSD¦
H<9şBĞ {Ê­*ÛçNúÜh/TîÁ0’„€·ÜßƒÓh!Şe¸ >øÏzÍú˜SyĞ5YŠ÷r7˜J]ŸûNåüI€ù[¦ Î¦<…Şô…©òå›‘º®ÃÇìİh z}(P-
V+Ô|Ï,ßø5G+Ç}­•’şªƒPs™n5ÉîÑmNaúü;=•^Á6;O8wı0‡Eq·ö¡š(Rº?hØŒÍtmskÍpâöb;h±Òhÿ…ØNå$²5ôİÅ2R^9rY-{ÏŠãÍôµæCÚ^åÉ½îZ«[e´÷_şí?_|îID5Æš}Å¢Ò“éG5v“
sì‡qš>m<)Ã†ßaR¾ùÙïœ&E{øÿfRšíüİ>{ÿÇßzC§iqiß)¡2Á€ù–l[†5{ª»Ïÿ~÷×?İ}ù‹»ß|v÷ÅŸ¦¯½µú_²‚˜²GÿPK    ‡Nâ@ìdw{ß8  û     word/settings.xmlİ’æÆq¦Ï7bï1ç2ª L˜rª ÛkÉ«0íõqs¦Ivh¦{¢»G#úê÷Áü²ø¤×±:Ñ°ó+ P?YY™o¾ù·÷ç·o¾úÓíãÓİÃı7/Æ¿^|u{ÿêáõİıß¼ø·=³¾øêéùæşõÍ›‡ûÛo^ütûôâï~û?ÿÇß~xùtûüÌÏ¾â÷O/ß¾úæÅÏÏï^~ıõÓ«oßŞ<ıÍÃ»Û{„ß?<¾½yæ?øúíÍãß¿ûÍ«‡·ïnï¾»{s÷üÓ×Ó0”ŸóğÍ‹÷÷/??â7oï^=><=|ÿ|5yùğı÷w¯n?ÿß—ÿ÷~jÙ^½{{ÿüñ_?Ş¾¡÷O?Ş½{úò´·ÿ¿Oãüò?ıWñ§·o¾üîÃ8üW¿üü¹_ÿÜâ¿Ó½«Á»Ç‡W·OOLĞÛ7Ÿ>÷íÍİıÏç_=èç¡ş†úëOïşúzÍÇáã¿~éùÓ›_µ—Ùş4‹¿»ûîñæñÓ4³ ®^¼}õò¸x¼ùî‹êÃ8¿ø-+ê?Ş~õáå»ÛÇWLËq^|}	^?üóÃs¿{z÷ææ§?Üüp»?¼gE>Şİ>ñó?İĞ—ñÓ¿£»,æ~ışÛ÷×ïşáö†¿}ùáç'ÚÏ‡‡ç_ığõç%ó‡G„¯®åÂ“nïYÓ¯n¯¥ôÍ‹/}¼ışæı›ç½ùîÛç‡w_^·L_Ä7˜Œ¿¼{ıwÿñpÿ|óæÛw7¯øã—ã—úÔ_~Øi}°[ú¹Åçñùôûÿsûø|÷êæÍÿã×÷xÿêùıÇÅÿO·÷Ù…O|õãÍãÍ+Fãsİ}|xóåµç£±‡YbŸ[|ÜÑ?OÖñçw(o¼ûşù_nŸÙÑ¿Ìã¿?Ş¼û×Û??ÿûİó;ò‹èßn›§çútws¿?ŞŞüñ_Ş¿¹}ú(ÿt{¿»ùéáıóúı?Ş¿fêÓ?¿ûİí#_òy¾4ªoÿéîşéáïwwûWı¤†¾ı¤Èø¸û›·,ÇOı¬œ~ÿğúö¢÷w¿Zñá¹|Z–Ó5:_xùé™×ğ j_?}ùÇ¿°ä¾üvz{ş¼®Ÿı"†qŸÏO#ı+IËßòéÑÙ&mõ6ó‰Æı8Dı´²A–ehŞf9ïÁ8¤õóÎü«÷ŒÓĞ’>mœÖº»$%xOJ=xZJç<m]—Ì9O›·9hS¦æã6.çém‚ÍÛLÃ1tí’îs:Ãìó3iôï™Æ¹ûüLcm¾B&şHÒV}¬§ùƒ÷”²c°ÙÇ-Óæ=H©îş¥)ã©#šr³KJJ>Ö©,sÔf;|Ò’ƒq›‡´™‡5Ú·™mâ#:OSòY˜§%Ø?ó´uÿyjg Iãæ#:Ïç¼y¯K9}~æÒŸíy¡wş´eŞ£6ë—s÷¯ôN†ÉÇrøXça:]ïäa}%æ±$ßÁy<¿˜5İ·4î>¢9Álç¼Í>ÛyÉ‹u^úômé‹¯Ş2°ëtÊĞ‚Y@Òƒ6ãèŞ2öê³P¦eó™+l­ MŠ´e™·!h3Áœ–Üw×QõÑYÆ@»”¥ç]Û,C|Å/ã>ùœ.Óè·ešš¯%ÕîûgÉ¹mrÎ¹¥ŒÕçg)¥øz[–cÏ:ë˜w_;ëx4Ú:ÕÉ¿gMC°ŞÖœÑ5×<­Œ«ŸYk™Ÿ9l!xÏéªmˆ,¡mè«?mcøÌmc®®]¶i:}/lÓ¼ïIGpnoy
%©ù
Ù
úR×ÁVÕ÷ÜÆ€6mS‡¼ùn¬ãzz*‡™¯Ä:M^'ÆÇ{0õÀB©i‚÷¤~¸>¨sÛ}~êÜû­–qôq«å\‚1(g°·ë²•`D—½xßö½¥£³OC0¢h·æsºO%ûêİ§³ønÜS>üK÷„Âö¾¥È~Ûç¾ïÁŞñÑÙóºß³Œîİ—Xisİub›Rp_hiØ\#µ4ûÉéßÓr4_Ë=Ğ°­,»ï’VZ÷Ñiå8‚6×á¨3×0)|%¶el¾¶´@_sw·>´ÀºíÓ¹yzíÒÓ|ø.é)w¦J
ú–jöqës\ô¹öh/9°a¡UŸ…eéßsŒ-°‘”ûàÈS÷]ä”}\-vä£ú‰~”5¸cœÃÜBÏi	lòsªÁ—i,bnL›kÿ{Ôwı™kà8—ê½Æ£:nú4$åĞ±F²lºv¬g G?ÍÆaœfÕÊ8‹F÷JáÙ6ÕHæIu’ıú–Ç#h“ûªç›6];ølßã8×£ã8n+Ódğ»æ8.»{	p¥‹)¦`D§	;Íôèˆ1è·Pæmw¯Ç8åàt¾$~ã§2¹}0^Ëg{Zö]íÄ1±|}U¥¡6ÕxÅö`¤i;½iª{ğ´„ÏLG4áŞñùIóî÷Ÿ‘#ØµØ˜ÊÜô”AÒüf4¦%-Á¸-k
z½´ä+dÆÑ˜ôKça)»KÆc
VV÷SŒ3gÿÒyaõè{ğÕšI°®ó8¸·hDè*$Åç4³}¬óØwk$Íøß|¬3N©`R´B2·¶ Í<úİlÌ¸Õ¦@²¹7bÌyvV^V¿qÌ®§Úcçq×ÙF…’0H½MZ»ÏOIÜè¼ÍÌYë’Ü{Ğ·’_JsÿÛ¸phùùƒÇ#ã2-Í{°LÕ-UÚiÔïY¦3ØõúÀß³cQ›o\çì÷$%øÒu®î‘×\‚u°òA®¯W¼î®CÖ¥Ì¾v¸=nÃ|n)£³Íc ñÜzŒeÜæâ>;$=ƒ­÷øP‚ÙŞ–¾úŠ¯Ãè±œ|)°êØü¾M›Ó½ c’ÇÇ:ÏYç=ƒ:î¿k>üş3Ö‚“K÷BeUùn¬K
Îm<%íñ‡¸§Éî7°qÇIàZlÇîõógŸÓ¿g/X<ú¥mHÁ)Ó†ùÚŒkñ÷´)W×-Aßğ9¸elé\}Ú<W›ÏâgV+Cp+hD \'¶eõXÁØ–Ã#ßcg¿Ä^<Z1vbÕ>§x	?zÚë¶Ï`t¶{áÎï’%ˆ²ÓêsÚ—5ĞU}©Ó‰°¸—ÉéşñÀ“åcp¤è¤=€¸¾FœÎÇ<fŸ…#/“VUpšK9ÜÚ8‡Õ}èÊc˜t~Nâ´Ş·3å@#ysïşx–êö(x¼ÓO@®šÕ9a^Ï:ÖÓÀ•EOÚi˜1íKñãµsII§jeÌîcÕ?x©½ãx4Sƒê"mt\ûÆåÙo,xnG×;D÷­#é~FAßÊîú€6Í#«Hº[iaZ·ğ‘ôU×õ%é>?©ßÍ¦Ã£#ÊÚ}(´Ùİc>eóˆ4ÈT¬¿'a\º¤ û\²~w¦åp’Ó1?xğ‹û¬î‡E²;8MßJŒœZÄNñ(’ÀÏqq:ªeJ§[š šœ6Ø\A›î·¶	g¸{‹´¦–H.MúŒÎ ×sŞ²¯ø9Ÿ«÷†{h'Îs@¯‚ÀCÒ_£vÅ5,ØËLy¨~7CÒİs:áÁp_'’ÀöG²ùıgÊS€]ADŠ§œÖâc}I|Uå¼Ú2gî‡:ÖHğR³ïú¼ŒîïÅñÄÈé{¸™«ª‘~Ãëá×Ä.uÌ’uVû INÚ27ñ©Ì«û-‘4÷9¥v×£%—`–¼9ve*Ä}/,ÜO} ˆ$é~2-óâs)uNÔµk±eI~£œÖÔ‚>‰#€ùåêº
/y`Õ¬ø¸¼o¬LÛĞ¾ÀÏÿ3.”Ãèë-m®ÂçX5Û²ö[š[ªàz nè¸Õ™µH6·ã§š‡@STleß?5Ÿ‰œjIÁ«ev¯ûT—!˜íº4¿Nûà¼§='Æ"	¼“HNGsOû2¾âwm_½m`†t^ÑÜÒíÆıÃ÷6’À~kÓî^¶©¥ìŸ6‡ß3oî{J×İ“55@š®ıñ9¸cjK€Å™úP»N{ğ!ı¦&ÕÛ;Neîï:sX›ÏB_¢ÃØ×ß5Ò1nîiv¿Şëê^C$-¹Íw w	zPvÇuN‘H×;Çr»şDYºewsp7;×î:gŠnD$‚ÛÔ	ŞÒg¿û ÁPáÓôp«à¦séw!L»¸„¬’õ ŞvJ0 u]§ËpD¿4%ğˆt@‰êªBRªjK$‹ë*.zÉ=%H‚x’e¾”0OĞ·¥yLœÅêøQ$‡¯$ø¥t~FâèºâYÕ“ßÍHHIîWF²û­-øıõ”!Õç}ÑHÊæö4"QM¤»ß2Kòû)’y¶÷ûÓ¦¹µÁµ>ˆÏ>(£îS$§chÓ”÷²!Ùİg—@¾Ş¸Ğ¹íŸ¦¼ûŒ¤»÷8qeq”(’âÑå„wÅoâ	õâ'2Ltí ÷˜mÖ`í¤õãOg·¸Q™`’è7ñ„'úÒÔÜºÅ÷BÑû–,hJø6‚6…DZ#é’eõ¨|JK¤šo&aÒßƒ³ÕÑöif‰º›Áæ¹†çâ6,1«ÀNL3ÉÇ¸{ÌÒ\N¿ñııÆOZÛà¾+ámõuqÈû—âr¼XÔÍ1šHºûaqíJFÒÜÛJ2^	4EN,]U€Mš®4µÉ·ßğ&÷9¤‚ÛßÏî îOd '·ùR)@nô{ L»ÿ:aí¸?ş’8ªÉî±]$Av’ÓQˆiÉ²Ñ^“éî>;Àgcö/%¯úü,¹¹ÿ€\¯Ó³.8Ë‚ûÂ%ñ[5’ê>——`7®Ó\ÕZO+ÚÊwı:öÕq[ÉáÚ€Í‹$§çò`ôÖ`Ï‘ÿÓ¼xß‚Uµ]–ˆöz›·àtŞğz¯ÉËñ;-î‹2ûŞµî>ÚD_Z/³S{M¾Œß³.Ü¼c¿T÷‹!9-VÙ"ŞL
×Êä±ø½KlvÔ’ÓïfÀS²#¢~ßN;dÑ^ïåtOcjC”ÈIñx=7ô1Ø?Üİİ·AîâÚ·6İÛæÀ+•ğ¤Í¾F[NîEâ¾ÁÔp”»%D;ĞñœÁÚé\„]'bU9f!õqN™>îmÅvßÛ[õ¡cBÅ½à,{›ùt$Yêyö\<\²¸œù{J;}NÁP¹§èÙh¾câÂ«ï9¦5Ğbø€õ],5°ãOŞã§ãœç5¦ÚëcÙomø±<F	qX?‰AnœyN¦37÷©¦³lŞ91^‚÷àõú¶ìÎKNÜHºFç0T“ãG‘$·‘frEÃ„„ü\Q$»#:\ €íñøÓ@½êlÓ&»ğ’x’î™Ğ3ğøª':yvûIñ |p–Ì¤6º,~ÎÍäJz	O7BmMšÉ¾ñ“v&8æ–óD‹¯7$î¤tÚ·iªî-š§9¹o}Æ‡âL6Hšûù@û“%­=Àô\Å9•6_ÎšàiÌv$	n3‘6·ˆ‘`]z¯ÑH¾vÈ:ô(ÜœJp3š¹ 9¾,ê<¨®B’İË†$À0îİ9Ïiu›|—İã´—Ä5,’îÖÆœ¹ÎéI‹¤ºõ„û‚Îèª@[æ¥û'/‡ÛñsA_ûœ|B®ù
è3×Uhƒà{
i,j	u>ı¬ŸA3øcæ^èë¢5Ñ·ßp	aöéX?X½×¤z‡«s°³ ßñØnSò¼DIÕ™—ÌÅÀÛàÂp} u†ç¾Ì—açšœl•ÙõÁÏ%+öµ¯ª¼˜ïíu\ı–ƒ¦‚²¦Ñ³Î±ÄHÓÑYÃ±Æ=-O°hF”Ç©Â—³»äˆ[´9İV7øÅ|D7ÒB}…läµùÌmiÎí-UtAl²®)»qƒÿ èä*‡ÎÜ–›G€9ó6ùÎÚÊäñ¼;
z úÙµË¶4G&ğ´3°{+ Dï¿Ip¼û3|(7›ÉØ	ö)’`€uôLuÌTü­:ÖH‚]_Ë6ûüÀ¡œYWc0:È'í™Aİç‡ó"ùÓö±úíi,ØU<24ïxD|7îéğøö¢Ş}²ö/%WÄ×èÎèø®ox¶}PC7°ECáî¬´6Ê()Ğ!-ò8¨öïD_|¬û°Ú¥A\“s–IÕ±îcu_4>Ğ1=˜J`[vy?ÑÉMòH×LR°Şú¼y,‡65°TÉYrämx“D6ÁèdÜyŞ&“"HN÷ÃÎ½Î=š<` bµmÅ{ RÉ‘WÄ¹@ƒjß¢å¾e\‚6À^ı<Ìøl#q†&e	ißÎëf éQrò}Øñ>ÛD1K•ˆ‘#ğMÂáè}#6äw0YÏ"K|qT’æ&$gpbœd™Ş7ÎzÕ|WŠ€ß5‘\¼HŠï$›c².ï›§—6’Kâ'-’yÓ±Î\ô|]#YçÑàV WÚä¸uÁìÚIà¯BR=ò9êÒfŠæØˆÜßubá-Òi^sŒ•€c~ªç}ƒ¼#xÏÄ·¯ÏC&Â‚;Bß3]÷œ@²ùmŠ§UÇ˜AªKª ?m9fÕäHa$!Wİw©Ë~Êd QîODØäL¯~6"	è¬A—Äõhæpv?,’ì6îS:¢)Xê¶ág#Y`‡ó¶f¾"ä_{€{ÒïL ˜‚ìB$“ûCÀáïÁSHæÅmÿŒ[jW»7“õšë‚k>œû«¸¯ÎÑMd³"Ù} 'Œûğ/—`Qå@8 7¿›!©ÁÍ¥ø-'ç²yt­º§ä²ŞÜÓˆäúFàÛ1ÁÚ/·6HÃk§kö÷[ò¡ÚæÊgŠ$A0€\èş4î€Ş7xd<OGÚ¬x|vnİr1ËÁ—röhy^¹å¸V^‡îÑ1¬Ş *„‘Ó1€'ØYOÀß“@‚ÃŸ6õÀv¡İ­´“Û°yÅâñÙ^34oŞÖÚäd7‚nÕ6xÙ<>;c’=xÏ6§À®KçŸ|y¥\'n°Cø÷€rŒ&é:-¹MÒÃ#¸¹N“{‚såÄğÙ®xÃƒ¾Í%°Tñ}ù­š<Ù#]HğŞêÌÁ=íùL°R÷ÀR­ËêX]²ª[`‹Á<SıK÷¼?íÛ•‰¶’Ã}O#¦‘DV,½Á]fÇcåö5¹pa	=FPÑ"ï” ˜ı{J­‚O7`EC‚¹¡Okğhê™6Çì+±§ûã3,;å c3Ùä
ÑµecõúJ„KÇ}À	·è{¨œ¼§£¹Ğéè¸áó¨Uîãâ¸4$»³ãå>eÏèEäbçN²ŠÏOÇ¸tıÖY£®«¨ñã¬¹ƒ„ñÕË>ùüP±!8³dş´cxİaÉ¢8„Î±XGäc"ê´©?…tŸà··I›3#Ğö³ MVâ1—¨óî~ò|à!uÎÜ™­òAÁWïĞ%Ô`
ÖÎ9lX#kwnç°‡mvç¢âiA;“«èO$Õ9¯XCÛ§ûn/IpË9ç ’ş² ×
Iv¬;’æ¬‚HºgìäÿÊ¬ëo^`A"	|(`…ñ	Š¸z®U!…Ã£"H‚ó+1@£"ÉŞ7$ÕùğËÀ¬ê^(øÒ<>W€óº·`·jìn÷"in¡=˜º
Ïû µúl#9ı¦Gs›ïšQ·Åø{ÀÊII wÊUXKÏÔ.[‰HVÏl@Üv»¬¡…N5yôåâjv¿åEâ‘âKâö(’æwgâŞìú¥¤ôº[®Ä]=çgC²3w¥úX“§çqÚò1ñĞ{ŸO­hjGÏYÅ–?VšàKamĞ{#QZÒÊüiKP½ŠÌ¤ Z^®Ja>:dÖù=ò7HçµHüVM›âŞ"$Ô	Öİ³ ]pnoCì0àfŞ³Œ]Á%Ô+@‚ãÃ{eiC¥ä!I~:CÔ*£–CõìvÜUÉ}ƒHv¿/§>:²çÊ`wôséØ<Übøuutğóy$…6dWx›‘Õã’);J$<Ş&M^‹6­mÊ¶=(G -!=ßÛô%µ~en´»Ç(¹ÑîÅ)ø=S	WTbpÁªZ°Òü{˜Ôôf„Ï#`Ê/tK®ÅÖa
Nğ|~kƒˆª;<Ÿ£t¨RİsŠ¤5Ÿí•;®•áarl^Á#ä™eå~è#º–X5H<×ÖıÕQaÜĞVN$A¦zÙHH÷9İÒáÙ «(¨«jË“gÙ ¨øŸì™ ç Dô=°\{ª€r¾çòAVö¨Ûo•ıãú­ÂïÕüi`Wüd"ïpt½S	I_J˜ÖÇ6ÏM"|
Ş<ÏÁ²dDÂ¨_ºC“åã¶ãârKíè²İã\@¬9Jô’»ä¤ÇiiÓ{\¨àå˜
|Hàll”„ñ™CØb”k¼†Á¹ Ê-°1	×½p•úflç)p^»¾İoÕÿ›ÇY àtUu|Ïõ%ˆ–“iµzög¿Êñœç»ã6`İêpÀ` õ¦<¤zÉhª.;v²œT¿™tÜN ¹nWÁÿãx1JüTçL@Ò<IPA²pwö(²ƒ˜+5)Şaß$aW—ÌÁl_e8IFBPSIÀƒ±§ç+	V¹÷¢yŞk÷'ª`›èÓÀ{úm
^¹¼M¢ïR=e@EÖ6d¼yT„ÂµŞ14.ş4xƒt×Ó&àArº=ºîMÌ^òŞƒd-‹<%HšŸõHN×;u†Ÿ%—Ä½“HVÏÔ@d6 iÁ.¡®‰ûìvgp\pWy´Iätí•´ä':’îÑ1$‡ß
¸KA¨sz1 ùêÅŠ÷x0—œ3èÜ@Í5¸Ï;„¥¤úİtâæQì‹ºÖ}Ä°'Göœ‚q²æ·‚_€cq´ ×ìÈ5ôİwùÉ§k> /nSQ°Î)®`åP®:àG‚¿(xZqmz°ªpÉ¸·ğL4yv¤v/©pÙ=Yà,p•k¯ÑÖ´ }¢œŞ&òls‡ÁÊÛP'Å%ÜÄ=Ê¿fÖõ:A«ïYqzûÉ´â>öÓÄ\°FAÜ¸ç”(ÆQƒïAWùz£¸û6–•ip½³’çª÷9’5‰¿èløİr ûÔı°hQ
ŠûÓR¤A¹Ç:JŒ.Z¡ˆX ÁîŒ$y †ÉIçmxSURa¶òu7ßøpB•_*Éå>5­îçãJ½ºMNeVş½×T÷]È3,—ŠWÈµe…H-òiƒïYv•‘#$/IpšíĞ]øÆçàxX2¤9ÎttÈ’óÜ1Ú¾€…\8GÂ 9<.³ì‘¦÷ †Ÿ¹Ç©ï¬¦;?K@‡DßC…ŸS¸¹=NŒö›Óo`MîY w:{¡úqHï ×°E»¼6gÊ_úHF†~O¿X	ÕşÉî™¥§Ã™l.û¸tU³t“ûìl} g¶ûP–ƒà²Ï)ÌØÁ}şí@ûèx_£ÔÏr¿õm®d$G`+S?+ùÌqó<	hE(èª3G¾™{~˜“‹Ã©@nƒ>æ¤@[âÁp<‹²UZÙİs
«{P»IsÛe%sËù‘?m= ğæäŞI‚"Piz–µj1Ú€´Ú³•¤²¨`´>m¤Æ›êh¸lzjªë
¡™®Ş†è²sÀÉ§`Dáòh°‘ ñ	ì$ïÁ VrèÍ 8=ÈòY§Èr€P6`È@’}]#Y]S !¯Y¿‡d¯I‚j5˜äA]$ÍoFdÌn¡ Y=
‡?::IVYX-‚Ès‹z “š4½nÜƒ]Bõ*¿å¬ÄF£Ãüø†Èmå¼€{u‘ìîe[¡8s\¸u…ÌSm¾çæ	ÌtĞæô8¤©§û‘Ö·”ŞÀL+·z¿ŸR¦ªoï¹œÁ—‚uıv»?è¥k±‹û9hCôÒµ%é¹Î ~GíA!¯$ºW²˜É#)\)Q¨ï8èUdVà~k»$®¢€JÔ¬Çè= 4ïS<2Î—¶QqŞp$Aì}-Üìıt^Òsµo8Êİw».ğzøJ\Æî,WúûwP¿Ê{ªcdpSìÆ×ødüiğûû: ÄA`0~_¯Jã¾ç¨’å÷àu…@Ë×¾'÷_Ó¦:IĞkÌg¿Y×qöx	jDé¸]uº\‹­$Rºv¡2ûW°
[·)È"Y7xó|õR=+ĞÊ³´vä³À[³°^@¾vjâ"ªãVSuVšn Ï_X+ ½ ©îİGÒ­…ät?ÅºC\á½&£*°ğ`tï@ÑÓ¸.m85}Uíš|¬Agøİyİ!Ñ÷“i'Â<º±Eg„ûÖ\Øw}Râë¾èÑÇ‰£ÜÖwEğ´Ò;±1ñ/çìŸ>p9Ò1ècd÷^ÌËAêåø,PÁË^+¾÷İ®x0cvI<ò½ò–ì	vX!¯dyfÃ%ñÛ;’#xÏ1V÷²­p2»w…?SğVg¼c~Öƒ˜¸ÏöA"¿ŸÎt¾záŠ	ôÛABº[vGéÁê%ÿ'ø°ÁŸ»ûìVryı¼¸ ]»œ$ùèÉÜ$Î2{vÔ
¢ÃíÑm H•®x$A¾&A‘€»	ÌR¶6Xi<‚‹ïº¶á–å¹pÛH±%Õ½¨½¶ëşÙ @x”Éè,$ÔYğ¾•Ãïè´9İâ"Amp¼"úJÁ;B’´aÒ MóÓy#Ø×T+oìßY×’ÀÙ tuûIà³CTôƒ2Èˆß8˜<+I×Dr:Òœğ\qŒ[ü(Q€0®«hƒ%´Y¥ÌbsêM®gş´ ¨6|{¿$‘H‚Àî'Ó6«c	6ØÅÜ²Crº•Á¬ëáëmÆ!âëãÉ£c€6v·P.‰GÇ Õ€$;'’ Í}Éä·C$A}ÚÊ©@ïÀ÷á7°/A°O3	‰®Cxô…àòày»H6$A¥#’iá|×ÕK>÷Jm¸Tƒ^s¥ô–9k€²Ş ;	õa½o¸¥ü¼’lü4£ĞÄ¡çö»[@êIªÒ`í8Nˆ2ÖA}çmÁ}à'A‘à,alÜw»]Ü3®ù®PµÎB<É%pÏ8·ı¯¢û-! :m	'³ß6t¥g¢m8xœãÉîbÛ6d’^·Òı¯s
>$81P¾Î‡²]ªÂçŒgóç=X×yç¾ŞØtÎÿF¢¡ş=˜ñ¡ÄÑZÛÆ
qkƒzSÁİÀ”_UuìÁÉT#oë†×Ão,[%™Uo,HöÀzª9ğ9l°Å¸¿j«W‘7ÑJ®ˆŸs0f{ÉFFH°zÁ`¸gaÛ©Èâ«j§d‚5¨èÀê¤¢¹#
IÅ£:«~éÁ¿kK8Œ=–CÑX¨[õi ù=Jôæ'`#jI}û{°ã]B…(ÏŠÙ`ÖrO#
<ë{c ƒ°ß57Ø€Õ‚:7q_‰»ÊWH§XÍ¬OCïy´b; &øÓlËH‚OÆßC…ß%!=×½WFH ¡dĞƒ9àœß`¼¾.6_£ğ÷ÓÄ[5'Árßgä¯Ú¨^å¨äÆ]÷zlgT±Éx	Nâ2IççÄ´ó™#WÄÇ;»ëÒO·Ö+La~ÊÔs]­4ÎV×£õ
éªBB!ûRÊ4
$MAXn¼ÍHÁ]—Àª;¸âñø)˜êıiä‰=(İ}Şu¤ü¨®Q$“ŸèuÂÓèm¸Tû^ 
TÀ«TÌö3hSà¹$îÛ@Ò“EÂèè$”TÒ¥Ú“{¶+ŸÌu&ü¾9^ñ†épä"Ùİ"®ğùŒ<ıBüB¤M÷,F$g°HÅÆ Z×ñ„HÕ{ß¢»&A« ‹ƒ$Ğ×—dV}!Ä8Úœõ Msí³wvmYñ¡x'æh€çC‚×Îû6S¦*ìÁnœ©™àú`ÆMà:‘DÎ€Œ‘BsŞƒ… a 	°º•Q0ÖÜĞõZ3H%ï5yĞ›„à ñ<íO^Ûíd ˆäœ¾ªIø}»ÂÉé1½
0Î=è„½!×±Oáxè
N·ì(ÔØÃŸV‚º¾$ÄCO§mˆP:‚ëÏâ¹HºG}+ì‰­ ì0îÖu=vˆ¤vÀÁ`t Œy<
 ‘˜£c ş 8ÑW.¡®•‘ç^å`’èÖ`EõÇ¶ïà•d+ŸSÎİTWòôQñ¡' ¯×VqÕ;2	g“5•¨œM›6Õãf'±W¬xW}$°ß¨DU‚1`7ÎŞkŸZ ‰ÎÆ­4öUÌÁÙWb%OÂµrÅ5èöhÅàú æ-°ìP/î5¬lnÏŸ»$«”8ğ¾èğxcÑáõ+™'Ç¨à6Ûe'ÙØgn-ìûggíø¸±³cV÷X°®ƒJGş´†yíû”J>~¯Ä…¾Ô÷4b»$e÷×†áômîî©pãFîK`m€—4_»2õ{B¾ÛÚ'@¬Ş$su	H2Ÿm2Ü?Z©ÂäŒ¡—Ä9ô‘q3Ê]Ä÷¾İ]²FHNÏCFU•¸è
{‡ÇK 24Ü7Î,_Äøh¯‰¼{œ¶âñö|$AÆN=¡·ô÷PÏÈ}iäWp:Åğ¸s¥QàÀ‡â¾Á
›éêúà$ ¤v/Tã’y'®êÜ;dÚf¸$îGBBõv›ŸP²g i‘ˆ¶ÚÅå¸µ"IP'e§à•#‘«êø}'GÆ!	2,‘÷m$â%ñÇN‰k÷#ÙüÜFjNÇšİ~ÒDÏiÜGüşª]vĞ3Î@’İ³¤º¯Iós HÀ€Ê¾;. I`+S¤’(6}÷u İ“cæö‹$>h‡Ï$‰nWíä9Iõ³IÀC‹Ó%ÈßÆÜ	¸tvÜH¶Grø	xIüüÙÁÕÚ·)v²$Ü»OIÂV:s°=ùM|‡§Ä-Õ4#G 9İ½ã‚tÏtÈTyÓ¾Á`â'à ^(A¸Í}·PÅàgó÷äQ<múîPgøm
I€ÚóÄã´ÈÀwV ´Iİóø1¯g÷N"Y=¯ ‚v Ş7*´{¸Õ{ü”°æŒÛ…6ÑÛ;DwÁİÓpO’À›GáŒ F"’ãPkp¿Jaù
Á	ê¬c);©ãÆrö6¹/ö_ÈöÑAâé$Şsz.X˜Kpúœ‚³ˆÆ náïKéÁ>ec9òŠàVÚ·u€ÈÅ%cà¡ˆ  ı Mp3¢Mw/dB¤
úÓ¨¶á#Š·Êë^îğ©:¶ˆ’º·ÉNê–ß‘ C÷¾qv-kjpÖSİoÕ  O÷ìå\]WmŞ§ök°°º÷ó$àë¤¼çµÁéí£¯¯óïìÜ4›‚À¦ßeœÁŞ&æù´
œ@::À¥Ï\Å;éç6yglÛáawÄÀ;<X‰æ¤ o%à«ÙAé8f‡5ØØ}€·È³°vMç:BRı¦·s ¹Ç	):;¸u_½;eØ}tˆıGßC„k±ëkEšÜ"Ş—İq5û¾àÒïOÕfvò™Ü‡‚”™?n{ÿYº|,¢Úqôài#åŞÁû‰Ñ)Zäc ok`qu¸M¢6‡ó` qƒÙ]GI°:g}Ğk‚”¾ëá‡lKê3yäaïÀ²÷­dQî}©ì!í~vL#’ì5â‘ôèicÀï²SzMD¯ù£vbà9 MğU…_Ì3®wõQ›¨Şû~€øôµC¥#Ï|Üñ~=8!ñÛ.U}=¦·ŸålØóâ˜±u Sq¼ËEĞä–´(L ´×€‹{[Û@e]£”Ÿ#wKßCíDçïmÄ½ıÆd}8~Õoï›Ï’Ó¹ ¹0H†&$”ó/]6ÇJx¼“«ŸšH0ñõ=°Ç{ìjnàÏŞæºî¢»¡D#L¸Æ¼Õw|…à}óŒ·F·,šÁ÷$¨öü=éJóÑ¾¥ÔVïu‡â{`©G—)
DÒßÃåĞû6{nCrzß.<…İ´óXİÀQ?ß§s
¢Šm‹[ƒNY¿å4êU:d¦‡¯QbŠ¡„#Ã¿nE7‚—ÎŞA’öô±ÛäŸGy ¶ß<ÑH/ñÈ7’ê3$İ³õ•tÜlÜ‹=
G®Ÿè´™³¯xr ‚³ª~G½’dDN•Îö–c=hs«¨a ¯¯âkj‹µÇ÷ySîÃox²Üö.@R¢ÏUm)’x$òë »ZÃœš	ÊŞ €^Q¶-øa]S\IŞë…Œ×–ø«{L@úğ¼ÃU²£g¼+nû“ÚAiTQYßÈ¨r;¾ar|"’ z"JÓy ¨¸ŞÉı1›ûÚ6’ò¦ïA2ùl“¼X¬P5jßx´¢‘kœ§¤X':Ş·ãé…Á	xÕËñ•HrŸçg5*éøM¯iwŞ$G`‹UXï½À¹=Æ°•tV$Ë¡Íê‘‡vÁ’İ®‚aÆı£­Â˜ô`ªóÑ¦#z!•ÜB©eætêàrßSÛÇ3èõNÚ®Ş³Üµîlœ³Î‡‚$`£§`P€-¢49F…OYc­¡=›	†>+˜g¼QJªü M
´åusØ`+z0®Á	Èµ ØÛ-õ@[6LH_‰"}Qá1£†ÄQHjÔëÔ’£ ÚXvx¥<ã­
ìx"®Şû3ĞHü^E£l\×H°ì¸g®Q<Ğş}=éªê„XüŞØ©ûâ¶ÿ¬Åû†É=€n¢œµH‚Õ{ 2ğ½p`¥ùppãù	ìÄƒÀsğ=Tnòqã$ñ¨|;…ºu3O°zÉ€òÜ
À×p÷ù¸åØ;äœ»ñ($ÛúÓJ¬€sØ£ [‡ HŸvøê]B•m×°'+ŞW"¼ÇÎÛ¾€Â÷ …”÷-â÷oç²¹%tj_{Âò¤ºå =y°ƒ‘Kñ§Í¨Ë@ÒœI€+AÀNŠöæ–#¦‘÷`R}g^"9|%vp\«F ã:¯qØ)QŒ5—wÇ	uòôG†k Ó¾·û~GÏFèãwşwˆäô¼6ŒÚTSôD=µ«H‘v)Ò¬é—&Œ'Õ!=áÂWÍğwõ{}§Š³{ ‘ìÁº¦¦n0Ö‚9b‹s ‘‡Ï)%ƒëü!Èfå mgêeøj~±NYw÷Èt
t¸$ääùH6÷†C›Ô6FÒÜ×Ù9—ülÄìŞ²ë*°+
£€åè>H(·ˆ‘uI;,€Şkrø.@ä…BÅ9ğiÒ]BF•{Nû:nï©nP1IqÔïv¢ŸL`úı¤íÔ$pÔQ_	kúŞ^Ñş§÷`YÙŠ§˜,$ó’x5”Nm"÷y#	P-Àï§¤¥@ómT RÛ¥_)ñ®ãaeknàsp„>0¥âq3$Á]“‹ÛDg¡N[ ğ9ø-JÎ98KHÜÎFw­[ŒûßH®ªq!9İSÒ©œ€•»ŒëçİOÑ©åãé~|}os/òÚæÏé0¹…ß…+ü=P¡Ò	y}k~ö}JˆĞ=Î½EÈE$@³uU]¾€à=W°ÀÛ ]\WáŒÎm$Á	ˆ$Ğ|Ôõu_MÇğuä˜Ğµ×d.;öÜ`Åc¦9ƒpåßü=›\çÛ |ƒ§»keP 'rèy9ı€aÓ{}İëÉüLûF¦“3ÔöƒÄ?³.ö\×½°çc@ıÿôc4,^K÷‡ô#ƒÒôïÉÿm TÚìÎ·A›Ã™E:ùTïœ$Á^8‰¨ù¹@uåÀR=øœ^¹V~ÎÁë•ú¹íO&¶ï9ˆ“H”°qc!Â8è²èµ×¸«V×–H<,’ÀO‹«ºŸ¨ÔèQ+$A$‡g gÜç€„2£>N%äZ9¢ı Œ€ß‘°Füi\6uoCläØÜ~ºîm$Ám—dÉ At¥Qzæä|Z	y™ú=DÍü^½fp—A²;"Š”¿ >-ğ7RB¼&À@TÀåAtoC%DÿRÒ·İƒU }i`Ùg;Á•ì+‘.~– ÚÃñâïI$¸dN®C 1jw Ùœ=—RrA&4’3˜·]ò™f=ƒ‘À¤ß®Æ³²rœ3I+‚$¨«ˆ$Ò.sáúì}»ê©’ÓïõGÆƒá+€¾{¿
ş:Ëdr©Ò‰àŞpÚtGÁ™ÊZş=`d<Óé 	ì’†V}iPèã—Ò^#q.Ä&›¬·Ã£LA¾3’ ’3ê®9ŸJã¹¿÷¸è6|]_Ì¾®)Ê¡©¬'ÁÓ àã¶œÕ|@ïŞ$lníYÈÁŠ_°-ƒ6ôïÁ_åÚc0æÚá`~¨Mäúƒ\+÷~àvüp:”it,ÁA™9ÏÏBÑ¨?$Bß§hªè=ùğXÛuí^©ã*Xà#ºQĞ\oü´Ù<N‹äfáÊZòïKÇ}\Š ©~×<¶ˆè€¶Ûík$ qtà¸	Öş*Ï¥¬ãà(x$xÊõ=0æxmZõ³lFq½ƒ·(°] 8ól•£Â5îÚz/Ï•'Èt:2î î²ßŒ=Âï !­YG„ŠóÈ{j~C>ö‹úßŸFÜYom´9ßå€ã:˜Sô^(	b,ÑÇ`¬7	ƒF	Xß? ‰r •u\’Å=õ€Kúm¡–µè¨õ¾õqwFd’øÏ`×4òØîÑ0ùş¡Š³ã)ÎÍÈõèŒ`ÿÀ:éñ’£/K"’â¾èãªä;‹,ç$;@u:_ ’%°¸ E= °ê7.ÁœòxÖÇ£Ë¸çù9à¸qÄ4’ÈBá~ì¾´ã$óÄ¿çLk÷ÄydõìÁz;©òãÚåÌA.6!Å ëüÀ¯íÀs€Pw’ Ùƒ„ü5Û§çåøQírÑy˜Ùüi¤é©y„pÕGÕ?m¡ê–J`wqŒóye ©m‰„k“?òsA›rº}}p/(Î¼ RËIfGºì›„¨ªö¶± Ï{›™*.·I0­¼$¾ª`öûÁÆÑ¹&€#5(¬ƒ$ou_Ú%qMÎ¦9.\ıR¶‚GÇ.Js×|\«×ö:¡èğÿ%q×‰?Äï€P§“Ö^Ãßë'4«Ä—½µ?]»¼æ™s¦Ê‚ïí™ò2¾ªÈ3
zCÆÑ›8Cà=\ô<’ÂtìõK3é%j»œ°®¸Isí„ÉÓ÷\5ƒô¬§4KŞÛ ƒt­\Êéñà‰{œ	€Êò÷ qM~±¸øª"nçş7ÂäÅè{.Íê´˜Î’ `ÚTÇ­C^T¸A°‘@ZpB‘»dñ;íyqşúˆRíĞ³äNª³ßÔ-ÕsåÄğ±^#¤Ò‰gÁ}5çšƒL'’·)%ª³ SJp– [<¦wRbÚ}Ş”XĞ¨'ş·ìNÊú=ÉhË–D×x	‚uoE°¨h$0 vâ?ğh¦Rk$§Ù/AhÚUByŠà\¸Xzı¬§0B`qQ.ÀÎ
°Çw=x—Pò¿»÷:S}À%TÖr=
o`óUğ‰¾O©Õì¾h¨‰¶àKw’ä\WÁ®âø²°àK/*_£dçOÉİÒÑi#×3—ÀÆè#Jå`tZ
òiO‘ƒ±n« ¡ËÈ¦ ñğù!WÄqv'8”İW/±å@S€CñòIE%ç¿>;ÙQ~Ö
v‡vPÿwõnu~ˆÒ÷,`¯›tâ§lØNÀà=púzÃc¬Q¼î<Á‡$¹"Ãqs-Ş7â5Á½‘«‘cWNLï o˜Ñ9|Tqvö’¸%÷Z0:',°¶I^ÈÎ™æ©8wàÑÈ2ï>ñğV6óJMÄ&~½ªŒ¶””Õq¥ÄËº.Ä¿#š~Ï+@"˜Gìş³tÈıq^}ûúÃËÇ§»×O¿ıÛ·/ßŞ<ÿø‡Ç/ÿ:îŸ¿zûòO7o¾yÑnŞ~÷xwóÕïùÅÕêíËïÿ¸ßİ‘wûıÃãí_J¾}ÿİáo~óIğôöæÍ›óñæÕÁÇÁyûòõİÓ»~ûıÇÇ¾ùıÍã¿<÷ó/õ¯¯o¿ÿ_??ëÕíıóíãß?>¼÷émoŞıãıkşüåu$§|~ŞİıóïîŞ~ùûÓûï¾ıÒêşæñ§¿½¿ı¿ÿôx=ğë_†çÃËçoßŞ^ãó»›û¾úğiŒnïóoß¾à¿noëÓİÍ7/şãÇß´¾ZxùêÍã·¯®f¿¿y÷îîc«ï~¿yñæî‡ŸÇ«Ù3ÿõúæñÿã»¦Ï²é£ŒÿºdÿãæÕõ±üúó?®|ú'¿úü_ş–¾ü-ıò·ùËßæ_ş–¿ü-ÿò·òåoåúÛ?½»}|swÿÇo^üüÏëïß?¼yóğáöõ?ü"ÿÕŸ>á‡—O·ÏÏ|üÓoÿ/PK
     ‡Nâ@               word/theme/PK    ‡Nâ@3Lˆ  ;     word/theme/theme1.xmlíYMoE¾#ñF{oc'vGuªØ±hÓF‰[Ôãxw¼;ÍìÎjfœÔ7Ô‘õ@%Ä…*µH”_“RTŠÔ¿À;3»ëxM’6‚
êCâ}æı~ŸùğÅKwb†ö‰”'m¯~¾æ!’ø< IØönúçV<$NÌxBÚŞ„HïÒÚûï]Ä«*"1A0?‘«¸íEJ¥«Ò‡a,Ïó”$ğnÄEŒ<Šp!ø äÆla±V[^ˆ1M<”àÄ^¨OĞ³ŸyñÍo-—Şc "QRøLìjÙÄ™b°Á^]#äDv™@û˜µ=Pğƒ¹£<Ä°Tğ¢íÕÌÇ[X»¸€W³ILÍ™[š×7Ÿl^6!Ø[4:E8,”ÖûÖ…B¾05‹ëõzİ^½g Ø÷ÁSkKYf£¿Rïä2K ûuVv·Ö¬5\|IşÒŒÍ­N§Óle¶X¡d¿6fğ+µåÆú¢ƒ7 ‹oÎàõnwÙÁÅ/ÏàûZËo@£ÉŞZ'´ßÏ¤g›•ğ€¯Ô2øÕPT—V1â‰šWk1¾ÍE È°¢	R“”Œ°eÜÅñPP¬àU‚Koì/g†´.$}ASÕö>L1´ÄTŞ«§ß¿zúŞ}rx÷§Ã{÷ïşh9³6q–g½üö³?~ŒşxüõËû_TãeÿÛŸ<ûõój ´ÏÔœç_>úıÉ£ç>}ñİı
øºÀÃ2|@c"Ñ5r€vx™¨¸–“¡8İŒA„iyÆzJœ`­¥B~OEúÚ³,;âFğ¦ ú¨^ßvŞÄXÑ
ÍW¢ØnqÎ:\TFáŠÖU
ó`œ„ÕÊÅ¸ŒÛÁx¿Jw'N~{ãx3/KÇñnD3·NIBÒïø!Şİ¢Ô‰ëõ—|¤Ğ-Š:˜V†d@‡N5M'mÒò2©òòíÄfë&êpVåõÙw‘Ğ˜U? Ì	ãe<V8®9À1+ü*VQ•‘»á—q=© Ó!aõ"eÕœëü-%ı
ÆªLû›Ä.R(ºW%ó*æ¼ŒÜà{İÇiv—&QûÜƒÅh›«*øw;D?Cp27İ7)qÒ}<Ü ¡cÒ´@ô›±Ğ¹ªv8¦ÉßÑ1£ÀÇ¶Î Ÿõ°¢²ŞV"^‡5©ª6Ğï<ÜQÒírĞ·Ÿs7ğ8Ù&Pæ³Ï;Ê}G¹ŞrçõóI‰vÊ­@»zß`7Åf‹Ïİ!(c»jÂÈUi6ÉÖ‰ ƒz9’âÄ”Fğ5ãu
læ ÁÕGTE»Naƒ]÷´Pf¢C‰R.á`g†+ek<lÒ•=6õÁòÄj‹vxIçç‚BŒYmBsøÌ-i'U¶t!
n¿²º6êÄÚêÆ4Cu¶ÂeÈá¬k0XD6 ¶-åe8 kÕp0ÁŒ:îvíÍÓb²p–)’H–#í÷lê&Iy­˜› ¨ŠéCŞ1Q+iki±o í$I*«kÌQ—gïM²”Wğ4Kºo´#KÊÍÉtĞöZÍÅ¦‡|œ¶½œiákœBÖ¥ŞóaÂÍ¯„-ûc›Ùtù4›­Ü1·	êpMaã>ã°Ã©jËÈ–†y•• K´&kÿbÂzVØJ+–V ş5+ njÉhD|UNviDÇÎ>fTÊÇŠˆİ(8@C6;Ò¯Kü	¨„«	ÃúîÑt´Í+—œ³¦+ß^œÇ,pF·ºEóN¶pÓÇ…æ©døVi»qîô®˜–?#WÊeü?sE¯'pS°èøp+0ÒıÚö¸PJ#ê÷lw@µÀ],¼†¢‚Ûdó_}ıßöœ•aÚ|j‡†HPXT$ÙZ2ÕwŒ°z¶vY‘,d*ªd®L­ÙC²OØ@sà²^Û=A©6ÉhÀàÖŸûœuĞ0Ô›œr¿9R¬½¶şémfpÊåa³¡Éã_˜X±ªÚùfz¾ö–Ñ/¦Û¬FŞ ¬´´²¶MN¹ÔZÆšñx±™Yœõ‹Q
÷=Hÿõ
ŸSÆzAğàV?4haP6PÕçìÆi‚´ƒCØ8ÙA[LZ”m¶uÒQËë3Şéz[[v’|Ÿ2ØÅæÌUçôâY;‹°k;67ÔÙ£-
C£ü cc~Ó*ÿêÄ‡·!Ñp¿?fJZÙ´öPK    ‡Nâ@&Ğ  ÎÖ     word/document.xmlí]msÓVş¾3û<^fHfÀ±c'oíq–Y–íú¹£Èr¤,i$9n`˜	t¤„…-í–Ón™nax[vºË„$”ƒå$Ÿø{®ŞìkË¶K²dn3â—«{^î¹ç<÷Üs>øğ³2[ad……\<•HÆcŒ@‹ENXÊÅ?9·pt&STJ(R¼(0¹ø*£Ä?Ìÿö7T³E‘®”AÁ‚’­Jt.Îªª”˜Ph–)SJ¢ÌÑ²¨ˆ%5A‹å	±Tâhf¢*ÊÅ‰Éd*©ÿK’EšQx^V(%nWnM”Uå2¥*	Q^š(SòrE:
£K”Ê-r<§®ÂØÉik1¯ÈBÖœĞQ{Bè+YcBæ_Ö7ä6*k|sÎä€şÄ	™áa¢ °œÔ ã £‰¬5¥•nD¬”yësU)•i{M²ÌÉTDÑ°m8f/•yƒH¾©¶èf@|kÜ2Å	öÄFh«RÉnL55M¤ñÈ©¶¹wåí¤®ßM”`I²@NÊbE²§#qƒvJX¶ÇB+»™%§ÛHSú míŸe)‰±§#)…Š¢Šå9J¥ìq«Õj¢*)	Z0IÓêK¥'à­Æ—â±2=µ$ˆ2µÈmÕT&VMMÅĞ‰çÁv-ŠÅUô·¤ÿï#ı¥Hº«fy1drŒ¡ñËÇ4
¥f(EO OËÆ—h‘eøÔ
Åçâéôƒ¾¤‚ıc
è½\\e>SSö‹ç8AÍÅgŒQ”óöw'­W
ŠıÚ4zmÂ|ü-Õ§kN`QŸ6……$üggÖó0íü¡±qô@Õx¬Nhµò‚(¨hz¬NâÆ	…£ŒGy<“Úæõİ»Õ67w¿~TÿÇ«ú/ß`CÜ@3‹¾ƒeêÚÛµK#A»š$ì±)ƒŒ9¸RaŠíïú­§ùh½õ¥øÁÎ1¿÷æ–öå#L†ïÉb˜Ñ»OŸÖ6×j›µ›—ëß¼x·s÷ÂEŒí–¢˜V¹›qvêÒcdã×v´¯6´ÿ|__{8*ü¥š­ á€È£¨öÌ‚Òòn“ı‘ö<9ƒ~Œİµ»§17w–[byø£Z»ş*ÃóbÌš¡¨jşB•+ª¬^{BGz>3;•ö*ên8g’Ì(Œ¼ÂÄóÙX`„ŸMæg½',ŸN&#Â7-;c¤‹QBô,Ş§!	=Ã7eâyx¢pùB[¶/ËÆêß¾Üÿö¿c†7ª½yRÿâìåã±Øşö½ç?Á'2-FŒHÆ/Él®7KÆÉëÚÎÍw;ÚÍÇõûğŸvŞh~3ËD6>ÈÆÙ?‰5–&K‰ËÒ>«R2rá¸b.®ƒPUçÏ§ç?=}êÌMg¯9nï
"|ä!w l^(ÚtéoX‰{fXµbÁ²=
1_‡ÑAWšW â« eøİaU "SrÒË äTŒikûk?ŒÇğU@¶¶ädi÷î5oå1íŞ÷{/>×®¾ 
Ó¥(K Ês-æ—×~¾eO%èG¬è¤Ê"o¡DæaUQÅ³p
ÆÌÍw|çLË;Š@IçÄ“2WÔ·óÆ!UR8ı2‡6¡'ÛM9(®Ô€Á¬HW9ß803^õÒ‡Ô¬ıÀlà)`Ûº3xÒynèèÌDwh“dµ;(1ÒÓ™Ù‚)'7üuMƒÊrJ`Tø&‰ñ„uŠ
ØtpİröÂ†›NX`ÓÁ‰p–ÎÅ#ÃFµ§,€Ğ°aíÁ©p–O€â™ÌÌf¦Z',ØYGŞd]D¾í¨¥Š@£ÃÈ‹(?6~#Â)& ®ª™nå‰›ç—ƒÔx
õôóÏÈjpŞ¶ó™±æ;5™ÆV”Ÿ!ƒ_º”ÿ=Fƒ“Uh„˜QÊÓŒHØyq„eå!s‡ÜŞÅö”¨ƒæ6#~vÁ‚ÈgŞ¿ı+œÇ°npºˆ›9'â¨“¯Éò(g²ÆãÂ	ì6pôÚæ3íÊw=wâwFÁï„»
˜$ıôw|èF"u·[qÓà ,ç<ÀÁ]lg:	pêEV³_Ò¹šó+¶sV<¸çšnQùò9Ó ĞÚó¾À‘èo´9%‡üŞŞÃ|ÇŠ:rJpO.t®HÎ{h“n\Ä	ÎY xônâ®†ùQBı„üò¥GJ Q†À;(Ox@Ñ­ EHQßŠkDàÔ«ÇÉ@¸Ï®‰,ïõıN¿(UâdE=­—#:f”#²_)°”åÌ¨Î«üjìˆÆ—m*Òë¤g½5é~!¦#‘
œ¿è
xkñ*à‚Fø6-¨£FéµÕôBiŒpô“³¨&ŠUA,?Ï-œAI­`¬:%Îamkëti67®~zRœ¥èe#_ÖúlãşY–Äñ¡'lôMÃü.ëËV€éÃ±obÛ¿eÆFdÿEi—Á!gCtC}¤àá ±ŞfmSçBb$[4%aÑÕb¨Í}¤²EµK÷ëÏÙ¢nœ¼–@Oœõ!xmTÏD†¹]¦özò\ä½B•j	jW–8SğzŠşğh®)Æ,'€XzhìğïŠÜJêğxqw¬e‹	-²Şû0ßiÌ\£6T«úgLŒöú¶¶nÖÃQàÔhwR`U®0‘Tb,i®Ã4Ù V¬jdİ”¨|Kg$(Šg*ÿ­¿ín?ƒ²…­¥ÿ‘Y~-ú•ç6>­–‰âHdW‡#b}oªÔ©İüwmû_»O®k7~1œJíÚ‹úÆUíù]Ğûİ{Ïëÿ¼º{ùÕ»kµí/ö¿»eìö’x·³Nv£ÇÁ;w´ì
†·H¯£ {#á|µ.Âõ5¨ËÚ¾ÇöŸÜÙ]¿V¿ÿTÛº]_¿ò$7X´ÿh7E÷/­]5Š›§gs÷00·øÚGXäáÓ‘aÓ¶_î½ù¡‹å­¨½E	°pĞ¡ŠĞümµ¥Ígú‚ÍÒß¼‡>yr"êÛY"É†
I6”ó©ZS>ºŞ¤õ ßÑ£öDãH:úû˜î¬…#q!4?"É	cßÄBÌ®Œ'†À·ãÜÔ($ã8/˜&³M®y”[ç›¿¡_99Än{Ô?npùV¥ÍÎ-2Ú#
òìô¨ûùë½ÿ½ĞoÔ¶® ?z¥v~¥]¹oˆôví2¶±z†ML„°^mª‡-1;ı»KÂw8›™£YÿñZí×ëp©nïÍ×PllÿÇ—ûŸ?ê¹ü–F:ıÁ[š* —Ñ­»¸yË§¹0™Ñn¡"¡Æ—
úğ™Jy‘‘[¿¢°¨á’uOóĞß–8º•§æÑOÜ§¥÷yfª[ïó¿ĞÖ<SÂû¡ÛŠæÎ]o¨ƒİ†no‹ºh=Ğd†ˆÍeĞIH£¡ºİp´Ñ"­¿Šæ¦?„aå‹L‰ªğ*b[$æ
'N$-3²ĞB~£KƒA4¯oê‚a¿æJô®îeÀó¹"$ƒáw4ò‡0%ï¼•—Mêr^º*h7L^æ§™‰CÎËÃ¬Zæ]Õ²&C›mWÈ:ıJÕ4[Ê„£²½û	DÓÛêó&¸ç,,Ïoí8ØÓ“¹WhhûÆŸ¥,1=vô3 ì›»:İæBœ*ÌŸˆ†/‡ßsv‚{¢iÚ‰­>²Gã[55¤1ÌÂp­ø“läS³Ğ@§Å•ÖdîĞÄ# }>c€g|_ÔÁQŒ‚ƒ&	¢9ß€ÄÍJCèumkÃ½?ˆÛy„fòvíRms[ûòÑŞÃŸµ›Çfå™\}”¨'C#F¨2·´ÄÈ-9¥]ñU\0^Í¤cn½W°Hı%¡&ò!Ğ­	±)8i]óAL6Ošh‡'O!À„`ÿº·¡1•ì°*ÜPµŸ®aÙ·ììñ„(¸:àğ„ÿäAó½ìê`ÁB|“‡«Úrà[÷$ÒÔÁ<'›Nh6î’u{²¦|3¤.]r“hI\ÑH4+ôÌÃœ7ğ:ˆ€0|%’î'‰Âd×¼X\CÖN3%Å™\|Ò(¨šÈ\ááJábâÖØtĞç"tí²vëÚŞÕÇP¬¦öj½¶u½¶ı3›ër¦î8ƒìÇ¡ÚG›SX±J ¹îw)0óL ¹ÍoÇÆ{g–’ <
A8ærñ>lƒo—ÔS“iÌ‹‹$ĞRÒuô<QlŸèn	ÈÈfG,,?TÌâø4‘L€j¶ÿ É?yh£Ïzs$Ú Ñ\U·2æ:W¢÷Dáˆ62SÓíııºÉ°ŸqK,?›!h$<Q7AET.¸D2p'¡@ÿ>´vm”F$plEÅ@9¡rdîéTÎJe™2SyQÎÅ½jÅøMÚ<ö/mvËÂ
”M7#:ƒZ·!:eüZê0¾_9jÁd/‚O 0´jd~IKgV…z™Ô±)´±³Û˜LKõ¤¥?Q2ÚîE	}&£ö„»Å¬
¿Î$õ_EUË·QYÏÆ»,Cp%gĞğ%QT›~]ª¨ú¯æM$85D%H‘"CJ¥ù¡‚7æSé“2‡Š’ª«|å_*h\ô8•†é§§õiÑ,%Ÿ5ÒGÉY„Ã?ÅâªŞP
F¬”AÍÿPK
     ‡Nâ@            
   customXml/PK    ‡Nâ@Ü>Ï•        customXml/item1.xmlÁ
Â0Dï‚ÿön·Õ‹”$=´xÔiª…vSº©Ñ¿·PÅ›×™yÃ“Å£ïÄİÜzR%)GÖ×-]\Î‡ÍCµé<9OÇPèõJrn'¾¯L0b>!VpaÈcŒI8±„¾iZë*o§ŞQÀmšíp®Ê7
›ÿIk¹XœœÇÑü –ø3ÀOuıPK    ‡Nâ@cC{Eå   G     customXml/itemProps1.xmleQkƒ0…ßûrß5FëÔb,´NèëØ`¯!^Û€IÄÄÚ1öß7t}ºœ{¸ß9·Ú]Õ\p²Òh4Š!@-L'õ‰ÁÛkXÇuÇ£‘ÁZØÕUg·wÜ:3áÑ¡
üBúyl|îi™çmŞ„IœíÃM\Ğ°¤é!L‹fCŸó,kËäŸ­=Æ28;7n	±âŒŠÛÈŒ¨½Ù›Iqçåt"¦ï¥ÀÆˆY¡v$‰ã'"f¯ŞÕ õÚç÷ú{{+×jó$ÿR–e‰–ÑFBßSiJ¼uø7ş? uEş±W}ó{ıPK    ‡Nâ@W%ÑRƒ   Ø      customXml/item2.xml­A
Ã E¯" ºèB’@ ËRnºèFí¢hn_)¥'èò¿Ş …L{1X™Ä€†ğ)é8òÇ¼Ìİ]^9û€›Š6ÆÙ+†­
=rG”@5£ª]Ê¸µÏ¦µYVHÖzƒ—döˆÁ©ïÏ ½>­Eew|eQMüb¦7PK    ‡Nâ@#ajÁ   ì      customXml/itemProps2.xml]NM‹Â0¼ûÂ»ÇÔÚj+Mµ¼Š‚×¾j¡I¤/..‹ÿİ,{ó4ÌóQ5O;±oœiôNÂj™ Cg|?º«„óIñíz=y‡~ ©¿UO»^MÁÏxhYÆˆ‡NÂ¯Úfk¥:ÅÛ,Ûğl¿Ny‘—9_iÙª<)Ó­z‹Û.Ö„[÷dnh5-ı]4?["¯ÂÃh°óæaÑ‘&ÉF˜Gœ·;Aı÷ç?}ÄD]‰ÏƒõPK    ‡Nâ@]p`âK  í     word/fontTable.xmlÕVİnÓ0¾GâªÜo±Ó´I«uS×‰.`ˆk7u[‹Ø®ìt¥ÀWˆKŞa< OÃ$öÛéRÚ	&‘¨jrr|dş¾ïøìâÏj7Ti&EÇÃ§È«Q‘Ê£÷ö:9‰½šÎ‰L
ÚñæT{çÏŸÍÚC)r]ƒñB·yÚñÆy>iû¾NÇ”}*'TÀÇ¡TœäğªF>'êıtr’J>!9ë³Œås?@¨éeÔ!UäpÈRz%Ó)§"·ã}E3¨(…³‰^T›Rm&Õ`¢dJµ†5óÌÕã„‰eîâ,URËa~
‹ñİŒ|S
†cdŸxæÕxÚ~9R‘~ØÍpèÀÕfmA8¯§ºöŠÎj¯%'Â&LˆšbÈ¹!YÇCÜMTGÂ/€§ĞóM¥tL”¦ù2¹ğp–ÍQeëÚü	ËÓñ"~C3sc4Á‡©î£[‚¢ny.‚;^s‘ &å. ‡U_FlNjëØœ$&"P§eçé;
í rûéçİ—
 0   ¼¸Kˆ›e@i.]|‡’i–ïÂPL¶¾‚!ˆãÄDw` ï…!„Aø8Şu)brk¥H à/"±X÷úFºu¯±È)%Ä:'Dxš•¢ KàChbDT	—¡ gLk÷á0B¼ ´ƒ®ã3(`èA$ŠÃEV0´öÂ°mè"ËÍlªtñğıó~]´ ‹§Ğ…İÅàÒÊÚÁP{IÔKºÛºÀÿ@=9UŒ*c™œˆÀZ–Æ,Ã£8Áå€*ñÿâÍœ÷e¹8Ğ+0 €QÄà-rëÚî¥QÕ5şä–ı?±GôHÆúŠU0"±mÓúp£Ò%JÛç£\ë.aôŞí-#+—°-$Tj–¦#Ü:²{^“1ôû
œ[ºƒ„qÍcÇã€Á-_,W]¸e5.·m"Øë–€¸š«ãšl¤õ }nyÿãö×İ·‡¯Á6+ÑhX6¨îåg‰£Ñp¦¹~¦‚5$õ^#ØFãÓÄG²¢Gc™‘ò³„ë¢Î1Ã£õñÇbì
$)È^b˜“à¦@®’«È7ˆQôS}şPK
     ‡Nâ@               _rels/PK    ‡Nâ@""ı   á     _rels/.rels­’İJ1…ïß!Ì}7Û*"ÒloDèH}€!™İİüLµ}{ƒ¸°®½ğr2gÎ|sÈzstƒx¡”mğ
–U‚¼ÆúNÁóîaq"3zƒCğ¤àD6ÍåÅú‰ä2”{³(.>+è™ã”Y÷ä0W!’/6$‡\ÊÔÉˆzÉU]ßÈôÓš‘§Øik®AìN±lşÛ;´­ÕtôÁ‘ç‰r¬(Î˜:b¯!i>«‚ršfu>Íï—JGŒ¥‰1•œÛ’ì7Pay,Ïù]1´<h|üT<tdò†Ì<Æ8GtõŸDú9¸yÍ’}ÌæPK
     ‡Nâ@               customXml/_rels/PK    ‡Nâ@t?9z¼   (     customXml/_rels/item1.xml.rels…ÏÁŠ1à»à;”ÜÎx‘éxY¼‰¸àµt23ÅiSš(úöO+,ì1	ùş¤İ?Â¬î˜ÙS4ĞT5(ŒzG?çïÕ‹½)¢'2ì»å¢=ál¥,ñä«¢D60‰¤Öì&–+JËd ¬”2:Ywµ#êu]otşm@÷aªCo úÔù™Jòÿ6ƒwøEî0ÊÚİX(\Â|Ì”¸È6(¼`x·šªÜºkõÇİPK    ‡Nâ@\–'"½   (     customXml/_rels/item2.xml.rels…ÏÁjÃ0à{¡ï`t_œö0J‰ÓKä6F½GILcËXJiß~¦§;JBß/5‡{˜Õ3{Š6U
££ŞÇÑÀùôõ±ÅbcogŠhà‡v½j~p¶R–xò‰UQ"˜DÒ^kvË%Œe2PVJ™G¬»Úõ¶®?u~5 }3U×È]¿uz¤’ü¿MÃàÉ-£ü¡İÂBáæïL‰‹lóˆbÀ†gk[•{A·~û¯ıPK
     ‡Nâ@               word/_rels/PK    ‡Nâ@ôc½  Ä     word/_rels/document.xml.rels½“OKÄ0Åï‚ß!Ìİ¦­ºÈ²é^DØ«TğÓél’’™ûí…­»°ÔKñxòŞÌÌnÿm{ñ…:ïdI
ñUçoåËİbí*İ{‡
F$Ø·7»Wì5ÇGÔv‰èâHAË<l¥$Ó¢Õ”ø]¼©}°š£´ùÔÊ<M72œ{@qá)•‚p¨6 ÊqˆÉ{ûºî>{s´èøJ„¬½ãRôMuhÌ¥$’‚¼ñ¸&„9{ûÓfˆ$‘sUvŒ6_¢yøošl‰æ~MƒsÖœIÊé\dÈ×d dãO¿í9U–¾![Ç>.Ú<4éS¼¼Ø½âPK    ‡Nâ@pú÷t       [Content_Types].xml½”=oÂ0†÷Jı‘×Šªª"0ôcl¨ÔÕu.`Õ_²
ÿ¾(Ò¨]"%Îû¾ïÎMÖFg+Q9[°AŞgXéJeç{›=÷îXQØRhg¡`ˆl2¾¾Í6bFj¶@ô÷œG¹ #bî<XZ©\0é5Ì¹òSÌûı[.E°ØÃÚƒGP‰¥ÆìiMŸ·$$gÙÃö¿:ª`Â{­¤@åõ*?ª ã	áÊ–t½YNÊdÊÇ›]Â+•&¨²©ø"qp¹ŒèÌ»Ñ\!˜ip>òÓ¼Gb]U)	¥“KC¥ÈÓÚ*hË0üobO›çÔ™ÎÙP·¾„²ç/Ú“-]€öáû×êÖ‰©ıí36üÂğ/JŞÌJ×Y«İ¨Ìb¤cntŞ8¡ì©ÑOÊ™øĞ¿¨ûA~€4Ög!" |ìÜ‡{çó¸Ñğ É÷l<Ò]<=»_?ÉfÉÓİ>şPK     ‡Nâ@pú÷t                vk  [Content_Types].xmlPK 
     ‡Nâ@                        ¦f  _rels/PK     ‡Nâ@""ı   á              Êf  _rels/.relsPK 
     ‡Nâ@            
            w_  customXml/PK 
     ‡Nâ@                        ğg  customXml/_rels/PK     ‡Nâ@t?9z¼   (              h  customXml/_rels/item1.xml.relsPK     ‡Nâ@\–'"½   (              i  customXml/_rels/item2.xml.relsPK     ‡Nâ@Ü>Ï•                 Ÿ_  customXml/item1.xmlPK     ‡Nâ@W%ÑRƒ   Ø               €a  customXml/item2.xmlPK     ‡Nâ@cC{Eå   G              e`  customXml/itemProps1.xmlPK     ‡Nâ@#ajÁ   ì               4b  customXml/itemProps2.xmlPK 
     ‡Nâ@            	                docProps/PK     ‡Nâ@ /Ôpm  {              '   docProps/app.xmlPK     ‡Nâ@áŸeV  €              Â  docProps/core.xmlPK     ‡Nâ@
µ­oş                 G  docProps/custom.xmlPK 
     ‡Nâ@                        v  word/PK 
     ‡Nâ@                        j  word/_rels/PK     ‡Nâ@ôc½  Ä              8j  word/_rels/document.xml.relsPK     ‡Nâ@&Ğ  ÎÖ              3Q  word/document.xmlPK     ‡Nâ@]p`âK  í              +c  word/fontTable.xmlPK     ‡Nâ@ìdw{ß8  û              A  word/settings.xmlPK     ‡Nâ@˜NĞğ{  w_              ™  word/styles.xmlPK 
     ‡Nâ@                        OJ  word/theme/PK     ‡Nâ@3Lˆ  ;              xJ  word/theme/theme1.xmlPK      ì  m    iq             2 0   j q \ 1 3   $ N„v8^(u¹eÕl. d o c x   Ñ­ÌFŸ=şş÷]eùm$3$ÙQìOFó<_mogş\Æ"»§2/g*EÓËíX¤ï–‹-_Å‘‡Ó0
óÛíİƒ‘U£&£ešY[qè§*S³\‹©Ù,ô¥ıSH¤›àÉgÊ_Æ2Éq;•ŒA%Ù<\d…¶˜«¦8/”\¹&qGÅ}×›€]«4X¤Ê—Y>‰#3øX„I©f¼ßPTînÛL[«ññş¯2ñkÄÖìZº€Ì¢b‹·OÃi*Rãf =îØ?zy™¨TL#©ëñşè1ÄS ügr&–QééYj?ÚOøçD%yæ]‰ÌÃ4P‡ ëÅ“$GğÍ\ÿ§õ)²üIŠÉè?ÿşË·ÿúë‡ßÿòÃ?­eü,¯¨záhûñ£mDñ·\®	ÂêÜähSË$ŸŒv ™à^9ûé	æÀdT\x“ÌÃ@~1—É›LwöÆs‡/Â :íµ7/ÏÒP¥)“ÑÃ‡öâ©òßÉà<`­U›&Ê‚ç7¾\è˜ØŸ˜¨gYÄ,Ã•f¼UàñB"´}_ëÑGÚ"CQpø(s)4ëxãM€*#Gf …Šİá*ö†«Ø®PK
     ‡Nâ@            	   docProps/PK    ‡Nâ@G¾ëi  |     docProps/app.xmlRËNÃ0¼#ñQî‰hkTœTj Gd9ÛÆ"±-Û ú÷8•på¶3#Ç;†ëÏqˆ>Ğ:©Õ2ÎRG¨„î¤Ú/ãçö>©ãÈy®:>h…Ëø€.¾fçg°¶Ú õ],”[Æ½÷æŠ'z¹Kƒ¬‚²Óvä>@»'z·“oµxQy’SzAğÓ£ê°KÌÉ0>:^}øÿšvZLùÜK{0!0ƒG3pìqŠ3¤ö#k¾GÇ* Ç¶ÚvåÅÈq„¦ç–6Å²¢*Ìx*Ï2 Ç)øY¾·Üô“é	A«=Z9"+ê2øÅ°|À&äf;>8òKL7¼¹gÓêÛé?ú_rq+}¿1\L¡ªº‡I°2f‚ûĞ=Û®7ÑÓw?¯MÃGH%¥¯÷Ù]‘/nš$¿¸l’²¨ºd•UyB«¦*iMiŞ¬€Ì ô»Añn¥?0
dÃ*N-³/PK    ‡Nâ@ˆ™\V  €     docProps/core.xml}’[OÄ …ßMüï-¥ZIËÆKöÉML¬Ñø†0»K,´ÜË¿—v»uÆÇ™søæPÎvº‰6`jM…H’¢Œh¥2«
=×ó¸@‘óÜHŞ´*´‡fìü¬­…GÛv`½’qTtZ{ßQŒXƒæ.	Äek5÷¡´+ÜqñÁW€³4½Ä<—ÜsÜãn"¢)Å„ì>m3 ¤ÀĞ€ã&	Áß^V»?Ê‰S+¿ïÂNcÜS¶qrïœšŒÛí6ÙæCŒŸà×ÅÃÓ°j¬LW+¥ÆQa{Q ĞÃ¸£ò’ßİ×sÄ£ˆÓë˜š\Ñ,¥iúVâ£k<ß¬Ö²©•QÎ[î[Û['¥–†;¿/¸T o÷L½ëÿnOõhı7!		¯b’×)¡YN/Š“„G ë‡[Ø¨ş/±¬ ù0wêÕÏ?Ã¾ PK    ‡Nâ@Fr1ş        docProps/custom.xmlĞËjÃ0Ğ}¡ÿ ´—%«uÙ¡¶“M-$ÍŞHrb°H²[SúïUHû.‡;îÛ¼«ÌÒùÁè¦	@jnÄ O%|=ìĞ:-ºÑhYÂEz¸©noØ‹3Vº0H"¡}	Ï!ØcÏÏRu>‰±IoœêBİ	›¾¸lŸ”ÔSB0Ÿ|0
Ù_^½bÿ%…á—vşxXl¬[±o|½
ƒ(áG›5m›‘ÑmŞ ”¤5Êïò"kBhM›]ş¸ı„À^–)ºSñô§ısdÅÄC=£8Jé9£}óÁU”d4RIüa²º'„á¿ŒáŸ
Ã—n×ÏU_PK
     ‡Nâ@               word/PK    ‡Nâ@ÉFÁ^  b_     word/styles.xmlİ\KsÜJŞSÅPÍ
=?W&·'Æ)lcî8ÜuÔãQ"©…~dÜºK6wÁeÅ‚‚Å‚¢àß`nş§O·4=ZÓG	E‘3}çë>¯»5­~úÙ]87<I}MGãG;#‡G®ğüèz:zsu²õxä¤‹<ˆˆOG÷<}öì»ßyz{”f÷O0¥G¡;-³,>ÚŞNİ%YúHÄ<‚/"	Y“ëí%ïòxËaÌ2î~v¿½»³s0ÒfÄt”'Ñ‘6±ún"R±È$äH,¾ËõŸ‘lÂ«/…›‡<Êq;á´ADéÒÓÂZHµ]\FnL¸	ƒâ¾ÛMÈnEâÅ‰pyšBLÂ@5>d~Tšï5•{ÛVİß–¦ >ŞÁÿUÚ1Ş1µX»]¢Ê4h0¶D[EñÌŸ',Qa†íİ£××‘HØ<€”ºïA>yÂ}É,²T~L.ıQÂ?'"ÊRçöˆ¥®ï_A¢Ğ[§Ï£ÔÁ7KùŸÖo8K³ç©Ï¦£ıóOßşãÏ~ûóÿ¥Ä¸iV1õÂ÷üÑö³§ÛØˆâoÙ¸\k*$¤ÕLÕXy”MG»PLp/_üøk`:*.¼‰–¾Ç¿XòèMÊ=¨;}ãŒ‡ş©ïy\Ö¢¾öæõeâ‹*e:zòD_<î;îÍ2 –V¥k‚Ô{uçòXæ4Ğş´àD;y’û+Ëx!­Ğã…ˆIÿ^ÈÖÒ#CY°ù,KÎ¤ê8ãMˆ*-G›ª¡…‰İá&&ÃMì7±?ÜÄÁp‡ÃM<nâI«‰j«êP©àG¿ëÈ%3¦=yÌ˜öl1cÚÓÃŒiÏ3¦=Ì˜öˆ›1í!6cúc:©”w&Ü"ZGôÇ³èfÑË:¢?’uDëˆş(Öı1¬#ú#X­J5’8¯¡8£ÌªBd‘È¸“ñ;;$‹ ‡3½nlm°¬.}COZûA´(»ÙaÑ\Izè³lËd_Î'”bº§­º¸39ƒsÄÂYø×yKƒ¶9B˜G7<€i£Ã<°DpÂ3X1X—¹”ğO`¹Ã­à•„¢üˆ;QÎ-#³kG–­µÚºğÊä`y¶”Xß2AB«?«Ğd‚9¦JèJÅ3?µ	p^äAÀ	¸ûĞ#_ÿHVÕZ„ôeÈ•Ç‘¥0k°(ß9„.i$¡gIè Fú©bMé§Fú©‘„~jd{?kCZßŠrlZR^ùY`§ºÇ@¬’sæ_G†‡~&\$«qP¯óK–°ë„ÅKG>s°â}!¼{çÊv¢R¢(ó#¬Ãch¨åıİm”c¤$j‰%¤j‰%$k‰mO×.­?‡©†HOáyCÇ l›é˜=5fù<³Nör5gµÊ»—ğ8È
°J¹?01o7a™Grf/b[á+v»‘d…³KÚN¹Ê²Ÿ¸%{ ıº…¥–¶›®bNïcÀœôUêœˆ ·Ü3£kMê3vwåz¤«’²Dt ¶4¦¡éU/Yê§VŞ(~ZpÎYl¼à‰xwH»DìÕ<IœÍ¸ªâëUø÷¾àóï[5öôêüÌy“òè>$ 	Ë<d<ö-eM¡„g'†ˆ‚Ñß`©"ì–”ˆı!¿Ÿ¿’Ø¬‚y	K3ü‰ ãôŒ…±ål
Y¯ ğoa]Ö1
våbÂ_.ş[ûZ+Ç†©‰–NÃ«N3]¨,ÀÓ|ş–»v³3$„Ò‘NÛàybµrÖ v#ÎÔNöô8`ğà&O@›-.°”&Ø!m¶›İéşŠ@$‹< …è¸ “z\€I]AF)µÕˆ%6±CÚLòÚMÂUˆøÉQ¤x	!â’ÓÿĞ¿YìÈØÿì¿Øÿ@ˆ‹Ïößm»4\% )qD %¤Ä”8"GRâˆ@J'/¾XÀxJ“¯
œÓ
œYù8€‡1ì*Iî[g%æT|ğkfùœG%ñe"rwˆ:6I˜‰åêDDA)Î†¹?Iy%Ê×ÕÍ&‹/,7acK÷Sµ¾µå¾é—¼ÕxDHÜlÔëk”Ú"Ô±à=ó¯—™3[‹ôÚ7=šRö¥ZoZ­+ãr,"ŸœsÏÏÃÂ5]‰Üëœ½Í):r¾—`íˆ¯îÊuÇèÙkvNv>0©Ú§¶ÿ°ß>Î7¨í‡í¥}íGûÔö›Š^ûí·kSï¶¹CÓ“¤—°ÛÕ¡—×¡©vËÎ y84UpI1 ¦".í	“û×ä[¹°ç„,¦X¬tt(‹)+AÊb
J]Y‡rÙHìP®µÖLT›ôIğÄÔEÔöò—DâH¸±Æ›ûÕ+f‹ıP¢U(ÑÆò?h³q`(‰I„J5ÕÂP.“•\˜ŞÃ”õĞ¤F%ÑÃˆ6Ÿj®£Î9LajTS€šc•Å®±‚ÊeÒ×îĞYÔNY‹7•ÈZ¼©DÖâM%²o"‘xSILªPê\M¼©\&m(¹ªâM%2ÉCITo"‘½xt¦05Å›Êb
PS¼©,¦èÔu\*•‹"ŞT.kñ¦Y‹7•ÈZ¼©DÖâM%²o"‘xSILªPê\M¼©\&m(¹ªâM%2ÉCITo"‘½xwü@×··o*‹)@Mñ¦²˜¢Ó%ŞT.ŠxS¹¬Å›Jd-ŞT"kñ¦Y‹7•ÈZ¼‰DvâM%¡ˆ7•Ë¤¥¦VÅ›Jd’‡’¨*ŞD"{ñîØ$ñ‘Å›Êb
PS¼©,¦èt‰7•‹"ŞT.kñ¦Y‹7•ÈZ¼©DÖâM%²o"‘xSI(âMå2iC©©Uñ¦™ä¡$ªŠ7‘È^¼;6ª}dñ¦²˜Ôo*‹):]âMå¢ˆ7•ËZ¼©DÖâM%²o*‘µxS‰¬Å›Hd'ŞTŠxS¹LÚPjjU¼©D&y(‰ªâDpjXõ˜0y– ÛŸ2xg:Š‹÷å(84L„¦OÃ_ã9a'_Ÿ{nœÂV=›Ko\À·V{N‹;wÔîƒø2‘6˜÷6O³ÏåCx“±vO±øJ`4§1så]€_ÀkCpÆÙîÀ‘'ZÀ‡½òÃç¹<Ù~Àó ïšu“ìÉÚ1nÓÑ[ŠÉãémÕ¶‡¶[ßİ×	Ñéûcyf:¬¸0ì^ãÑÖ›™d_‘½_n_ÈKs8z’lÍKc•3á0*=q,#·‹g´U#§Ï©(v$Íœ÷#yr6Iï§‹à%òÚ%ù¦fyIwĞy}FÁ;Îã0‹‘Î x©òSŞ¹|"8Q!ÕÑLÊ OGû‡(Š2ôëÑ¾=y&/ŸİEC1i0GÖù±bÇ“²û{zµºŠåêÊ*–êZHÜ%Ô–+ßsƒöt”ÖA#@¦ƒ V;:±ë[kÔ¥ò­·ÂRhlGŞdø\w7Ø|®¿Y=™¢S%›ªPá?gìâ	íR2µğïŠwáËcçk:1ÜgZb¨›½;¦*0ài¾ï`ÚÔ¾Ÿ‹,a7>Á­ĞÀ«ÕÆ¨²İî^“Û²L''77·WêZYêå+ºrêÛ^U«šë—@ªú§®_PŠmı£Nê¬ÊXõÄª<£u­¥`6ËLí
(<$şBÒ bÊíªÂc‘NG{ã}…Ê=˜FRğ–Ç8xŠU¦Úƒÿ¬SŸÒ•ûT“#Bñ.î®ÔcòPWÆ/<¬ß²Ñ›ò¬x»\åÊ·!õXÓ÷Ó‘šßÃ`#D¡j…™O™Û£·n-Ğ*pŸ"^kÃE)‡xÕ>¨…LO/ÉáÑS%tÑõøwr"£‚çÕâlNâ]?À!/îÖ1T"•û“FŸq]ÛĞZë¸.qs=Ã®Y&uü|œƒ.ä!$r:å»‹ÃHyå†p¨j9ß¬¾[¾ÖbèÂTW„3y>ocF­Ï­*Ú‡oşúï¯¿r$£jc­Åº¡2ÓgÌ]†÷&±Ë–s`Ä|!ÚØ)ãFÜÁ)ßşì7VNÑş¿qJs
ÿğ»/?üş×ÎØÊ-6SvJªÌ1aşË“jS…5çT_ıíá/xøæ¿úòáë?Z¹¯}jõ¿–d…0¥ÏşPK    ‡Nâ@ïß­78  Ã!    word/settings.xmlÛ’×q¥ï'bŞ{Šu> D9ªö®²<!yC{î›@“ì€Ft7SO?_hÑ#~Ë£ß˜BvÕ¿krçaåÊßşÓ¼}óÕ_nïîß}û¢ıMóâ«Ûw¯î_ß½ûñÛÿşoç×Ë‹¯ŸnŞ½¾ysÿîöÛ?ß>¾ø§ßı÷ÿöÛ/oŸø³Ç¯xÅ»Ç—o_}ûâ§§§÷/¿ùæñÕO·oosÿşöÂîŞŞ<ñ?~üæíÍÃŸ?¼ÿúÕıÛ÷7Owßß½¹{úù›®i¦_^sÿí‹ï^~yÅ×oï^=Ü?Şÿğt=òòş‡î^İ~ùÏO<ü#¿ûùÉzÿêÃÛÛwOŸ~ñ›‡Û7ŒáşİãOwïŸßööÿ÷m|âOÏ/ùËõyûæùï>¶Íõ—_>÷ãıÃë¿=ñïzàıÃı«ÛÇGèí›ÏŸûöæîİß^Ó¿zÑß¦ú7Lõ7Ÿû›ëU<Ş6Ÿşë—‘?¾ùÕó²ÚŸWñwß?Ü<|^f6À5Š·¯^şËïîn¾Ã¦úØ/~ÇúëııÛ¯>¾|ûğŠEb;6Í‹o.Áëû½ªwïßÜüü§›o÷ûìÈ‡»ÛGşü/7Œ¥ıü‡ß3\6s½şş»×ßışö†ûşğ¼¿úÕ¾ş²eşô€ğÕµ]xÓí;öô«Ûk+}ûâyŒ·?Ü|xóôo7ß÷tÿşùçæîYüpó‘Åøç‡»×¿¿¸ûëı»§›7ß½¿yÅ?>ÿqÛ>ÿñçOıåë/OœÖŸŸŸè¾ÌÏç¿ÿß·Ow¯nŞü?şúÕO77¯øÔ/?_ËÃı›çw~šìÂ}`ÿ|~ÿçãz­Ä‡ÇÛóøÃÍÏ÷>­ÌgÉwŸUoxwó–ıü¯_÷ï_ß¾@ôááîW{&î¹ëÏûé¿ùøò—1 ¬^?^ƒ¹şã±hÏÛ4µoëøe/é/’¦iÎöüü9/i÷!IÊøeŠÿş™¾)‹¿m8ÑfŸ&çïŸ™–#Œm›âÏÌçá#h›~ù²ëÿîwÚ¶,‡¾­íšÒÉ²í.é›)Œ ïkx[ßŸCxÛ2Ï.Ö!H¦®ø¼µóyú3|èêÏtÍÑT’êkŠä’¶|åº¶o}vºv¨¾r]»ß;ÿ$ıºù\wÃÙ†ßç=ÌÛ4ÍaŞ¦­>os3†·Ígq	Ç§ø¨û¶[ıKû~Û}Fû±	g»ûÖGİO}ïkÚOóY_í~ÃúMš¥÷s:´]8ÛC×õ>oC7‡s:tkX¹¡+§éĞ·ë©«=ç°ºdšN_Ÿaª‡ïƒaftş¶y{t˜—ç[õï4ßØ4ïx6Èás=6İéúmlæÖwâØN½ë±=Ÿ–¿[ßî>£ãØ„ÕÇuğÕçqö¹çÚ…±Íuöİ;5œ:]…©)aÔğL;í¾¦S;í?µuóõ™ºyõ58tá™>iòiX›ğÌp„ÕÆº»¦˜m>oÓ²…Ù™Û ‘¦¹»¾mn÷ÎW{îÚ ùæ®vî·ê§qÇêûmk¸ƒçiš|¿Íó±ú=K;î>;K{ÛÒmzé›°«–q<|Ş–q›ÂÛ¦vñp™ºÃ÷56M~'êªµI×ÚÔÅß¶²Ø¾>k×¾¯×nXÃÛÆ.ÜõëØ?së„îÓ5]§cñS²29EŸÙšqõó³µËé#Ø¸˜|Wm]lÿ­c|]ÖÆÖ·Mø¾~N·¡ì¾
ÛPƒÍ·Mmëó¶Mçæ`:ÃiÜæu
3:ï“mo8':;{×„E_Ó½›F¿çöîœüdíıxø—î=*ÖÇÖ'[lê~ÛÅgg—%|ÏÜm¹Ïëâ:dŸk°Å
Æ¿k¾ÒõÁ/)}³ºŞ)ıN’Ó¿´Œ[Ğoe¬A–iŞıü”©TŸ·2Gxfnª¯OÁ<ğ=Zæ5Xve.A+×f­>oµ)Á†­İ¹újß½SûáğóSû1x`÷#Œ­ßFŸ·:lkŠ:”`uÖi–êÑ”ÍWá@ú÷m	öÎÑ÷Á
8Æ®º>8Æ~ô98Æ)è·c<6?sÇ´OâlÚàŸİ,ï³ÛÂ—ıì^ü¢Õï…sÜBlãœ7±ÏvUMd:tF‘ ’L["YÎ i[¿ÍÚ¦íÕÊ„ZqiVÕH†N5’İ£+HªŸS®æöoë¢7CîVİ;mÛN®-Û¶;6Ÿƒv˜¦^çº÷(ÛvŞ=@`®}}ˆd…¹îºÕ£“-Æ ûš¬èî±¶Ã½}IÜ¯o»©sË	î”ÎÎuä|‡tó¾«mÙöly[ßlEuÑ·=ì¾[OAßmî¹¶}OlN¿§'¼ã+×»û?-—³ë·¶Ÿ†¢÷’âQÛÏıæm^ú0ê¹ô®]š¾¯‡fT¿µC{támX(>¶aZ<‚ÑÃ}†™§«0`÷ú¨‰ï‹$œ’±m<ÂÔ"	:Éäû`ätûŒmİ}}F"sá{WùŒı1ÉĞº?×„ÕÚ@²zÌ¡Ç!œ¬q^Ü›â^Nµ6Ú‰İ³ëš¢\ÂšN=¦ª?Ó/Õçzêñı™ûÙ%c­alÓî…i*kg.:¿™ˆÕx&¥»¹øænwãÜ}«ß3wg8õ3úÀgiÚI­ÁvF÷™LáK—aóˆL»ŒSØäúz!êîšb™§ÁÏÏÚ4½ïÄµïÃ¬!MQâ³±i×aòø’¾t¦Æ÷(Ñ•°¦[Óz£İÚ>Ø[[Âí¼µ§G'Û­ë={ÙnÃ,ÈmØÃ—nÃá±èv÷rÚm"”¥«°‘yp-¶±wüÌmsngb(Ul‰”x¥İ	¸FÚ±{ı^Ø‡ãôïÙ'¬ıÒÒôá^(í2ùÛJ7n~‚Kß†?ğHI[úÓ£m†`#•áœ|}ÊÔÛ¿3r-VæÅcøm™Ï–·µÜÓkÉ–x¡­d±}åğøg¿1j¿{´MXS¢şÅ×§Nxöºêò€ìÃ~	o›— ‘ê¼y~®%'NÖÑÅiâU>;GŸnÍ(ke$á¦=†vôõ9Æ¹óyÃB
7Ó1O‡[g³¸Ç®<šN×ç$çêc;û1è“„£Ÿ’s\=ºßÓæ$˜ºÓãH¸šÁ‚ì0ˆ]…®Á1Ñû´kHÇªŞ!vLÔÎfs¸?U+#9Õ|]CüÚGĞ6!¢Ùµ`=T‡5#ì¡cÃåot:Üj÷Kˆé¶®ÅÈHÌGRİíZÒŠaÔÓîÚ…gŠçO‘T·Ò:’±ná#©‹…KR}å˜l÷³ºOÓ£sOíqÙ=–fõŒ4È¶ÿNqé	ßUİ%óá^u×Í‡G¿œG"ê?y¼
Éâ±[$k8õ}r]Ïœú'të9=&4Äğ¹|NÇ»tıHPçåïş)ÏT÷Ú:Âä-BR[DĞ§IG€¡Æ6Œëè;~ÏEu|GœÂ£ºH6 ­‚DRß£vÅu/ØÏØtc³¹o†¤z´µ#áQP$Á_@²ºgÔ]À® 	Ùånì—Éçú’øŞG d:£ãˆèÀáw¦môS?Î­çe"1sú;ølaWMMÒoD=ÜJë8‹ùA²jS )áºà‰ ]<n‰¤xÌÌn³»Æ)ìÑi\¡ÒMdı,Ìø´¾€$	—½ßL gŠ¯Ü<ÌåKGbSW{F]o*YIâh`~{`HÆÍw<ñó`	-D¿ÂØ†ÅóİÚ”gØùÿX3Ñx\¬[û5h1âÁŞYç=Ø|[SÜºñDgt#¢é·Ù6°Ã3«ûİ†}í'kOÏ^vÛÔ‡Ó¸MƒÇã»m„îc›‹{¡İŞz·÷Õı…n{Ïí"9Âm¶§cĞ»}Z?û<†ß)k§_zÅ)|®M_Ó‚7ãú I°ùJ·{Ì®+}	'«ñ{†Õc\€ìªGÌº°ÓõQ¡te˜Ÿ®6[õÙ©m¿Spsú€ˆC°„*ù9_…:§Íì+²àºêhW©×Ş<‰¤ôëùçôD½¹•v‡İu÷}²ğÉ!ÿç!éó†÷îñDRÄ'}xÈémİÔsuì
‰ÕÙ­$àl=©j”ô&ßèÏpm‡·Ñ/íAxv¹oÀuêj#¡LÁG `Zï’«¾ÅãoHz‡ 	¹)$óæ€”Mõ\<?Îbq,(’ÃwâR:=\‡°ß;÷³(béO=H6×äHv÷Íú–Œ€Ş”i ¬|Ô :‚\Z’¬aïÛi-ªwTuöíÜ»ŠdXÂÛæÉ1Y<SÜ¦ÀyŸ<wˆ$dîÀ%œ»í»~öø’İ£y=øÆ÷(Ûş}7î~Ÿ"©qîqYYŠdòìrOÅm—eå÷*LtW÷<Ï,aïôRÈßÖn=õdrÂî¥VÑ=qÀ&]úÒ¾¸Lìì¢m(Ñ¾'¶™(dñ·M ']2/•ïû9T] ©A[súïlu´}?°E]ó ö\+à¸Ô%l¾~@Wù¼‘÷¸X?L§{üä’Z÷ø)kk<¶q¼-¾¯GBõş¥Ä„»Juuô&’êqXBE»ã•‘¶RŒ7M1ölİU€M%Ú_Å*j_÷DdÜæ#ÒÙ{Ì¡ŸûûÍ„?éñD&ºóx|?M8¨ú=\Y¿î±<I¼ Éîù`$¡
ÉéøÄ~n©²ÑQSÇî1;Àgíè_JŸ×@Q·U<J€äôJî²Á³¾—Ä}g$›G(Ãi\ºas{gA[ù©_’È:ouá°yI²º…ß/ó¹ù3k³…Ó¸²<>6âra¿­—¢ßCä§oÖp£¯Ä}ÔXõe_ŒÁRİšipM:Şã.¼-ÍÎv¾ú¥Tì¸xáóI†dóX’3èÄm¢^ÅG€â:~›KĞñÔØ¸O‹Å7x¤ÉöÛŸåû€8’ûèı>q™è÷ìÓéqË¾4¡:ª§*Æ±øûm8§D<Â3‡G=ú2´­ïÄ2„HVO\nğ}]Æ>èx$iìy·¸È¢‡»„{)ìªŠûîw#Ö›ã)úÚ.á6«íé±[lÎ&x` g<‚Òƒô²î:œeëë¸†3WQ¾r5Å]pæp}3…Õ*9ÈÏõA²„[æèpÆı™¾„ã Yê§ş˜·àœİâ8UÀbK¸ÎkNul'¦·Ï‘4ÏxB÷ÚĞß6.áÎ:§5hŠ³Æí“JøywÆ‚ş$\¥ûmh(WÑ¹«Õ9²IïÖÓĞLÔçÚ ÙÑ$°‘ ¶Çç÷·zÕõá™ÑëôT¯wFr8k ê¾©&GWn_#™ü&)tü@iC£’ÙïŸ*JÏà"&ªóFBÍ3Cu9~¤À¼ör ïâq$]ØoH<
Ê3Tİé¨»+É%CïôèJ¯§Iñ¨!u Ô\ëï`z}#$!Áâ®0Nxû I‚_2is[	–¢½ã»ŠJE÷r(U©ŸC¼©§ÉÑÂ a‡Fµ’Ñ#sHî	ñàqËaÀ/(::ÑO0‰o·†GÏßÚÄíÂôÄtƒ‰Ú!Ã8—p²Æùp›|˜Ğ×¾¦Ñ"×‰¸4ŸôDø‰/òï¡¬ÍqvdO¿ÑîIÄ‚Ÿ5ú*¯q[Œ0&œ®ÂÌ:‚„ĞœK .òûÊÏ¾j¥ê!¼­º}Í3¡b˜Ébûj#	»wFÏ¤Ptxöÿ’xõ’Ñ£ÇHÈû—‚ôsÉ‚åíß³€XsM±´‹û?hÄ&ì·¥oİ"ÆzkİD’VFzÛØy­<Ğ¦!Ì(Õ7”…—g§„Š[ªÃ
_šÏÛJaªëµ'Á­+·¢şı”¬ı,‡µß<?éJÈŠ'Ù<ötIÜ“@R<[Ä­m}W­P'ùi\ç¹_
ÊÚõÎ:Ç,ë|[yÒè# "ã~DÈ0²xn f(œ9$aµAé8¢£wô*z$Äuuï 	g{›ÖÁ×~—pR4û3;qÿ$Yª¯wŒ×à’‹İÜoDRƒUó‹g †ˆˆŸÆ½?<+?€é÷(äo‹#¼¬¸½®O¸è³êÈsÕ!Á~+C¨wFµtA”¿&»˜‡J.Çg´6{Ğ!µ	YRîY–Ng§¶›G¶‰’å÷gº)Xã_#\
ƒçÍàyhÂ®‚Â3C<ÃS>6ÈoÂ—àü™‘R´ 9=r:Ôép¾pæOˆ³N>‚ƒ$¥ÏÛ1‚Õ±äÑ;—Ìí!1~g&T¯oƒÕğôQŸNex¦¦g¨¯÷]ub­ûš’«V'#G&\5
$Î8„•£>Ë<3Ïî€
ó•å³£gGQ'•©­Ï(÷¶®ÏU<à%’ÀŒdòS‚duìigjBllHöUïFÒÛä’ø­‰dXu®G\@ßñHfÏ&AgÔø³Û;ÖıªÅsˆ$Ä¸l-‡¥¨óÖ’ığ5¥DÀ5ßØÂ‚¤§r¾â#ô¯BBáŸÂğ;sÈ‰\îÓ^!^	MeöšH$ø,:6jÁİ3â™Í™Ç è¥$Ñß6ƒïkàIB…½¯eÕ~3 ¬<:‰$Øä#<Å~7"	xHoÑ%q­<r9{T®€˜¾ ~7Rv8oëH(ØsFäUüëút/lS¨;DÒyÔ	¼ş;@•‚Š½5Çó$¶{ÿJ\Ô	ˆ8‡Ûà‘,\İ¥÷y#„âYEì =èxd<î¿x~ àâ¬AHV÷Àla'Pk¹¶§Õs`Xo›Ç6.»Î36HÎ06’ØJ!se¤ìÃ³}0kà×} áGX¹«Ê×”pUĞÄ½:øPu<•ò Aulóp„³@üÍ­'Ü/. ÛÌ@%¾ŒëŞ¥©QÃv$ÌœÿÌAB•tÙ—ÍßÖÕ`»ÀêîöÛûÛ½ã‚Åã«½ÀÕf‡½ãzf-ÏQ‹*áÎŒ€d¿³}°«Àßy|g¼bO®Aö8z“¢œÒº
`3<ƒ;n]çÚqãÆğ5İÀŸ…±÷¹¦Ş,XªD¸Üw¦Rdğâ­ş¥~N7*ÕÕ7£Şzq|/’,®½i6ÿÒ½¡"PÇvÕ¨ùØöæşñGY`xƒÅµw£çFx‚ƒÿ³—ò»„*9¯×„ #ôáwÚc¸—ƒÄ+iÆ}‚¤àµùÛàù	¶rãÓW»4‡sö9=ê>Â¬x~œg, ]v¼ï^€<æ 8qMßC‡ğ;S¨?k	îQêç‚gD,Ís`cmgG¬!Ù…o¬İè•ÃHB5øX)±qT1b]#UöµëD: 9sìXAÜø9­Óî•'ğcPË©3z€1ó·Màœ‡Û‹öş6È|ü,ö*¹ñ ¾ãûªCÏÓÒ€$»àj	$«ó9ğ6ØÜÂ3[Ø×Ç0¥±»GİÇƒH¬keĞñÎî5ä$ü, 
]Bïª°ßÎfuduÃkğŒN,;Ÿë³	Ùòñ„ÿÓ÷ÛÙnÎîfüIğ™Î!ôRÏ!T{!m¤8¯!’ê5CãI´Æw<±Á`"	ğÅy¼yµ×D2É3)HÂíŒÍpªHFÛÔ°ªº{'âo¹› úºw tLn	!ÙİVFRÜªájŞ¡†jñ•CW—zh=Š[ƒ×ê¸•v5Åq=JIJĞÓÕLuÇ—‚­ƒN=		~0™Å‘²³ö-º8¡=¢y‘‘x¦ø’¸¥Š¤¸WMv#_¿´o·ãtë…dòÌ*’=¬ÜULêsMÕŸgc§OeŒ>jâ|¾«(ÃòÚXÂ$°kùÛà¸	_
Ÿƒïx¤İG'KzaQçrâÓÕwÌg‡:=÷!™ƒö^¿‰ûÛ<3y		LÂÛªÇ ß´íÏopáwæÖ*‹B_$c|[¨‡˜'T¢!éı>…d.t>£gÄæ•÷T½‡
ò«ŞqÄXGÇæü"®«sM4Ïó%<X'”¯{z*Éq5Ä·ÒtŞI™Ô»êvõ5‘AóM¤ôüœÒ†Ğ3‘ôhÌËx§»g"ñNOÕLD ½†	°#]2ma‡@£é¼RÓu’FÙ ê‚ö3çÏÔp²ÀÌ9z†!›Ç:‘”â+·À`ïÚ6.Ç¿MÄp¼JaZğÁ|µ—iÖ¯ö‚A™Š®ÏŠùäztÅ&ÏPv®å´ö‡W€m¢  ¦!ÿÒàH’TÇûsÍ‚öĞßÿÚ³Iè³ğ=W<Q}Ö õà´q\WmpuùŒ‚—öZ+îæĞ—­uŸ–Tìì•AH`eóŠ,±€9¥VÚaktK8ÁTı¹ï<ğrìä%	ç¢g8x¦zÄl¢ç–ãh%Ø2‘áf*4qñ=Š$X5¥ÃFÑy#Ê´2x±`qâş®-a
	şkG?OğJ…sZ›ê¾æDTÊ3¸l dú¥•Â ?%Ô9˜éij£¯£œ`ò?÷ìî¨	ôCo•éH3°ÙŞDW)Ï|#Ù<º$ôCèÔìÈE$¡7+âyº
ğÿ8=|6ç?@R¼® Éáqò	/Øy¥¨ô¹PzÒˆÃFµ#y_—a\-5Ú?ôÇ@8-fjîü” Á&ö±ÑÏGÍUâQ6-}hK÷eàªËŸÁ»RoM°dwõ™‹æZõ­fBi(Yümp ©¦à™ÀëätTòÜ‘…ó½C%¶Ç1a	zûØÆPDö4D0¿ë‘œ®«.‚ó!Y¼æI¨@RÂ)¡{‰G~H¸VgVœ	yÜI¨:Grz¬“>TôPÑ¹¦äÛ3P<s¸í÷­Ÿ¾íbóñİ‹­îyÚ™bÉ06x~Šï*ğ6^ãÈæŞ.è%Ì( "ÏH_4´‡…s’5¸bÂŒ%s¯`‡İÑ3HJø(ä:rˆê'k¤Aa5ñ×b@GÂ%Dë¹òª	q7±ùá™ö°Á É	-8êŒ(V—–3_%j{3AÛß–ê³(^£]§?“bÑ¸è Ùüº®¸İs,tú«aÇ/”®ú;aj¿Í¾¾w@¿…İzÆcdj¸³ˆ’oáKÑ|®wèîñyá
v-¶PçzêP%7&IçQúã†˜*:™Vãş;}Ò°`~<b¹%&œ¿m¢½X`ÅºäºƒV•l0[ù¾†ÍÇcóF¡¸ÏèÖ/³ÃÙ^Üã§g+<ş>6zÄA2{ã‹f8?tia. ÿÎ¸Mf0?i¼$áÛ!µğsJ4Â¬Ô4séØèŸUüü€ òÈÂL%šãP/™wLUŸ7Daåv‚ ~Jvøìü.‘¾‡7“ÏÉK_9x¶½ê}Ö¨{m3ÌIÁ@˜/©iî9;y	÷]Ã=7Ñæ ¶è ¨^·fmCw¤¹^¼Ã:;f×.µßÕÂÛçĞ¿âKKCR=ïÌAè=ˆdÖœÙß™RÈ¾ ßU a<×Fšë¼Ñ§ËcB<Øš‘Á&§OWï:¼šWC@8B«W$~¶áGr$ÌŒåìø‘‚î%RâÑ}65­:¶êß‰ç´{ì¾÷Ğ#IqKh¡ÚËk—‘P?mc£gç1U’/sú3lx½çxÔ\x&Dó
ÑÒ& Óú6b(i\ZúÏ©•™°¿®îº«x†X†¼³, è]˜kx‹<_ $ >­‡'H¨hò±Íe°PwïøŞ¦!×HàZ¿¡´HF?%H×;H¨…Öï¡@Ì{Öaú‡~9HBg $Å±+d,Ä‘h·d»Šú,ÇAºº•FR2^ÒîŸò*!<³‡“¤Ñı¬ŠÚ4;¬Ÿz¸ÜZ_¨âw	>j
Ô¶\ Ys”øõmC·?§CÎ:<szŞB×Ó£8Ë@˜MmX$½c!á¾3-”¡!÷±Q3¾Ä§kËXımä\]ó]¼Ôár®®a)v8=ÚÅèÆöğÌ÷BY¦Û×ÅŠ¿†`¦ó<?uÀ½ÍØĞ}ÍKô-\Ò3àPZmóüÔO ÖüÌÓq–·`ó #	(ƒe"á§qn(ÖQ“,ğøõ2Ãâ»—z3çÁ¸J“<ˆ„®[>‚~sdÁ•ÀÖŒáOŒÉßFÃÏßéñƒåêî§‘®_î×/^¾ˆ˜y¤gJĞ.HÂ¨1^œegYÚÁ3CHè_¥³sõsı¶PÊéóF??‚.`W}¶¬]¨IYV8ı|Ò¿+èë•á Q¾
üJëšÚ«*Ä¼£’Í9n8ˆÒÛ(/QÿtaÖ<¤8’Ééq—e‡nÃõ5]Á!"S}lğ	¥·á–„g¸O}Wí$Î|v8ÃÛÈå‡gèië:n ÏµÑìcõhÄR€%û©'†öìÓ­Ï5Gà-öß½tAVgÖç H8?µÁ	ÓS_Ûd+W¢Eá:¹å@w1G¬-DW‚HÅ1sËÅğì6¿2ºFmâÙò…
$¯†¸$?@r„ß9ÚÍ£†Ëù€Ïqğ@è`Œdv¬’Ğç{9@ø9h]ë÷öÉ¨ïxn‚]uPFïvâ1Õ°ã©
s &øèä<¹œ4hríBÍc¶²Á¾>	İºŞ9)Mò¥Ê(ø2ç4xÖFÆ-âµ[XO’Pº¢â¿IuŸi…ÇsâHBo/(®ùTÓ!kK+ª$!DëÏ ~Ö¼6ñ’Ö£yHè5á¿ÆKµ2ÏœnóQ"×8	¹!ı0›îJ§1|Ã3Åíƒ•$iÑ{aEƒøm†$XB+t·nA"	ÑI$¡{"›`åjôú$!Œät>ÉËÉñH(ê½tF¹æã<†ğÌâˆ( -«[ÑP‰â úÛÆ€Xƒd´w4Ã%ñjIÊ'v¿×:H×°²¹m	!óév<t{Ø!®F5ß:¬ñ}=PÉïsE»ã) ¡cIÀºCÇÒ¹G‰$tâ]¡Ğ
:ş÷çV
ŞÜ&_‰F„Ó8R,éšIÕ›–{ãõÁHo’ĞŠ¢]ñuÒŸ0heÂ½aÔ¸ÎzSÍv÷_¯z?%€Më¾^åD>;´Çp6úÆy·G)8 Lç ;ÈQT´ò¬×™ƒß2¤rÂ½€±îqåõâÒq-v%òılÏôòÙ™Éœù3°ìû nIœBµt_´û%+Ñ+ëVÂEÎæƒd÷Š·uÅkó‰[i<3®6™p/ bf½”ˆ¯6q¯]æŸ÷°ãWªå}'®PUúšÒS=hK¸t<Úº"ñ,’€»]éŸå™!$Xò:£[Šê®°5»ÿ³n”àº5¸{°„¶1D0VØo<úµnW£;5D„~gõpÓºc÷ºe·Coé'˜ê›°¯AµxlcİéWãûm§m„¯½Û‰I9"®‘ÎÁÿuø™†ÑúL¹è+>2hXú½{=  [‚Äş;Xi~êÆÓàÏ`Çû3t¼rlÑ
»˜Ç:‘Ğf[Fd÷OWØ„ª~½ïÑJÙ¬ïƒJ“ŸôgEÖ†¿íÀ‚Lb?:jĞ&áKÒ®{¯ê› ¡UfÁ˜ò×ø³¯öÅzâ{®æàŸ`‹Üª9Iñû™;S\l¥—£¹W¸…=R²Ò?Ë1ÛHö%8Éòôº>'¦¯Õ7>o4Ú]PFy:pƒÍo™­Á×Û’·Åµåv%áT+#¡™})íIAI°)x6¦¥±K`GÕ¼q-x	üúş6jåÃ¦ê±õ|ˆ{‡H:÷X¶ˆ¦îë‹6ÏÏ´yX¾:ê~·zclt÷{xWˆ‡\m ©K£raÛ•Dv	ı1|MùĞ°rôÍpêÀPwˆ¹Ø€‘ìÎlµÁoæ·3˜ õ{€8F“gªç‘œa‡€6	s ™kR±”#øØ’JÚ, ˆM~IÕäû<jˆ$ T¿®G7b(^ƒ‹	0HˆÚéìüŸÏq8§İ!\SüœÂ ì‘m)iĞçc›ISI@?o$­„¤:òwA^ù¨¡íöü„¥GĞşÔ3¹Mql†SOÆèTk}#äàÕ	÷Ñ7K=ßÙ`à9%ñİ¹Îõ[Øà’‹Ü$HBŸbˆ ÈÓgÈ‘:bƒÛëKTÏ.op>z¶b›a–ò/Åê:`§g/7X‚…Ü1Ì07ïHÛ&
štv@@„»~Áó[†ØqØ£Txº5¸!I# ÍW<…3NmUêIlDJÂmF²À¹ú7Âîs@Â=£óF/,gç™Í³c‘ÎS²C	ºI°Òè’5…9 JÁOÖ
OUñï‰÷Ü:Ïém[CAß†98ø~Ûº…²ğS¿k°ßàŠñ¨áÆöÂK4ÒFcßéYÅ|ˆ÷;¤³Fg‡ŠÏVlàC‚…²S¤íkºƒdö{ngWùŒr²±¶Ñ‰*èøÎMş¶‚yí'¸ĞÖw1ÇAn…Ünx[?z\y+˜alCõ¨Ç‹s˜7ê‚M–;h¾rÕêjG–Ş­vÀhığ×îMQåãhÔ"	l¦—äô¹†q×³c´ï¢~ÀGuw	Ğ¢ğ=3E–şµ'¾wb¿)o@sop¨xÉ>¹•F÷ª w` rŞıíÂ®¸9zf[¿”l½çv7âç^­‚$T:m'ÜÂş;ôòÈÜ^-ÜõäD<W½„w|µ‰Èx<qƒ·uq›â$Ñ¤« E{`¾D0Û4<œUc‡SÃ±—ÄãUHèmo+·²v›IñŠQ$ğìøÛ./—À}–$¡'ÍNÛ1Ç+#9ÜGßÛ¶s¤’P‹$xïHïä%ñLşN;q8#Yİr@
PçV[¿³HÖ+ ÉèèM’"«e¥ã–’ÑóH6¶")~3‘|	œ²˜»×;#	Ö:Í-!ÓyCQTµ6vh¿H±q`RC²z¬I°ùvª°Ñdsnn$Ù—àN¨¯Çà
üH;á*×äH¿ƒ/‰ß€;ø w 0q«f§Äó”b‡Š*Ú?8Ó5…ÛË£;¬4~Ïín9Éé±õ ¨sÜ@=M>|5~Ï‹X!¢Z=®1‘>ÿ\qÍğÌáé}lW÷‘¤Ò>vÿIu>Ht„{IõJ[LÿÁã£;½¼GõÀìÎE?`ĞI¬av 5ôØ-„‡ÁoÄùh<b†$Di8úQîN=’…„×é>ÀôáÎÖ	'˜Š ãgêª5~ÍÛ(GğœT+z³ç¶åâÆ-;$¸ş;ãáZj8sGx‘d‚`Lgi ÓqI"2´K è <<0©=†ì‰¢HGÔC&UÁ.õgèéäkJ	Ÿûš;gî£#Vï¿ƒ¿í	VÛp£Ó#Ş½wZ»[ÕßYiëwıŠI®q$R/i'ˆõøFH`Z¥aê’á6óÙwÙYv<Zí+Ó¾Ú¤Vİÿ!!q†SOÎ«QıÜ3:×`P_S8r	³ƒùq®=$»cvÂîaÒï=œím
|B;"GÜì0î†sŠé¬ âU^o¶s:ã’Í½ÃÈ#ÛH(>ÑUØÁÇû¾Şi_ï+ú }Õ®ß.åë»Ûûı³Ï»ãwö(›ŸSê³<V³1së^è	à£†ıÆ3P;Ü7ÉÚ©Ïr~¾½$.Ñ½‚Jö£Ò¸É¿–Ş#=s»âÓº&¯¸QNIå®# åég6à`'Ò£Ê§ö:ŒÖİKµ—g<÷:o ‚``pì$’qò{á€YŞgçhcÎ~tc5ùÁâ'‹n”!BX8õ¬u¸5‰¥ymùr?½mØÂ	>ÀœúN$.~ç„vÅctCöÜá~Nçá«}^¬=¶ ÃšWsÑd¹%jÑßFã5`ÇÉ£º¥¡o‘šæ|ÔˆéïĞ§Ò™—Yt÷ë‘1ñ·¹Q[¬}óõAr:{”æÙ
	íÒ|óêÈ+Ò!YHÓúˆC^§ëP.ºQï9ˆØYû3—ë$äŠ£D5´îÀüºù!ÆæÜZ…ŞDnXNÃ÷ôúïôWÑ­ïËâ£îAµøY ÀêYl³ÅôßÁ9ô±Mà=.HNÛ¥BÂÛØØEG0´›Ç¸ê‡ÉÏ)ô;î/”a˜Üæ+°»—SbvaÔôIñ=Jî2J¸2üKg¬r•$u6ŠÎ0jĞÊnyâ;3¢‘ÁêB‹çŞ‘lXCR} Ğ¼İù ~QĞ£pûÎ3Ãè;Z«p—-rt-eNÔné*`oy#Ïœa÷\úújZ§¶X™ÀüøY >Ëó?
/·É!§•VÚ$¡V:ÈîFø(=¶^€z¿]Ò!—ƒáMLÇ6Sÿã:ñ"5w-F¼Ê1Î$¾¯o,PY;~§P–ã¶?’ĞÃ…Çê÷À=ã8üŠ*¬Õ^nûPT,Ğayü€‹¤õ(’Õ=ş²¶İé÷ é|WQ
ìö®gÇ
½‰<'Q¨é
÷)¥œáF'ºâv|¡À1Ü€ëTİº-”z’àé óÎƒäVÚFW?ÀÆ=“L–¢;]:y® \Pf·àÅñ(hÙàùñ}€Ä=~©aŞ.D”ŸàmÂé×ïÙRArx©ìíFÄ+»)ÂpJàÖi8Ï;n`g~AúĞ* ›h¹ás0-Î3WĞ¢^i‹“Gß†sæÕx4šéƒ½œ3×‰^¶0‚v	w#C8õ¥¯A'ŒKß½˜(ÁòÆÜğœQAâ˜,$[õ:úÑÊÆ>£Sõš»^ Xød\=öDËêÊôw`SÚ‰Ç Á9ÊRa*v-ÓGó
ÓÃQÑñî7VÒ2î…Vºü¸¿p …ñ±{ò¨aŸÉ+i.IØ×ö›Û|0/‡Û™ÈO° ÒËaÔtğòÙáñ¬|9H…ºİŸPØ½Ô`y o¸uWÁAìªŞÃi<&
ımÓìƒ³<YĞäC«¤o;[bõ.¡¹kØ“}íûiçÈ-HB”à„ª?Œ`";åcKıÊ9¯n#Şäj²·!!ù$›#ˆ ‚ç	¹Û€º’â\¸£òñÕsª0Çl#	2%ÅƒGh‘¾+/Ïb#	˜¹ÊÏ¸æ«´s[ï8¡J¥ £Â »PÈ¢sdÛÏvíÀïèİUÿî¸€Ú·äôwz\=s\[QMQ{úåìş6*ŞÂÛ(ğ×SBùvu\Zí1«T» ! §#€³Çc•Ù5D²‡OÏã°
•9–7<hK$‡gòFìÃ¿$^ÇÂEK¶Mç`jËN½ú3©¶¬´VñØ eĞ”¦úïô«ÇÉ!¦‘‚Vî%¿1»WEÓ®´uì×%ñè$Ô‡[ÄHBGÙ
ßaĞ; P?% ˆ<²PÁ®8s2M:×Ä<¦Z—võŠkH‚Cr$“có`pø°ıf¢ªÀoÚJÿÇ#Õ…„§ŸàíúæÅkxÛáv"’€Ä¼$ŞÇ¦Ò!Ê£áHŞ¥b¸OKiT4ß:¯nÃÖ«(ßu<ìoJæ™ÓQı—Ä«!€6MkC¼P\6®q
÷r Â]Bp¸)º&²QŞº¥!9=ºR7ŠV}Çox,n#Áºï±J&ÏU#	½!êıõS_äT*¬4^­RaarÛ¿š„øïtuìJ%MÆVÿ5ÏŒáv.	íXIuyç$l`İoŸA2…5%€îíSâw#’ éüìQœŠIìh$p¾ë¨©ª'áp0í·AŠ‡Æ}ş;‰é®r=ÇgPËám‡÷Ü¢¤™rE*×ñŸ>êË¯’`šşUAó$8ü6»„}Pkæ€.L3ªÇ4,1P‡T8Ä<·‹âÿR”X˜Ñq÷jpŞv8ëI¥:ËQã•;&œ…“,œßôÒ–ê	hÁ×”^^5ùAØñ4Qa³Ã¦‚óĞ%Tëë=-®ù<,’A'\µy¨TècƒäpÛÿ #ãñ$³{¡H0Çt¨¨rD;¬Æ==$¬ª¿ÇQOãWRõÌ!	ş)e”tXz„~ù‹„ŠM50÷$ äŞ’İÑM”ï…^À@Ù(ÕğŒ°Iè~@‚nôş]'ıK)ùö˜ôb¸,ú6
·F_Ó¾£ÖŸ¡E¯ŸÆ+~à;‰# 8ëİ¯GúŠ YW—F{¡zÉVï6ÅAÑ w#’À9Oˆ8ğ”ÔÑ8Ï’P÷$tªD’tÈ0áğêÊ Ú’&Yî‰#ıX|'¶÷xÕAeçL€€np›	]SuÔT:9nıé!¡'§ÆTP-á”Œàa5îU?ñ"gI<à¸qˆcêBU3’ĞÉ™F@ÈÌ×bĞy‡ïë‹'Ø5Å4C‚ês ‡Jx`º0oóéÊôñ?@ÂáÖPQv<OqÌ ¹\óÁ-æztú¦ê±§ƒöä«A2@ßFÛIÏş4Çóº)$!¢‰dudÜAÛ/·-‘­ñ±‡çÀª–<ZtĞ)Æ1sH 4ÕßAâùS9Âú\uF¾>kWƒ 3G¥$Ç@²¹x¬‰Ñè€êÛı9$ k|ê†ï™CÍ*¡ˆÆqëHˆ`ëïÀ²ãU<S6¿K@S8ÛÅA|'Ø.PœyåÉqÑˆ¹¾†øË³¤…NÇ¿ô¸våØJ	åÆ:; Mœ{æØi:é3º_MümdŠÕ›:ğóœæ  6¬)z/JBîƒ´wè™Šd'¸Ğ×w"àVG’eœ=‚„Æ_:;À*=O{”™bu}æJ­úØj»;‹òAÊÆs®Höë “µ£„~`H¨“óQÅóG¥§­ßLu<F|\ı™üüP—æ¦Wë¸SÁ>ÀÍI# áé~ÉÕŸÉW|ç™¢+õ=è‡lK8Î tÀdãèg$ÉBÁö×qREâ_zöéû@âœ0HBÏ $»£‘„~‡¤úB]5’PA~ov¤ßÙ@¨'I@Ü ¡ÍvüyqTÃ^äD^s‡7å?zk©Uµã‘@(ŞFËy—Ìôı
’Ğblbèúe®n+Ÿ Ü
8[8¯ÔîErºMNk/RÂ:.@·Nj†<Ÿ…d÷ª%$€Xıwz¢\ARœ·Z)º]ø3 3’sÌŸêÁW>b÷™H)¶Î(è(ôº@²8Ú‘R¼Å£l—ÄïEëÈy$0ëê—r|<vQ§»ÅÜ¼SØ	‡G	.‰ÇÅNb(î7´ö{ÒÖĞù	YdıR"%â=)^ó(Î9ĞÍÁõÁ@ƒßU½2UÇŸq‰I å¿ƒCéu”4À#-¯_
ƒŠÇˆO õ~/ a‰ômW"µh´ÇÆög€4º¾¦Ós»'8Ó¶„•ÿ×ñ8”;É´ydÚXêbôw.ºÎÍ%è*Ÿ*\‚Şá¾pt:DT¡_’À9i]`<„æatì>’Ùı`$éá¼¸…}®éªèUr']Ã> ÖêØ¹pcø*,	t§ğø…Ø4@Õ•ƒ%ÜhÏÂ´¿öh8²ô$æà6ßI‹