/**
 * @file A fantasy name generator library.
 * @version 1.0
 * @license Public Domain
 *
 * This library is designed after the RinkWorks Fantasy Name Generator.
 * @see http://www.rinkworks.com/namegen/
 *
 * @example
 * var generator = NameGen.compile("sV'i");
 * generator.toString();  // Emits a new name on each call
 * // => "entheu'loaf"
 *
 * ## Pattern Syntax
 *
 *   The compile() function creates a name generator based on an input
 * pattern. The letters s, v, V, c, B, C, i, m, M, D, and d represent
 * different types of random replacements. Everything else is emitted
 * literally.
 *
 *   s - generic syllable
 *   v - vowel
 *   V - vowel or vowel combination
 *   c - consonant
 *   B - consonant or consonant combination suitable for beginning a word
 *   C - consonant or consonant combination suitable anywhere in a word
 *   i - insult
 *   m - mushy name
 *   M - mushy name ending
 *   D - consonant suited for a stupid person's name
 *   d - syllable suited for a stupid person's name (begins with a vowel)
 *
 *   All characters between parenthesis () are emitted literally. For
 * example, the pattern "s(dim)", emits a random generic syllable
 * followed by "dim".
 *
 *   Characters between angle brackets <> emit patterns from the table
 * above. Imagine the entire pattern is wrapped in one of these.
 *
 *   In both types of groupings, a vertical bar | denotes a random
 * choice. Empty groups are allowed. For example, "(foo|bar)" emits
 * either "foo" or "bar". The pattern "<c|v|>" emits a constant,
 * vowel, or nothing at all.
 *
 *   An exclamation point ! means to capitalize the component that
 * follows it. For example, "!(foo)" will emit "Foo" and "v!s" will
 * emit a lowercase vowel followed by a capitalized syllable, like
 * "eRod".
 *
 *   A tilde ~ means to reverse the letters of the component that
 * follows it. For example, "~(foo)" will emit "oof". To reverse an
 * entire template, wrap it in brackets. For example, to reverse
 * "sV'i" as a whole use "~<sV'i>". The template "~sV'i" will only
 * reverse the initial syllable.
 *
 * ## Internals
 *
 *   A name generator is anything with a toString() method, including,
 * importantly, strings themselves. The generator constructors
 * (Random, Sequence) perform additional optimizations when *not* used
 * with the `new` keyword: they may pass through a provided generator,
 * combine provided generators, or even return a simple string.
 *
 *   New pattern symbols added to NameGen.symbols will automatically
 * be used by the compiler.
 */

/**
 * Number of generated output possibilities (generator function).
 * @returns {number}
 * @method
 */
String.prototype.combinations = function() { return 1; };

/**
 * Longest possible output length (generator function).
 * @returns {number}
 * @method
 */
String.prototype.min = function() { return this.length; };

/**
 * Shortest possible output length (generator function).
 * @returns {number}
 * @method
 */
String.prototype.max = function() { return this.length; };

/**
 * List all possible outputs (generator function).
 * @returns {Array} An array of output strings.
 * @method
 */
String.prototype.enumerate = function() { return [String(this)]; };

/**
 * @namespace NameGen Everything relevant to the name generators.
 */
var NameGen = NameGen || {};

/**
 * Strings generated by the symbol generators.
 */
NameGen.symbols = {
    s: ['ach', 'ack', 'ad', 'age', 'ald', 'ale', 'an', 'ang', 'ar', 'ard',
        'as', 'ash', 'at', 'ath', 'augh', 'aw', 'ban', 'bel', 'bur', 'cer',
        'cha', 'che', 'dan', 'dar', 'del', 'den', 'dra', 'dyn', 'ech', 'eld',
        'elm', 'em', 'en', 'end', 'eng', 'enth', 'er', 'ess', 'est', 'et',
        'gar', 'gha', 'hat', 'hin', 'hon', 'ia', 'ight', 'ild', 'im', 'ina',
        'ine', 'ing', 'ir', 'is', 'iss', 'it', 'kal', 'kel', 'kim', 'kin',
        'ler', 'lor', 'lye', 'mor', 'mos', 'nal', 'ny', 'nys', 'old', 'om',
        'on', 'or', 'orm', 'os', 'ough', 'per', 'pol', 'qua', 'que', 'rad',
        'rak', 'ran', 'ray', 'ril', 'ris', 'rod', 'roth', 'ryn', 'sam',
        'say', 'ser', 'shy', 'skel', 'sul', 'tai', 'tan', 'tas', 'ther',
        'tia', 'tin', 'ton', 'tor', 'tur', 'um', 'und', 'unt', 'urn', 'usk',
        'ust', 'ver', 'ves', 'vor', 'war', 'wor', 'yer'],
    v: ['a', 'e', 'i', 'o', 'u', 'y'],
    V: ['a', 'e', 'i', 'o', 'u', 'y', 'ae', 'ai', 'au', 'ay', 'ea', 'ee',
        'ei', 'eu', 'ey', 'ia', 'ie', 'oe', 'oi', 'oo', 'ou', 'ui'],
    c: ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r',
        's', 't', 'v', 'w', 'x', 'y', 'z'],
    B: ['b', 'bl', 'br', 'c', 'ch', 'chr', 'cl', 'cr', 'd', 'dr', 'f', 'g',
        'h', 'j', 'k', 'l', 'll', 'm', 'n', 'p', 'ph', 'qu', 'r', 'rh', 's',
        'sch', 'sh', 'sl', 'sm', 'sn', 'st', 'str', 'sw', 't', 'th', 'thr',
        'tr', 'v', 'w', 'wh', 'y', 'z', 'zh'],
    C: ['b', 'c', 'ch', 'ck', 'd', 'f', 'g', 'gh', 'h', 'k', 'l', 'ld', 'll',
        'lt', 'm', 'n', 'nd', 'nn', 'nt', 'p', 'ph', 'q', 'r', 'rd', 'rr',
        'rt', 's', 'sh', 'ss', 'st', 't', 'th', 'v', 'w', 'y', 'z'],
    i: ['air', 'ankle', 'ball', 'beef', 'bone', 'bum', 'bumble', 'bump',
        'cheese', 'clod', 'clot', 'clown', 'corn', 'dip', 'dolt', 'doof',
        'dork', 'dumb', 'face', 'finger', 'foot', 'fumble', 'goof',
        'grumble', 'head', 'knock', 'knocker', 'knuckle', 'loaf', 'lump',
        'lunk', 'meat', 'muck', 'munch', 'nit', 'numb', 'pin', 'puff',
        'skull', 'snark', 'sneeze', 'thimble', 'twerp', 'twit', 'wad',
        'wimp', 'wipe'],
    m: ['baby', 'booble', 'bunker', 'cuddle', 'cuddly', 'cutie', 'doodle',
        'foofie', 'gooble', 'honey', 'kissie', 'lover', 'lovey', 'moofie',
        'mooglie', 'moopie', 'moopsie', 'nookum', 'poochie', 'poof',
        'poofie', 'pookie', 'schmoopie', 'schnoogle', 'schnookie',
        'schnookum', 'smooch', 'smoochie', 'smoosh', 'snoogle', 'snoogy',
        'snookie', 'snookum', 'snuggy', 'sweetie', 'woogle', 'woogy',
        'wookie', 'wookum', 'wuddle', 'wuddly', 'wuggy', 'wunny'],
    M: ['boo', 'bunch', 'bunny', 'cake', 'cakes', 'cute', 'darling',
        'dumpling', 'dumplings', 'face', 'foof', 'goo', 'head', 'kin',
        'kins', 'lips', 'love', 'mush', 'pie', 'poo', 'pooh', 'pook', 'pums'],
    D: ['b', 'bl', 'br', 'cl', 'd', 'f', 'fl', 'fr', 'g', 'gh', 'gl', 'gr',
        'h', 'j', 'k', 'kl', 'm', 'n', 'p', 'th', 'w'],
    d: ['elch', 'idiot', 'ob', 'og', 'ok', 'olph', 'olt', 'omph', 'ong',
        'onk', 'oo', 'oob', 'oof', 'oog', 'ook', 'ooz', 'org', 'ork', 'orm',
        'oron', 'ub', 'uck', 'ug', 'ulf', 'ult', 'um', 'umb', 'ump', 'umph',
        'un', 'unb', 'ung', 'unk', 'unph', 'unt', 'uzz']
};

/**
 * Return true if the given thing is a string.
 * @param object - The object to be tested
 * @returns {boolean}
 * @private
 */
NameGen._isString = function(object) {
    return Object.prototype.toString.call(object) === '[object String]';
};

/**
 * Combine adjacent strings in the array.
 * @param {Array} array - The array to be compressed (unmodified)
 * @returns {Array} A new array with the strings compressed
 * @private
 */
NameGen._compress = function(array) {
    var emit = [], accum = [];
    function dump() {
        if (accum.length > 0) {
            emit.push(accum.join(''));
            accum.length = 0;
        }
    }
    for (var i = 0; i < array.length; i++) {
        if (NameGen._isString(array[i])) {
            accum.push(array[i]);
        } else {
            dump();
            emit.push(array[i]);
        }
    }
    dump();
    return emit;
};

/**
 * @param {string} string
 * @returns {string}
 */
NameGen._capitalize = function(string) {
    return string.replace(/^./, function(c) {
        return c.toUpperCase();
    });
};

/**
 * @param {string} string
 * @returns {string}
 */
NameGen._reverse = function(string) {
    return string.split(/(?:)/).reverse().join('');
};

/**
 * When emitting, selects a random generator.
 * @param {Array} generators - An array of name generators
 * @returns A name generator, not necessarily a new one
 * @constructor
 */
NameGen.Random = function(generators) {
    if (!(this instanceof NameGen.Random)) {
        switch (generators.length) {
        case 0:
            return '';
        case 1:
            return generators[0];
        default:
            return new NameGen.Random(generators);
        }
    }
    this.sub = generators;
    return this;
};

/**
 * Generate a new name.
 * @returns {string}
 * @method
 */
NameGen.Random.prototype.toString = function() {
    if (this.sub.length > 0) {
        var i = Math.floor(Math.random() * this.sub.length);
        return this.sub[i].toString();
    } else {
        return '';
    }
};

/**
 * Number of generated output possibilities (generator function).
 * @returns {number}
 * @method
 */
NameGen.Random.prototype.combinations = function() {
    return Math.max(1, this.sub.reduce(function (total, g) {
        return total + g.combinations();
    }, 0));
};

/**
 * Shortest possible output length (generator function).
 * @returns {number}
 * @method
 */
NameGen.Random.prototype.min = function() {
    return Math.min.apply(null, this.sub.map(function(g) {
        return g.min();
    }));
};

/**
 * Longest possible output length (generator function).
 * @returns {number}
 * @method
 */
NameGen.Random.prototype.max = function() {
    return Math.max.apply(null, this.sub.map(function(g) {
        return g.max();
    }));
};

/**
 * Enumerate all possible outputs.
 * @returns {Array} An array of all possible outputs.
 * @method
 */
NameGen.Random.prototype.enumerate = function() {
    var enums = this.sub.map(function(g) { return g.enumerate(); });
    return Array.prototype.concat.apply(enums[0], enums.slice(1));
};

/**
 * Runs each provided generator in turn when generating.
 * @param {Array} generators - An array of name generators
 * @returns A name generator, not necessarily a new one
 * @constructor
 */
NameGen.Sequence = function(generators) {
    generators = NameGen._compress(generators);
    if (!(this instanceof NameGen.Sequence)) {
        switch (generators.length) {
        case 0:
            return '';
        case 1:
            return generators[0];
        default:
            return new NameGen.Sequence(generators);
        }
    }
    this.sub = generators;
    return this;
};

/**
 * Generate a new name.
 * @returns {string}
 * @method
 */
NameGen.Sequence.prototype.toString = function() {
    return this.sub.join('');
};

/**
 * Number of generated output possibilities (generator function).
 * @returns {number}
 * @method
 */
NameGen.Sequence.prototype.combinations = function() {
    return this.sub.reduce(function (total, g) {
        return total * g.combinations();
    }, 1);
};

/**
 * Shortest possible output length (generator function).
 * @returns {number}
 * @method
 */
NameGen.Sequence.prototype.min = function() {
    return this.sub.reduce(function(total, g) {
        return total + g.min();
    }, 0);
};

/**
 * Longest possible output length (generator function).
 * @returns {number}
 * @method
 */
NameGen.Sequence.prototype.max = function() {
    return this.sub.reduce(function(total, g) {
        return total + g.max();
    }, 0);
};

/**
 * Enumerate all possible outputs.
 * @returns {Array} An array of all possible outputs.
 * @method
 */
NameGen.Sequence.prototype.enumerate = function() {
    var enums = this.sub.map(function(g) { return g.enumerate(); });
    function enumerate(enums, prefix) {
        if (enums.length === 1) {
            return enums[0].map(function(e) {
                return prefix + e;
            });
        } else {
            var output = [];
            var rest = enums.slice(1);
            for (var i = 0; i < enums[0].length; i++) {
                output.push(enumerate(rest, prefix + enums[0][i]));
            }
            return Array.prototype.concat.apply([], output);
        }
    }
    return enumerate(enums, '');
};

/**
 * Create a new type of generator based on a string transform function.
 * @param {Function} f
 */
NameGen.fromTransform = function(f) {
    function G(generator) {
        if (!(this instanceof G)) {
            if (NameGen._isString(generator)) {
                return f(generator);
            } else {
                return new G(generator);
            }
        }
        this.generator = generator;
        return this;
    }

    G.prototype.toString = function() {
        return f(this.generator.toString());
    };
    G.prototype.combinations = function() {
        return this.generator.combinations();
    };
    G.prototype.min = function() {
        return this.generator.min();
    };
    G.prototype.max = function() {
        return this.generator.max();
    };
    G.prototype.enumerate = function() {
        return this.generator.enumerate().map(f);
    };

    return G;
};

/**
 * Decorate a generator by capitalizing its output.
 * @constructor
 */
NameGen.Capitalizer = NameGen.fromTransform(NameGen._capitalize);

/**
 * Decorate a generator by reversing its output.
 * @constructor
 */
NameGen.Reverser = NameGen.fromTransform(NameGen._reverse);

/* Everything below here is the compiler. */

/**
 * Builds up a generator grouping in the compiler.
 * @constructor
 */
NameGen._Group = function() {
    this.set = [[]];
    this.wrappers = [];
};

/**
 * @param g The generator to add to this group
 * @returns This object
 */
NameGen._Group.prototype.add = function(g) {
    while (this.wrappers.length > 0) {
        var type = this.wrappers.pop();
        g = type(g);
    }
    this.set[this.set.length - 1].push(g);
    return this;
};

/**
 * Start a new grouping in this generator group.
 * @returns This object
 */
NameGen._Group.prototype.split = function() {
    this.set.push([]);
    return this;
};

/**
 * Wrap the next added generator with this decorator.
 * @param type The type of the decorator to wrap.
 * @returns This object
 */
NameGen._Group.prototype.wrap = function(type) {
    this.wrappers.push(type);
    return this;
};

/**
 * @returns A generator built from this grouping.
 */
NameGen._Group.prototype.emit = function() {
    return NameGen.Random(this.set.map(NameGen.Sequence));
};

/**
 * Builds up a literal grouping in the compiler.
 * @constructor
 */
NameGen._Literal = function() {
    NameGen._Group.call(this);
};
NameGen._Literal.prototype = Object.create(NameGen._Group.prototype);

/**
 * Builds up a symbolic grouping in the compiler.
 * @constructor
 */
NameGen._Symbol = function() {
    NameGen._Group.call(this);
};
NameGen._Symbol.prototype = Object.create(NameGen._Group.prototype);

/**
 * Add a new generator based on a character.
 * @param c The generator's symbol
 * @returns This object
 */
NameGen._Symbol.prototype.add = function(g, literal) {
    if (!literal) {
        g = NameGen.Random(NameGen.symbols[g] || [g]);
    }
    NameGen._Group.prototype.add.call(this, g);
    return this;
};

/**
 * Compile a generator specification string into a generator.
 * @param {string} input - The pattern string to compile
 * @returns A name generator
 */
NameGen.compile = function(input) {
    var stack = [];
    stack.top = function() {
        return stack[stack.length - 1];
    };

    stack.push(new NameGen._Symbol());
    for (var i = 0; i < input.length; i++) {
        var c = input[i];
        switch (c) {
        case '<':
            stack.push(new NameGen._Symbol());
            break;
        case '(':
            stack.push(new NameGen._Literal());
            break;
        case '>':
        case ')':
            if (stack.length === 1) {
                throw new Error('Unbalanced brackets.');
            } else if (c === '>' && stack.top() instanceof NameGen._Literal) {
                throw new Error('Unexpected ">" in input.');
            } else if (c === ')' && stack.top() instanceof NameGen._Symbol) {
                throw new Error('Unexpected ")" in input.');
            }
            var last = stack.pop().emit();
            stack.top().add(last, true);
            break;
        case '|':
            stack.top().split();
            break;
        case '!':
            if (stack.top() instanceof NameGen._Symbol) {
                stack.top().wrap(NameGen.Capitalizer);
            } else {
                stack.top().add(c);
            }
            break;
        case '~':
            if (stack.top() instanceof NameGen._Symbol) {
                stack.top().wrap(NameGen.Reverser);
            } else {
                stack.top().add(c);
            }
            break;
        default:
            stack.top().add(c);
            break;
        }
    }
    if (stack.length !== 1) {
        throw new Error('Missing closing bracket.');
    } else {
        return stack.top().emit();
    }
};
