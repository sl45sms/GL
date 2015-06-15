describe("Selection Tests", function() {
   
    it("If test", function() {
        var $GL = 'if (1==1) -> $a<-(1)., return($a).\n\n.\r\n';
        expect(execute(gl.parse($GL))).toEqual(1);
    });
    
    it("If else test", function() {
        var $GL = 'if (1==2) -> $a<-(1), else -> $a<-(2).,return($a).\n\n.\r\n';
        expect(execute(gl.parse($GL))).toEqual(2);
    });
    
});
