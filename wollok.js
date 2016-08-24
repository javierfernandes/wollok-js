module.exports = (function() {
  "use strict";

  /*
   * Generated by PEG.js 0.9.0.
   *
   * http://pegjs.org/
   */

  function peg$subclass(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
  }

  function peg$SyntaxError(message, expected, found, location) {
    this.message  = message;
    this.expected = expected;
    this.found    = found;
    this.location = location;
    this.name     = "SyntaxError";

    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, peg$SyntaxError);
    }
  }

  peg$subclass(peg$SyntaxError, Error);

  function peg$parse(input) {
    var options = arguments.length > 1 ? arguments[1] : {},
        parser  = this,

        peg$FAILED = {},

        peg$startRuleFunctions = { wfile: peg$parsewfile },
        peg$startRuleFunction  = peg$parsewfile,

        peg$c0 = function(i) { return i },
        peg$c1 = function(imports, e) { return e },
        peg$c2 = function(imports, elements) {
             	return {
             		imports : imports,
             		elements : elements
             	}
             },
        peg$c3 = function(name) {
        		return {
        			fqn : name.fqn.elements,
        			isWildcard : name.isWildcard
        		}
        	},
        peg$c4 = function(name, b) {return b},
        peg$c5 = function(name, body) {
        		return {
        			type : 'object',
        			name : name,
        			members : body ? body.members : []
        		}
        	},
        peg$c6 = function(instanceVariables) {
        	    var members = []
        	    instanceVariables.forEach(function(i) { members.push(i) })
        		return { members : members }
        	  },
        peg$c7 = function(name, right) {
        		return {
        			name : name,
        			initValue : right ? right.initValue : undefined
        		}
        	},
        peg$c8 = function(initValue) {
        		return { initValue: initValue }
        	},
        peg$c9 = ".",
        peg$c10 = { type: "literal", value: ".", description: "\".\"" },
        peg$c11 = function(name, i) { return i },
        peg$c12 = function(name, elements) {
        	var parts = [name]
        	elements.forEach(function(e) {
        		parts.push(e)
        	})
        	return {
        		elements: parts
        	}
        },
        peg$c13 = "*",
        peg$c14 = { type: "literal", value: "*", description: "\"*\"" },
        peg$c15 = function(fqn, wildcard) {
        	return {
        		fqn : fqn,
        		isWildcard : !!wildcard
        	}
        },
        peg$c16 = /^[A-Za-z0-9_]/,
        peg$c17 = { type: "class", value: "[A-Za-z0-9_]", description: "[A-Za-z0-9_]" },
        peg$c18 = function(str) { return str.join('') },
        peg$c19 = "import",
        peg$c20 = { type: "literal", value: "import", description: "\"import\"" },
        peg$c21 = "package",
        peg$c22 = { type: "literal", value: "package", description: "\"package\"" },
        peg$c23 = "object",
        peg$c24 = { type: "literal", value: "object", description: "\"object\"" },
        peg$c25 = "class",
        peg$c26 = { type: "literal", value: "class", description: "\"class\"" },
        peg$c27 = "mixin",
        peg$c28 = { type: "literal", value: "mixin", description: "\"mixin\"" },
        peg$c29 = "var",
        peg$c30 = { type: "literal", value: "var", description: "\"var\"" },
        peg$c31 = "=",
        peg$c32 = { type: "literal", value: "=", description: "\"=\"" },
        peg$c33 = /^[ \t\n\r]/,
        peg$c34 = { type: "class", value: "[ \\t\\n\\r]", description: "[ \\t\\n\\r]" },
        peg$c35 = ";",
        peg$c36 = { type: "literal", value: ";", description: "\";\"" },
        peg$c37 = "{",
        peg$c38 = { type: "literal", value: "{", description: "\"{\"" },
        peg$c39 = "}",
        peg$c40 = { type: "literal", value: "}", description: "\"}\"" },
        peg$c41 = "+",
        peg$c42 = { type: "literal", value: "+", description: "\"+\"" },
        peg$c43 = function(left, right) { return left + right; },
        peg$c44 = function(left, right) { return left * right; },
        peg$c45 = "(",
        peg$c46 = { type: "literal", value: "(", description: "\"(\"" },
        peg$c47 = ")",
        peg$c48 = { type: "literal", value: ")", description: "\")\"" },
        peg$c49 = function(additive) { return additive; },
        peg$c50 = { type: "other", description: "integer" },
        peg$c51 = /^[0-9]/,
        peg$c52 = { type: "class", value: "[0-9]", description: "[0-9]" },
        peg$c53 = function(digits) { return parseInt(digits.join(""), 10); },

        peg$currPos          = 0,
        peg$savedPos         = 0,
        peg$posDetailsCache  = [{ line: 1, column: 1, seenCR: false }],
        peg$maxFailPos       = 0,
        peg$maxFailExpected  = [],
        peg$silentFails      = 0,

        peg$result;

    if ("startRule" in options) {
      if (!(options.startRule in peg$startRuleFunctions)) {
        throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
      }

      peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
    }

    function text() {
      return input.substring(peg$savedPos, peg$currPos);
    }

    function location() {
      return peg$computeLocation(peg$savedPos, peg$currPos);
    }

    function expected(description) {
      throw peg$buildException(
        null,
        [{ type: "other", description: description }],
        input.substring(peg$savedPos, peg$currPos),
        peg$computeLocation(peg$savedPos, peg$currPos)
      );
    }

    function error(message) {
      throw peg$buildException(
        message,
        null,
        input.substring(peg$savedPos, peg$currPos),
        peg$computeLocation(peg$savedPos, peg$currPos)
      );
    }

    function peg$computePosDetails(pos) {
      var details = peg$posDetailsCache[pos],
          p, ch;

      if (details) {
        return details;
      } else {
        p = pos - 1;
        while (!peg$posDetailsCache[p]) {
          p--;
        }

        details = peg$posDetailsCache[p];
        details = {
          line:   details.line,
          column: details.column,
          seenCR: details.seenCR
        };

        while (p < pos) {
          ch = input.charAt(p);
          if (ch === "\n") {
            if (!details.seenCR) { details.line++; }
            details.column = 1;
            details.seenCR = false;
          } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
            details.line++;
            details.column = 1;
            details.seenCR = true;
          } else {
            details.column++;
            details.seenCR = false;
          }

          p++;
        }

        peg$posDetailsCache[pos] = details;
        return details;
      }
    }

    function peg$computeLocation(startPos, endPos) {
      var startPosDetails = peg$computePosDetails(startPos),
          endPosDetails   = peg$computePosDetails(endPos);

      return {
        start: {
          offset: startPos,
          line:   startPosDetails.line,
          column: startPosDetails.column
        },
        end: {
          offset: endPos,
          line:   endPosDetails.line,
          column: endPosDetails.column
        }
      };
    }

    function peg$fail(expected) {
      if (peg$currPos < peg$maxFailPos) { return; }

      if (peg$currPos > peg$maxFailPos) {
        peg$maxFailPos = peg$currPos;
        peg$maxFailExpected = [];
      }

      peg$maxFailExpected.push(expected);
    }

    function peg$buildException(message, expected, found, location) {
      function cleanupExpected(expected) {
        var i = 1;

        expected.sort(function(a, b) {
          if (a.description < b.description) {
            return -1;
          } else if (a.description > b.description) {
            return 1;
          } else {
            return 0;
          }
        });

        while (i < expected.length) {
          if (expected[i - 1] === expected[i]) {
            expected.splice(i, 1);
          } else {
            i++;
          }
        }
      }

      function buildMessage(expected, found) {
        function stringEscape(s) {
          function hex(ch) { return ch.charCodeAt(0).toString(16).toUpperCase(); }

          return s
            .replace(/\\/g,   '\\\\')
            .replace(/"/g,    '\\"')
            .replace(/\x08/g, '\\b')
            .replace(/\t/g,   '\\t')
            .replace(/\n/g,   '\\n')
            .replace(/\f/g,   '\\f')
            .replace(/\r/g,   '\\r')
            .replace(/[\x00-\x07\x0B\x0E\x0F]/g, function(ch) { return '\\x0' + hex(ch); })
            .replace(/[\x10-\x1F\x80-\xFF]/g,    function(ch) { return '\\x'  + hex(ch); })
            .replace(/[\u0100-\u0FFF]/g,         function(ch) { return '\\u0' + hex(ch); })
            .replace(/[\u1000-\uFFFF]/g,         function(ch) { return '\\u'  + hex(ch); });
        }

        var expectedDescs = new Array(expected.length),
            expectedDesc, foundDesc, i;

        for (i = 0; i < expected.length; i++) {
          expectedDescs[i] = expected[i].description;
        }

        expectedDesc = expected.length > 1
          ? expectedDescs.slice(0, -1).join(", ")
              + " or "
              + expectedDescs[expected.length - 1]
          : expectedDescs[0];

        foundDesc = found ? "\"" + stringEscape(found) + "\"" : "end of input";

        return "Expected " + expectedDesc + " but " + foundDesc + " found.";
      }

      if (expected !== null) {
        cleanupExpected(expected);
      }

      return new peg$SyntaxError(
        message !== null ? message : buildMessage(expected, found),
        expected,
        found,
        location
      );
    }

    function peg$parsewfile() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$currPos;
      s3 = peg$parseImport();
      if (s3 !== peg$FAILED) {
        s4 = peg$parsewhitespace();
        if (s4 !== peg$FAILED) {
          peg$savedPos = s2;
          s3 = peg$c0(s3);
          s2 = s3;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
      } else {
        peg$currPos = s2;
        s2 = peg$FAILED;
      }
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$currPos;
        s3 = peg$parseImport();
        if (s3 !== peg$FAILED) {
          s4 = peg$parsewhitespace();
          if (s4 !== peg$FAILED) {
            peg$savedPos = s2;
            s3 = peg$c0(s3);
            s2 = s3;
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parseWLibraryElement();
        if (s4 !== peg$FAILED) {
          s5 = peg$parsewhitespace();
          if (s5 !== peg$FAILED) {
            peg$savedPos = s3;
            s4 = peg$c1(s1, s4);
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parseWLibraryElement();
          if (s4 !== peg$FAILED) {
            s5 = peg$parsewhitespace();
            if (s5 !== peg$FAILED) {
              peg$savedPos = s3;
              s4 = peg$c1(s1, s4);
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c2(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseImport() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = peg$parseKW_IMPORT();
      if (s1 !== peg$FAILED) {
        s2 = peg$parsewhitespace1();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseQualifiedNameWithWildcard();
          if (s3 !== peg$FAILED) {
            s4 = peg$parsesemicolon();
            if (s4 === peg$FAILED) {
              s4 = null;
            }
            if (s4 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c3(s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseWLibraryElement() {
      var s0;

      s0 = peg$parseWPackage();
      if (s0 === peg$FAILED) {
        s0 = peg$parseWClass();
        if (s0 === peg$FAILED) {
          s0 = peg$parseWNamedObject();
          if (s0 === peg$FAILED) {
            s0 = peg$parseWMixin();
          }
        }
      }

      return s0;
    }

    function peg$parseWPackage() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parseKW_PACKAGE();
      if (s1 !== peg$FAILED) {
        s2 = peg$parsewhitespace1();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseQualifiedName();
          if (s3 !== peg$FAILED) {
            s1 = [s1, s2, s3];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseWClass() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parseKW_CLASS();
      if (s1 !== peg$FAILED) {
        s2 = peg$parsewhitespace1();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseID();
          if (s3 !== peg$FAILED) {
            s1 = [s1, s2, s3];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseWNamedObject() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8;

      s0 = peg$currPos;
      s1 = peg$parseKW_OBJECT();
      if (s1 !== peg$FAILED) {
        s2 = peg$parsewhitespace1();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseID();
          if (s3 !== peg$FAILED) {
            s4 = peg$parsewhitespace1();
            if (s4 !== peg$FAILED) {
              s5 = peg$parselcurlybracket();
              if (s5 !== peg$FAILED) {
                s6 = peg$currPos;
                s7 = peg$parseWNamedObjectBody();
                if (s7 !== peg$FAILED) {
                  peg$savedPos = s6;
                  s7 = peg$c4(s3, s7);
                }
                s6 = s7;
                if (s6 === peg$FAILED) {
                  s6 = null;
                }
                if (s6 !== peg$FAILED) {
                  s7 = peg$parsewhitespace();
                  if (s7 !== peg$FAILED) {
                    s8 = peg$parsercurlybracket();
                    if (s8 !== peg$FAILED) {
                      peg$savedPos = s0;
                      s1 = peg$c5(s3, s6);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseWNamedObjectBody() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parseWVariableDeclaration();
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parseWVariableDeclaration();
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c6(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseWMixin() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parseKW_MIXIN();
      if (s1 !== peg$FAILED) {
        s2 = peg$parsewhitespace1();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseID();
          if (s3 !== peg$FAILED) {
            s1 = [s1, s2, s3];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseWVariableDeclaration() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = peg$parseKW_VAR();
      if (s1 !== peg$FAILED) {
        s2 = peg$parsewhitespace1();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseID();
          if (s3 !== peg$FAILED) {
            s4 = peg$parseWVariableRightSide();
            if (s4 === peg$FAILED) {
              s4 = null;
            }
            if (s4 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c7(s3, s4);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseWVariableRightSide() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = peg$parsewhitespace();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseSYM_ASSIGNMENT();
        if (s2 !== peg$FAILED) {
          s3 = peg$parsewhitespace();
          if (s3 !== peg$FAILED) {
            s4 = peg$parseID();
            if (s4 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c8(s4);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseQualifiedName() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parseID();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 46) {
          s4 = peg$c9;
          peg$currPos++;
        } else {
          s4 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c10); }
        }
        if (s4 !== peg$FAILED) {
          s5 = peg$parseID();
          if (s5 !== peg$FAILED) {
            peg$savedPos = s3;
            s4 = peg$c11(s1, s5);
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 46) {
            s4 = peg$c9;
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c10); }
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parseID();
            if (s5 !== peg$FAILED) {
              peg$savedPos = s3;
              s4 = peg$c11(s1, s5);
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c12(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseQualifiedNameWithWildcard() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = peg$parseQualifiedName();
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 46) {
          s3 = peg$c9;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c10); }
        }
        if (s3 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 42) {
            s4 = peg$c13;
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c14); }
          }
          if (s4 !== peg$FAILED) {
            s3 = [s3, s4];
            s2 = s3;
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 === peg$FAILED) {
          s2 = null;
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c15(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseID() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      if (peg$c16.test(input.charAt(peg$currPos))) {
        s2 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c17); }
      }
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          if (peg$c16.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c17); }
          }
        }
      } else {
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c18(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseKW_IMPORT() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$parsewhitespace();
      if (s1 !== peg$FAILED) {
        if (input.substr(peg$currPos, 6).toLowerCase() === peg$c19) {
          s2 = input.substr(peg$currPos, 6);
          peg$currPos += 6;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c20); }
        }
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseKW_PACKAGE() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$parsewhitespace();
      if (s1 !== peg$FAILED) {
        if (input.substr(peg$currPos, 7).toLowerCase() === peg$c21) {
          s2 = input.substr(peg$currPos, 7);
          peg$currPos += 7;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c22); }
        }
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseKW_OBJECT() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$parsewhitespace();
      if (s1 !== peg$FAILED) {
        if (input.substr(peg$currPos, 6).toLowerCase() === peg$c23) {
          s2 = input.substr(peg$currPos, 6);
          peg$currPos += 6;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c24); }
        }
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseKW_CLASS() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$parsewhitespace();
      if (s1 !== peg$FAILED) {
        if (input.substr(peg$currPos, 5).toLowerCase() === peg$c25) {
          s2 = input.substr(peg$currPos, 5);
          peg$currPos += 5;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c26); }
        }
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseKW_MIXIN() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$parsewhitespace();
      if (s1 !== peg$FAILED) {
        if (input.substr(peg$currPos, 5).toLowerCase() === peg$c27) {
          s2 = input.substr(peg$currPos, 5);
          peg$currPos += 5;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c28); }
        }
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseKW_VAR() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$parsewhitespace();
      if (s1 !== peg$FAILED) {
        if (input.substr(peg$currPos, 3).toLowerCase() === peg$c29) {
          s2 = input.substr(peg$currPos, 3);
          peg$currPos += 3;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c30); }
        }
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseSYM_ASSIGNMENT() {
      var s0;

      if (input.charCodeAt(peg$currPos) === 61) {
        s0 = peg$c31;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c32); }
      }

      return s0;
    }

    function peg$parsewhitespace() {
      var s0, s1;

      s0 = [];
      if (peg$c33.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c34); }
      }
      while (s1 !== peg$FAILED) {
        s0.push(s1);
        if (peg$c33.test(input.charAt(peg$currPos))) {
          s1 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c34); }
        }
      }

      return s0;
    }

    function peg$parsewhitespace1() {
      var s0, s1;

      s0 = [];
      if (peg$c33.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c34); }
      }
      if (s1 !== peg$FAILED) {
        while (s1 !== peg$FAILED) {
          s0.push(s1);
          if (peg$c33.test(input.charAt(peg$currPos))) {
            s1 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c34); }
          }
        }
      } else {
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsesemicolon() {
      var s0;

      if (input.charCodeAt(peg$currPos) === 59) {
        s0 = peg$c35;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c36); }
      }

      return s0;
    }

    function peg$parselcurlybracket() {
      var s0;

      if (input.charCodeAt(peg$currPos) === 123) {
        s0 = peg$c37;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c38); }
      }

      return s0;
    }

    function peg$parsercurlybracket() {
      var s0;

      if (input.charCodeAt(peg$currPos) === 125) {
        s0 = peg$c39;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c40); }
      }

      return s0;
    }

    function peg$parseadditive() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parsemultiplicative();
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 43) {
          s2 = peg$c41;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c42); }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseadditive();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c43(s1, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$parsemultiplicative();
      }

      return s0;
    }

    function peg$parsemultiplicative() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parseprimary();
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 42) {
          s2 = peg$c13;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c14); }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parsemultiplicative();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c44(s1, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$parseprimary();
      }

      return s0;
    }

    function peg$parseprimary() {
      var s0, s1, s2, s3;

      s0 = peg$parseinteger();
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 40) {
          s1 = peg$c45;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c46); }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parseadditive();
          if (s2 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 41) {
              s3 = peg$c47;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c48); }
            }
            if (s3 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c49(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      }

      return s0;
    }

    function peg$parseinteger() {
      var s0, s1, s2;

      peg$silentFails++;
      s0 = peg$currPos;
      s1 = [];
      if (peg$c51.test(input.charAt(peg$currPos))) {
        s2 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c52); }
      }
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          if (peg$c51.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c52); }
          }
        }
      } else {
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c53(s1);
      }
      s0 = s1;
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c50); }
      }

      return s0;
    }


    	function s(obj, property) {
    		return obj.hasOwnProperty(property) ? obj[property] : undefined 
    	}


    peg$result = peg$startRuleFunction();

    if (peg$result !== peg$FAILED && peg$currPos === input.length) {
      return peg$result;
    } else {
      if (peg$result !== peg$FAILED && peg$currPos < input.length) {
        peg$fail({ type: "end", description: "end of input" });
      }

      throw peg$buildException(
        null,
        peg$maxFailExpected,
        peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
        peg$maxFailPos < input.length
          ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
          : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
      );
    }
  }

  return {
    SyntaxError: peg$SyntaxError,
    parse:       peg$parse
  };
})()