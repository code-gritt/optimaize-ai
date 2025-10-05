"""create uploads table

Revision ID: ff7a8033621d
Revises: e7555a4af790
Create Date: 2025-10-06 01:14:52.856312

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'ff7a8033621d'
down_revision: Union[str, Sequence[str], None] = 'e7555a4af790'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema by creating the uploads table."""
    op.create_table(
        'uploads',
        sa.Column('id', sa.Integer, primary_key=True, index=True),
        sa.Column('user_id', sa.Integer, nullable=False),
        sa.Column('url', sa.String, nullable=False),
        sa.Column('analysis', sa.String, nullable=True),
        sa.Column('timestamp', sa.DateTime, default=sa.func.now()),
    )


def downgrade() -> None:
    """Downgrade schema by dropping the uploads table."""
    op.drop_table('uploads')
