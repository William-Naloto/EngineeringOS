import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { dedupeGraphEdges, toApiGraphEdgeType } from './graph-edges.ts';

describe('toApiGraphEdgeType', () => {
  it('maps internal orchestration edge types to orchestrates', () => {
    assert.equal(toApiGraphEdgeType('orchestrates_competency'), 'orchestrates');
    assert.equal(toApiGraphEdgeType('orchestrates_agent'), 'orchestrates');
    assert.equal(toApiGraphEdgeType('orchestrates_skill'), 'orchestrates');
    assert.equal(toApiGraphEdgeType('orchestrates_workflow'), 'orchestrates');
  });

  it('passes through API-native edge types', () => {
    assert.equal(toApiGraphEdgeType('depends_on'), 'depends_on');
    assert.equal(toApiGraphEdgeType('topic_of'), 'topic_of');
    assert.equal(toApiGraphEdgeType('replaces'), 'replaces');
  });

  it('maps enables_capability to enables', () => {
    assert.equal(toApiGraphEdgeType('enables_capability'), 'enables');
  });

  it('deduplicates edges by from, to, and type', () => {
    const edges = [
      { from: 'a', to: 'b', type: 'depends_on' },
      { from: 'a', to: 'b', type: 'depends_on' },
      { from: 'a', to: 'c', type: 'depends_on' },
    ];

    assert.equal(dedupeGraphEdges(edges).length, 2);
  });
});
