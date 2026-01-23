
      SELECT 
        lo.id,
        lo.anonymized_title,
        lo.anonymized_description,
        lo.licensing_type,
        lo.asking_price,
        lo.industry_sectors,
        lo.inquiries_count,
        lo.created_at,
        ip.invention_category,
        ip.status as ip_status
      FROM licensing_opportunities lo
      JOIN ip_disclosures ip ON lo.ip_disclosure_id = ip.id
      WHERE 
        lo.visibility = 'public'
        AND (COALESCE(:param0, '') = '' OR lo.industry_sectors ILIKE :param1)
      ORDER BY lo.created_at DESC;
    