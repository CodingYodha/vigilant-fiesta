"""
Entity Graph module — Neo4j-backed entity relationship graph for Intelli-Credit.

Sub-modules:
  - neo4j_client   : Connection singleton, schema constants, constraints, health check
  - graph_writer   : Writes EntityExtraction into Neo4j (MERGE/upsert)
  - fuzzy_matcher  : V12 fix — fuzzy entity-to-transaction matching
  - fraud_detector : Cypher-based cross-application fraud detection
"""

from .neo4j_client import (
    get_driver,
    close_driver,
    create_constraints,
    neo4j_health_check,
    PERSON,
    COMPANY,
    LOAN,
    APPLICATION,
    DIRECTOR_OF,
    GUARANTOR_FOR,
    SUPPLIER_TO,
    SUBSIDIARY_OF,
    LENDER_TO,
    PAID_TO,
    APPLIED_FOR,
    FLAGGED_IN,
)
from .graph_writer import write_entity_graph, WriteResult
from .fuzzy_matcher import (
    normalize_entity_name,
    match_score,
    classify_match,
    find_entity_in_transactions,
    link_transactions_to_graph,
    MatchConfidence,
    EntityMatchResult,
    TransactionLinkResult,
)

from .fraud_detector import (
    run_all_fraud_checks,
    detect_related_party_director_overlap,
    detect_historical_rejection,
    detect_shell_supplier_network,
    detect_circular_ownership,
    FraudFlag,
    FraudDetectionResult,
)

__all__ = [
    "get_driver",
    "close_driver",
    "create_constraints",
    "neo4j_health_check",
    "write_entity_graph",
    "WriteResult",
    "normalize_entity_name",
    "match_score",
    "classify_match",
    "find_entity_in_transactions",
    "link_transactions_to_graph",
    "MatchConfidence",
    "EntityMatchResult",
    "TransactionLinkResult",
    "run_all_fraud_checks",
    "FraudFlag",
    "FraudDetectionResult",
    "PERSON",
    "COMPANY",
    "LOAN",
    "APPLICATION",
    "DIRECTOR_OF",
    "GUARANTOR_FOR",
    "SUPPLIER_TO",
    "SUBSIDIARY_OF",
    "LENDER_TO",
    "PAID_TO",
    "APPLIED_FOR",
    "FLAGGED_IN",
]
