//%options ranges
//%options backtrack_lexer

//TODO to  case-insensitive den fenete na doulevei... tha ekane pio aplo to lex
%options case-insensitive

//TODO FLOATS!!!!

/* lexical grammar Case Insesitive*/

%lex


%{
    var parser = yy.parser;
%}

//TODO USE this bellow....
nl              \n|\r\n|\r|\f|\v
hex             [0-9a-fA-F]
nonascii        [\200-\377]
nmstart         [_a-zA-Z]|{nonascii}
nmchar          [_a-zA-Z0-9-]|{nonascii}
string          \"(?:[^"\\]|\\.)*\"
//num             [0-9]+|[0-9]*"."[0-9]+    //[0-9]+("."[0-9]+)?\b
//TODO negative reals!!
//real			[-+]?[0-9]*\.[0-9]+
real			\`[-+]?[0-9]*\.[0-9]+\`
//real			\`[0-9]*\.[0-9]*\`
integer         [0-9]+

url             ([!#$%&*-~]|{nonascii})*
w               [ \t\r\n\f]*

range           \?{1,6}|{hex}(\?{0,5}|{hex}(\?{0,4}|{hex}(\?{0,3}|{hex}(\?{0,2}|{hex}(\??|{h})))))
nth             [\+-]?{integer}*n([\t\r\n ]*[\+-][\t\r\n ]*{integer})?

A   [Aa]
B   [Bb]
C   [Cc]
D   [Dd]
E   [Ee]
F   [Ff]
G   [Gg]
H   [Hh]
I   [Ii]
J   [Jj]
K   [Kk]
L   [Ll]
M   [Mm]
N   [Nn]
O   [Oo]
P   [Pp]
Q   [Qq]
R   [Rr]
S   [Ss]
T   [Tt]
U   [Uu]
V   [Vv]
W   [Ww]
X   [Xx]
Y   [Yy]
Z   [Zz]

//%options flex 
//auto psaxnei to regex pou exei to megalitero match...
//isos omos gia auto ta kanei skata!!

%s group
%x c_comment

%%

/*Warning regex must be in order*/

//Automatic Fix for inline missing comma before end. ,.,

\)[ \s]*\.  {yy.lexer.unput("),.,"); }
\][ \s]*\.  {yy.lexer.unput("],.,"); }

<<EOF>>                 return 'EOF'

{nl}                    {return 'NL'}
//\s+           /*Clean whitespaces*/
"//"[^\n]*      /* C++ style comments */

"/*"                this.begin("c_comment"); /*C style comments*/
<c_comment>"*/"     this.popState();
<c_comment>([^*]|\n)+|.    /* eat up */
<c_comment><<EOF>>      {/*TODO print error for unterminated comment*/}


/*bif's and specials*/
_[a-zA-Z]+[a-zA-Z0-9_]*\b  return 'BIF'
{D}{E}{B}{U}{G}            return 'DEBUG'     //TODO make it as bif? 
{L}{E}{N}{G}{T}{H}      return 'LENGTH'  

/* */
{T}{R}{U}{E}            return 'TRUE'
{F}{A}{L}{S}{E}         return 'FALSE'

/* */
{I}{F}                  return 'IF'
{E}{L}{S}{E}            return 'ELSE'


/*Custom procedures*/
{G}{R}{O}{U}{P}           return 'GROUP'
{F}{U}{N}{C}{T}{I}{O}{N}  return 'GROUP'

 
{W}{H}{I}{L}{E}         return 'WHILE'
"->"                    return '->'
{R}{E}{T}{U}{R}{N}      return 'RETURN'


/* */
//TODO oi array na pernoun variables kai alles array h to apotelesma apo mia group h mia bif.. epishs string...
\@[a-zA-Z0-9_]*\b   return 'ARRAY'   //TODO unicode...

\$[a-zA-Z0-9_]*\b   return 'VAR'     //TODO unicode...

 
\#[a-zA-Z]+[a-zA-Z0-9_]*\b  return 'GROUPNAME'  //TODO unicode...
\:[a-zA-Z0-9_]*\s*(?=\()\b  return 'METHOD'


/* maths adv */ 
{A}{B}{S}				return 'ABS'
{A}{C}{O}{S}            return 'ACONS'
{A}{S}{I}{N}            return 'ASIN'
{A}{T}{A}{N}2           return 'ATAN2'
{A}{T}{A}{N}            return 'ATAN'
{C}{E}{I}{L}            return 'CEIL' 
{C}{O}{S}               return 'COS'  
{E}{X}{P}               return 'EXP'
{F}{L}{O}{O}{R}         return 'FLOOR'
{L}{O}{G}				return 'LOG'
{M}{A}{X}				return 'MAX'
{M}{I}{N}				return 'MIN'
{P}{O}{W}				return 'POW'
{R}{A}{N}{D}{O}{M}		return 'RANDOM'
{R}{O}{U}{N}{D}			return 'ROUND'
{S}{I}{N}				return 'SIN'
{S}{Q}{R}{T}			return 'SQRT'
{T}{A}{N}				return 'TAN'

/* maths */
//"++"                    return '++' //TODO
//"--"                    return '--' //TODO
"*"                     return '*'
"/"                     return '/'
"-"                     return '-'
"+"                     return '+'
"^"                     return '^'
"%"                     return '%'





//Equal compiration here gia na mporo na kano = stis variables....
"=="                    return '==' //TODO isos to compiration na to kano me ena = ??? gia na mhn xrizete na mpenei kai auto edo...

/* Assignments for groups...*/
"="                     return '=' 
"<-"                    return '='

/* comparison ops */
"<="                    return '<='
">="                    return '>=' 
"<"                     return '<'
">"                     return '>'         
"!="                    return '!='


/**/
"("                     return '('
")"                     return ')'
"["                     return '['
"]"                     return ']'
"{"                     return '{'
"}"                     return '}'
"|"                     return '|'



{integer}?\b            return 'INTEGER'
{real}					return 'REAL'

";"                     /* Ignore C semmicolon */
"."                     return '.' //end of program end of group
","                     return ',' //for inline seperation


{string}                return 'STRING' 


.                       {;}

/lex

//Edo apothikeuontai ta group.. 
%parse-param  groups  

{{

function locinfo()
    {
    //TODO na to kano na pezei me thn teleutea ekdosh tou jison exei kapia themata...
    //console.log(parser.lexer.showPosition());
    return {"yylloc":parser.lexer.yylloc,"yylineno":parser.lexer.yylineno,"matched":parser.lexer.matched.slice(-40)};
    }
    
function createNode(type, parameters, locinfo,category) {
    this.category = category;
    this.type = type;
    this.locinfo=locinfo;
    for(var key in parameters){ this[key] = parameters[key];}
    return this;
}

}}

/* operator associations and precedence */

%left  '+' '-'
%left  '*' '/' '%'
%left  '^'
%left  '<' '<=' '>' '>=' '==' '!='
%left UMINUS
%nonassoc ELSE

%start gl

/* language grammar */
%% 

gl   
    : stmt '.' {
        return {"groups":groups,"program":$1};
    }
    ;


var_list
     :variable  {   
        $$ = [];
        $$.push(new createNode('IDENT', {name : $1},locinfo()));
    }
    | variable ',' var_list {
        $=[]
        $$ = new createNode('IDENT', {name : $1},locinfo());
        $3.push($$)
        $$ = $3;
    }
    | { $$ = []; }
    ;
    
parm_list  
          //TODO check order on group params!!!
    : variable  {   
        $$ = [];
        $$.push(new createNode('IDENT', {name : $1},locinfo()));
    }
    | variable ',' parm_list {
        $=[]
        $$ = new createNode('IDENT', {name : $1},locinfo());
        $3.push($$)
        $$ = $3;
    }
    | array {   
        $$ = [];
        $$.push(new createNode('IDENT', {name : $1},locinfo()));
    }
    | array ',' parm_list {
        $=[]
        $$ = new createNode('IDENT', {name : $1},locinfo());
        $3.push($$)
        $$ = $3;
    } 
    | groupname '(' parm_list ')' {
        $$ = []
        $$.push(new createNode('GROUPCALL', {name : $1, parameters : $3},locinfo()))
    }
    | groupname '(' parm_list ')' ',' parm_list {
        $$=[]
        $$ = new createNode('GROUPCALL', {name : $1, parameters : $3},locinfo());
        $6.push($$)
        //$$=$6.reverse();//TODO!!! na tsekaro kala an oi parametroi mpenoun se seira (group se allo group array me group klp) 
        $$=$6;
    }
    | bif '(' parm_list ')' {
        $$ = [];
        $$.push(new createNode('BIFCALL', {name : $1, parameters : $3},locinfo()))
    }
    | bif '(' parm_list ')' ',' parm_list {
        $$=[];
        $$ = new createNode('BIFCALL', {name : $1, parameters : $3},locinfo());
        $6.push($$);
        //$$=$6.reverse();
        $$=$6; 
    }    
    | num {
        $$ = [];
        $$.push(new createNode('NUMBER', {value : $1},locinfo()));
    }
    | num ',' parm_list {
        $$=[];
        $$ = new createNode('NUMBER', {value : $1},locinfo());
        $3.push($$);
        $$=$3;
    }
    | str {
        $$ = [];
        $$.push(new createNode('STRING', {value : $1},locinfo())); 
    }
    | str ',' parm_list {
        $$=[]
        $$ = new createNode('STRING', {value : $1},locinfo());
        $3.push($$)
        $$=$3
    }
    | { $$ = []; }
    ;

stmt 
    : stmt handle_assigments 'NL' {$$ = new createNode('STATEMENT', {left : $1, right :$2},locinfo());}
    | stmt handle_assigments ',' {$$ = new createNode('STATEMENT', {left : $1, right :$2},locinfo());}
    | stmt selection   {$$ = new createNode('STATEMENT', {left : $1, right :$2},locinfo());}
    | stmt loops    {$$ = new createNode('STATEMENT', {left : $1, right :$2},locinfo());}
    | stmt groupdef   {$$ = new createNode('STATEMENT', {left : $1, right : new createNode('no-op')});}
    | { $$ = new createNode('no-op'); } // No-op
    ;

groupdef 
    : 'GROUP' groupname '(' parm_list ')' '->' stmt '.' {
       // console.log($parm_list.reverse(),"/n/n");
        var gr = $2;
        // AST for function, add to function table
        var mainGRP = new createNode('GROUP', {left : $7, name : gr, parameters : $4.reverse()},locinfo());
        groups[gr] = mainGRP; 
    }
    ;

selection 
    : 'IF' '(' exp ')' '->' stmt  '.'   {$$ = new createNode('IF', {left : $3, right : $6},locinfo());}
    | 'IF' '(' exp ')' '->' stmt 'ELSE' '->' stmt '.'   {
        $$ = new createNode('IFELSE', {left : $3, middle: $6,right: $9},locinfo());     
    }
    ;  

//TODO for, until,
loops
    :
     'WHILE' '(' exp ')' '->' stmt '.' {
        $$ = new createNode('WHILE', {left : $3, right:$6},locinfo());
    }
    ; 

handle_assigments  
    : handle_assigments variable '=' '(' exp ')' {
        // Identifier assigment 
        var lf= new createNode('IDENT', {name : $2},locinfo()); 
        $$ = new createNode('=', {left : lf, right : $5},locinfo());
    }
    
    | handle_assigments variable '=' groupname '(' parm_list ')' {
        // Group call and assign
        var lf= new createNode('IDENT', {name : $2},locinfo());
        var call = new createNode('GROUPCALL', {name : $4, parameters : $6.reverse()},locinfo());
        $$ = new createNode('=', {left : lf, right : call},locinfo());
    }

    | handle_assigments array '=' '[' parm_list ']' {
        // Array creation and assignment
        var lf= new createNode('IDENT', {name : $2},locinfo());
       // console.log(require('util').inspect($5, true, 10));//inspect works on node only    
        var arr = new createNode('ARRAY', {value : $5.reverse()},locinfo());
        $$ = new createNode('=', {left :lf, right : arr},locinfo());
        
    }
    | handle_assigments array '[' ']' '=' '(' exp ')' {
         $$ = new createNode('METHOD', { name : $2, METHOD : ":APPEND", argument : $7},locinfo());
         } // APPEND METHOD shortcat ie @a[]<-(1)

    | handle_assigments array '[' ']' { $$ = new createNode('METHOD', { name : $2, METHOD : ":POP"},locinfo());} //POP shortcat $v1=$v[]
    | handle_assigments array meth '(' exp ')' {$$ = new createNode('METHOD', { name : $2, METHOD : $3, argument : $5},locinfo());} //$v.append(1) 
    | handle_assigments array meth '(' ')' {$$ = new createNode('METHOD', { name : $2, METHOD : $3},locinfo());}//POP $v.pop() 

    | handle_assigments array '[' exp ']' '=' '(' exp ')' { 
        // Assignment of an array index
        var lf  = new createNode('ARRAYINDEX', {name : $2, index : $4},locinfo()); 
        $$ = new createNode('=', {left : lf, right : $8},locinfo());
    }

    | handle_assigments ifun '(' parm_list ')' {
        $$ = new createNode('IFUNCALL', {name : $2, parameters : $4.reverse()},locinfo());
    }

    | handle_assigments groupname '(' parm_list ')' {
        $$ = new createNode('GROUPCALL', {name : $2, parameters : $4.reverse()},locinfo());
    }

    | handle_assigments bif '(' parm_list ')' {
        $$ = new createNode('BIFCALL', {name : $2, parameters : $4.reverse()},locinfo());
    }

    | handle_assigments  '{' var_list '}' '=' '(' array ')' {
        $$ = new createNode('ARRAYTOTUPLE', {name : $7, parameters : $3.reverse(),tail:null},locinfo());
    }

    | handle_assigments '{' var_list '|' array '}' '=' '(' array ')' {
        $$ = new createNode('ARRAYTOTUPLE', {name : $9, parameters : $3.reverse(),tail:$5},locinfo());
    }

    | handle_assigments '{' var_list '}' '=' '(' groupname '(' parm_list ')' ')'{
        var call = new createNode('GROUPCALL', {name : $7, parameters : $9.reverse()},locinfo());
        $$ = new createNode('GROUPTOTUPLE', {group : call, parameters : $3.reverse(),tail:null},locinfo());
    }

    | handle_assigments '{' var_list '|' array '}' '=' '(' groupname '(' parm_list ')' ')' { 
        var call = new createNode('GROUPCALL', {name : $9, parameters : $11.reverse()},locinfo());
        $$ = new createNode('GROUPTOTUPLE', {group : call, parameters : $3.reverse(),tail:$5},locinfo());
    }

    | handle_assigments  '{' var_list '}' '=' '(' bif '(' parm_list ')' ')'{ 
       var call = new createNode('BIFCALL', {name : $7, parameters : $9.reverse()},locinfo());
       $$ = new createNode('BIFTOTUPLE', {bif : call, parameters : $3.reverse(),tail:null},locinfo());
    }

    | handle_assigments  '{' var_list '|' array '}' '=' '(' bif '(' parm_list ')' ')'{ 
       var call = new createNode('BIFCALL', {name : $9, parameters : $11.reverse()},locinfo());
       $$ = new createNode('BIFTOTUPLE', {bif : call, parameters : $3.reverse(),tail:$5},locinfo());
    }

    | handle_assigments 'DEBUG' '(' exp ')' {
        // Print statement
        $$ = new createNode('DEBUG', {left : $4},locinfo());
    }

    | handle_assigments 'RETURN' '(' exp ')' {
        // Return statement
        $$ = new createNode('RETURN', {left : $4},locinfo());
    }

    | { $$ = new createNode('no-op'); } // No-op
    ;

exp    
    : exp '+' exp   { $$ = new createNode('+', {left : $1, right : $3},locinfo()); }
    | exp '-' exp   { $$ = new createNode('-', {left : $1, right : $3},locinfo());}
    | exp '*' exp   { $$ = new createNode('*', {left : $1, right : $3},locinfo());}
    | exp '^' exp   { $$ = new createNode('^', {left : $1, right : $3},locinfo());}
    | exp '/' exp   { $$ = new createNode('/', {left : $1, right : $3},locinfo());}
    | exp '%' exp   { $$ = new createNode('%', {left : $1, right : $3},locinfo());}
    | exp '<' exp   { $$ = new createNode('<', {left : $1, right : $3},locinfo());}
    | exp '<=' exp  { $$ = new createNode('<=', {left : $1, right : $3},locinfo());}
    | exp '>' exp   { $$ = new createNode('>', {left : $1, right : $3},locinfo());}
    | exp '>=' exp  { $$ = new createNode('>=', {left : $1, right : $3},locinfo());}
    | exp '!=' exp  { $$ = new createNode('!=', {left : $1, right : $3},locinfo());}
    | exp '==' exp  { $$ = new createNode('==', {left : $1, right : $3},locinfo());}
    | '-' exp %prec UMINUS  { $$ = new createNode('UMINUS', {left : $2},locinfo()); }
    | num { $$ = new createNode('NUMBER', {value : $1},locinfo()); }
    | variable { $$ = new createNode('IDENT', {name : $1},locinfo()); }
    | str {$$ = new createNode('STRING', {value: $1},locinfo()); }

    | array { $$ = new createNode('IDENT', {name : $1},locinfo()); }
    | array '[' exp ']' { $$ = new createNode('ARRAYINDEX', {name : $1, index : $3},locinfo()); }
    | array meth '(' ')' { $$ = new createNode('METHOD', { name : $1, METHOD : $2},locinfo());} //POP 
    | array '[' ']' {  $$ = new createNode('METHOD', { name : $1, METHOD : ":POP"},locinfo());}

    | 'LENGTH' '(' variable ')' {$$ = new createNode('LENGTH', {name : $3},locinfo());}
    | 'LENGTH' '(' array ')' {$$ = new createNode('LENGTH', {name : $3},locinfo());}

    | 'TRUE'    { $$ = new createNode('NUMBER', {value : 1},locinfo()); }
    | 'FALSE'   { $$ = new createNode('NUMBER', {value : 0},locinfo()); }

    | ifun '('parm_list ')' {
        // Group call as expresion, must return something
        $$ = new createNode('IFUNCALL', {name : $1, parameters : $3.reverse()},locinfo());
    }

    | groupname '(' parm_list ')' {
        // Group call as expresion, must return something
        $$ = new createNode('GROUPCALL', {name : $1, parameters : $3.reverse()},locinfo());
    }
    | bif '('parm_list ')' {
        // Group call as expresion, must return something
        $$ = new createNode('BIFCALL', {name : $1, parameters : $3.reverse()},locinfo());
    }
    ;
    
    
    



//Internal functions
ifun
    : 'ABS'     {$$ = yytext.toUpperCase();}
    | 'ACONS'   {$$ = yytext.toUpperCase();}
    | 'ASIN'    {$$ = yytext.toUpperCase();}
    | 'ATAN'    {$$ = yytext.toUpperCase();}
    | 'ATAN2'   {$$ = yytext.toUpperCase();}
    | 'CEIL'    {$$ = yytext.toUpperCase();}
    | 'COS'     {$$ = yytext.toUpperCase();}
    | 'EXP'     {$$ = yytext.toUpperCase();}
    | 'FLOOR'   {$$ = yytext.toUpperCase();}
    | 'LOG'     {$$ = yytext.toUpperCase();}
    | 'MAX'     {$$ = yytext.toUpperCase();}
    | 'MIN'     {$$ = yytext.toUpperCase();}
    | 'POW'     {$$ = yytext.toUpperCase();}
    | 'RANDOM'  {$$ = yytext.toUpperCase();}
    | 'ROUND'   {$$ = yytext.toUpperCase();}
    | 'SIN'     {$$ = yytext.toUpperCase();}
    | 'SQRT'    {$$ = yytext.toUpperCase();}
    | 'TAN'     {$$ = yytext.toUpperCase();}
    ;
    
bif 
    : 'BIF' {$$ = yytext.toUpperCase();}
    ;

groupname
    : 'GROUPNAME' {$$ = yytext.toUpperCase();}
    ;

array
    : 'ARRAY' {$$ = yytext.toUpperCase();}
    ;

variable 
    : 'VAR' {$$ = yytext.toUpperCase();}
    ;

str
    : 'STRING' {$$ = yytext;}
    ;
    
meth
    : 'METHOD' {$$ = yytext.toUpperCase();}
    ;

num 
    : 'INTEGER' {$$ = Number(yytext);}
    | 'REAL'  {$$ = Number(yytext.substring(1, yytext.length-1));//TODO na do an mporei na parei REAL xoris backtick
		         }
    ;

%%

/* AST here */




