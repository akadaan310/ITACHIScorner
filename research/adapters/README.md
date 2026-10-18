# Optional exact source-index adapter

`isnaad.ts` defines the versioned `isnaad-exact-index-v1` boundary. It accepts only a supplied reviewed edition/locus index, an expected engine version and expected index checksum. Matching is exact after NFC and whitespace normalization; offsets refer to the original UTF-16 string. It preserves case and diacritics and reports `index_match_only`.

No approved real source index is supplied, no scripture was retrieved/generated, and no remote ISNAAD repository was integrated or executed. The adapter does not establish interpretation, speaker assertion versus quotation, religious truth or validity of ordinary dialogue analysis. Its `approved_index` reference is supplied metadata; an authenticated editorial system must verify that authority before real use. Tests use only controlled non-scripture strings.
