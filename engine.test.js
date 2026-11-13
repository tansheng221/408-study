const {test}=require('node:test'),assert=require('node:assert/strict'),E=require('./engine');
test('所有模式可生成挖空且准确保留原文范围',()=>{for(const mode of ['mixed','knowledge','definition','number','algorithm']){const source='栈是只允许在一端操作的线性表。\n二分查找的时间复杂度为 O(log n)。\nIPv4 地址长度为 32 位。';const cards=E.generate(source,mode,2);assert.ok(cards.length);for(const c of cards){assert.equal(source.slice(c.sourceStart,c.sourceStart+c.text.length),c.text);for(const b of c.blanks)assert.equal(c.text.slice(b.start,b.end),b.answer);assert.ok(c.blanks.length<=2);}}});
test('重叠术语不会产生重叠空白',()=>{const cards=E.generate('线程是处理器调度的基本单位。时间复杂度为 O(n)。');for(const c of cards)for(let i=1;i<c.blanks.length;i++)assert.ok(c.blanks[i].start>=c.blanks[i-1].end);});
test('无匹配文本不会编造答案',()=>assert.equal(E.generate('春日学习笔记').length,0));
const source='栈遵循后进先出原则。';const backup={version:1,docs:[{title:'测试',subject:'数据结构',source,cards:E.generate(source)}]};
test('JSON 往返保留答案与学习状态，并分配独立 ID',()=>{backup.docs[0].cards[0].status='mastered';const d=E.validate(JSON.parse(JSON.stringify(backup)))[0];assert.equal(d.cards[0].status,'mastered');assert.deepEqual(d.cards[0].blanks,backup.docs[0].cards[0].blanks);assert.notEqual(d.cards[0].id,backup.docs[0].cards[0].id);});
test('拒绝损坏结构和非法挖空范围',()=>{assert.throws(()=>E.validate({version:2,docs:[]}));const b=structuredClone(backup);b.docs[0].cards[0].blanks[0].end=999;assert.throws(()=>E.validate(b));});
test('Markdown 包括挖空、答案、进度与原文',()=>{const md=E.markdown(backup.docs[0]);for(const s of ['____','答案：','状态：','完整原文',source])assert.ok(md.includes(s));});
