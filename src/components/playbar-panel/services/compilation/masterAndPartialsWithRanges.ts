import {masterAndPartials} from '.';

export function masterAndPartialsWithRanges({
    masterContentsSplit, //{string[]} masterContents split by partials regex
    partials, //{IPartial} id and contents for partials
    percentage, // {number} from 0 to 1 for 0 % to 100%, how much of the string to print
    startPercentage = 0, // {number} optional - from 0 to 1 for 0 % to 100%
  }){
    const _masterAndPartials = masterAndPartials({
      masterContentsSplit,
      partials,
      percentage,
      startPercentage,
    });
    const _masterAndPartialsWithRanges = _masterAndPartials
      .map((txtBlock, _index)=> {
        const txtBlockRows = txtBlock
          .split('\n')
          .map((row, rowIndex) => {
            return {
              txt: row,
              row: rowIndex + 1, 
              cols: row.length,
            };
          });
        return txtBlockRows;
      })
      // .map((txtBlockRow, _index)=>{
      //   let lastTxtBlock = null;
      //   if(_index > 0 && _index < _masterAndPartials.length){
      //     lastTxtBlock = txtBlockRow[_index - 1];
      //   }
      //   const _block = {
      //     txt: txtBlockRow.txt,
      //     range: {
      //       row: {
      //         start: 1,
      //         end: txtBlockRow.txt.split('\n')?.length,
      //       },
      //       col: {
      //         start: 1,
      //         end: 1,
      //       },
      //     },
      //   };
      //   return _block;
      // });
    return _masterAndPartialsWithRanges;
  }