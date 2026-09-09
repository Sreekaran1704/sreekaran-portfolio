export const fanhouseLinks = {
  "dashboard": "https://sreekaran1704.github.io/fanhouse-casestudy-membership-/",
  "caseStudy": "https://github.com/Sreekaran1704/fanhouse-casestudy-membership-/blob/main/CASE_STUDY.md",
  "github": "https://github.com/Sreekaran1704/fanhouse-casestudy-membership-"
};

export const fanhouseViews = [
  {
    "slug": "",
    "label": "Plain language",
    "title": "People bought more product value. Did the business keep more money?",
    "lede": "I started with a membership question. I ended up separating three things that are easy to confuse: who joins, what they buy, and what they actually pay.",
    "sections": [
      [
        "The question I wanted to answer",
        [
          "Imagine a retailer offering discounts and reward coins through a paid membership. Members spend more than everyone else. That sounds like a success, until you ask whether they would have spent more anyway.",
          "I built this as an independent simulation with 40,000 synthetic customers and 573,352 transactions. No real customer records or company engagement are involved. The point was to build an analysis I could test against a known simulated counterfactual."
        ]
      ],
      [
        "The first comparison looked encouraging",
        [
          "After launch, members spent 22.3% more per day than nonmembers. But when I looked backward, eventual members were already spending 40.6% more before membership existed.",
          "That changed the question. Comparing the two groups after launch was mixing the program with the kinds of people who chose it. The pre-launch gap is evidence of selection, not an estimate of the program effect."
        ]
      ],
      [
        "I made the comparison more useful",
        [
          "I matched adopters to non-adopters with similar observed characteristics, then compared how spending changed in the two groups. Matching and difference-in-differences are stages of one design here, not two independent confirmations.",
          "The final analysis retained 12,153 pairs. It still depends on assumptions, especially that their spending would have followed parallel trends without the program. Similar starting points help, but they cannot prove that assumption."
        ]
      ],
      [
        "The answer depends on what you count",
        [
          "The estimated change in product value before discounts was +$0.1367 per customer per day. The estimated change in net product payments was −$0.0103/day, with a 95% interval from −$0.0232 to +$0.0027.",
          "Those results tell a more useful story than “members spend more.” In this simulation, the contrast is consistent with purchasing responses being offset by discounts and redeemed rewards. It does not establish higher net payments, and an interval crossing zero does not prove the effect is exactly zero.",
          "Net product payments exclude membership fees. Product value is measured at modeled pre-discount prices, not in physical units. Neither outcome is profit; costs and revenue recognition need their own analysis."
        ]
      ],
      [
        "The checks that kept me honest",
        [
          "One pretrend diagnostic raised a warning: raw p = 0.0165, or 0.1154 after Holm adjustment across seven diagnostics. I report both. The adjustment does not make the underlying concern disappear.",
          "A wider matching caliper also made the net-payment estimate nominally significant. That means I cannot claim the significance result is stable across every specification. The dashboard lets a reader explore outcomes and trend sensitivity instead of taking a headline on trust."
        ]
      ],
      [
        "What I would recommend next",
        [
          "I would not use the member spending gap to justify a rollout. I would take this as a tested analytical prototype and design a prospective experiment with contribution profit as the decision outcome.",
          "The project taught me to ask a better business question: when customer behavior changes, how much of that change becomes value the business can actually retain?"
        ]
      ]
    ]
  },
  {
    "slug": "data-story",
    "label": "Data story",
    "title": "The spending gap was there before the membership.",
    "lede": "The first number was 22.3%. The number that changed the story was 40.6%.",
    "sections": [
      [
        "An attractive first slide",
        [
          "Put members beside nonmembers after launch and the chart almost writes its own headline: members spend 22.3% more per day. It is the kind of number that invites a quick recommendation.",
          "This was a synthetic retailer, built for a portfolio study. That gave me something an ordinary company dataset cannot offer: the ability to inspect the world I generated and compare it with a coupled world without membership benefits. But first I had to stop reading a difference between people as an effect of a program."
        ]
      ],
      [
        "Then I moved the clock backward",
        [
          "Before launch, the people who would eventually join were already spending 40.6% more. The apparent success story had started before there was a membership to explain it.",
          "That did not tell me the program was useless. It told me that the first comparison was answering the wrong question. I needed a credible comparison for how members would have changed without the program."
        ]
      ],
      [
        "A different comparison, a different answer",
        [
          "I found 12,153 pairs of adopters and comparable non-adopters, using observed pre-program characteristics. Then I measured the difference between their changes in daily spending.",
          "The net-payment estimate came out at −$0.0103 per customer per day. Its interval stretched from −$0.0232 to +$0.0027. There was no clean positive revenue story to put in bold. There was also no basis for saying the true effect had to be zero."
        ]
      ],
      [
        "But the basket had another story",
        [
          "Before discounts, estimated product value rose by $0.1367/day. After discounts and redeemed coins, the net-payment estimate was slightly negative and uncertain.",
          "This is the finding I would bring to a decision meeting. A program can produce a positive product-value contrast without establishing higher customer payments. In the modeled accounting, discounts and rewards can absorb purchasing responses. That is consistent with these results, not a separately identified causal mechanism.",
          "Fees were kept separate, and costs were outside the model. Calling this profit, or multiplying it into a company-wide revenue promise, would go beyond the evidence."
        ]
      ],
      [
        "The uncomfortable details stayed in",
        [
          "The overall pretrend test raised a nominal warning. Widening the matching caliper to 0.10 produced p = 0.0467. Only 49.5% of adopters joined in the launch month, so the monthly event-study path mixes adoption cohorts.",
          "None of those details belongs in a footnote that nobody can find. They shape how strongly I can interpret the estimate. I left them in the case study and exposed sensitivity controls in the dashboard."
        ]
      ],
      [
        "A result I could defend",
        [
          "The coupled counterfactual put the known net-payment ATT at about −$0.01128/day, inside the reported interval. That supports the implementation in this simulated world. It does not certify the assumptions in a real company.",
          "I also ran 40 smaller simulation replications, kept the uncertainty around that validation visible, and built a pipeline that checks whether the reports agree with the data.",
          "The ending is a decision, not a victory lap: test contribution profit prospectively before recommending a real rollout. The useful finding is the separation between buying more product value and paying more money."
        ]
      ]
    ]
  },
  {
    "slug": "technical",
    "label": "Technical",
    "title": "A matched difference-in-differences study, with its assumptions exposed.",
    "lede": "The estimand, accounting, diagnostics, and validation behind the membership analysis.",
    "sections": [
      [
        "Population, timing, and causal target",
        [
          "The synthetic panel contains 40,000 customers and 573,352 transactions from January 1, 2024 through December 31, 2025. Program launch is October 1, 2024: 274 pre-period days and 457 post-period days. There are 12,408 adopters and 27,592 non-adopters.",
          "The matched analysis retains 12,153 adopter-control pairs, about 97.94% of adopters. Its target is the full post-launch-window contrast for retained adopters under their observed adoption timing. It is not a randomized offer ITT or a uniform duration-since-adoption effect."
        ]
      ],
      [
        "Outcome accounting",
        [
          "The primary outcome is net product payments per customer per day, after discounts and redeemed reward coins. Membership fees are tracked separately. The secondary outcome is product value at modeled pre-discount prices.",
          "Neither is contribution profit. Issued but unredeemed rewards, costs, and fee revenue recognition need separate accounting before a financial rollout decision. Physical units and willingness to pay are not measured by pre-discount product value."
        ]
      ],
      [
        "Matching and estimation",
        [
          "A logistic propensity model uses pre-program covariates. Greedy one-to-one matching without replacement uses a default caliper of 0.03. Difference-in-differences is then computed within the matched pairs: (member post − member pre) − (control post − control pre).",
          "The pre-spend standardized mean difference falls from 0.3961 to 0.00134. The largest absolute matched model-covariate SMD is approximately 0.0152. These are observed-balance diagnostics, not proof of exchangeability.",
          "The net-payment estimate is −$0.0102538/day, paired SE $0.0066222, p = 0.1216, 95% CI [−$0.0232345, +$0.0027268]. The pre-discount estimate is +$0.1367276/day, 95% CI [+$0.1225555, +$0.1508997]."
        ]
      ],
      [
        "Event study and identification limits",
        [
          "Monthly specifications use pair-clustered covariance. Only 49.5% of adopters join in the launch month. Launch-aligned paths therefore mix cohorts and exposure durations; they should not be read as cohort-specific treatment dynamics.",
          "The overall joint pretrend diagnostic has raw p = 0.0165 and Holm-adjusted p = 0.1154 across seven diagnostics. Report both: adjusted non-rejection does not establish parallel trends or practical equivalence.",
          "Identification still requires assumptions about parallel counterfactual trends, selection, anticipation, and interference. Matching cannot remove unobserved confounding by itself."
        ]
      ],
      [
        "Sensitivity and channel findings",
        [
          "At caliper 0.10 the net-payment estimate becomes nominally significant (p = 0.0467), compared with p = 0.1216 at the default. Statistical significance is therefore not stable across all matching specifications.",
          "The in-store net-payment contrast is −$0.01210/day (nominal p = 0.0131); online is +$0.00184/day (p = 0.7123). These channel results do not establish a profitable overall program. The interactive dashboard includes four monthly outcomes and an additive trend-violation sensitivity control."
        ]
      ],
      [
        "Validation against known simulated outcomes",
        [
          "The shared generator constructs coupled factual and no-benefit worlds and verifies the factual reconstruction before producing counterfactual output. The known full-window net-payment ATT is −$0.0112774/day. The estimate differs by about +$0.0010236/day and contains that truth in its interval.",
          "All six outcome/channel comparisons contain their coupled truth, but they are correlated outcomes in one world, not a coverage study.",
          "A separate Monte Carlo exercise uses 20 configured-benefit and 20 zero-benefit worlds, each with 4,000 customers and matching refitted. Both scenarios cover truth in 20/20 intervals; each Wilson 95% interval is approximately 83.9% to 100%. Zero of 20 null worlds rejects at 5%. This is too small to establish precise coverage or Type I error, and it is not full-sample validation."
        ]
      ],
      [
        "Reproducibility and decision",
        [
          "The pipeline regenerates data, runs 14 regression tests, executes the analysis and assumption audit, builds the dashboard and preview, and validates artifact consistency. The manifest records completion, package versions, source/data hashes, and phase logs. Separate JavaScript checks exercise dashboard bindings and sensitivity updates.",
          "The implementation checks support this simulation. They do not establish real-world identification. The next organizational study should randomize an appropriate offer or rollout and measure contribution profit before a launch recommendation."
        ]
      ]
    ]
  }
];
