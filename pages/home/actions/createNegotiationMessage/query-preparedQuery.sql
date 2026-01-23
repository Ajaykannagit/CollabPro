
      INSERT INTO negotiation_messages (
        negotiation_thread_id,
        sender_name,
        sender_organization,
        message_type,
        content
      ) VALUES (
        :param0::int,
        :param1,
        :param2,
        :param3,
        :param4
      ) RETURNING id;
    