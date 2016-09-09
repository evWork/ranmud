'use strict';
//TODO: Consider implementing ES6 maps instead so I can use arrays of keywords as keywords
//////  That way, a check can be done for all of the keywords in the key array, and if they
/////   all match (.every) the sentence, then the value (dialogue config) will be used.
////    NOTE: use map.entries to iterate over the entries in a for of loop...
const Dialogue = require('../../src/dialogue').Dialogue;
const expect = require('chai').expect;

describe.only('Basic keyword parsing', () => {

  const mockConfig = {
    'thieves guild': {
      keywords: ['thieves', 'thief', 'stealing', 'guild'],
      priority: Dialogue.Priority.LOW,
      prereqs: {
        introduced: true
      },
      dialogue: 'I need you to infiltrate the thieves guild for me, and find their roster.'
    },
    'murder': {
      keywords: ['murder', 'killings', 'assassin', 'assassination'],
      priority: Dialogue.Priority.HIGH,
      prereqs: {
        introduced: true
      },
      dialogue: 'The thieves have become assassins? We cannot have two assassin\'s guilds...'
    },
    'here': {
      keywords: ['here'],
      priority: Dialogue.Priority.LOWEST,
      prereqs: {
        introduced: true
      },
      dialogue: [
        'This is my favorite place.',
        'It is so great here.'
      ]
    },
    'quest': {
      keywords: ['quest', 'mission'],
      priority: Dialogue.Priority.HIGH,
      prereqs: {
        introduced: true
      }
    }
  };

  describe('tokenization', () => {
    it('should be able to break a string into words', () => {
      expect(Dialogue.tokenizeSentence('hello world!')).to.eql(['hello', 'world']);
    });
  });

  describe('keyword finding', () => {
    it('should be true if the keyword is in the string', () => {
      expect(Dialogue.hasKeyword('thief', mockConfig['thieves guild'])).to.be.true;
    });

    it('should be false if the keyword is not in the string', () => {
      expect(Dialogue.hasKeyword('potatoes', mockConfig['thieves guild'])).to.be.false;
    });

  });

  describe('finding topics', () => {
    it('should return a list of a single topic if there is only one', () => {
      const tokens = Dialogue.tokenizeSentence('thieves guild');
      expect(Dialogue.findPotentialTopics(tokens, mockConfig).length === 1).to.be.true;
    });

    it('should return an empty array if there are no relevant topics', () => {
      const tokens = Dialogue.tokenizeSentence('pants helicopter');
      expect(Dialogue.findPotentialTopics(tokens, mockConfig).length === 0).to.be.true;
    });
  });

  describe('prioritizing dialogue', () => {
    it('should be able to pick out the highest priority topic from a list', () => {
      const tokens = Dialogue.tokenizeSentence('the thieves guild is doing a murder!');
      const topics = Dialogue.findPotentialTopics(tokens, mockConfig);

      expect(Dialogue.getPriorityTopic(topics, mockConfig)).to.eql(mockConfig['murder']);
    });
  });

  describe('Getting next NPC dialogue choice', () => {

    it('should return a string as the next dialogue choice', () => {
      const npcDialogue = Dialogue.getNpcResponse('what is the thieves guild?', mockConfig);
      expect(npcDialogue).to.equal(mockConfig['thieves guild'].dialogue);
    });

    it('should return null if no NPC dialogue is found', () => {
      const npcDialogue = Dialogue.getNpcResponse('potatos?', mockConfig);
      expect(npcDialogue).not.to.be.ok;
    });

    it('should still return a string or series of strings if the NPC can say multiple things', () => {
      const dialogueArray = mockConfig['here'].dialogue;
      let dialogueSpoken = [];
      while (dialogueSpoken.length < 100) {
        dialogueSpoken.push(Dialogue.getNpcResponse('here', mockConfig));
      }
      dialogueArray.forEach(blurb => {
        expect(dialogueSpoken.indexOf(blurb) > -1).to.be.true;
      });
    });
  });

});
