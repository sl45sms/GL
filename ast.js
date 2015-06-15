var nodejs=false;
if (typeof module !== 'undefined' && module.exports) { 
    exports.execute=execute;
    nodejs=true;
   }

var DataStructures = {
    stack : function() {                  
        var elements;
        
        this.push = function(element) {
            if (typeof(elements) === 'undefined') {
                elements = [];   
            }                            
            elements.push(element);
        }
        this.pop = function() {
            return elements.pop();
        }
        this.top = function(element) {
            return elements[elements.length - 1];
        }
    }
}

function runtimeError(error,locinfo) {
if (typeof locinfo!=="undefined"){
var guide=Array(locinfo.yylloc.first_column-1).join("-")+"^";
//throw new Error(error+"\non line "+locinfo.yylineno+":\n"+locinfo.matched+"\n"+guide+"\n"+JSON.stringify(locinfo));

throw new Error(error+"\non line "+locinfo.yylineno+":\n"+locinfo.matched+"\n"+guide+"\n");
//!!!TODO Gia kapio logo sto chrome otan einai megalo to string tou error den to deixnei! opote evgala to JSON.stringify...
}
//TODO return optional expecting
            /*
             Error: Parse error on line 3:
             $a=(1)$b=$a$c=(12)$a[]=(1).
             -----------^
             Expecting '(', got 'NL'
             */
}

var groups={}

function execute(game){
groups=game.groups;
var r = evalrun(game.program);
groups={};
return r;   
}

function evalrun(astNode) {
    var v;
    switch(astNode.type) {
        
        case 'GROUP': 
            console.log("GROUP",require('util').inspect(astNode.left, true, 10) );
            v = evalrun(astNode.left); 
            break;
            
        case 'STATEMENT': 
            r=   evalrun(astNode.left); 
            v = evalrun(astNode.right);
            break;
        
        case 'ARRAY':
            // Handle the right hand side of an array declaration
            // Set the values to real values
            var vec = [];
             var members = astNode.value;
             for(var i=0;i<members.length;i++) {
            vec.push(evalrun(members[i]));
		    }
            /*
            var vec = [];
            
            var members = astNode.value;
            
            //TODO evalrun an einai group h bif 
            for(var i=0;i<members.length;i++) {
                if(!members[i].name) {
                    console.log("Number? "+members[i].value);
                    vec.push(members[i].value);
                    
                } else {
                    console.log("Variable? "+members[i].name);
                    
                    if(!members[i].name in executionstack.top()) {
                        var error = "NameError: name '"+members[i].name+"' is not defined in list declaration";
                        runtimeError(error,astNode.locinfo);
                    }
                    var identifierValue = executionstack.top()[members[i].name];                     
                    vec.push(identifierValue);
                }
            }
            */
            
            v = vec;
            break;
            
        case 'ARRAYINDEX':
            // Handle rhs of a array index value retrievalrun
            var identifierValue = executionstack.top()[astNode.name];
            if(!(astNode.name in executionstack.top())) {

                var error = "NameError: name '"+astNode.name+"' is not defined";
                    runtimeError(error,astNode.locinfo);
            
            }
            v = identifierValue[parseInt(evalrun(astNode.index))]
            break;
            
        case 'ARRAYTOTUPLE':
        var identifierValue = executionstack.top()[astNode.name];
            if(!(astNode.name in executionstack.top())) {
                var error = "NameError: name '"+astNode.name+"' is not defined";
                    runtimeError(error,astNode.locinfo);
            }
         
         if (astNode.parameters.length>identifierValue.length){
         var error = "Params Error: Number of variables in tuple is greater than array length";
                    runtimeError(error,astNode.locinfo);    
        }
         var Index=0;
         astNode.parameters.forEach(function(Var) {
              executionstack.top()[Var.name]=identifierValue[Index];   
              Index++; 
            });
         if (astNode.tail!==null) 
         {
          executionstack.top()[astNode.tail]=identifierValue.slice(Index); 
         }
        break;

        case 'GROUPTOTUPLE':
        var call = evalrun(astNode.group);
        if(!Array.isArray(call)) {
                var error = "RuntimeError: group "+astNode.group.name+" does not return array";
                    runtimeError(error,astNode.locinfo);
            }
        if (astNode.parameters.length>call.length){
         var error = "Params Error: Number of variables in tuple is greater than array length returned from "+astNode.group.name;
                    runtimeError(error,astNode.locinfo);    
        }
         var Index=0;
         astNode.parameters.forEach(function(Var) {
              executionstack.top()[Var.name]=call[Index];   
              Index++; 
            });
         if (astNode.tail!==null) 
         {
          executionstack.top()[astNode.tail]=call.slice(Index); 
         }
        break;
        case 'BIFTOTUPLE':
        var call = evalrun(astNode.bif);
        //console.log(call);
        if(!Array.isArray(call)) {
               var error = "RuntimeError: bif "+astNode.bif.name+" does not return array";
                    runtimeError(error,astNode.locinfo);
            }
           
        if (astNode.parameters.length>call.length){
         var error = "Params Error: Number of variables in tuple is greater than array length returned from "+astNode.bif.name;
                    runtimeError(error,astNode.locinfo);    
        }
         var Index=0;
         astNode.parameters.forEach(function(Var) {
              executionstack.top()[Var.name]=call[Index];   
              Index++; 
            });  
         if (astNode.tail!==null) 
         {
          executionstack.top()[astNode.tail]=call.slice(Index); 
         }
        break;

        case 'LENGTH':
            //TODO pio eksipno... 
            //an einai string to mikos tou string
            //an einai function tote error
            //an einai number to mikos san na itan string?
            var identifierValue = executionstack.top()[astNode.name];
            if(!(astNode.name in executionstack.top())) {
                var error = "NameError: name '"+astNode.name+"' is not defined in list declaration";
                runtimeError(error,astNode.locinfo);
            }

            if(!Array.isArray(identifierValue)) {
                var error = "TypeError: object of type '"+(typeof identifierValue)+"' has no length()";
                    runtimeError(error,astNode.locinfo);
            }
            v = identifierValue.length;
            break; 
            
        case 'METHOD':
        
            // Handle list.append(expr) and list.pop(expr)
            var identifierValue = executionstack.top()[astNode.name];//TODO fix this code
                                                                     //ginete kai kalitera....
            if(!(astNode.name in executionstack.top())) {
                   //Create list if not object exist.. for cases of $l[]<-(1) before $l<-[1]
                    executionstack.top()[astNode.name]=[]; 
                    identifierValue = executionstack.top()[astNode.name];
            }
            
            if(!Array.isArray(identifierValue)) {   
             var error = "AttributeError: '"+(typeof identifierValue)+"' object has no attribute '"+astNode.METHOD+"'";
             runtimeError(error,astNode.locinfo);
            }
            
            
            if(astNode.METHOD == ":APPEND") {
                
               var r =  evalrun(astNode.argument);
               
               if (Array.isArray(r))  
               {
                v =  identifierValue.concat(r);
                identifierValue=v;
                 }
               else 
               v = identifierValue.push(r);
            
            } else if(astNode.METHOD == ":POP") {
                v = identifierValue.pop(); 
            } 
            else if(astNode.METHOD == ":LENGTH") {
                v = identifierValue.length; 
            }
            else {
                var error = "AttributeError: '"+astNode.name+"' has no METHOD '"+astNode.METHOD+"'";
                    runtimeError(error,astNode.locinfo);
            }
            
            executionstack.top()[astNode.name] = identifierValue;
            break;
        
        case 'IFUNCALL':
                   // Get function node and eval it
                         ifunName = astNode.name;
                         callparams = astNode.parameters;
           // New stack with given params included to match signature
            var values = {};
            for(var i = 0;i<callparams.length;i++) {
                
                var callpari = callparams[i];
                values["v"+i]=Number(evalrun(callpari));
            }
                  //TODO na dokimaso oti doulevoun kai na ftiakso tests!
                   switch(ifunName) {
					  case 'ABS': //abs(x)	Returns the absolute value of x
					        if (callparams.length!=1){  
					          var error = "Params Error: ABS needs one parameter";
                              runtimeError(error,astNode.locinfo);
						      }
					         v=Math.abs(values["v0"]);
					         break;  
					  case 'ACOS': //acos(x)	Returns the arccosine of x, in radians
					        if (callparams.length!=1){  
					          var error = "Params Error: ACOS needs one parameter";
                              runtimeError(error,astNode.locinfo);
						      }
					         v=Math.acos(values["v0"]);
					         break;  
					  case 'ASIN'://asin(x)	Returns the arcsine of x, in radians
					        if (callparams.length!=1){  
					          var error = "Params Error: ASIN needs one parameter";
                              runtimeError(error,astNode.locinfo);
						      }
					         v=Math.asin(values["v0"]);
					         break;  
					  case 'ATAN'://atan(x)	Returns the arctangent of x as a numeric value between -PI/2 and PI/2 radians
					        if (callparams.length!=1){  
					          var error = "Params Error: ATAN needs one parameter";
                              runtimeError(error,astNode.locinfo);
						      }
					         v=Math.atan(values["v0"]);
					         break;  
					  case 'ATAN2'://atan2(y,x)	Returns the arctangent of the quotient of its arguments
					        if (callparams.length!=2){  
					          var error = "Params Error: ABS needs two parameters";
                              runtimeError(error,astNode.locinfo);
						      }
					         v=Math.atan(values["v0"],values["v1"]);
					         break;  
					  case 'CEIL'://ceil(x)	Returns x, rounded upwards to the nearest integer
					        if (callparams.length!=1){  
					          var error = "Params Error: CEIL needs one parameter";
                              runtimeError(error,astNode.locinfo);
						      }
					         v=Math.ceil(values["v0"]);					  
					         break;  
					  case 'COS'://cos(x)	Returns the cosine of x (x is in radians)
					        if (callparams.length!=1){  
					          var error = "Params Error: COS needs one parameter";
                              runtimeError(error,astNode.locinfo);
						      }
					         v=Math.cos(values["v0"]);
					         break;  
					  case 'EXP'://exp(x)	Returns the value of Ex
					        if (callparams.length!=1){  
					          var error = "Params Error: EXP needs one parameter";
                              runtimeError(error,astNode.locinfo);
						      }
					         v=Math.exp(values["v0"]);
					         break;  
					  case 'FLOOR'://floor(x)	Returns x, rounded downwards to the nearest integer
					        if (callparams.length!=1){  
					          var error = "Params Error: FLOOR needs one parameter";
                              runtimeError(error,astNode.locinfo);
						      }
					         v=Math.floor(values["v0"]);					        
					         break;  
					  case 'LOG'://log(x)	Returns the natural logarithm (base E) of x
					        if (callparams.length!=1){  
					          var error = "Params Error: LOG needs one parameter";
                              runtimeError(error,astNode.locinfo);
						      }
					         v=Math.log(values["v0"]);
					         break;
					  case 'MAX'://max(x,y,z,...,n)	Returns the number with the highest value
					        if (callparams.length<1){  
					          var error = "Params Error: MAX needs at least one parameter";
                              runtimeError(error,astNode.locinfo);
						      }
					         var arr = [];
                          for (var key in values) {
                          if (values.hasOwnProperty(key)) {
                           arr.push(values[key]);  
                              }}
					          v=Math.max.apply( Math, arr );   
					        break;  
					  case 'MIN'://min(x,y,z,...,n)	Returns the number with the lowest value
					        if (callparams.length<1){  
					          var error = "Params Error: MIN needs at least one parameter";
                              runtimeError(error,astNode.locinfo);
						      }
					      var arr = [];
                          for (var key in values) {
                          if (values.hasOwnProperty(key)) {
                           arr.push(values[key]);  
                              }}
					         v=Math.min.apply( Math, arr );   
					         break;
					  case 'POW'://pow(x,y)	Returns the value of x to the power of y
					        if (callparams.length!=2){  
					          var error = "Params Error: POW needs two parameters";
                              runtimeError(error,astNode.locinfo);
						      }
					         v=Math.pow(values["v0"],values["v1"]);
					         break;  
					  case 'RANDOM':
					          if (callparams.length>2){  
					          var error = "Params Error: RANDOM needs at most two parameters";
                              runtimeError(error,astNode.locinfo);
						      }   
					         if (callparams.length==2) v=~~(Math.random() * (values["v0"]-values["v1"]+1)+values["v1"]); //~~(Math.random() * (max-min+1)+min) 
					         else if (callparams.length==1) v=~~(Math.random() * (values["v0"]+1) | 0);//~~(Math.random() * (max+1) | 0) 
					         else v=Math.random();					                   
					         break;
					  case 'ROUND'://round(x)	Rounds x to the nearest integer
					        if (callparams.length!=1){  
					          var error = "Params Error: ROUND needs one parameter";
                              runtimeError(error,astNode.locinfo);
						      }
					         v=Math.round(values["v0"]);
					         break;  
					  case 'SIN'://sin(x)	Returns the sine of x (x is in radians)
					        if (callparams.length!=1){  
					          var error = "Params Error: SIN needs one parameter";
                              runtimeError(error,astNode.locinfo);
						      }
					         v=Math.sin(values["v0"]);
					         break;
					  case 'SQRT'://sqrt(x)	Returns the square root of x
					        if (callparams.length!=1){  
					          var error = "Params Error: SQRT needs one parameter";
                              runtimeError(error,astNode.locinfo);
						      }
					  		v=Math.sqrt(values["v0"]);
					         break;  
					  case 'TAN'://tan(x)	Returns the tangent of an angle
					        if (callparams.length!=1){  
					          var error = "Params Error: TAN needs one parameter";
                              runtimeError(error,astNode.locinfo);
						      }
					        v=Math.tan(values["v0"]);
					        break;
				      default:
				         v="unknown"				      				      				      
				      } 
            
            break;
        case 'BIFCALL':
            // Get function node and eval it
            bifName = astNode.name;
            callparams = astNode.parameters;
            
            // New stack with given params included to match signature
            var values = {};
            for(var i = 0;i<callparams.length;i++) {
                
                var callpari = callparams[i];
                values["v"+i]=evalrun(callpari);
            }
            
            // Call external js function with same name... 
            if (nodejs) {
             console.log("\033\[31m runing in node no bifs here \033\[0m");
             console.log("bif ",bifName,"executionStack",JSON.stringify(values));
             return "";
            } else
            {
             //http://jsperf.com/uuid-generator-opt/7 TODO use faster UUID gen (e7)
             var id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});
             var Timeout = (Date.now()/1000)+2;      
     
             self.postMessage({'cmd': 'bif', 'name':bifName,'values':values,'id':id});
             var bif={"id":null,"return":null};

            //XHR  i can't found another way without server :(
             var xhr= new XMLHttpRequest;
             while ((bif.id!=id) && Timeout>(Date.now()/1000)){ 
             try{
             xhr.timeout = 1000;
             xhr.open("GET","?id="+id,false);
             xhr.send();
             bif=JSON.parse(xhr.responseText);
            } catch(e){
              console.log(e); 
             }
            }
/* This works but is not possible(?) to know myurl 
var blob = new Blob(returnvalue,{ type: 'text/json' });
var myurl= window.URL.createObjectURL(blob);
var xhr = new XMLHttpRequest();
xhr.open('GET', myurl, false);
xhr.send();
console.log(xhr.responseText);
*/
         return JSON.parse(bif.return);
            }
            break;

        case 'GROUPCALL':
            // Get function node and evalrunuate it
            groupName = astNode.name;
            functionNode = groups[groupName];
            if(!(groupName in groups)) {
                var error = "NameError: group named '"+groupName+"' is not defined";
                    runtimeError(error,astNode.locinfo);
            }
            
            // Match given parameters to function signature in number only (no typing for piethon)
            groupparams = functionNode.parameters.reverse(); //!!!TODO FIX ginete tou reverse to kagelo... dokimase me 3 emfolevomena group....
            callparams = astNode.parameters;
            if(groupparams.length != callparams.length) {
                var error = "TypeError: "+funcName+"() takes exactly "+groupparams.length+" arguments ("+callparams.length+" given)";
                    runtimeError(error,astNode.locinfo);
            }

            // New stack with given params included to match signature
            var newstackframe = {};
            for(var i = 0;i<groupparams.length;i++) {
                var callpari = callparams[i];
                var grouppari = groupparams[i];
                newstackframe[grouppari.name]=evalrun(callpari);
            }
            
            // Push new stack frame
            executionstack.push(newstackframe);
            // Call group
            v = evalrun(functionNode);
            // Pop, back to old stack frame
            executionstack.pop();
            break;
            
        case 'IF': 
            if(evalrun(astNode.left)) {
                v = evalrun(astNode.right);     
            }
            break;
            
        case 'IFELSE': 
            if(evalrun(astNode.left)) {
                v = evalrun(astNode.middle);    
            } else {
                v = evalrun(astNode.right);     
            }
            break;
            
        case 'WHILE':
            while(evalrun(astNode.left)) {
                v = evalrun(astNode.right);     
            }
            break;
            
        case 'IDENT': 
            // Look up value in table
            var identifierValue = executionstack.top()[astNode.name];
            if(!(astNode.name in executionstack.top())) {
                var error = "NameError: name '"+astNode.name+"' is not defined";
                    runtimeError(error,astNode.locinfo);
            }
            v = identifierValue;
            break;
        
        case '=':
            // Set value of identifier in table            
            if(astNode.left.type == 'ARRAYINDEX') {
                var vec2 = executionstack.top()[astNode.left.name];
            if (vec2===undefined) throw "NameError: name '"+astNode.left.name+"' is not defined in list declaration\n";
                else
                vec2[parseInt(evalrun(astNode.left.index))] = evalrun(astNode.right);//TODO Edo giati integer??? den mporei na einai string px?
                                                                                     //Gia na mporei na caneo compare kai strings..  
            } else {
                executionstack.top()[astNode.left.name] = evalrun(astNode.right);
            }
            break;
            
        case '>':
            if(evalrun(astNode.left) >  evalrun(astNode.right)) {
                v = true;
            } else {
                v = false;
            }
            break;
            
        case '>=':
            if(evalrun(astNode.left) >=  evalrun(astNode.right)) {
                v = true;
            } else {
                v = false;
            }
            break;
            
        case '<':
            if(evalrun(astNode.left) <  evalrun(astNode.right)) {
                v = true;
            } else {
                v = false;
            }
            break;
            
        case '<=':
            if(evalrun(astNode.left) <=  evalrun(astNode.right)) {
                v = true;
            } else {
                v = false;
            }
            break;
            
        case '==':
            if(evalrun(astNode.left) == evalrun(astNode.right)) {
                v = true;
            } else {
                v = false;
            }
            break;
            
        case '!=':
            if(evalrun(astNode.left) != evalrun(astNode.right)) {
                v = true;
            } else {
                v = false;
            }
            break;
            
        case 'no-op': 
            // Do nothing!
        break;
        
        case 'DEBUG':
            v = evalrun(astNode.left);
           if (v!==null)
            {
            console.log(v.toString(),'\t\t\t\t\t log at line:',astNode.locinfo.yylineno);
            }
            break;
            
        case 'RETURN': v = evalrun(astNode.left); break; 
        case 'NUMBER': v = astNode.value; break;
        case 'STRING': v = astNode.value.replace(/\"/g,''); break;
        
        case '+': 
            left = evalrun(astNode.left);
            right = evalrun(astNode.right);
            v = (left + right);     
            break;
            
        case '-': 
            left = evalrun(astNode.left);
            right = evalrun(astNode.right);
            v = left - right;   
            break;
            
        case '*': 
            left = evalrun(astNode.left);
            right = evalrun(astNode.right);
            v = (left * right);     
        break;
        
        case '/': 
            left = evalrun(astNode.left);
            right = evalrun(astNode.right);
            v = (left / right);     
            break;
            
        case '%': 
            left = evalrun(astNode.left);
            right = evalrun(astNode.right);
            v = (left % right);     
            break;
            
        case '^': 
            left = evalrun(astNode.left);
            right = evalrun(astNode.right);
            v = Math.pow(left, right);
            break;      
        
        case 'UMINUS': v = -1 * evalrun(astNode.left); break;
        
        default: {
        var error = "feature error: unknown node type '"+astNode.type+"'";
            runtimeError(error,astNode.locinfo);
      }
    }
    return v;
}

/*
function resetForRun() {
    groups = {
        // Pre-create the main function
    //  '#main#' : new createNode('function', {name : '#main#'})
    };
}
*/

var executionstack = new DataStructures.stack();

executionstack.push({});
