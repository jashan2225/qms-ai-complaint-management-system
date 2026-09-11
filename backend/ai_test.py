from graph import complaint_graph


result = complaint_graph.invoke({
    "complaint": """
    Apollo Pharmacy reported discolored capsules in
    Amoxicillin Capsules 500 mg.
    Batch number AMX240602.
    12 capsules were affected.
    Manufacturing date March 2026.
    Expiry date February 2028.
    Please log this complaint.
    """,

    "customer_name": "",
    "product_name": "",
    "product_strength": "",
    "batch_number": "",
    "affected_quantity": "",
    "manufacturing_date": "",
    "expiry_date": "",
    "complaint_category": "",
    "complaint_description": ""
})


print(result)
