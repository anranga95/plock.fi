import { useContractKit } from '@celo-tools/use-contractkit';
import { Panel, Table } from 'components';
import { useCallback, useEffect, useState } from 'react';
import { ImArrowDown, ImArrowUp } from 'react-icons/im';
import { FiExternalLink } from 'react-icons/fi';
import { VoteValue } from '@celo/contractkit/lib/wrappers/Governance';

import Countdown from 'react-countdown';

export default function Vote() {
  const { kit, openModal, send } = useContractKit();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProposals = useCallback(async () => {
    setLoading(true);
    const governance = await kit.contracts.getGovernance();
    const dequeue = await governance.getDequeue();
    const queue = await governance.getQueue();

    const records = await Promise.all(
      dequeue.map(async (id) => {
        const isExpired = await governance.isDequeuedProposalExpired(id);
        const support = await governance.getSupport(id);
        const percentage = support.required.div(support.total).toFixed(0);

        const record = await governance.getProposalRecord(id);
        const {
          Referendum,
          Execution,
          Approval,
        } = await governance.proposalSchedule(id);

        const nextStageTime = [Referendum, Execution, Approval].reduce(
          (accum, bn) => {
            if (bn.toNumber() < 0) {
              return accum;
            }

            if (bn.toNumber() < accum) {
              return bn.toNumber();
            }

            return accum;
          },
          Date.now()
        );
        const voteRecord = await governance.getVoteRecord(
          kit.defaultAccount,
          id
        );

        const isPassing = await governance.isProposalPassing(id);
        const isApproved = await governance.isApproved(id);

        return {
          id: id,
          isExpired,
          isPassing,
          isApproved,
          proposal: record,
          vote: voteRecord ? voteRecord.value : 'None',
          nextStageTime: Date.now() + nextStageTime,
          percentage,
        };
      })
    );
    setProposals(records.sort((a, b) => b.id.minus(a.id).toNumber()));
    setLoading(false);
  }, [kit]);

  useEffect(() => {
    fetchProposals();
  }, [fetchProposals]);

  const approve = async (id: string) => {
    if (!kit.defaultAccount) {
      openModal();
      return;
    }

    const governance = await kit.contracts.getGovernance();

    await send(governance.upvote(id, kit.defaultAccount));
    fetchProposals();
  };

  const upvote = async (id: string) => {
    if (!kit.defaultAccount) {
      openModal();
      return;
    }

    const governance = await kit.contracts.getGovernance();
    await (await governance.vote(id, VoteValue.Yes)).sendAndWaitForReceipt();
    fetchProposals();
  };

  const downvote = async (id: string) => {
    if (!kit.defaultAccount) {
      openModal();
      return;
    }

    const governance = await kit.contracts.getGovernance();
    await (await governance.vote(id, VoteValue.No)).sendAndWaitForReceipt();
    fetchProposals();
  };

  return (
    <>
      <Panel>
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-200">
            Proposals
          </h3>
          <p className="text-gray-400 mt-2 text-sm">
            Celo uses a formal on-chain governance mechanism to manage and
            upgrade the protocol. You can have your say in this by{' '}
            <a
              className="text-blue-500"
              target="_blank"
              href="https://docs.celo.org/celo-owner-guide/voting-governance"
            ></a>
            voting on proposals and being active in the community. More
            information around this can be found in the{' '}
            <a
              className="text-blue-500"
              target="_blank"
              href="https://docs.celo.org/celo-codebase/protocol/governance"
            >
              Governance documentation
            </a>
            .
          </p>
        </div>
        <div className="-mx-5">
          <Table
            headers={['', 'ID', 'Stage', 'Status', 'Description']}
            loading={loading}
            noDataMessage="No proposals found"
            rows={proposals.map((p) => {
              let upvoteClass = '';
              let downVoteClass = '';
              if (p.vote === 'None' || p.vote === 'Abstain') {
                upvoteClass = 'text-gray-500';
                downVoteClass = 'text-gray-500';
              }
              if (p.vote === 'No') {
                upvoteClass = 'text-gray-500';
                downVoteClass = 'text-red-500';
              }
              if (p.vote === 'Yes') {
                upvoteClass = 'text-green-500';
                downVoteClass = 'text-gray-500';
              }

              let status;
              let statusClassName;
              if (p.proposal.stage === 'Proposal') {
                status = '';
              } else if (p.proposal.stage === 'Approval') {
                status = p.isApproved ? 'Approved' : 'Not approved';
                statusClassName = p.isApproved
                  ? 'border rounded px-2 py-1 border-green-500 text-green-500'
                  : 'border rounded px-2 py-1 border-red-500 text-red-500';
              } else if (p.proposal.stage === 'Referendum') {
                status = p.isPassing ? 'Passing' : 'Not passing';
                statusClassName = p.isPassing
                  ? 'border rounded px-2 py-1 border-green-500 text-green-500'
                  : 'border rounded px-2 py-1 border-red-500 text-red-500';
              } else if (p.proposal.stage === 'Execution') {
              }

              return [
                <span
                  className="inline-flex text-gray-500 space-x-3"
                  style={{ width: 'fit-content' }}
                >
                  {p.proposal.stage === 'Proposal' && (
                    <button
                      className={upvoteClass}
                      onClick={() => approve(p.id)}
                    >
                      <ImArrowUp />
                    </button>
                  )}
                  {p.proposal.stage === 'Referendum' && (
                    <>
                      <button
                        className={upvoteClass}
                        onClick={() => upvote(p.id)}
                      >
                        <ImArrowUp />
                      </button>
                      <button
                        className={downVoteClass}
                        onClick={() => downvote(p.id)}
                      >
                        <ImArrowDown />
                      </button>
                    </>
                  )}
                </span>,

                <div className="flex items-center">
                  <div className="">
                    <div className="text-sm font-medium text-gray-200">
                      {p.id.toString()}
                    </div>
                  </div>
                </div>,
                <div>
                  {p.proposal.stage} (
                  <Countdown date={new Date(p.nextStageTime)} />)
                </div>,
                <span className={statusClassName}>
                  {status} ({p.percentage}%)
                </span>,
                <div>
                  <a
                    href={p.proposal.metadata?.descriptionURL}
                    target="_blank"
                    className="flex items-center text-gray-300 hover:text-gray-400 cursor-pointer space-x-2"
                  >
                    <span>Link</span>
                    <FiExternalLink />
                  </a>
                </div>,
              ];
            })}
          />
        </div>
      </Panel>
    </>
  );
}
