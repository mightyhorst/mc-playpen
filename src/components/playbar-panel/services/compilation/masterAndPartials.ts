import { percentageOfPartial } from '.';

export function masterAndPartials({
    masterContentsSplit, //{string[]} masterContents split by partials regex
    partials, //{IPartial} id and contents for partials
    percentage, // {number} from 0 to 1 for 0 % to 100%, how much of the string to print
    startPercentage = 0, // {number} optional - from 0 to 1 for 0 % to 100%
  }){
    const masterAndPartials = masterContentsSplit.map((masterPiece) => {
      /**
       * @step find partial
       */
      const matchedPartial = partials.find(partial => {
        return masterPiece.search(partial.id) >= 0;
      });
      /**
       * @step replace the partial tag, with the partial contents
       */
      if(matchedPartial){
          return percentageOfPartial({
            txtPartial: matchedPartial.contents,
            endPercentage: percentage,
            startPercentage: startPercentage || 0,
          });
      }
      /**
       * @step if we dont have a partial, return the master 
       */
      else return masterPiece;
  });
    
    return masterAndPartials;
  }