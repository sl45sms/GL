describe("Tuple Assignment Tests", function() {
   
    it("array to tuple without tail", function() {
        var $GL = '@a<-[1,2,3],{$a,$b,$c}<-(@a),return ($a+" "+$b+" "+$c).\r\n';
        expect(execute(gl.parse($GL))).toEqual("1 2 3");
    });
    
    it("array to tuple with tail", function() {
        var $GL = '@a<-[1,2,3,4,5],{$a,$b,$c|@t}<-(@a),return ($a+" "+$b+" "+$c+" "+@t).\r\n';
        expect(execute(gl.parse($GL))).toEqual("1 2 3 4,5");
    });

    it("array to tuple with more values error", function() {
        var $GL = '@a<-[1,2,3],{$a,$b,$c,$d,$e|@t}<-(@a),return ($a+" "+$b+" "+$c+" "+@t).\r\n';
        expect(function(){execute(gl.parse($GL))}).toThrow(new Error('Params Error: Number of variables in tuple is greater than array length\non line 0:\n@a<-[1,2,3],{$a,$b,$c,$d,$e|@t}<-(@a),\n-----------------------------------^\n'));
    });

    it("group to tuple without tail", function() {
        var $GL = 'group #test() -> @a<-[1,2,3], return (@a).,\n{$a,$b,$c}<-(#test()),return ($a+" "+$b+" "+$c).\r\n';
        expect(execute(gl.parse($GL,{}))).toEqual("1 2 3");
    });

    it("group to tuple with tail", function() {
        var $GL = 'group #test() -> @a<-[1,2,3,4,5], return (@a).,\n{$a,$b,$c|@t}<-(#test()),return ($a+" "+$b+" "+$c+" "+@t).\r\n';
        expect(execute(gl.parse($GL,{}))).toEqual("1 2 3 4,5");
    });

    it("group to tuple with more values error", function() {
        var $GL = 'group #test() -> @a<-[1,2], return (@a).,\n{$a,$b,$c|@t}<-(#test()),return ($a+" "+$b+" "+$c+" "+@t).\r\n';
        expect(function(){execute(gl.parse($GL,{}))}).toThrow(new Error('Params Error: Number of variables in tuple is greater than array length returned from #TEST\non line 1:\nturn (@a)),.,,\n{$a,$b,$c|@t}<-(#test()),\n----------------------^\n'));
    });  

    it("group to tuple with group not return array", function() {
        var $GL = 'group #test() -> $a<-(1), return ($a).,\n{$a,$b,$c|@t}<-(#test()),return ($a+" "+$b+" "+$c+" "+@t).\r\n';
        expect(function(){execute(gl.parse($GL,{}))}).toThrow(new Error('RuntimeError: group #TEST does not return array\non line 1:\nturn ($a)),.,,\n{$a,$b,$c|@t}<-(#test()),\n----------------------^\n'));
    });
    
    it("group to tuple with group not defined", function() {
        var $GL = '{$a,$b,$c|@t}<-(#test()),return ($a+" "+$b+" "+$c+" "+@t).\r\n';
        expect(function(){execute(gl.parse($GL,{}))}).toThrow(new Error('NameError: group named \'#TEST\' is not defined\non line 0:\n{$a,$b,$c|@t}<-(#test()),\n----------------------^\n'));
    });  
});
