describe("Array Assignment Tests", function() {
   
    it("Simple array assignment", function() {
        var $GL = '@a<-[1,2,3],return (@a).\r\n';
        expect(execute(gl.parse($GL))).toEqual([ 1, 2, 3 ]);
    });
    it("Append to array", function() {
        var $GL = '@a<-[1,2,3],@a:append(4),return (@a).\r\n';
        expect(execute(gl.parse($GL))).toEqual([ 1, 2, 3, 4 ]);
    });
    it("Short Append to array", function() {
        var $GL = '@a<-[1,2,3],@a[]<-(4),return (@a).\r\n';
        expect(execute(gl.parse($GL))).toEqual([ 1, 2, 3, 4 ]);
    });
    it("Pop from array", function() {
        var $GL = '@a<-[1,2,3],$a<-(@a:pop()),return ($a+" "+@a).\r\n';
        expect(execute(gl.parse($GL))).toEqual('3 1,2');
    });

    it("Short Pop from array", function() {
        var $GL = '@a<-[1,2,3],$a<-(@a[]),return ($a+" "+@a).\r\n';
        expect(execute(gl.parse($GL))).toEqual('3 1,2');
    });
//TODO set to aray from group
//TODO set to array from IFUN max min abs floor etc...

});
