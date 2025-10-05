"""create uploads table

Revision ID: f5f02b884fc8
Revises: ff7a8033621d
Create Date: 2025-10-06 01:17:52.661268

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f5f02b884fc8'
down_revision: Union[str, Sequence[str], None] = 'ff7a8033621d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
